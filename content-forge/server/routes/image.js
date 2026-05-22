import { Router } from 'express';
import { generateImage } from '../services/ai-client.js';

const router = Router();

// POST /api/image/generate — 生成配图
router.post('/generate', async (req, res) => {
  const { prompt, size } = req.body;
  if (!prompt) return res.status(400).json({ error: '请提供图片描述' });

  try {
    const images = await generateImage(prompt, {
      size: size || '1536x1024',
      n: 1,
    });

    res.json({
      success: true,
      images: images.map(img => ({
        url: img.url || (img.b64_json ? `data:image/png;base64,${img.b64_json}` : null),
        b64: img.b64_json,
        revisedPrompt: img.revised_prompt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/image/suggest — 根据内容自动建议配图描述
router.post('/suggest', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: '请提供文章内容' });

  // 提取 <!-- IMAGE: xxx --> 标记
  const markers = [];
  const regex = /<!--\s*IMAGE:\s*(.+?)\s*-->/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    markers.push(match[1].trim());
  }

  if (markers.length === 0) {
    // 没有标记，用 AI 建议
    const { chat } = await import('../services/ai-client.js');
    const suggestions = await chat([
      {
        role: 'system',
        content: '你是一位视觉创意总监。请根据文章内容建议2-3张配图。每个建议用一行描述，格式为英文prompt（适合AI绘图）。',
      },
      {
        role: 'user',
        content: `请为以下文章建议配图：\n\n${content.slice(0, 2000)}`,
      },
    ]);

    return res.json({
      success: true,
      suggestions: suggestions.split('\n').filter(l => l.trim()).slice(0, 3),
      source: 'ai',
    });
  }

  res.json({
    success: true,
    suggestions: markers,
    source: 'markers',
  });
});

export default router;
