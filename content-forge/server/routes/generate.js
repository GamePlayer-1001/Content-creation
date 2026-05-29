import { Router } from 'express';
import { generateDraft, adaptForPlatform } from '../services/draft-engine.js';

const router = Router();

// POST /api/generate/draft — 生成母稿（SSE 流式）
router.post('/draft', async (req, res) => {
  const { topic, context } = req.body;
  if (!topic) return res.status(400).json({ error: '请提供主题' });

  // 客户端断连保护
  let clientClosed = false;
  req.on('close', () => { clientClosed = true; });
  res._isClientClosed = () => clientClosed;

  try {
    await generateDraft(topic, context, res);
  } catch (err) {
    console.error('[draft] 生成异常:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    } else if (!clientClosed) {
      try {
        res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
        res.end();
      } catch {}
    }
  }
});

// POST /api/generate/adapt — 平台适配改写（SSE 流式）
router.post('/adapt', async (req, res) => {
  const { content, platform } = req.body;
  if (!content) return res.status(400).json({ error: '请提供母稿内容' });
  if (!platform) return res.status(400).json({ error: '请选择目标平台' });

  let clientClosed = false;
  req.on('close', () => { clientClosed = true; });
  res._isClientClosed = () => clientClosed;

  try {
    await adaptForPlatform(content, platform, res);
  } catch (err) {
    console.error('[adapt] 改写异常:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    } else if (!clientClosed) {
      try {
        res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
        res.end();
      } catch {}
    }
  }
});

export default router;
