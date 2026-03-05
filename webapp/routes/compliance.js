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
  const ts = () => new Date().toLocaleTimeString('zh-CN', { hour12: false });
  console.log(`  ${ts()}  [合规] 检查请求  文本=${(text||'').length}字`);
  if (!text || !text.trim()) {
    console.log(`  ${ts()}  [合规] ✗ 文本为空`);
    return res.status(400).json({ error: '请提供待检查的文本内容' });
  }
  try {
    const result = req.app.locals.complianceEngine.check(text);
    console.log(`  ${ts()}  [合规] ✓ 得分=${result.score}  命中=${result.hits?.length || 0}项`);
    res.json(result);
  } catch (e) {
    console.error(`  ${ts()}  [合规] ✗ 失败: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

// --- 刷新规则缓存 ---
router.post('/compliance/reload', (req, res) => {
  req.app.locals.complianceEngine.reload();
  res.json({ ok: true, message: '合规规则已刷新' });
});

module.exports = router;
