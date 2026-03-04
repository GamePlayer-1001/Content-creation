/**
 * [INPUT]: 依赖 js-yaml 解析 YAML, 依赖 fs/path 读写文件
 * [OUTPUT]: 对外提供 ConfigManager 类 (list/read/write/readRaw)
 * [POS]: services/ 的配置读写核心, 被 routes/ 和其他 services 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ============================================================
//  敏感文件过滤 — 这些文件不暴露给前端编辑
// ============================================================
const SENSITIVE_FILES = new Set([
  'xhs_cookies.json',
  '.env.example',
]);

class ConfigManager {
  constructor(configDir) {
    this.configDir = configDir;
  }

  // --- 列出所有可编辑配置文件 ---
  list() {
    return fs.readdirSync(this.configDir)
      .filter(f => /\.(yaml|yml|json)$/.test(f))
      .filter(f => !SENSITIVE_FILES.has(f))
      .filter(f => f !== 'CLAUDE.md')
      .map(f => ({
        name: f,
        type: path.extname(f).slice(1),
        size: fs.statSync(path.join(this.configDir, f)).size,
      }));
  }

  // --- 读取并解析配置 ---
  read(name) {
    const filePath = this._resolve(name);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(name);

    if (ext === '.yaml' || ext === '.yml') return yaml.load(raw);
    if (ext === '.json') return JSON.parse(raw);
    return raw;
  }

  // --- 读取原始文本（供编辑器使用）---
  readRaw(name) {
    return fs.readFileSync(this._resolve(name), 'utf-8');
  }

  // --- 写入配置（自动序列化）---
  write(name, data) {
    const filePath = this._resolve(name);
    const ext = path.extname(name);
    let content;

    if (ext === '.yaml' || ext === '.yml') {
      content = typeof data === 'string' ? data : yaml.dump(data, {
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
      });
    } else if (ext === '.json') {
      content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    } else {
      content = String(data);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  // --- 安全路径解析 ---
  _resolve(name) {
    const filePath = path.join(this.configDir, path.basename(name));
    if (!filePath.startsWith(this.configDir)) {
      throw new Error('路径越界');
    }
    if (!fs.existsSync(filePath)) {
      throw new Error(`配置文件不存在: ${name}`);
    }
    return filePath;
  }
}

module.exports = ConfigManager;
