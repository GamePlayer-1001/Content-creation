/**
 * 范文风格分析器
 * 从参考案例中提取写作模式，用于 few-shot 学习
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..', '..');
const DEFAULT_TEMPLATES_DIR = path.resolve(PROJECT_DIR, 'templates');
const CONFIGURED_TEMPLATES_DIR = process.env.TEMPLATES_DIR
  ? path.resolve(PROJECT_DIR, process.env.TEMPLATES_DIR)
  : null;
const TEMPLATE_ROOTS = [...new Set([CONFIGURED_TEMPLATES_DIR, DEFAULT_TEMPLATES_DIR].filter(Boolean))]
  .filter(root => fs.existsSync(root));

// 缓存已加载的范文
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 60_000; // 1分钟缓存
const ENGLISH_PLATFORMS = new Set(['x', 'medium', 'quora', 'reddit']);

/**
 * 加载所有范文文件
 */
async function loadTemplates() {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL) return _cache;

  const patterns = TEMPLATE_ROOTS.flatMap(root => [
    path.join(root, '中文', '公众号', '*.md'),
    path.join(root, '中文', '头条', '*.md'),
    path.join(root, '中文', '小红书', '*.md'),
    path.join(root, '中文', '学术论文', '*.md'),
    path.join(root, '英文', 'academic', '*.md'),
  ]);

  const allFiles = [];
  for (const pattern of patterns) {
    const files = await glob(pattern.replace(/\\/g, '/'));
    allFiles.push(...files);
  }
  const uniqueFiles = [...new Set(allFiles)];

  const templates = [];
  for (const file of uniqueFiles) {
    try {
      const raw = fs.readFileSync(file, 'utf-8');
      const { data, content } = matter(raw);
      const dirName = path.basename(path.dirname(file));
      let platform = 'general';
      if (dirName === '公众号') platform = 'wechat';
      else if (dirName === '头条') platform = 'toutiao';
      else if (dirName === '小红书') platform = 'xiaohongshu';
      else if (dirName === '学术论文') platform = 'academic_zh';
      else if (dirName === 'academic') platform = 'academic_en';
      const kind = data.template_kind === 'academic_reference' || platform.startsWith('academic_') ? 'academic' : 'article';
      const language = data.language || (platform === 'academic_en' ? 'en' : 'zh');

      templates.push({
        title: data.title || path.basename(file, '.md'),
        platform,
        kind,
        language,
        content: content.slice(0, 3000), // 截取前3000字作为参考
        filename: path.basename(file),
      });
    } catch (e) {
      // 跳过无法解析的文件
    }
  }

  _cache = templates;
  _cacheTime = now;
  return templates;
}

/**
 * 按平台随机抽取范文
 */
export async function sampleTemplates(platform, count = 2) {
  const templates = await loadTemplates();
  const preferredLanguage = ENGLISH_PLATFORMS.has(platform) ? 'en' : 'zh';

  // 优先抽取目标平台的真人范文
  const platformTemplates = templates.filter(t => t.platform === platform && t.kind !== 'academic');
  const academicTemplates = templates.filter(t => t.kind === 'academic' && t.language === preferredLanguage);
  const platformCount = academicTemplates.length > 0 && count > 1 ? count - 1 : count;
  const picked = [];

  // 从目标平台随机抽取
  const shuffledPlatform = platformTemplates.sort(() => Math.random() - 0.5);
  picked.push(...shuffledPlatform.slice(0, platformCount));

  if (picked.length < count && academicTemplates.length > 0) {
    const shuffledAcademic = academicTemplates.sort(() => Math.random() - 0.5);
    picked.push(...shuffledAcademic.slice(0, count - picked.length));
  }

  // 如果目标平台范文不够，从其他平台的真人范文中补充（跨平台多样性）
  if (picked.length < count) {
    const otherTemplates = templates
      .filter(t => !picked.includes(t) && t.language === preferredLanguage)
      .sort(() => Math.random() - 0.5);
    picked.push(...otherTemplates.slice(0, count - picked.length));
  }

  return picked;
}

/**
 * 分析范文的写作风格特征
 */
export function analyzeStyle(content) {
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim() && !p.startsWith('#') && !p.startsWith('!'));
  const sentences = content.split(/[。！？\n]/).filter(s => s.trim().length > 2);

  // 段落长度分布
  const paraLengths = paragraphs.map(p => p.trim().length);
  const avgParaLen = paraLengths.reduce((a, b) => a + b, 0) / (paraLengths.length || 1);

  // 句子长度分布
  const sentLengths = sentences.map(s => s.trim().length);
  const avgSentLen = sentLengths.reduce((a, b) => a + b, 0) / (sentLengths.length || 1);

  // 修辞手法检测
  const rhetorical = {
    questions: (content.match(/？/g) || []).length,
    exclamations: (content.match(/！/g) || []).length,
    ellipsis: (content.match(/……|\.{3}/g) || []).length,
    quotes: (content.match(/["「『]/g) || []).length,
  };

  // 口语化标记
  const colloquial = (content.match(/[吧呢嘛啊呀哦噢嗯哈]/g) || []).length;

  return {
    avgParagraphLength: Math.round(avgParaLen),
    avgSentenceLength: Math.round(avgSentLen),
    paragraphCount: paragraphs.length,
    rhetorical,
    colloquialDensity: colloquial / (content.length / 100),
    shortParagraphRatio: paraLengths.filter(l => l < 50).length / (paraLengths.length || 1),
  };
}

/**
 * 生成写作风格指令
 */
export function buildStylePrompt(templates) {
  const styles = templates.map(t => analyzeStyle(t.content));

  const avgShortRatio = styles.reduce((a, s) => a + s.shortParagraphRatio, 0) / styles.length;
  const avgColloquial = styles.reduce((a, s) => a + s.colloquialDensity, 0) / styles.length;

  let styleHint = '写作风格要求：\n';

  if (avgShortRatio > 0.4) {
    styleHint += '- 大量使用短段落（1-2句话一段），制造呼吸感\n';
  }
  if (avgColloquial > 0.3) {
    styleHint += '- 适当使用口语化表达（吧、呢、嘛等语气词）\n';
  }

  styleHint += '- 句子长短交替，避免每句话长度一致\n';
  styleHint += '- 用具体细节代替抽象描述（"出租屋楼下那家24小时便利店的灯"好过"城市的夜晚"）\n';
  styleHint += '- 可以有观点和好恶，不要过于中立\n';
  styleHint += '- 开头不要"在当今时代/随着XX的发展"这类AI八股开头\n';
  styleHint += '- 不要使用"总而言之/综上所述"这类总结语\n';
  styleHint += '- 每段之间要有自然的逻辑连接，但不要生硬的"首先/其次/最后"\n';
  styleHint += '- 偶尔用反问、设问来引导读者思考\n';
  styleHint += '- 论据要有具体的数据或案例支撑，不要空泛论证\n';

  return styleHint;
}

export async function getTemplatesList() {
  const templates = await loadTemplates();
  return templates.map(t => ({
    title: t.title,
    platform: t.platform,
    kind: t.kind,
    language: t.language,
    filename: t.filename,
    preview: t.content.slice(0, 200),
  }));
}
