/**
 * [INPUT]: 依赖 outputManager
 * [OUTPUT]: CRUD /api/content/*
 * [POS]: routes/ 的内容管理 API
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

router.get('/content', (req, res) => {
  res.json(req.app.locals.outputManager.listPlatforms());
});

router.get('/content/:platform', (req, res) => {
  res.json(req.app.locals.outputManager.listFiles(req.params.platform));
});

router.get('/content/:platform/:file', (req, res) => {
  try {
    const content = req.app.locals.outputManager.readFile(req.params.platform, req.params.file);
    res.json({ content });
  } catch (e) { res.status(404).json({ error: e.message }); }
});

router.put('/content/:platform/:file', (req, res) => {
  req.app.locals.outputManager.writeFile(req.params.platform, req.params.file, req.body.content);
  res.json({ ok: true });
});

router.delete('/content/:platform/:file', (req, res) => {
  try {
    req.app.locals.outputManager.deleteFile(req.params.platform, req.params.file);
    res.json({ ok: true });
  } catch (e) { res.status(404).json({ error: e.message }); }
});

module.exports = router;
