/**
 * [INPUT]: 依赖 scheduleEngine
 * [OUTPUT]: GET /api/schedule, GET /api/schedule/today
 * [POS]: routes/ 的排期 API
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

router.get('/schedule', (req, res) => {
  res.json(req.app.locals.scheduleEngine.getFullSchedule());
});

router.get('/schedule/today', (req, res) => {
  res.json(req.app.locals.scheduleEngine.getTodayTasks());
});

module.exports = router;
