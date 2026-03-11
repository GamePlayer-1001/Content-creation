/**
 * [INPUT]: 依赖 outputManager, fs/path (子目录导航 + 图片服务)
 * [OUTPUT]: CRUD /api/content/* (含嵌套子目录 + 图片二进制读取)
 * [POS]: routes/ 的内容管理 API
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// ============================================================
//  图片扩展名 → MIME
// ============================================================
const IMG_EXTS = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' };
function isImage(name) { return IMG_EXTS[path.extname(name).toLowerCase()]; }

// ============================================================
//  列出所有平台
// ============================================================
router.get('/content', (req, res) => {
  res.json(req.app.locals.outputManager.listPlatforms());
});

// ============================================================
//  列出某平台的文件 (一级)
// ============================================================
router.get('/content/:platform', (req, res) => {
  res.json(req.app.locals.outputManager.listFiles(req.params.platform));
});

// ============================================================
//  :platform/:entry — 智能分发: 子目录 → 列表, 图片 → base64, 文本 → content
// ============================================================
router.get('/content/:platform/:entry', (req, res) => {
  const { platform, entry } = req.params;
  const outputDir = req.app.locals.outputDir;
  const fullPath = path.join(outputDir, platform, entry);

  // 安全: 防止路径穿越
  if (!fullPath.startsWith(outputDir)) return res.status(403).json({ error: '路径越界' });

  if (!fs.existsSync(fullPath)) return res.status(404).json({ error: '不存在' });

  // 子目录 → 列出其中文件
  if (fs.statSync(fullPath).isDirectory()) {
    return res.json(req.app.locals.outputManager.listFiles(`${platform}/${entry}`));
  }

  // 图片 → base64
  const mime = isImage(entry);
  if (mime) {
    const b64 = fs.readFileSync(fullPath).toString('base64');
    return res.json({ content: b64, isImage: true, mimeType: mime });
  }

  // 文本
  try {
    const content = req.app.locals.outputManager.readFile(platform, entry);
    res.json({ content });
  } catch (e) { res.status(404).json({ error: e.message }); }
});

// ============================================================
//  深层嵌套: :platform/:sub/:file (如 图片/小红书/xxx.png)
// ============================================================
router.get('/content/:platform/:sub/:file', (req, res) => {
  const { platform, sub, file } = req.params;
  const outputDir = req.app.locals.outputDir;
  const fullPath = path.join(outputDir, platform, sub, file);

  if (!fullPath.startsWith(outputDir)) return res.status(403).json({ error: '路径越界' });
  if (!fs.existsSync(fullPath)) return res.status(404).json({ error: '不存在' });

  const mime = isImage(file);
  if (mime) {
    const b64 = fs.readFileSync(fullPath).toString('base64');
    return res.json({ content: b64, isImage: true, mimeType: mime });
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    res.json({ content });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ============================================================
//  写入 & 删除
// ============================================================
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

// 嵌套路径删除 (如 图片/小红书/xxx.png)
router.delete('/content/:platform/:sub/:file', (req, res) => {
  const { platform, sub, file } = req.params;
  const outputDir = req.app.locals.outputDir;
  const fullPath = path.join(outputDir, platform, sub, file);

  if (!fullPath.startsWith(outputDir)) return res.status(403).json({ error: '路径越界' });
  if (!fs.existsSync(fullPath)) return res.status(404).json({ error: '不存在' });

  try {
    fs.unlinkSync(fullPath);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
