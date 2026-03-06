/**
 * [INPUT]: 依赖 imageGenerator + promptStore + aiAdapter (翻译)
 * [OUTPUT]: POST /api/image/generate, GET/POST/DELETE /api/image/prompts
 * [POS]: routes/ 的图片生成 API, 封装 Nano Banana Pro + prompt 历史 + 中英翻译管道
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

// ============================================================
//  生成图片 (支持双框模式 + 后端翻译)
// ============================================================
router.post('/generate', async (req, res) => {
  const {
    prompt,                    // 兼容旧模式: 直接 prompt
    extraction,                // 新模式: 提炼内容 (画什么)
    stylePrompt,               // 新模式: 风格提示词 (怎么画)
    platform = '', topic = '', index = 0,
    aspectRatio = '1:1', imageSize = '1K',
    engine = 'claude',         // 翻译用的 AI 引擎
  } = req.body;
  const { imageGenerator, promptStore, aiAdapter } = req.app.locals;

  const ts = () => new Date().toLocaleTimeString('zh-CN', { hour12: false });

  // --- 服务可用性检查 ---
  if (!imageGenerator) {
    console.log(`  ${ts()}  [图片] ✗ 服务未配置 (缺少 GOOGLE_AI_KEY)`);
    return res.status(503).json({ error: '图片生成服务未配置 (缺少 GOOGLE_AI_KEY)' });
  }

  // --- 构建最终中文 prompt ---
  let finalPromptCN;
  if (extraction || stylePrompt) {
    // 新模式: 风格 + 提炼内容 拼接
    finalPromptCN = (stylePrompt || '') + '\n' + (extraction || '');
  } else if (prompt) {
    // 旧模式: 直接 prompt (向后兼容)
    finalPromptCN = prompt;
  } else {
    console.log(`  ${ts()}  [图片] ✗ prompt 为空`);
    return res.status(400).json({ error: '请输入图片描述' });
  }
  finalPromptCN = finalPromptCN.trim();

  const promptPreview = finalPromptCN.replace(/\s+/g, ' ').slice(0, 60);
  console.log(`  ${ts()}  [图片] 生成请求  platform=${platform||'general'}  ratio=${aspectRatio}  size=${imageSize}  prompt="${promptPreview}..."`);

  try {
    // --- 保存中文 prompt 到历史 (方便复用) ---
    promptStore.save(finalPromptCN, platform);

    // --- 后端翻译: 中文 → 英文 ---
    let finalPrompt = finalPromptCN;
    const hasChinese = /[\u4e00-\u9fff]/.test(finalPromptCN);

    if (hasChinese && aiAdapter) {
      try {
        console.log(`  ${ts()}  [图片] 翻译 prompt → 英文 (引擎=${engine})...`);
        const translatePrompt = `Translate the following image generation prompt to English. Keep it as a vivid, descriptive image generation prompt. Only output the English translation, nothing else.\n\n${finalPromptCN}`;
        finalPrompt = await aiAdapter.generate(translatePrompt, engine);
        finalPrompt = finalPrompt.trim();
        console.log(`  ${ts()}  [图片] ✓ 翻译完成 (${finalPrompt.length} chars)`);
      } catch (translateErr) {
        console.warn(`  ${ts()}  [图片] ⚠ 翻译失败, 降级用中文: ${translateErr.message}`);
        finalPrompt = finalPromptCN;
      }
    }

    // --- 生成并保存图片 ---
    const opts = { aspectRatio, imageSize };
    console.log(`  ${ts()}  [图片] 调用 Nano Banana Pro API...`);
    const start = Date.now();
    const result = await imageGenerator.generateAndSave(
      finalPrompt, platform || 'general', topic, index, opts
    );

    // 读取已保存的文件作为 base64 返回
    const fs = require('fs');
    const imgBuf = fs.readFileSync(result.fullPath);
    const base64 = imgBuf.toString('base64');
    const ext = result.filename.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const sec = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`  ${ts()}  [图片] ✓ 生成完成  耗时=${sec}s  size=${imageSize}  文件=${result.path}`);

    res.json({
      ...result,
      base64,
      mimeType: ext,
    });
  } catch (e) {
    console.error(`  ${ts()}  [图片] ✗ 生成失败: ${e.message}`);
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
