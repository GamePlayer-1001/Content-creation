/**
 * [INPUT]: 依赖 fs (读写 config/image-prompts.json)
 * [OUTPUT]: 对外提供 PromptStore 类 (list/save/delete)
 * [POS]: services/ 的 prompt 历史管理, 自动去重 + 上限 100 条
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const fs = require('fs');
const path = require('path');

class PromptStore {
  constructor(configDir) {
    this.filePath = path.join(configDir, 'image-prompts.json');
    this.maxEntries = 100;
    this._load();
  }

  // ============================================================
  //  读取全部 prompt
  // ============================================================
  list() {
    return this.prompts;
  }

  // ============================================================
  //  保存 prompt (自动去重 + 上限裁剪)
  // ============================================================
  save(text, platform = '') {
    const trimmed = text.trim();
    if (!trimmed) return null;

    // 去重: 相同 text+platform 的旧记录移除
    this.prompts = this.prompts.filter(
      p => !(p.text === trimmed && p.platform === platform)
    );

    const entry = {
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      text: trimmed,
      platform,
      createdAt: new Date().toISOString(),
    };

    // 新的排在前面
    this.prompts.unshift(entry);

    // 上限裁剪
    if (this.prompts.length > this.maxEntries) {
      this.prompts = this.prompts.slice(0, this.maxEntries);
    }

    this._save();
    return entry;
  }

  // ============================================================
  //  删除 prompt
  // ============================================================
  delete(id) {
    const before = this.prompts.length;
    this.prompts = this.prompts.filter(p => p.id !== id);
    if (this.prompts.length < before) {
      this._save();
      return true;
    }
    return false;
  }

  // ============================================================
  //  内部: 加载 / 持久化
  // ============================================================
  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        this.prompts = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        return;
      }
    } catch {}
    this.prompts = [];
  }

  _save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.prompts, null, 2), 'utf-8');
  }
}

module.exports = PromptStore;
