/**
 * [INPUT]: 依赖 fs/path, 依赖 ConfigManager 读取配置
 * [OUTPUT]: 对外提供 SkillLoader 类 (listSkills/buildPrompt)
 * [POS]: services/ 的 Skill 模板引擎, 将 .md 模板转化为完整 AI Prompt
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const fs = require('fs');
const path = require('path');

// ============================================================
//  配置文件路径模式 — 用于从 Skill 模板中提取引用
// ============================================================
const CONFIG_PATTERNS = [
  { regex: /config\/product\.yaml/g, file: 'product.yaml' },
  { regex: /config\/platforms\.yaml/g, file: 'platforms.yaml' },
  { regex: /config\/creator\.yaml/g, file: 'creator.yaml' },
  { regex: /config\/compliance\.yaml/g, file: 'compliance.yaml' },
  { regex: /config\/schedule\.yaml/g, file: 'schedule.yaml' },
  { regex: /config\/hashtags\.json/g, file: 'hashtags.json' },
  { regex: /config\/icons\.json/g, file: 'icons.json' },
  { regex: /config\/topics\.json/g, file: 'topics.json' },
  { regex: /config\/promotion\.json/g, file: 'promotion.json' },
];

class SkillLoader {
  constructor(commandsDir, configManager, templatesDir) {
    this.commandsDir = commandsDir;
    this.configManager = configManager;
    this.templatesDir = templatesDir;
  }

  // --- 列出所有可用 Skill ---
  listSkills() {
    return fs.readdirSync(this.commandsDir)
      .filter(f => f.endsWith('.md') && f !== 'CLAUDE.md')
      .map(f => ({
        name: f.replace('.md', ''),
        file: f,
      }));
  }

  // --- 构建完整 Prompt ---
  buildPrompt(skillName, args = {}) {
    const template = this._readTemplate(skillName);

    // 1. 替换 $ARGUMENTS
    let prompt = template.replace(/\$ARGUMENTS/g, args.topic || args.input || '');

    // 2. 如果有母稿内容，附加到末尾
    if (args.draftContent) {
      prompt += `\n\n---\n以下是母稿原文：\n\n${args.draftContent}`;
    }

    // 3. 提取并注入配置文件内容
    const configs = this._extractConfigs(prompt);
    if (configs.length > 0) {
      prompt += '\n\n---\n以下是引用的配置文件内容（请严格按照配置执行）：\n\n';
      for (const { file, content } of configs) {
        prompt += `## ${file}\n\`\`\`\n${content}\n\`\`\`\n\n`;
      }
    }

    // 4. 注入模板文件（如果 Skill 引用了 templates/）
    const templateRefs = this._extractTemplateRefs(template);
    if (templateRefs.length > 0) {
      prompt += '\n\n---\n以下是引用的写作模板：\n\n';
      for (const { name, content } of templateRefs) {
        prompt += `## ${name}\n\`\`\`\n${content}\n\`\`\`\n\n`;
      }
    }

    return prompt;
  }

  // --- 读取 Skill 模板 ---
  _readTemplate(skillName) {
    const filename = skillName.endsWith('.md') ? skillName : `${skillName}.md`;
    const filePath = path.join(this.commandsDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Skill 不存在: ${skillName}`);
    }
    return fs.readFileSync(filePath, 'utf-8');
  }

  // --- 提取 Skill 中引用的配置文件 ---
  _extractConfigs(template) {
    const needed = new Set();
    for (const { regex, file } of CONFIG_PATTERNS) {
      regex.lastIndex = 0;
      if (regex.test(template)) needed.add(file);
    }

    const result = [];
    for (const file of needed) {
      try {
        const content = this.configManager.readRaw(file);
        // 截断过长的配置（避免 Prompt 爆炸）
        const trimmed = content.length > 5000 ? content.slice(0, 5000) + '\n...(已截断)' : content;
        result.push({ file, content: trimmed });
      } catch {}
    }
    return result;
  }

  // --- 提取模板引用 ---
  _extractTemplateRefs(template) {
    const refs = [];
    const regex = /templates\/([\w\u4e00-\u9fff-]+\.md)/g;
    let match;
    const seen = new Set();

    while ((match = regex.exec(template)) !== null) {
      const name = match[1];
      if (seen.has(name)) continue;
      seen.add(name);

      const filePath = path.join(this.templatesDir, name);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const trimmed = content.length > 3000 ? content.slice(0, 3000) + '\n...(已截断)' : content;
        refs.push({ name, content: trimmed });
      }
    }
    return refs;
  }
}

module.exports = SkillLoader;
