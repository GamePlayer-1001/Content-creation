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
  const { prompt, platform = '', topic = '', index = 0, aspectRatio = '1:1', imageSize = '1K' } = req.body;
  const { imageGenerator, promptStore } = req.app.locals;

  const ts = () => new Date().toLocaleTimeString('zh-CN', { hour12: false });
  const promptPreview = (prompt || '').replace(/\s+/g, ' ').slice(0, 60);
  console.log(`  ${ts()}  [图片] 生成请求  platform=${platform||'general'}  ratio=${aspectRatio}  size=${imageSize}  prompt="${promptPreview}..."`);

  if (!imageGenerator) {
    console.log(`  ${ts()}  [图片] ✗ 服务未配置 (缺少 GOOGLE_AI_KEY)`);
    return res.status(503).json({ error: '图片生成服务未配置 (缺少 GOOGLE_AI_KEY)' });
  }

  if (!prompt || !prompt.trim()) {
    console.log(`  ${ts()}  [图片] ✗ prompt 为空`);
    return res.status(400).json({ error: '请输入图片描述' });
  }

  try {
    // 保存 prompt 到历史
    promptStore.save(prompt, platform);

    // 生成并保存图片
    const opts = { aspectRatio, imageSize };
    console.log(`  ${ts()}  [图片] 调用 Nano Banana Pro API...`);
    const start = Date.now();
    const result = await imageGenerator.generateAndSave(
      prompt, platform || 'general', topic, index, opts
    );

    // 读取已保存的文件作为 base64 返回 (避免重复调用 API)
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
