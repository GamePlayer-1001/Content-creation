/**
 * [INPUT]: runtimeEnv.hotspot + config/trending_topics_manual.json
 * [OUTPUT]: 导出 HotspotService（读取 Google Sheets / 手动热点池）
 * [POS]: core/services/hotspot 的统一热点读取层，被 WebApp/CLI 共用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

class HotspotService {
  constructor({ configDir, runtimeEnv, logger = console }) {
    this.configDir = configDir;
    this.runtimeEnv = runtimeEnv || {};
    this.logger = logger;
    this.manualFile = path.join(configDir, 'trending_topics_manual.json');
  }

  async listHotspots({ query = '', limit = 20, source = 'auto' } = {}) {
    const q = String(query || '').trim().toLowerCase();
    const maxLimit = _normalizeLimit(limit, 20, 200);
    const requestedSource = _normalizeSource(source);
    const configuredDefaultSource = _normalizeSource(this.runtimeEnv?.hotspot?.source || 'auto');
    const wantedSource = requestedSource === 'auto' ? configuredDefaultSource : requestedSource;
    const strictGoogleSource = requestedSource !== 'auto'
      && (wantedSource === 'google_sheets' || wantedSource === 'google');
    const warnings = [];

    let rows = [];
    let resolvedSource = wantedSource;

    if (wantedSource === 'google_sheets' || wantedSource === 'google' || wantedSource === 'auto') {
      try {
        rows = await this._loadFromGoogleSheets();
        resolvedSource = 'google_sheets';
      } catch (error) {
        if (strictGoogleSource) {
          throw error;
        }
        warnings.push(`Google Sheets 读取失败，已回退手动热点池: ${error.message}`);
      }
    }

    if (!rows.length) {
      rows = this._loadFromManualFile();
      resolvedSource = 'manual';
    }

    const filtered = q
      ? rows.filter((item) => _matchesQuery(item, q))
      : rows;

    return {
      source: resolvedSource,
      query: q,
      total: filtered.length,
      items: filtered.slice(0, maxLimit),
      warnings,
      fetchedAt: new Date().toISOString(),
    };
  }

  async _loadFromGoogleSheets() {
    const hotspotEnv = this.runtimeEnv.hotspot || {};
    const url = _resolveSheetsCsvUrl(hotspotEnv);
    if (!url) {
      throw new Error('未配置 Google Sheets 地址（HOTSPOT_GOOGLE_SHEETS_CSV_URL 或 HOTSPOT_GOOGLE_SHEET_ID）');
    }

    const timeoutMs = _normalizeLimit(hotspotEnv.fetchTimeoutMs, 8000, 60000);
    const csv = await _fetchText(url, timeoutMs);
    const rows = _parseCsv(csv);
    if (!rows.length) {
      throw new Error('Google Sheets 返回为空');
    }

    const normalized = [];
    rows.forEach((row, idx) => {
      const mapped = _normalizeGoogleRow(row, idx + 1);
      if (mapped) normalized.push(mapped);
    });

    if (!normalized.length) {
      throw new Error('Google Sheets 数据缺少可用标题列（title/标题/topic 等）');
    }
    return normalized;
  }

  _loadFromManualFile() {
    if (!fs.existsSync(this.manualFile)) {
      throw new Error(`手动热点文件不存在: ${this.manualFile}`);
    }

    const raw = fs.readFileSync(this.manualFile, 'utf-8');
    const parsed = JSON.parse(raw);
    const topics = Array.isArray(parsed?.trending_topics) ? parsed.trending_topics : [];

    const result = [];
    topics.forEach((item, idx) => {
      const title = String(item?.title || '').trim();
      if (!title) return;
      result.push({
        id: `manual-${idx + 1}`,
        title,
        summary: String(item?.summary || item?.description || '').trim(),
        category: String(item?.category || '').trim(),
        platform: String(item?.platform || '').trim(),
        url: String(item?.url || item?.link || '').trim(),
        score: _toNumber(item?.score || item?.heat_score || ''),
        heat: String(item?.heat || '').trim(),
        tags: _toTags(item?.keywords || item?.tags || ''),
        publishedAt: String(item?.published_at || item?.date || '').trim(),
        source: 'manual',
        raw: item,
      });
    });

    return result;
  }
}

function _normalizeSource(input) {
  const raw = String(input || '').trim().toLowerCase();
  if (raw === 'google') return 'google_sheets';
  if (raw === 'google_sheets' || raw === 'manual' || raw === 'auto') return raw;
  return 'auto';
}

function _resolveSheetsCsvUrl(hotspotEnv) {
  const directUrl = String(hotspotEnv?.googleSheetsCsvUrl || '').trim();
  if (directUrl) return directUrl;

  const sheetId = String(hotspotEnv?.googleSheetId || '').trim();
  if (!sheetId) return '';
  const gid = String(hotspotEnv?.googleSheetGid || '0').trim() || '0';
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${encodeURIComponent(gid)}`;
}

function _normalizeGoogleRow(row, index) {
  const title = _pickAny(row, ['title', '标题', 'topic', '热点', '选题', '主题']);
  if (!title) return null;

  return {
    id: _pickAny(row, ['id', '编号']) || `sheet-${index}`,
    title,
    summary: _pickAny(row, ['summary', '描述', '简介', 'detail', '详情', 'content', '内容']) || '',
    category: _pickAny(row, ['category', '分类']) || '',
    platform: _pickAny(row, ['platform', '来源平台', 'source_platform', '来源']) || '',
    url: _pickAny(row, ['url', 'link', '链接']) || '',
    score: _toNumber(_pickAny(row, ['score', '热度分', 'heat_score', 'ranking', 'rank'])),
    heat: _pickAny(row, ['heat', '热度']) || '',
    tags: _toTags(_pickAny(row, ['tags', '关键词', 'keywords', 'keyword'])),
    publishedAt: _pickAny(row, ['published_at', 'date', '日期', '时间']) || '',
    source: 'google_sheets',
    raw: row,
  };
}

function _pickAny(row, keys) {
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(row, key)) continue;
    const val = String(row[key] ?? '').trim();
    if (val) return val;
  }
  return '';
}

function _toTags(input) {
  if (Array.isArray(input)) {
    return input.map((x) => String(x).trim()).filter(Boolean).slice(0, 20);
  }
  const raw = String(input || '').trim();
  if (!raw) return [];
  return raw
    .split(/[,\uFF0C;|\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function _toNumber(input) {
  const value = Number.parseFloat(String(input || '').trim());
  if (Number.isNaN(value)) return null;
  return value;
}

function _normalizeLimit(limit, fallback, ceiling) {
  const parsed = Number.parseInt(limit, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, ceiling);
}

function _matchesQuery(item, query) {
  const text = [
    item.title,
    item.summary,
    item.category,
    item.platform,
    ...(Array.isArray(item.tags) ? item.tags : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return text.includes(query);
}

function _fetchText(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const client = target.protocol === 'http:' ? http : https;

    const req = client.request(
      {
        hostname: target.hostname,
        port: target.port || (target.protocol === 'http:' ? 80 : 443),
        path: `${target.pathname}${target.search}`,
        method: 'GET',
        headers: {
          'User-Agent': 'content-output-hotspot-service/1.0',
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          let errBody = '';
          res.on('data', (chunk) => {
            errBody += chunk.toString('utf-8');
          });
          res.on('end', () => {
            reject(new Error(`请求失败: HTTP ${res.statusCode} ${errBody.slice(0, 180)}`));
          });
          return;
        }

        let body = '';
        res.on('data', (chunk) => {
          body += chunk.toString('utf-8');
        });
        res.on('end', () => resolve(body));
      }
    );

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`请求超时 (${timeoutMs}ms)`));
    });
    req.on('error', (error) => reject(error));
    req.end();
  });
}

function _parseCsv(text) {
  const rows = [];
  const records = _splitCsvRecords(String(text || ''));
  if (!records.length) return rows;

  const header = records[0].map((cell) => _normalizeHeader(cell));
  for (let i = 1; i < records.length; i += 1) {
    const record = records[i];
    const row = {};
    header.forEach((key, idx) => {
      if (!key) return;
      row[key] = (record[idx] || '').trim();
    });
    rows.push(row);
  }
  return rows;
}

function _normalizeHeader(value) {
  return String(value || '')
    .replace(/^\uFEFF/, '')
    .trim();
}

function _splitCsvRecords(text) {
  const records = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((x) => String(x).trim() !== '')) {
        records.push(row);
      }
      row = [];
      field = '';
      continue;
    }

    field += ch;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((x) => String(x).trim() !== '')) {
      records.push(row);
    }
  }

  return records;
}

module.exports = HotspotService;
