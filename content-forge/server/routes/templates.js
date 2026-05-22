import { Router } from 'express';
import { getTemplatesList } from '../services/style-analyzer.js';

const router = Router();

// GET /api/templates — 获取范文列表
router.get('/', async (req, res) => {
  try {
    const list = await getTemplatesList();
    res.json({ success: true, templates: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
