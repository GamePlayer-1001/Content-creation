/**
 * 规则加载器 — 从 config/ 目录读取写作规则、平台规范、Tropes等
 * 供 draft-engine.js 和平台适配使用
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', '..');
const CONFIG_DIR = path.resolve(PROJECT_DIR, process.env.CONFIG_DIR || 'config');
const RULES_DIR = path.join(CONFIG_DIR, 'rules');

// 缓存
let _cache = {};
let _cacheTime = 0;
const CACHE_TTL = 120_000; // 2分钟

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

function invalidateCache() {
  _cache = {};
  _cacheTime = 0;
}

/**
 * 加载写作黑名单规则（精简版，嵌入 prompt）
 */
export function getWritingRules() {
  if (_cache.writingRules && Date.now() - _cacheTime < CACHE_TTL) return _cache.writingRules;

  const raw = readFile(path.join(RULES_DIR, 'writing-rules.md'));
  if (!raw) return '';

  // 提取关键部分：黑名单 + 润色引擎核心规则
  const sections = [];

  // 中文黑名单
  sections.push(`【中文黑名单 — 零容忍，绝对不能出现】
- 翻译腔开头：随着、在当今、近年来、伴随着、在这个时代
- 空洞过渡：不可否认、众所周知、毋庸置疑、显而易见
- AI废话：值得注意的是、起到重要作用、具有重要意义、需要指出的是、不仅如此
- 假客观：有人认为、据说、或许（说不出来源就别说）
- 总结套话：综上所述、总而言之、概括来说、归根结底、总之、综上
- 过度修饰：深深地、静静地、温柔地、轻轻地、默默地、缓缓地
- 假大空词：绽放、涅槃、启迪、沉淀、升华、洗礼、蜕变、觉醒、顿悟
- 套路连接：首先、其次、最后、此外、另外`);

  // 英文黑名单
  sections.push(`【英文黑名单 — 零容忍】
- AI高频词：delve, utilize, leverage, robust, streamline, harness, comprehensive, innovative, furthermore, moreover, additionally, notably, arguably
- 翻译腔开头："In today's rapidly evolving...", "It is important to note that...", "In the ever-changing landscape of..."
- 假权威："Studies show...", "Experts argue...", "Research suggests..."
- 总结套话："In conclusion", "To sum up", "In summary", "As we've seen"`);

  // 反AI检测策略
  sections.push(`【反AI检测8策略 — 必须执行】
1. 打破对仗句式 — 避免 A,B;A,B 的平行结构
2. 增加口语碎碎念 — 插入感叹/自嘲
3. 减少概括性总结句 — 删除"总的来说""综上所述"
4. 用具体场景替代抽象概念 — "效率提升50%" → "原来半天的活午饭前搞完"
5. 术语口语化 — "吃什么进去的"替代"输入了什么数据"
6. 陈述→思考过程 — "我琢磨过" "后来我想明白了"
7. 格式化→随意化 — 去掉工整列表，变成自然段落
8. 逻辑递进→故事展开 — 时间线叙事替代论证`);

  const result = sections.join('\n\n');
  _cache.writingRules = result;
  _cacheTime = Date.now();
  return result;
}

/**
 * 加载 Tropes 核心规则（精简版）
 */
export function getTropesRules() {
  if (_cache.tropes && Date.now() - _cacheTime < CACHE_TTL) return _cache.tropes;

  const result = `【AI写作模式识别 — 34条Tropes精简版，必须回避】

词汇类(critical/high):
- 禁用AI高频词：绽放/涅槃/赋能/共振/深邃 | delve/utilize/leverage/robust
- 禁用过度修饰副词：深深地/静静地/真正地 | truly/incredibly/fundamentally
- 禁用假权威引用："研究表明""专家认为" — 要么引具体来源要么直接表态
- 控制万能连接词：此外/另外/同时 | Additionally/Furthermore — 最多2次

句式类(high):
- 控制"不是X——而是Y"否定式 — 最多1次
- 控制三段式排比"更快、更强、更好" — 最多1次
- 控制设问自答"那问题来了？答案是..." — 最多2次
- 禁用时间递进"过去...现在...未来..." — 最多1次
- 控制虚假因果"因此""所以" — 检查是否真有因果关系
- 禁用升华式递进"这不仅是...更是..." — 最多1次

语气类(critical/high):
- 禁用假谦虚"我也不是专家但..." — 确定就直说
- 控制假对话感"让我们一起..." — 用"我"替代"我们"
- 禁用过度热情"革命性的!颠覆性的!" — 好用就说好用
- 禁用中立骑墙"一方面...另一方面..." — 要有立场
- 禁用假共情"我理解你的感受..." — 没经历就别装
- 禁用模拟深度"从本质上来说..." — 删除深度表演词

篇章类(critical):
- 禁用五段式论文结构 — 用故事/悬念/问题驱动
- 禁用万能总结"综上所述" — 用金句或开放式问题收尾
- 禁用开头套路"在当今时代" — 故事/数据/事件直接开头
- 控制段落等长 — 必须长短交替，制造节奏感

格式类:
- 社交平台(小红书/即刻/X)禁止Markdown，纯文本
- 控制emoji频率 — 出现在情绪高点而非均匀分布
- 禁止过度格式化 — 社交内容不用三级标题和嵌套列表`;

  _cache.tropes = result;
  _cacheTime = Date.now();
  return result;
}

/**
 * 加载创作者人设和创作方向
 */
export function getPersonaRules() {
  if (_cache.persona && Date.now() - _cacheTime < CACHE_TTL) return _cache.persona;

  const result = `【创作者人设】
- 身份：独立开发者 / AI工具探索者 / 一人公司
- 声音：技术人的真诚分享，不是运营在做推广
- 价值观：真实体验优先 / 技术深度+人话表达 / 分享过程和踩坑 / 宁可粗糙也不要精致得像广告

【病毒方法论】
公式: Virality = Novelty × Resonance
- Novelty: 反直觉洞察——原本以为是A，其实是B
- Resonance: 情绪钩子——制造好奇缺口，触发读者痛点

三种钩子：
1. 半讲故事：开场即悬念，讲到一半不说了
2. 无答案问题：制造好奇缺口，读者必须往下看
3. 反直觉事实：挑战认知，一句话制造信息差

节奏规则：
- 短句比例(<=10字): 25-35%
- 最多连续长句(>20字): 5句
- 情绪爆点密度: >=2个/千字
- 段落节奏: 长段落后必须跟短段落`;

  _cache.persona = result;
  _cacheTime = Date.now();
  return result;
}

/**
 * 加载平台特定规则
 */
export function getPlatformRules(platform) {
  if (_cache[`platform_${platform}`] && Date.now() - _cacheTime < CACHE_TTL) {
    return _cache[`platform_${platform}`];
  }

  const platformMap = {
    wechat: {
      name: '微信公众号',
      tone: '专业但亲切，讲故事，深度分析',
      taboo: '不要太学术，不要浅尝辄止',
      length: '1500-2500字',
      format: '长图文',
      polishIntensity: 'medium',
      fillerRatio: '8-12%',
      inversionCount: '2-3个',
      bodyStructure: null,
      extra: '段落比较短，一两句话一段；多用空行制造呼吸感；开头要抓人；金句可以加粗突出；深度扩展优先',
    },
    xiaohongshu: {
      name: '小红书',
      tone: '轻松、好奇、有冲击力',
      taboo: '不要长篇大论',
      length: '500-800字 + 3-6图',
      format: '图文（短图文 + 钩子标题）',
      polishIntensity: 'max',
      fillerRatio: '10-15%',
      inversionCount: '3-5个',
      bodyStructure: '第1段钩子→第2段场景描述→第3段具体例子→第4段引导互动→末尾一句话介绍',
      extra: '标题用"数字+反常识"或"疑问钩子"格式（<=20字）；排版禁Markdown纯文本，段落<=4行；结尾加#标签（3-5个）；语气亲切真实像朋友分享',
    },
    toutiao: {
      name: '今日头条',
      tone: '同公众号，标题更抓眼球',
      taboo: '避免过度标题党',
      length: '1500-2500字',
      format: '长图文',
      polishIntensity: 'medium',
      fillerRatio: '8-12%',
      inversionCount: '2-3个',
      bodyStructure: null,
      extra: '标题要有信息量和数字（如"3个方法"、"月入5万"）；信息密度高，不要太多留白；观点鲜明不怕争议',
    },
    zhihu: {
      name: '知乎',
      tone: '专业、深度、有理有据',
      taboo: '避免绝对化表达，不用"首先其次最后"',
      length: '1500-3000字',
      format: '深度长文/专栏/回答',
      polishIntensity: 'medium',
      fillerRatio: '8-12%',
      inversionCount: '2-3个',
      bodyStructure: null,
      extra: '亲身经历至少1段；具体数据/案例支撑；不完美表达（增加真实感）；"先说结论：xxx"结构；回答式语气',
    },
    jike: {
      name: '即刻',
      tone: '观点鲜明、真实随性、朋友间聊天',
      taboo: '不要太正式',
      length: '200-1000字',
      format: '短文本/中文本',
      polishIntensity: 'max',
      fillerRatio: '12-18%',
      inversionCount: '1-2个',
      bodyStructure: null,
      extra: '最口语化的平台；废话比例最高；纯文本不用Markdown',
    },
    linuxdo: {
      name: 'LinuxDo',
      tone: '技术向、真诚、开发者第一人称',
      taboo: '绝对禁止营销感。不说"快来体验"，说"分享我的实现思路"',
      length: '800-1500字',
      format: '技术长文',
      polishIntensity: 'strong',
      fillerRatio: '5-8%',
      inversionCount: '0-1个',
      bodyStructure: '第1段背景和动机→第2段技术选型和实现→第3段遇到的问题和解决方案→第4段当前状态和下一步→末尾欢迎交流',
      extra: '前2周只互动不发帖；贡献:自推 >= 10:1；技术术语保持专业，非技术全面口语化；极度敏感反营销',
    },
    github: {
      name: 'GitHub',
      tone: '技术文档风格，严谨',
      taboo: '不推销，只分享技术',
      length: '按需',
      format: 'Discussion/PR/Issue',
      polishIntensity: 'light',
      fillerRatio: '0',
      inversionCount: '0',
      bodyStructure: null,
      extra: '纯技术内容；Markdown完全允许；不做口语化；只检查formatting类trope',
    },
    x: {
      name: 'X (Twitter)',
      tone: '英文、简洁、builder视角',
      taboo: '不要中式英语',
      length: '280字符（含标签）',
      format: '英文推文/Thread',
      polishIntensity: 'strong',
      fillerRatio: '-',
      inversionCount: '-',
      bodyStructure: null,
      extra: '碎片化(2-3词)+全大写(1-2词)+280字符硬限；每天回复3-5条相关推文；英文缩写强制(don\'t/can\'t/it\'s)',
    },
    medium: {
      name: 'Medium',
      tone: '英文、深度、个人视角+专业洞察',
      taboo: '不要翻译腔英文，不要"In today\'s rapidly evolving..."',
      length: '1500-3000 words (6-12 min read)',
      format: '英文长文',
      polishIntensity: 'light',
      fillerRatio: '5-8%',
      inversionCount: '-',
      bodyStructure: null,
      extra: '必须有Subtitle、Featured Image、5个Tags；缩写强制使用；标题用"How I..."或"Why...is Wrong"',
    },
    quora: {
      name: 'Quora',
      tone: '英文、专业、直接回答+经验支撑',
      taboo: '不要绕弯子，不要CTA',
      length: '500-2000 words',
      format: '英文问答',
      polishIntensity: 'light',
      fillerRatio: '5-8%',
      inversionCount: '-',
      bodyStructure: 'Short answer直接结论 → Let me explain why → 分点说明+案例 → 简短总结',
      extra: '资历说明+源引用；专业权威感优先',
    },
    reddit: {
      name: 'Reddit',
      tone: '英文、真实、社区感、可讨论',
      taboo: '零营销味，像社区成员不是品牌方',
      length: '200-1500 words',
      format: '英文帖子/评论',
      polishIntensity: 'medium',
      fillerRatio: '8-12%',
      inversionCount: '-',
      bodyStructure: null,
      extra: '真实性第一，Reddit讨厌虚假；承认不足邀请补充；遵守subreddit规则；Reddit术语(ngl/lowkey)；AI高度敏感',
    },
    pengyouquan: {
      name: '朋友圈',
      tone: '真实、个人化、不像广告',
      taboo: '3条里最多1条直接推广',
      length: '100-500字',
      format: '短文+配图',
      polishIntensity: 'light',
      fillerRatio: '5-8%',
      inversionCount: '0-1个',
      bodyStructure: null,
      extra: '轻量润色即可；短文本；真实生活感',
    },
  };

  const p = platformMap[platform];
  if (!p) return '';

  let rules = `【${p.name} 平台规则】
- 语气风格：${p.tone}
- 禁忌：${p.taboo}
- 字数要求：${p.length}
- 内容格式：${p.format}
- 润色力度：${p.polishIntensity}`;

  if (p.fillerRatio && p.fillerRatio !== '-' && p.fillerRatio !== '0') {
    rules += `\n- 人类废话比例：${p.fillerRatio}`;
  }
  if (p.inversionCount && p.inversionCount !== '-' && p.inversionCount !== '0') {
    rules += `\n- 倒装句数量：${p.inversionCount}`;
  }
  if (p.bodyStructure) {
    rules += `\n- 内容结构：${p.bodyStructure}`;
  }
  if (p.extra) {
    rules += `\n- 特殊要求：${p.extra}`;
  }

  _cache[`platform_${platform}`] = rules;
  return rules;
}

/**
 * 获取支持的全部平台列表
 */
export function getAllPlatforms() {
  return [
    { id: 'wechat', name: '微信公众号', group: 'A' },
    { id: 'xiaohongshu', name: '小红书', group: 'C' },
    { id: 'toutiao', name: '今日头条', group: 'A' },
    { id: 'zhihu', name: '知乎', group: 'A' },
    { id: 'jike', name: '即刻', group: 'C' },
    { id: 'linuxdo', name: 'LinuxDo', group: 'B' },
    { id: 'github', name: 'GitHub', group: 'B' },
    { id: 'x', name: 'X (Twitter)', group: 'E' },
    { id: 'medium', name: 'Medium', group: 'D' },
    { id: 'quora', name: 'Quora', group: 'D' },
    { id: 'reddit', name: 'Reddit', group: 'E' },
    { id: 'pengyouquan', name: '朋友圈', group: 'F' },
  ];
}

/**
 * 获取质量门控标准
 */
export function getQualityGate() {
  return `【质量门控标准】
母稿四维评分（每项1-10分，平均>=8）：
1. 钩子强度：前3句能否制造好奇缺口？
2. 洞察密度：每段是否有新信息？有无反直觉洞察？
3. 传播基因：有无让人想分享的点？有无可截图金句(<=20字)？
4. 论证深度：有无具体细节(时间/地点/数据/案例)？

对抗性审查三问：
- "为什么我要继续看？" — 钩子是否在前3句创造了好奇缺口
- "这个观点我早就知道了" — 是否有真正的反直觉洞察
- "看完了所以呢？" — 是否有让人想分享/收藏的理由`;
}
