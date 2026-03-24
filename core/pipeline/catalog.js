/**
 * [INPUT]: 无
 * [OUTPUT]: 导出 CREATION_STYLES / PLATFORM_CATALOG / 平台映射工具
 * [POS]: core/pipeline 的共享目录常量，避免 WebApp/CLI 常量漂移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const CREATION_STYLES = Object.freeze({
  contrarian: {
    key: 'contrarian',
    label: '反对大众观点',
    desc: '大家都说XX对，但其实...',
    thinking: '大家都说XX对，但其实...',
    prompt: '请以挑战主流认知的角度来写。大胆质疑大众普遍接受的观点，用事实和逻辑反驳常见误区，引发读者重新思考。语气犀利但有理有据。',
  },
  fresh: {
    key: 'fresh',
    label: '提出新观点',
    desc: '没人这么想过，但如果...',
    thinking: '没人这么想过，但如果...',
    prompt: '请从一个全新的、前所未有的角度来解读这个话题。避免重复已有的讨论，而是提出独到的见解和创新性的思考框架，让读者有"原来还能这样看"的感觉。',
  },
  debunk: {
    key: 'debunk',
    label: '反对旧观点提出新观点',
    desc: '传统做法是XX，更好的是...',
    thinking: '传统做法是XX，更好的方式是...',
    prompt: '先破后立：先指出现有主流观点的漏洞和局限性，用数据或案例论证其不足，然后提出你的新观点作为替代方案。逻辑链条要清晰有力。',
  },
  extend: {
    key: 'extend',
    label: '剖析旧观点引申新价值',
    desc: '大家都知道XX，但很少人意识到...',
    thinking: '大家都知道XX，但很少人意识到...',
    prompt: '深入剖析已有观点的底层逻辑，挖掘出被忽视的新维度和隐藏价值。不是否定原有观点，而是在其基础上发现新的可能性和应用场景。',
  },
  contrast: {
    key: 'contrast',
    label: '反差冲突对比',
    desc: '你以为是A，其实是B',
    thinking: '你以为是A，其实是B',
    prompt: '用强烈的对比和反差来制造认知冲击。将看似矛盾的事物放在一起比较，揭示隐藏的联系或讽刺的现实。善用"你以为是A，其实是B"的叙事结构。',
  },
  review: {
    key: 'review',
    label: '对比评测',
    desc: '多维度横评，数据说话',
    thinking: '多维度横评，数据说话',
    prompt: '以客观评测者的视角，从多个维度（成本、效果、易用性、适用场景等）横向对比。用具体数据和真实使用体验说话，给出有理有据的推荐结论。',
  },
  deconstruct: {
    key: 'deconstruct',
    label: '深度拆解',
    desc: '逐层剖析底层逻辑',
    thinking: '逐层剖析底层逻辑',
    prompt: '像庖丁解牛一样，逐层剖析这个话题的底层逻辑、运作机制、关键节点。从表象到本质，从现象到规律，让读者获得系统性的认知升级。',
  },
  predict: {
    key: 'predict',
    label: '趋势预判',
    desc: '信号→趋势→预测',
    thinking: '信号→趋势→预测',
    prompt: '基于当前信号和历史规律，预测这个领域的未来走向。分析关键趋势、拐点信号和可能的演化路径。语气要自信但留有余地，让读者觉得有前瞻性。',
  },
});

const PLATFORM_CATALOG = Object.freeze([
  { skill: '公众号', dir: '公众号', group: 'A', aliases: ['公众号'] },
  { skill: '知乎', dir: '知乎', group: 'A', aliases: ['知乎'] },
  { skill: 'linuxdo', dir: 'linuxdo', group: 'B', aliases: ['linuxdo'] },
  { skill: 'GitHub', dir: 'GitHub', group: 'B', aliases: ['GitHub', 'github'] },
  { skill: '小红书', dir: '小红书', group: 'C', aliases: ['小红书'] },
  { skill: '即刻', dir: '即刻', group: 'C', aliases: ['即刻'] },
  { skill: 'Medium', dir: 'Medium', group: 'D', aliases: ['Medium', 'medium'] },
  { skill: 'Quora', dir: 'Quora', group: 'D', aliases: ['Quora', 'quora'] },
  { skill: 'X推文', dir: 'X', group: 'E', aliases: ['X推文', 'X', 'x', 'twitter', 'x_twitter'] },
  { skill: 'Reddit', dir: 'Reddit', group: 'E', aliases: ['Reddit', 'reddit'] },
  { skill: '朋友圈', dir: '朋友圈', group: 'F', aliases: ['朋友圈'] },
]);

const PLATFORM_ALIAS_MAP = new Map();
for (const item of PLATFORM_CATALOG) {
  PLATFORM_ALIAS_MAP.set(item.skill, item.skill);
  PLATFORM_ALIAS_MAP.set(item.dir, item.skill);
  for (const alias of item.aliases || []) {
    PLATFORM_ALIAS_MAP.set(alias, item.skill);
  }
}

function resolvePlatformSkillName(name) {
  if (!name) return '';
  return PLATFORM_ALIAS_MAP.get(name) || '';
}

function listCreationStyles() {
  return Object.values(CREATION_STYLES).map((style) => ({ ...style }));
}

function listPlatformCatalog() {
  return PLATFORM_CATALOG.map((item) => ({ ...item, aliases: [...(item.aliases || [])] }));
}

module.exports = {
  CREATION_STYLES,
  PLATFORM_CATALOG,
  resolvePlatformSkillName,
  listCreationStyles,
  listPlatformCatalog,
};
