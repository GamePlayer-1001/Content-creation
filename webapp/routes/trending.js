/**
 * [INPUT]: 依赖 child_process 执行爬虫, 依赖 configManager 读 topics.json
 * [OUTPUT]: POST /api/trending (SSE), GET /api/trending/results, GET /api/trending/topics
 * [POS]: routes/ 的热点抓取 API, 整合爬虫脚本 + 话题库
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// --- 触发热点抓取 (SSE) ---
router.post('/trending', async (req, res) => {
  const { platform = 'xhs' } = req.body;
  const projectRoot = req.app.locals.projectRoot;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const scraperMap = {
      xhs: path.join(projectRoot, 'tools', 'scraper', 'xhs_trending_scraper.py'),
      rss: path.join(projectRoot, 'tools', 'scraper', 'rss_scraper.py'),
    };

    const script = scraperMap[platform];
    if (!script || !fs.existsSync(script)) {
      _send(res, { type: 'error', message: `爬虫脚本不存在: ${platform}` });
      return res.end();
    }

    _send(res, { type: 'status', message: `正在抓取 ${platform} 热点...` });

    const child = spawn('python', [script], {
      cwd: projectRoot,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      stdout += text;
      _send(res, { type: 'chunk', content: text });
    });

    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

    child.on('close', (code) => {
      if (code !== 0 && stderr) {
        _send(res, { type: 'error', message: `爬虫退出码 ${code}: ${stderr.slice(0, 200)}` });
      } else {
        try {
          const results = JSON.parse(stdout);
          _send(res, { type: 'done', results });
        } catch {
          _send(res, { type: 'done', raw: stdout });
        }
      }
      res.end();
    });

    child.on('error', (e) => {
      _send(res, { type: 'error', message: `执行失败: ${e.message}` });
      res.end();
    });
  } catch (e) {
    _send(res, { type: 'error', message: e.message });
    res.end();
  }
});

// --- 获取话题库 ---
router.get('/trending/topics', (req, res) => {
  try {
    const topics = req.app.locals.configManager.read('topics.json');
    res.json(topics);
  } catch {
    res.json([]);
  }
});

// --- 获取已有热点结果 ---
router.get('/trending/results', (req, res) => {
  const projectRoot = req.app.locals.projectRoot;
  const resultsDir = path.join(projectRoot, 'output', 'trending');

  if (!fs.existsSync(resultsDir)) return res.json([]);

  const files = fs.readdirSync(resultsDir)
    .filter(f => f.endsWith('.json'))
    .sort().reverse().slice(0, 5);

  const results = files.map(f => {
    try {
      return { file: f, data: JSON.parse(fs.readFileSync(path.join(resultsDir, f), 'utf-8')) };
    } catch {
      return { file: f, data: null };
    }
  });
  res.json(results);
});

function _send(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

module.exports = router;
