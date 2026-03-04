/**
 * [INPUT]: 依赖 configManager
 * [OUTPUT]: GET/PUT /api/config/*
 * [POS]: routes/ 的配置管理 API
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

router.get('/config', (req, res) => {
  res.json(req.app.locals.configManager.list());
});

router.get('/config/:name', (req, res) => {
  try {
    const raw = req.app.locals.configManager.readRaw(req.params.name);
    res.json({ raw, parsed: req.app.locals.configManager.read(req.params.name) });
  } catch (e) { res.status(404).json({ error: e.message }); }
});

router.put('/config/:name', (req, res) => {
  try {
    req.app.locals.configManager.write(req.params.name, req.body.raw || req.body);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
