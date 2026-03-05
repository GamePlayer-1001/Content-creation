/**
 * [INPUT]: 依赖 imageGenerator + promptStore
 * [OUTPUT]: POST /api/image/generate, GET/POST/DELETE /api/image/prompts
 * [POS]: routes/ 的图片生成 API, 封装 Nano Banana Pro + prompt 历史
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

// ============================================================
//  生成图片
// ============================================================
router.post('/generate', async (req, res) => {
  const { prompt, platform = '', topic = '', index = 0, aspectRatio = '1:1' } = req.body;
  const { imageGenerator, promptStore } = req.app.locals;

  if (!imageGenerator) {
    return res.status(503).json({ error: '图片生成服务未配置 (缺少 GOOGLE_AI_KEY)' });
  }

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: '请输入图片描述' });
  }

  try {
    // 保存 prompt 到历史
    promptStore.save(prompt, platform);

    // 生成并保存图片
    const result = await imageGenerator.generateAndSave(
      prompt, platform || 'general', topic, index, { aspectRatio }
    );

    // 同时返回 base64 供前端预览
    const imageData = await imageGenerator.generate(prompt, { aspectRatio });

    res.json({
      ...result,
      base64: imageData.base64,
      mimeType: imageData.mimeType,
    });
  } catch (e) {
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
