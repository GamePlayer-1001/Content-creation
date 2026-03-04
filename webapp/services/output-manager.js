/**
 * [INPUT]: 依赖 fs/path 扫描 output/ 目录
 * [OUTPUT]: 对外提供 OutputManager 类 (listPlatforms/listFiles/readFile/writeFile/deleteFile/getStats)
 * [POS]: services/ 的输出目录管理核心, 被 content/dashboard/review 路由消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const fs = require('fs');
const path = require('path');

// ============================================================
//  平台目录映射
// ============================================================
const PLATFORMS = [
  '母稿', '小红书', '公众号', '即刻', 'X', 'linuxdo', 'GitHub', '朋友圈',
  '封面', '卡片', '复盘', 'drafts', 'queue',
];

class OutputManager {
  constructor(outputDir) {
    this.outputDir = outputDir;
  }

  // --- 列出所有平台目录 ---
  listPlatforms() {
    return PLATFORMS
      .filter(p => {
        const dir = path.join(this.outputDir, p);
        return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
      })
      .map(p => ({
        name: p,
        count: this._countFiles(path.join(this.outputDir, p)),
      }));
  }

  // --- 列出某平台的所有文件 ---
  listFiles(platform) {
    const dir = path.join(this.outputDir, platform);
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir)
      .filter(f => !f.startsWith('.') && f !== 'CLAUDE.md')
      .map(f => {
        const filePath = path.join(dir, f);
        const stat = fs.statSync(filePath);
        return {
          name: f,
          size: stat.size,
          modified: stat.mtime.toISOString(),
          isDir: stat.isDirectory(),
        };
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));
  }

  // --- 读取文件内容 ---
  readFile(platform, filename) {
    const filePath = this._resolve(platform, filename);
    return fs.readFileSync(filePath, 'utf-8');
  }

  // --- 写入文件 ---
  writeFile(platform, filename, content) {
    const dir = path.join(this.outputDir, platform);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), content, 'utf-8');
  }

  // --- 删除文件 ---
  deleteFile(platform, filename) {
    const filePath = this._resolve(platform, filename);
    fs.unlinkSync(filePath);
  }

  // --- 产出统计 ---
  getStats() {
    const stats = {};
    for (const p of PLATFORMS) {
      const dir = path.join(this.outputDir, p);
      stats[p] = fs.existsSync(dir) ? this._countFiles(dir) : 0;
    }
    return stats;
  }

  // --- 今日产出 ---
  getTodayFiles(date = new Date()) {
    const today = date.toISOString().slice(0, 10);
    const result = {};

    for (const p of PLATFORMS) {
      const dir = path.join(this.outputDir, p);
      if (!fs.existsSync(dir)) continue;

      const files = fs.readdirSync(dir)
        .filter(f => f.startsWith(today.replace(/-/g, '')));
      if (files.length > 0) result[p] = files;
    }
    return result;
  }

  // --- 内部: 计算文件数 ---
  _countFiles(dir) {
    try {
      return fs.readdirSync(dir)
        .filter(f => !f.startsWith('.') && f !== 'CLAUDE.md')
        .length;
    } catch { return 0; }
  }

  // --- 安全路径解析 ---
  _resolve(platform, filename) {
    const filePath = path.join(this.outputDir, platform, path.basename(filename));
    if (!filePath.startsWith(this.outputDir)) {
      throw new Error('路径越界');
    }
    if (!fs.existsSync(filePath)) {
      throw new Error(`文件不存在: ${platform}/${filename}`);
    }
    return filePath;
  }
}

module.exports = OutputManager;
