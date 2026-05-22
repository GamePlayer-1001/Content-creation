import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import generateRouter from './routes/generate.js';
import imageRouter from './routes/image.js';
import exportRouter from './routes/export.js';
import templatesRouter from './routes/templates.js';
import configRouter from './routes/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3210;

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API 路由
app.use('/api/generate', generateRouter);
app.use('/api/image', imageRouter);
app.use('/api/export', exportRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/config', configRouter);

// 生产模式: 提供构建后的前端
const distDir = path.join(__dirname, '..', 'dist');
app.use(express.static(distDir));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

// 错误处理
app.use((err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.url}: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   Content Forge — 内容锻造工坊       ║');
  console.log(`  ║   http://localhost:${PORT}              ║`);
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
  console.log(`  AI API: ${process.env.AI_API_BASE}`);
  console.log(`  文字模型: ${process.env.AI_TEXT_MODEL}`);
  console.log(`  图片模型: ${process.env.AI_IMAGE_MODEL}`);
  console.log('');
});
