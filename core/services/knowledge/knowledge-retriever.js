/**
 * [INPUT]: projectRoot + optional source dirs, query text and stage context
 * [OUTPUT]: LightweightKnowledgeRetriever with keyword-based snippet retrieval
 * [POS]: core/services/knowledge local markdown knowledge retrieval for pipeline prompt injection
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_SOURCE_DIRS = Object.freeze([
  'docs/赛道存档',
  'config/rules',
  '.claude/commands',
]);

const DEFAULT_OPTIONS = Object.freeze({
  maxFilesPerSource: 120,
  maxFileBytes: 240000,
  maxResults: 5,
  maxSnippetChars: 1400,
  maxTotalChars: 5200,
});

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'you', 'your', 'are', 'was', 'were',
  '一个', '一种', '这个', '那个', '我们', '你们', '他们', '以及', '如果', '因为', '所以',
  '但是', '什么', '如何', '为什么', '可以', '需要', '进行', '内容', '生成', '平台',
]);

class LightweightKnowledgeRetriever {
  constructor({ projectRoot, sourceDirs = DEFAULT_SOURCE_DIRS, logger = console, options = {} } = {}) {
    this.projectRoot = projectRoot || process.cwd();
    this.sourceDirs = Array.isArray(sourceDirs) && sourceDirs.length > 0 ? sourceDirs : DEFAULT_SOURCE_DIRS;
    this.logger = logger;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this._documents = null;
  }

  retrieve({ query = '', stage = '', platform = '', limit = null, extraTerms = [] } = {}) {
    const terms = this._extractTerms([query, stage, platform, ...extraTerms].join('\n'));
    const documents = this._loadDocuments();
    if (documents.length === 0) return { context: '', matches: [] };

    const effectiveLimit = Number.isFinite(limit) && limit > 0 ? limit : this.options.maxResults;
    const scored = [];
    for (const doc of documents) {
      const score = this._scoreDocument(doc, terms, { stage, platform });
      if (score <= 0) continue;
      scored.push({ doc, score });
    }

    scored.sort((a, b) => b.score - a.score || a.doc.relativePath.localeCompare(b.doc.relativePath));

    const matches = [];
    let totalChars = 0;
    for (const item of scored.slice(0, effectiveLimit * 3)) {
      if (matches.length >= effectiveLimit) break;
      const snippet = this._buildSnippet(item.doc.content, terms, this.options.maxSnippetChars);
      if (!snippet) continue;
      if (totalChars + snippet.length > this.options.maxTotalChars && matches.length > 0) break;
      totalChars += snippet.length;
      matches.push({
        source: item.doc.relativePath,
        title: item.doc.title,
        score: item.score,
        snippet,
      });
    }

    return {
      context: this._formatContext(matches, { stage, platform }),
      matches,
    };
  }

  _loadDocuments() {
    if (this._documents) return this._documents;
    const docs = [];
    for (const sourceDir of this.sourceDirs) {
      const absoluteDir = path.join(this.projectRoot, sourceDir);
      if (!fs.existsSync(absoluteDir)) continue;
      const files = this._walkMarkdownFiles(absoluteDir).slice(0, this.options.maxFilesPerSource);
      for (const filePath of files) {
        try {
          const stat = fs.statSync(filePath);
          if (!stat.isFile() || stat.size <= 0 || stat.size > this.options.maxFileBytes) continue;
          const content = fs.readFileSync(filePath, 'utf-8');
          const relativePath = path.relative(this.projectRoot, filePath).replace(/\\/g, '/');
          docs.push({
            path: filePath,
            relativePath,
            title: this._extractTitle(content, filePath),
            content: this._normalizeContent(content),
          });
        } catch (error) {
          this.logger?.warn?.(`[knowledge] 跳过文件: ${filePath} ${error.message}`);
        }
      }
    }
    this._documents = docs;
    return docs;
  }

  _walkMarkdownFiles(dir) {
    const result = [];
    const stack = [dir];
    while (stack.length > 0) {
      const current = stack.pop();
      let entries = [];
      try {
        entries = fs.readdirSync(current, { withFileTypes: true });
      } catch {
        continue;
      }
      entries.sort((a, b) => a.name.localeCompare(b.name));
      for (const entry of entries) {
        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(fullPath);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
          result.push(fullPath);
        }
      }
    }
    return result;
  }

  _extractTitle(content, filePath) {
    const titleMatch = String(content || '').match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (titleMatch) return titleMatch[1].trim();
    const headingMatch = String(content || '').match(/^#\s+(.+)$/m);
    if (headingMatch) return headingMatch[1].trim();
    return path.basename(filePath, path.extname(filePath));
  }

  _normalizeContent(content) {
    return String(content || '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/data:image\/[^\s)]+/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  _extractTerms(text) {
    const raw = String(text || '').toLowerCase();
    const terms = new Set();
    const latin = raw.match(/[a-z0-9][a-z0-9_+.#-]{1,}/g) || [];
    for (const term of latin) {
      if (!STOP_WORDS.has(term) && term.length <= 40) terms.add(term);
    }
    const chinese = raw.match(/[\u4e00-\u9fff]{2,}/g) || [];
    for (const chunk of chinese) {
      if (!STOP_WORDS.has(chunk) && chunk.length <= 24) terms.add(chunk);
      for (let size = 2; size <= 4; size += 1) {
        for (let i = 0; i <= chunk.length - size; i += 1) {
          const gram = chunk.slice(i, i + size);
          if (!STOP_WORDS.has(gram)) terms.add(gram);
        }
      }
    }
    return [...terms].slice(0, 80);
  }

  _scoreDocument(doc, terms, { stage, platform }) {
    const haystack = `${doc.relativePath}\n${doc.title}\n${doc.content}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (!term) continue;
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped, 'g');
      const count = (haystack.match(re) || []).length;
      if (count > 0) score += Math.min(count, 8) * Math.min(term.length, 12);
    }
    const rel = doc.relativePath.toLowerCase();
    const title = doc.title.toLowerCase();
    if (platform && (rel.includes(String(platform).toLowerCase()) || title.includes(String(platform).toLowerCase()))) score += 40;
    if (stage === 'draft-generate' && rel.includes('config/rules')) score += 16;
    if (stage === 'draft-generate' && rel.includes('docs/赛道存档')) score += 24;
    if (stage === 'platform-rewrite' && rel.includes('.claude/commands')) score += 22;
    if (stage === 'platform-rewrite' && rel.includes('config/rules')) score += 18;
    if (rel.endsWith('/claude.md')) score -= 20;
    return score;
  }

  _buildSnippet(content, terms, maxChars) {
    const text = String(content || '').trim();
    if (!text) return '';
    let bestIndex = 0;
    let bestScore = -1;
    const lower = text.toLowerCase();
    for (let i = 0; i < text.length; i += 500) {
      const window = lower.slice(i, i + maxChars);
      let score = 0;
      for (const term of terms) {
        if (window.includes(term)) score += Math.min(term.length, 10);
      }
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
    const start = Math.max(0, bestIndex - 120);
    const snippet = text.slice(start, start + maxChars).trim();
    return snippet.replace(/\n{3,}/g, '\n\n');
  }

  _formatContext(matches, { stage, platform }) {
    if (!Array.isArray(matches) || matches.length === 0) return '';
    const label = stage === 'platform-rewrite'
      ? `平台改写知识库片段${platform ? `（${platform}）` : ''}`
      : '母稿生成知识库片段';
    const parts = [`\n\n---\n以下是${label}。只把它当作事实、术语、结构、禁忌和风格参考；不要逐字照搬，不要输出引用说明。`];
    matches.forEach((item, index) => {
      parts.push(`\n\n## 片段 ${index + 1}: ${item.title}\n来源: ${item.source}\n\`\`\`\n${item.snippet}\n\`\`\``);
    });
    return parts.join('');
  }
}

module.exports = {
  LightweightKnowledgeRetriever,
  DEFAULT_SOURCE_DIRS,
};
