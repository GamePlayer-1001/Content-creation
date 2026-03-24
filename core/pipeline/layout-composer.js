/**
 * [INPUT]: 平台名 + 原始正文 + 图片信息 + 选题信息
 * [OUTPUT]: 排版 Markdown（按平台组模板组织结构）
 * [POS]: core/pipeline 的排版组装器，被 Web 路由与 CLI 阶段复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const { PLATFORM_CATALOG, resolvePlatformSkillName } = require('./catalog');

const GROUP_TEMPLATE = Object.freeze({
  A: {
    name: '长图文模板',
    checklist: [
      '开头 2-3 句先给结论，再展开论证',
      '每 200-300 字一个小标题，避免大段墙文',
      '结尾加互动问题或行动建议',
    ],
    sections: ['开场观点', '核心展开', '结尾互动'],
  },
  B: {
    name: '技术社区模板',
    checklist: [
      '先交代背景与问题，再写方案与权衡',
      '把关键步骤拆成有序小节，便于复现',
      '最后补充风险与下一步计划',
    ],
    sections: ['问题背景', '实现方案', '复盘总结'],
  },
  C: {
    name: '社交平台模板',
    checklist: [
      '首段必须有钩子或反差点',
      '正文聚焦一个核心观点，不做多线并行',
      '收尾引导评论/私信/收藏',
    ],
    sections: ['开场钩子', '核心表达', '互动收尾'],
  },
  D: {
    name: '国际长文模板',
    checklist: [
      '开头直给核心观点，避免空泛背景',
      '中段用案例或数据支撑主张',
      '结尾给出清晰 takeaways',
    ],
    sections: ['Thesis', 'Evidence', 'Takeaways'],
  },
  E: {
    name: '国际社交模板',
    checklist: [
      '首句简短有冲击（可单独成行）',
      '正文拆短句，突出信息密度',
      '结尾一句行动或讨论引导',
    ],
    sections: ['Hook', 'Core Message', 'Call to Action'],
  },
  F: {
    name: '私域表达模板',
    checklist: [
      '像发给朋友，不要官话',
      '围绕一个具体经历或观察展开',
      '结尾留提问，促进互动',
    ],
    sections: ['近况切入', '主要观点', '朋友式收尾'],
  },
  DEFAULT: {
    name: '通用模板',
    checklist: [
      '先给结论，再展开细节',
      '控制段落长度，提升可读性',
      '收尾给下一步建议',
    ],
    sections: ['开场', '主体', '结尾'],
  },
});

function composeLayoutMarkdown({
  platform = '',
  sourceFile = '',
  sourceContent = '',
  hotspotTitle = '',
  hotspotSummary = '',
  images = [],
  generatedAt = new Date().toISOString(),
}) {
  const skillName = resolvePlatformSkillName(platform) || platform;
  const catalogItem = PLATFORM_CATALOG.find((item) => item.skill === skillName);
  const group = catalogItem?.group || 'DEFAULT';
  const template = GROUP_TEMPLATE[group] || GROUP_TEMPLATE.DEFAULT;

  const parts = splitParagraphs(sourceContent);
  const head = parts[0] || '';
  const tail = parts.length > 1 ? parts[parts.length - 1] : '';
  const middle = parts.length > 2 ? parts.slice(1, -1).join('\n\n') : parts.slice(1).join('\n\n');
  const fallbackCore = sourceContent || '';

  let output = `# ${skillName || platform || '平台'} 图文排版稿\n\n`;
  output += `- 生成时间: ${generatedAt}\n`;
  if (sourceFile) output += `- 来源文件: ${sourceFile}\n`;
  if (hotspotTitle) output += `- 选题: ${hotspotTitle}\n`;
  output += `- 模板: ${template.name}\n\n`;

  if (hotspotSummary) {
    output += `## 选题摘要\n\n${hotspotSummary}\n\n`;
  }

  output += '## 发布建议\n\n';
  template.checklist.forEach((item, index) => {
    output += `${index + 1}. ${item}\n`;
  });
  output += '\n';

  if (Array.isArray(images) && images.length > 0) {
    output += '## 配图清单\n\n';
    images.forEach((img, idx) => {
      const typeLabel = img.imageType === 'cover' ? '封面' : '配图';
      output += `${idx + 1}. [${typeLabel}] ${img.path}\n`;
    });
    output += '\n';
  }

  const [sectionA, sectionB, sectionC] = template.sections;
  output += `## ${sectionA}\n\n${head || fallbackCore}\n\n`;
  output += `## ${sectionB}\n\n${middle || fallbackCore}\n\n`;
  output += `## ${sectionC}\n\n${tail || fallbackCore}\n`;
  return output;
}

function splitParagraphs(text) {
  return String(text || '')
    .split(/\n{2,}/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

module.exports = {
  composeLayoutMarkdown,
};
