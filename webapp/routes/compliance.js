/**
 * [INPUT]: 依赖 complianceEngine 执行 6 维规则扫描
 * [OUTPUT]: POST /api/compliance/check, POST /api/compliance/reload
 * [POS]: routes/ 的合规检查 API, 无状态纯计算
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();

// --- 执行合规扫描 ---
router.post('/compliance/check', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: '请提供待检查的文本内容' });
  }
  try {
    const result = req.app.locals.complianceEngine.check(text);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- 刷新规则缓存 ---
router.post('/compliance/reload', (req, res) => {
  req.app.locals.complianceEngine.reload();
  res.json({ ok: true, message: '合规规则已刷新' });
});

module.exports = router;
