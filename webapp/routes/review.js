/**
 * [INPUT]: 依赖 outputManager 扫描产出 + aiAdapter 生成报告 + skillLoader
 * [OUTPUT]: GET /api/review/weekly, POST /api/review/generate (SSE)
 * [POS]: routes/ 的周复盘 API, 统计 + AI 生成报告
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

// --- 本周产出统计 ---
router.get('/review/weekly', (req, res) => {
  const { outputManager, scheduleEngine } = req.app.locals;

  try {
    const stats = outputManager.getStats();
    const dayN = scheduleEngine.getDayN();
    const phase = scheduleEngine.getPhase();

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    // stats 格式: { 母稿: 5, 小红书: 3, ... }
    const weeklyStats = {};
    let totalThisWeek = 0;
    let totalAll = 0;

    for (const [platform, count] of Object.entries(stats)) {
      totalAll += count;
      const files = outputManager.listFiles(platform);
      const thisWeek = files.filter(f => !f.isDir && new Date(f.modified) >= weekStart);
      weeklyStats[platform] = { total: count, thisWeek: thisWeek.length, files: thisWeek.map(f => f.name) };
      totalThisWeek += thisWeek.length;
    }

    res.json({ dayN, phase, weekStart: weekStart.toISOString().slice(0, 10), weekEnd: now.toISOString().slice(0, 10), totalThisWeek, totalAll, platforms: weeklyStats });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- AI 生成周复盘报告 (SSE) ---
router.post('/review/generate', async (req, res) => {
  const { engine = 'claude' } = req.body;
  const { aiAdapter, skillLoader, outputManager, scheduleEngine } = req.app.locals;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stats = outputManager.getStats();
    const dayN = scheduleEngine.getDayN();
    const phase = scheduleEngine.getPhase();

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    let dataContext = `当前 Day ${dayN}，Phase ${phase}。\n`;
    dataContext += `本周范围: ${weekStart.toISOString().slice(0, 10)} ~ ${now.toISOString().slice(0, 10)}\n\n`;

    let totalWeek = 0;
    for (const [platform, count] of Object.entries(stats)) {
      const files = outputManager.listFiles(platform);
      const thisWeek = files.filter(f => !f.isDir && new Date(f.modified) >= weekStart);
      totalWeek += thisWeek.length;
      if (thisWeek.length > 0) {
        dataContext += `${platform}: ${thisWeek.length} 篇 (${thisWeek.map(f => f.name).join(', ')})\n`;
      }
    }
    dataContext += `\n本周总产出: ${totalWeek} 篇`;

    _send(res, { type: 'status', message: `收集到本周 ${totalWeek} 篇产出，开始生成报告...` });

    const prompt = skillLoader.buildPrompt('周复盘', { topic: dataContext, draftContent: '' });

    _send(res, { type: 'status', message: `AI 引擎: ${engine} · 开始生成报告...` });

    let fullContent = '';
    for await (const chunk of aiAdapter.stream(prompt, engine)) {
      fullContent += chunk;
      _send(res, { type: 'chunk', content: chunk });
    }

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `${today}-周复盘.md`;
    outputManager.writeFile('复盘', filename, fullContent);

    _send(res, { type: 'done', file: `复盘/${filename}`, length: fullContent.length });
  } catch (e) {
    _send(res, { type: 'error', message: e.message });
  }
  res.end();
});

function _send(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

module.exports = router;
