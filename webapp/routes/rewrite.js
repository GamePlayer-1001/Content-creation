/**
 * [INPUT]: 依赖 aiAdapter + skillLoader + outputManager
 * [OUTPUT]: POST /api/rewrite (SSE 流式洗稿)
 * [POS]: routes/ 的洗稿 API, 5 种风格改写 + 保存
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

const STYLE_MAP = {
  A: '个人故事型',
  B: '对话场景型',
  C: '情感共鸣型',
  D: '优化版',
  E: '口语重写版',
};

router.post('/rewrite', async (req, res) => {
  const { source, platform = '母稿', style = 'A', engine = 'claude' } = req.body;
  const { aiAdapter, skillLoader, outputManager } = req.app.locals;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    let sourceContent = '';
    try {
      sourceContent = outputManager.readFile(platform, source);
    } catch {
      _send(res, { type: 'error', message: `源文件不存在: ${platform}/${source}` });
      return res.end();
    }

    const styleName = STYLE_MAP[style] || style;
    _send(res, { type: 'status', message: `风格: ${styleName} · 构建 Prompt...` });

    const prompt = skillLoader.buildPrompt('洗稿', {
      topic: `--style ${style}`,
      draftContent: sourceContent,
    });

    _send(res, { type: 'status', message: `AI 引擎: ${engine} · 开始改写...` });

    let fullContent = '';
    for await (const chunk of aiAdapter.stream(prompt, engine)) {
      fullContent += chunk;
      _send(res, { type: 'chunk', content: chunk });
    }

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const safeName = source.replace(/\.md$/, '').replace(/^\d{8}-/, '').slice(0, 20);
    const filename = `${today}-洗稿${style}-${safeName}.md`;
    outputManager.writeFile('母稿', filename, fullContent);

    _send(res, { type: 'done', file: `母稿/${filename}`, length: fullContent.length, style: styleName });
  } catch (e) {
    _send(res, { type: 'error', message: e.message });
  }
  res.end();
});

function _send(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

module.exports = router;
