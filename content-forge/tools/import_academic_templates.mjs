import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

const targets = [
  {
    title: '生成式人工智能赋能研究生教育：理论逻辑、法律风险与应对策略',
    author: '开放全文页面作者',
    source: 'html.rhhz.net',
    url: 'https://html.rhhz.net/yjyjyyj/html/20250203.htm',
    out: 'templates/中文/学术论文/生成式人工智能赋能研究生教育.md',
    language: 'zh',
    type: 'academic_paper'
  },
  {
    title: 'AI辅助博士生科研现状及其影响的学科差异',
    author: '开放全文页面作者',
    source: 'html.rhhz.net',
    url: 'https://html.rhhz.net/yjyjyyj/html/yjsjyyj-2025-6-19.htm',
    out: 'templates/中文/学术论文/AI辅助博士生科研现状及其影响的学科差异.md',
    language: 'zh',
    type: 'academic_paper'
  },
  {
    title: '教育领域数字孪生技术应用的伦理问题研究',
    author: '刁生富（佛山科学技术学院教授，博士）',
    source: 'html.rhhz.net',
    url: 'https://html.rhhz.net/HNLGDXXBSKB/html/2022-6-16.htm',
    out: 'templates/中文/学术论文/教育领域数字孪生技术应用的伦理问题研究.md',
    language: 'zh',
    type: 'academic_paper'
  },
  {
    title: '信息技术对未来社会的影响',
    author: '王克迪（中央党校哲学教研部教授）',
    source: 'html.rhhz.net',
    url: 'https://html.rhhz.net/KXYSH/html/f212e051-e77a-49f2-946f-dc675d2871bf.htm',
    out: 'templates/中文/学术论文/信息技术对未来社会的影响.md',
    language: 'zh',
    type: 'academic_paper'
  },
  {
    title: '下一代人工智能的挑战与思考',
    author: '焦李成（西安电子科技大学教授，博士生导师）',
    source: 'html.rhhz.net',
    url: 'http://html.rhhz.net/tis/html/202103043.htm',
    out: 'templates/中文/学术论文/下一代人工智能的挑战与思考.md',
    language: 'zh',
    type: 'academic_paper'
  },
  {
    title: '机制主义人工智能理论——一种通用的人工智能理论',
    author: '钟义信（北京邮电大学教授，博士生导师）',
    source: 'html.rhhz.net',
    url: 'http://html.rhhz.net/tis/html/201711032.htm',
    out: 'templates/中文/学术论文/机制主义人工智能理论.md',
    language: 'zh',
    type: 'academic_paper'
  },
  {
    title: 'From human writing to artificial intelligence generated text: examining the prospects and potential threats of ChatGPT in academic writing',
    author: 'Ismail Dergaa, Karim Chamari, Piotr Zmijewski, Helmi Ben Saad',
    source: 'PMC',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10108763/',
    out: 'templates/英文/academic/from-human-writing-to-ai-generated-text.md',
    language: 'en',
    type: 'academic_paper'
  },
  {
    title: 'Using Artificial Intelligence for Scholarly Writing',
    author: 'Marilyn H Oermann, Jacqueline K Owens, Heather Carter-Templeton, Gabriel Peterson, Hannah E Bailey',
    source: 'PMC',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12548816/',
    out: 'templates/英文/academic/using-artificial-intelligence-for-scholarly-writing.md',
    language: 'en',
    type: 'academic_paper'
  },
  {
    title: 'Co-Writing with AI, on Human Terms: Aligning Research with User Demands Across the Writing Process',
    author: 'arXiv authors',
    source: 'ar5iv/arXiv',
    url: 'https://ar5iv.labs.arxiv.org/html/2504.12488',
    out: 'templates/英文/academic/co-writing-with-ai-on-human-terms.md',
    language: 'en',
    type: 'academic_preprint'
  },
  {
    title: 'Examining Human-AI Collaboration for Co-Writing Constructive Comments Online',
    author: 'arXiv authors',
    source: 'ar5iv/arXiv',
    url: 'https://ar5iv.labs.arxiv.org/html/2411.03295',
    out: 'templates/英文/academic/examining-human-ai-collaboration-for-co-writing.md',
    language: 'en',
    type: 'academic_preprint'
  },
  {
    title: 'Ethics and journalistic challenges in the age of artificial intelligence: talking with professionals and experts',
    author: 'Frontiers in Communication authors',
    source: 'Frontiers in Communication',
    url: 'https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2024.1465178/full',
    out: 'templates/英文/academic/ethics-and-journalistic-challenges-in-ai-age.md',
    language: 'en',
    type: 'academic_paper'
  },
  {
    title: '生成式人工智能对研究生师生角色的消解与重构',
    author: '开放全文页面作者',
    source: 'html.rhhz.net',
    url: 'https://html.rhhz.net/yjyjyyj/html/20230507.htm',
    out: 'templates/中文/学术论文/生成式人工智能对研究生师生角色的消解与重构.md',
    language: 'zh',
    type: 'academic_paper'
  },
  {
    title: '政务短视频发展现状及在政府传播中的作用',
    author: '开放全文页面作者',
    source: 'html.rhhz.net',
    url: 'http://html.rhhz.net/BJHKHTDXXBSKB/20190618.htm',
    out: 'templates/中文/学术论文/政务短视频发展现状及在政府传播中的作用.md',
    language: 'zh',
    type: 'academic_paper'
  },
  {
    title: '面向智能教育的自适应学习关键技术与应用',
    author: '开放全文页面作者',
    source: 'html.rhhz.net',
    url: 'https://html.rhhz.net/tis/html/202105036.htm',
    out: 'templates/中文/学术论文/面向智能教育的自适应学习关键技术与应用.md',
    language: 'zh',
    type: 'academic_paper'
  },
  {
    title: 'Community Guidelines Make this the Best Party on the Internet: An In-Depth Study of Online Platforms',
    author: 'arXiv authors (CHI 2024)',
    source: 'arXiv',
    url: 'https://arxiv.org/html/2405.05225v1',
    out: 'templates/英文/academic/community-guidelines-best-party-internet.md',
    language: 'en',
    type: 'academic_preprint'
  },
  {
    title: 'Content ARCs: Decentralized Content Rights in the Age of Generative AI',
    author: 'arXiv authors',
    source: 'arXiv',
    url: 'https://arxiv.org/html/2503.14519v2',
    out: 'templates/英文/academic/content-arcs-decentralized-rights.md',
    language: 'en',
    type: 'academic_preprint'
  },
  {
    title: 'Rich-Get-Richer? Analyzing Content Creator Earnings Across Online Platforms',
    author: 'Ilan Strauss et al. (arXiv)',
    source: 'arXiv',
    url: 'https://arxiv.org/html/2509.26523v1',
    out: 'templates/英文/academic/rich-get-richer-creator-earnings.md',
    language: 'en',
    type: 'academic_preprint'
  },
  {
    title: 'Designing Usable Controls for Customizable Social Media Feeds',
    author: 'arXiv authors',
    source: 'arXiv',
    url: 'https://arxiv.org/html/2509.19615v1',
    out: 'templates/英文/academic/designing-usable-controls-social-media-feeds.md',
    language: 'en',
    type: 'academic_preprint'
  }
];

const entityMap = new Map([
  ['amp', '&'],
  ['lt', '<'],
  ['gt', '>'],
  ['quot', '"'],
  ['apos', "'"],
  ['nbsp', ' '],
  ['ensp', ' '],
  ['emsp', ' '],
  ['mdash', '—'],
  ['ndash', '–'],
  ['lsquo', '‘'],
  ['rsquo', '’'],
  ['ldquo', '“'],
  ['rdquo', '”']
]);

function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (_, entity) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      const code = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    }
    if (entity.startsWith('#')) {
      const code = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    }
    return entityMap.get(entity) ?? '';
  });
}

function pickArticleHtml(html) {
  const candidates = [
    /<main[\s\S]*?<\/main>/i,
    /<article[\s\S]*?<\/article>/i,
    /<div[^>]+class=["'][^"']*(?:article|content|main|正文|cont)[^"']*["'][^>]*>[\s\S]*?<\/div>/i,
    /<body[\s\S]*?<\/body>/i
  ];

  for (const pattern of candidates) {
    const matched = html.match(pattern);
    if (matched?.[0] && matched[0].length > 2000) return matched[0];
  }

  return html;
}

function htmlToMarkdown(html) {
  let s = pickArticleHtml(html);
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
  s = s.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  s = s.replace(/<form[\s\S]*?<\/form>/gi, '');
  s = s.replace(/<header[\s\S]*?<\/header>/gi, '');
  s = s.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  s = s.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  s = s.replace(/<aside[\s\S]*?<\/aside>/gi, '');
  s = s.replace(/<h1[^>]*>/gi, '\n# ');
  s = s.replace(/<h2[^>]*>/gi, '\n## ');
  s = s.replace(/<h3[^>]*>/gi, '\n### ');
  s = s.replace(/<h4[^>]*>/gi, '\n#### ');
  s = s.replace(/<h5[^>]*>/gi, '\n##### ');
  s = s.replace(/<\/h[1-5]>/gi, '\n\n');
  s = s.replace(/<p[^>]*>/gi, '\n');
  s = s.replace(/<\/p>/gi, '\n\n');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<li[^>]*>/gi, '\n- ');
  s = s.replace(/<\/li>/gi, '\n');
  s = s.replace(/<tr[^>]*>/gi, '\n');
  s = s.replace(/<\/td>/gi, ' | ');
  s = s.replace(/<\/th>/gi, ' | ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = decodeEntities(s);
  s = s.replace(/\r/g, '\n');
  s = s.replace(/[ \t\f\v]+/g, ' ');
  s = s.replace(/[ \t]+\n/g, '\n');
  s = s.replace(/\n[ \t]+/g, '\n');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

function normalizeText(text) {
  const badLine = /^(Skip to|Navigation|Menu|Search|Log in|Subscribe|Download PDF|Article alerts|Share on|Advertisement|Figures|Tables|Supplementary|Cite this article|Metrics|Permissions|Copyright|Conflict of interest|Publisher|View all|查看|下载|分享|打印|收藏|上一篇|下一篇|关闭|导出|加入书架|全文|摘要$|关键词$|中图分类号|收稿日期|基金项目|作者简介|通讯作者|参考文献\s*$)/i;
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const kept = [];

  for (const line of lines) {
    if (badLine.test(line)) continue;
    if (/^https?:\/\//i.test(line)) continue;
    if (/^[·•\-*\s]+$/.test(line)) continue;
    if (line.length <= 1) continue;
    kept.push(line);
  }

  return kept.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

function escapeYaml(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function frontmatter(target) {
  return [
    '---',
    `title: "${escapeYaml(target.title)}"`,
    `source: "${escapeYaml(target.source)}"`,
    `url: "${escapeYaml(target.url)}"`,
    `author: "${escapeYaml(target.author)}"`,
    `type: "${escapeYaml(target.type)}"`,
    `language: "${escapeYaml(target.language)}"`,
    'template_kind: "academic_reference"',
    'license_note: "Open full-text web source; saved locally for style-analysis reference."',
    '---',
    ''
  ].join('\n');
}

async function importOne(target) {
  const response = await fetch(target.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AcademicTemplateImporter/1.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const html = await response.text();
  const content = normalizeText(htmlToMarkdown(html));
  const minLength = target.language === 'zh' ? 2500 : 3500;

  if (content.length < minLength) {
    throw new Error(`content too short: ${content.length}`);
  }

  const outPath = path.join(root, target.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const md = `${frontmatter(target)}# ${target.title}\n\n> Source: ${target.url}\n\n${content}\n`;
  fs.writeFileSync(outPath, md, 'utf8');
  return { ok: true, out: target.out, length: content.length };
}

const results = [];
for (const target of targets) {
  try {
    const result = await importOne(target);
    results.push(result);
    console.log(`OK ${result.out} ${result.length}`);
  } catch (error) {
    results.push({ ok: false, out: target.out, error: error.message });
    console.log(`FAIL ${target.out} ${error.message}`);
  }
}

const successCount = results.filter((item) => item.ok).length;
if (successCount < 4) {
  process.exitCode = 1;
}
