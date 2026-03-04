/**
 * [INPUT]: 依赖 scheduleEngine + outputManager
 * [OUTPUT]: GET /api/dashboard
 * [POS]: routes/ 的仪表盘数据聚合, 被前端 dashboard 视图消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

router.get('/dashboard', (req, res) => {
  const { scheduleEngine, outputManager } = req.app.locals;

  const today = scheduleEngine.getTodayTasks();
  const stats = outputManager.getStats();
  const todayFiles = outputManager.getTodayFiles();

  res.json({
    ...today,
    stats,
    todayFiles,
  });
});

module.exports = router;
