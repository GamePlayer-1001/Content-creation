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

  const styleName = STYLE_MAP[style] || style;
  console.log(`  ${_ts()}  [洗稿] 开始  源=${platform}/${source}  风格=${styleName}  引擎=${engine}`);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    let sourceContent = '';
    try {
      sourceContent = outputManager.readFile(platform, source);
      console.log(`  ${_ts()}  [洗稿] 源文件读取成功  长度=${sourceContent.length}字`);
    } catch {
      console.log(`  ${_ts()}  [洗稿] ✗ 源文件不存在: ${platform}/${source}`);
      _send(res, { type: 'error', message: `源文件不存在: ${platform}/${source}` });
      return res.end();
    }

    _send(res, { type: 'status', message: `风格: ${styleName} · 构建 Prompt...` });

    const prompt = skillLoader.buildPrompt('洗稿', {
      topic: `--style ${style}`,
      draftContent: sourceContent,
    });
    console.log(`  ${_ts()}  [洗稿] Prompt 构建完成  总长=${prompt.length}字`);

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

    console.log(`  ${_ts()}  [洗稿] ✓ 完成  文件=母稿/${filename}  输出=${fullContent.length}字`);
    _send(res, { type: 'done', file: `母稿/${filename}`, length: fullContent.length, style: styleName });
  } catch (e) {
    console.error(`  ${_ts()}  [洗稿] ✗ 失败: ${e.message}`);
    _send(res, { type: 'error', message: e.message });
  }
  res.end();
});

function _send(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function _ts() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}

module.exports = router;
