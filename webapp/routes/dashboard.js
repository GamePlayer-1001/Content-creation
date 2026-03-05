/**
 * [INPUT]: 依赖 outputManager
 * [OUTPUT]: GET /api/dashboard
 * [POS]: routes/ 的仪表盘数据聚合, 产出统计 + 今日文件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

router.get('/dashboard', (req, res) => {
  const { outputManager, imageGenerator } = req.app.locals;

  const stats = outputManager.getStats();
  const todayFiles = outputManager.getTodayFiles();
  const todayCount = Object.values(todayFiles).flat().length;

  res.json({
    date: new Date().toISOString().slice(0, 10),
    weekday: ['日', '一', '二', '三', '四', '五', '六'][new Date().getDay()],
    stats,
    todayFiles,
    todayCount,
    imageEnabled: !!imageGenerator,
  });
});

module.exports = router;
