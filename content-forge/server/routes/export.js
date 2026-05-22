import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// POST /api/export/obsidian — 保存到 Obsidian vault
router.post('/obsidian', async (req, res) => {
  const { title, content, platform, vaultPath } = req.body;
  if (!content) return res.status(400).json({ error: '请提供内容' });

  const targetVault = vaultPath || process.env.OBSIDIAN_VAULT_PATH;
  if (!targetVault) {
    return res.status(400).json({ error: '请配置 Obsidian Vault 路径' });
  }

  try {
    // 确保目录存在
    const dir = path.join(targetVault, 'ContentForge');
    fs.mkdirSync(dir, { recursive: true });

    // 生成文件名
    const date = new Date().toISOString().slice(0, 10);
    const safeName = (title || '未命名').replace(/[<>:"/\\|?*]/g, '_').slice(0, 60);
    const filename = `${date}-${safeName}${platform ? `-${platform}` : ''}.md`;
    const filepath = path.join(dir, filename);

    // 添加 frontmatter
    const frontmatter = `---
title: "${title || ''}"
created: ${new Date().toISOString()}
platform: ${platform || 'general'}
generator: content-forge
---

`;
    fs.writeFileSync(filepath, frontmatter + content, 'utf-8');

    res.json({
      success: true,
      path: filepath,
      filename,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/export/download — 下载为文件
router.post('/download', (req, res) => {
  const { title, content, format } = req.body;
  if (!content) return res.status(400).json({ error: '请提供内容' });

  const safeName = (title || '未命名').replace(/[<>:"/\\|?*]/g, '_');

  if (format === 'html') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeName)}.html"`);
    res.send(content);
  } else {
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeName)}.md"`);
    res.send(content);
  }
});

export default router;
