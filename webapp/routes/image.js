/**
 * [INPUT]: 依赖 imageGenerator + promptStore + aiAdapter (翻译) + poster-templates.json
 * [OUTPUT]: POST /api/image/generate, GET/POST/DELETE /api/image/prompts
 * [POS]: routes/ 的图片生成 API, 封装双轨生成(封面+配图) + 反AI荧光色 + 中英翻译管道
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const fs = require('fs');
const path = require('path');
const router = require('express').Router();

// ============================================================
//  核心常量: 反AI荧光色 + 封面/配图系统指令
// ============================================================

// 反AI荧光色 — 所有图片生成都注入
const ANTI_AI_CORE = [
  'Use natural, organic color palette only.',
  'Absolutely NO electric blue (#4169E1), NO neon purple (#8A2BE2),',
  'NO AI-typical cyan glow, NO oversaturated fluorescent tones.',
  'Prefer warm earth tones, muted natural hues, analog film color science.',
  'Subtle film grain texture, natural micro imperfections.',
  'NO hyperreal AI smoothing, NO plastic skin texture.',
].join(' ');

// 封面模式 — 要求文字渲染在图上
const COVER_DIRECTIVE = [
  'You are generating a poster/cover image with TEXT rendered directly on it.',
  'The text MUST be clearly visible, legible, perfectly spelled,',
  'with high contrast against the background.',
  'Text should be the visual focal point with sharp edges and proper typography.',
].join(' ');

// 配图模式 — 纯视觉, 禁止文字
const ILLUSTRATION_DIRECTIVE = [
  'You are generating a pure visual illustration with NO TEXT whatsoever.',
  'Absolutely NO text, NO words, NO letters, NO numbers, NO watermarks anywhere.',
  'Focus entirely on visual metaphor, composition, lighting, and mood.',
].join(' ');

// 海报模板 (封面模式用 placement / style)
let POSTER_TEMPLATES = { text_placements: [], styles: {}, negative_prompt: '' };
try {
  POSTER_TEMPLATES = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../config/poster-templates.json'), 'utf-8')
  );
} catch { /* 容错: 文件不存在时用默认空值 */ }

// ============================================================
//  生成图片 (双轨模式: cover / illustration)
// ============================================================
router.post('/generate', async (req, res) => {
  const {
    prompt,                    // 兼容旧模式: 直接 prompt
    extraction,                // 提炼内容 (画什么)
    stylePrompt,               // 风格提示词 (怎么画)
    platform = '', topic = '', index = 0,
    aspectRatio = '1:1', imageSize = '1K',
    engine = 'claude',
    imageType = 'illustration', // 'cover' | 'illustration'
    coverTitle = '',            // 封面标题
    coverSubtitle = '',         // 封面副标题
  } = req.body;
  const { imageGenerator, promptStore, aiAdapter } = req.app.locals;

  const ts = () => new Date().toLocaleTimeString('zh-CN', { hour12: false });

  // --- 服务可用性检查 ---
  if (!imageGenerator) {
    console.log(`  ${ts()}  [图片] ✗ 服务未配置 (缺少 GOOGLE_AI_KEY)`);
    return res.status(503).json({ error: '图片生成服务未配置 (缺少 GOOGLE_AI_KEY)' });
  }

  // --- 根据 imageType 构建 prompt ---
  let finalPromptCN;

  if (imageType === 'cover') {
    // ====== 封面模式: 带文字海报 ======
    if (!coverTitle) {
      return res.status(400).json({ error: '封面需要标题文字' });
    }

    const textOnImage = coverSubtitle
      ? `${coverTitle}\n${coverSubtitle}`
      : coverTitle;

    // 随机选 placement 和 style
    const placements = POSTER_TEMPLATES.text_placements || ['billboard'];
    const placement = placements[Math.floor(Math.random() * placements.length)];

    const styleKeys = Object.keys(POSTER_TEMPLATES.styles || {});
    const randomStyleKey = styleKeys[Math.floor(Math.random() * styleKeys.length)] || 'minimal';
    const randomStyleDesc = (POSTER_TEMPLATES.styles || {})[randomStyleKey] || 'modern clean design';

    finalPromptCN = [
      COVER_DIRECTIVE,
      ANTI_AI_CORE,
      POSTER_TEMPLATES.negative_prompt || '',
      `The text "${textOnImage}" must be clearly visible and legible on a ${placement}.`,
      `Rendered with high clarity, sharp edges, perfect spelling.`,
      `Style: ${stylePrompt || randomStyleDesc}`,
      extraction || '',
    ].filter(Boolean).join('\n');

  } else {
    // ====== 配图模式: 纯视觉隐喻 ======
    if (extraction || stylePrompt) {
      finalPromptCN = [
        ILLUSTRATION_DIRECTIVE,
        ANTI_AI_CORE,
        stylePrompt || '',
        extraction || '',
      ].filter(Boolean).join('\n');
    } else if (prompt) {
      // 旧模式兼容: 直接 prompt + 注入反AI色
      finalPromptCN = [ILLUSTRATION_DIRECTIVE, ANTI_AI_CORE, prompt].join('\n');
    } else {
      console.log(`  ${ts()}  [图片] ✗ prompt 为空`);
      return res.status(400).json({ error: '请输入图片描述' });
    }
  }

  finalPromptCN = finalPromptCN.trim();
  const typeLabel = imageType === 'cover' ? '封面' : '配图';
  const promptPreview = finalPromptCN.replace(/\s+/g, ' ').slice(0, 80);
  console.log(`  ${ts()}  [图片] ${typeLabel}生成  platform=${platform || 'general'}  ratio=${aspectRatio}  size=${imageSize}  prompt="${promptPreview}..."`);

  try {
    // --- 保存用户可读部分到 prompt 历史 ---
    const userPrompt = imageType === 'cover'
      ? `[封面] ${coverTitle} | ${coverSubtitle}`
      : (extraction || stylePrompt || prompt || '').slice(0, 200);
    promptStore.save(userPrompt, platform);

    // --- 后端翻译: 中文 → 英文 ---
    let finalPrompt = finalPromptCN;
    const hasChinese = /[\u4e00-\u9fff]/.test(finalPromptCN);

    if (hasChinese && aiAdapter) {
      try {
        console.log(`  ${ts()}  [图片] 翻译 prompt → 英文 (引擎=${engine})...`);
        const translatePrompt = `Translate the following image generation prompt to English. Preserve all English technical instructions (about text rendering, anti-AI directives, color restrictions) exactly as-is. Only translate the Chinese parts into vivid English. Output ONLY the translated prompt.\n\n${finalPromptCN}`;
        finalPrompt = await aiAdapter.generate(translatePrompt, engine);
        finalPrompt = finalPrompt.trim();
        console.log(`  ${ts()}  [图片] ✓ 翻译完成 (${finalPrompt.length} chars)`);
      } catch (translateErr) {
        console.warn(`  ${ts()}  [图片] ⚠ 翻译失败, 降级用原文: ${translateErr.message}`);
        finalPrompt = finalPromptCN;
      }
    }

    // --- 生成并保存图片 ---
    const opts = { aspectRatio, imageSize };
    console.log(`  ${ts()}  [图片] 调用 Nano Banana Pro API...`);
    const start = Date.now();
    const result = await imageGenerator.generateAndSave(
      finalPrompt, platform || 'general', topic, `${imageType}-${index}`, opts
    );

    // 读取已保存的文件作为 base64 返回
    const imgBuf = fs.readFileSync(result.fullPath);
    const base64 = imgBuf.toString('base64');
    const ext = result.filename.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const sec = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`  ${ts()}  [图片] ✓ ${typeLabel}生成完成  耗时=${sec}s  size=${imageSize}  文件=${result.path}`);

    res.json({ ...result, base64, mimeType: ext, imageType });
  } catch (e) {
    console.error(`  ${ts()}  [图片] ✗ ${typeLabel}生成失败: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
//  获取历史 prompt
// ============================================================
router.get('/prompts', (req, res) => {
  const { promptStore } = req.app.locals;
  const { platform } = req.query;

  let prompts = promptStore.list();
  if (platform) {
    prompts = prompts.filter(p => !p.platform || p.platform === platform);
  }

  res.json(prompts);
});

// ============================================================
//  保存 prompt
// ============================================================
router.post('/prompts', (req, res) => {
  const { text, platform = '' } = req.body;
  const { promptStore } = req.app.locals;

  const entry = promptStore.save(text, platform);
  if (entry) {
    res.json(entry);
  } else {
    res.status(400).json({ error: 'Prompt 为空' });
  }
});

// ============================================================
//  删除 prompt
// ============================================================
router.delete('/prompts/:id', (req, res) => {
  const { promptStore } = req.app.locals;
  const deleted = promptStore.delete(req.params.id);
  res.json({ deleted });
});

module.exports = router;
