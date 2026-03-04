/**
 * [INPUT]: 依赖 aiAdapter + skillLoader + outputManager
 * [OUTPUT]: POST /api/distribute (SSE 逐平台流式分发)
 * [POS]: routes/ 的全平台分发 API, 从母稿逐平台衍生内容
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

// 分发目标平台（按 A→E 组排列）
const PLATFORMS = [
  { skill: '公众号', dir: '公众号', group: 'A' },
  { skill: '小红书', dir: '小红书', group: 'C' },
  { skill: '即刻',   dir: '即刻',   group: 'C' },
  { skill: 'X推文',  dir: 'X',      group: 'D' },
  { skill: 'linuxdo', dir: 'linuxdo', group: 'B' },
  { skill: 'GitHub', dir: 'GitHub', group: 'B' },
  { skill: '朋友圈', dir: '朋友圈', group: 'E' },
];

router.post('/distribute', async (req, res) => {
  const { draft, engine = 'claude', platforms } = req.body;
  const { aiAdapter, skillLoader, outputManager } = req.app.locals;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    let draftContent = '';
    try {
      draftContent = outputManager.readFile('母稿', draft);
    } catch {
      _send(res, { type: 'error', message: `母稿文件不存在: ${draft}` });
      return res.end();
    }

    const targetPlatforms = platforms && platforms.length > 0
      ? PLATFORMS.filter(p => platforms.includes(p.skill))
      : PLATFORMS;

    _send(res, { type: 'status', message: `开始分发到 ${targetPlatforms.length} 个平台...`, total: targetPlatforms.length });

    const results = [];
    for (let i = 0; i < targetPlatforms.length; i++) {
      const p = targetPlatforms[i];
      _send(res, { type: 'platform_start', platform: p.skill, index: i });

      try {
        const prompt = skillLoader.buildPrompt(p.skill, { topic: '', draftContent });

        let fullContent = '';
        for await (const chunk of aiAdapter.stream(prompt, engine)) {
          fullContent += chunk;
          _send(res, { type: 'chunk', platform: p.skill, content: chunk });
        }

        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const safeDraft = draft.replace(/\.md$/, '').replace(/^\d{8}-/, '').slice(0, 20);
        const filename = `${today}-${safeDraft}.md`;
        outputManager.writeFile(p.dir, filename, fullContent);

        _send(res, { type: 'platform_done', platform: p.skill, file: `${p.dir}/${filename}`, length: fullContent.length });
        results.push({ platform: p.skill, file: `${p.dir}/${filename}`, length: fullContent.length });
      } catch (e) {
        _send(res, { type: 'platform_error', platform: p.skill, message: e.message });
        results.push({ platform: p.skill, error: e.message });
      }
    }

    const success = results.filter(r => !r.error).length;
    _send(res, { type: 'done', results, success, total: targetPlatforms.length });
  } catch (e) {
    _send(res, { type: 'error', message: e.message });
  }
  res.end();
});

function _send(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

module.exports = router;
