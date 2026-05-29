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
        quality: data.quality || null, // gold | avoid | suspect | likely_human | null
        humanScore: typeof data.human_score === 'number' ? data.human_score : null,
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
 *
 * 采样策略（2026-05-22 重构）：
 * - platform === 'master' | 'draft' → 仅采样学术论文（母稿统一用学术范文）
 * - platform 为具体平台名（wechat / toutiao / xiaohongshu / x / medium / quora / reddit）
 *   → 仅采样该平台真人范文；若数量不足，fallback 到学术论文（按语言匹配）
 * - 学术论文按 kind === 'academic' 识别，平台真人稿排除 kind === 'academic'
 * - quality: avoid 的范文一律剔除（朱雀实测为 AI 协助稿）
 */
export async function sampleTemplates(platform, count = 2) {
  const templates = await loadTemplates();
  const isMaster = platform === 'master' || platform === 'draft';
  const preferredLanguage = ENGLISH_PLATFORMS.has(platform) ? 'en' : 'zh';

  // 全局先排除被标记为 avoid 的范文
  const usable = templates.filter(t => t.quality !== 'avoid');

  const academicPool = usable.filter(t => t.kind === 'academic' && t.language === preferredLanguage);

  // 母稿：直接返回学术论文
  if (isMaster) {
    const shuffled = academicPool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // 平台稿：优先该平台真人范文
  const platformPool = usable.filter(t => t.platform === platform && t.kind !== 'academic');
  const shuffledPlatform = platformPool.sort(() => Math.random() - 0.5);
  const picked = shuffledPlatform.slice(0, count);

  // 数量不足 → fallback 到学术
  if (picked.length < count && academicPool.length > 0) {
    const shuffledAcademic = academicPool.sort(() => Math.random() - 0.5);
    for (const t of shuffledAcademic) {
      if (picked.length >= count) break;
      if (!picked.includes(t)) picked.push(t);
    }
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
