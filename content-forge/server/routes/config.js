import { Router } from 'express';

const router = Router();

// 运行时配置（不暴露完整 key）
let runtimeConfig = {
  textApiBase: process.env.TEXT_API_BASE || process.env.AI_API_BASE || '',
  textApiKey: process.env.TEXT_API_KEY || process.env.AI_API_KEY || '',
  textModel: process.env.AI_TEXT_MODEL || 'gpt-4o',
  imageApiConfigured: !!(process.env.AI_API_KEY),
  imageModel: process.env.AI_IMAGE_MODEL || 'gpt-image-2',
};

// GET /api/config — 获取当前配置（key 脱敏）
router.get('/', (req, res) => {
  res.json({
    textApiBase: runtimeConfig.textApiBase,
    textApiKey: runtimeConfig.textApiKey ? `${runtimeConfig.textApiKey.slice(0, 8)}...` : '',
    textApiKeySet: !!runtimeConfig.textApiKey,
    textModel: runtimeConfig.textModel,
    imageApiConfigured: runtimeConfig.imageApiConfigured,
    imageModel: runtimeConfig.imageModel,
  });
});

// POST /api/config — 更新运行时配置
router.post('/', (req, res) => {
  const { textApiBase, textApiKey, textModel } = req.body;
  if (textApiBase !== undefined) {
    runtimeConfig.textApiBase = textApiBase;
    process.env.TEXT_API_BASE = textApiBase;
  }
  if (textApiKey !== undefined) {
    runtimeConfig.textApiKey = textApiKey;
    process.env.TEXT_API_KEY = textApiKey;
  }
  if (textModel !== undefined) {
    runtimeConfig.textModel = textModel;
    process.env.AI_TEXT_MODEL = textModel;
  }
  res.json({ success: true, message: '配置已更新' });
});

export default router;
