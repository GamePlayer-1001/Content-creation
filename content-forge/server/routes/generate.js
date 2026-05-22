import { Router } from 'express';
import { generateDraft, adaptForPlatform } from '../services/draft-engine.js';

const router = Router();

// POST /api/generate/draft — 生成母稿（SSE 流式）
router.post('/draft', async (req, res) => {
  const { topic, context } = req.body;
  if (!topic) return res.status(400).json({ error: '请提供主题' });

  try {
    await generateDraft(topic, context, res);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

// POST /api/generate/adapt — 平台适配改写（SSE 流式）
router.post('/adapt', async (req, res) => {
  const { content, platform } = req.body;
  if (!content) return res.status(400).json({ error: '请提供母稿内容' });
  if (!platform) return res.status(400).json({ error: '请选择目标平台' });

  try {
    await adaptForPlatform(content, platform, res);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

export default router;
