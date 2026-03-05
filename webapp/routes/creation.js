/**
 * [INPUT]: 依赖 aiAdapter + skillLoader + outputManager
 * [OUTPUT]: GET /api/skills, GET /api/skills/:name, GET /api/engines, POST /api/create (SSE)
 * [POS]: routes/ 的创作 API, 核心 AI 流式生成管道
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// --- 列出所有 Skill ---
router.get('/skills', (req, res) => {
  res.json(req.app.locals.skillLoader.listSkills());
});

// --- 获取 Skill 模板原文 ---
router.get('/skills/:name', (req, res) => {
  try {
    const dir = req.app.locals.commandsDir;
    const filePath = path.join(dir, `${req.params.name}.md`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Skill 不存在' });
    res.json({ content: fs.readFileSync(filePath, 'utf-8') });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- 获取可用 AI 引擎 ---
router.get('/engines', (req, res) => {
  res.json(req.app.locals.aiAdapter.listEngines());
});

// --- 创作 (SSE 流式) ---
router.post('/create', async (req, res) => {
  const { skill, topic, draft, engine = 'claude' } = req.body;
  const { aiAdapter, skillLoader, outputManager } = req.app.locals;

  const topicPreview = (topic || '').replace(/\s+/g, ' ').slice(0, 50);
  console.log(`  ${_ts()}  [创作] skill=${skill}  引擎=${engine}  topic="${topicPreview}"${draft ? `  母稿=${draft}` : ''}`);

  // SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    // 1. 如果选择了已有母稿，读取内容
    let draftContent = '';
    if (draft) {
      try {
        draftContent = outputManager.readFile('母稿', draft);
        console.log(`  ${_ts()}  [创作] 读取母稿成功  长度=${draftContent.length}字`);
      } catch {
        console.log(`  ${_ts()}  [创作] ✗ 母稿文件不存在: ${draft}`);
        _sendSSE(res, { type: 'error', message: `母稿文件不存在: ${draft}` });
        return res.end();
      }
    }

    // 2. 构建完整 Prompt
    _sendSSE(res, { type: 'status', message: `正在构建 ${skill} Prompt...` });

    const prompt = skillLoader.buildPrompt(skill, {
      topic: topic || '',
      draftContent,
    });
    console.log(`  ${_ts()}  [创作] Prompt 构建完成  总长=${prompt.length}字`);

    // 3. 调用 AI 引擎流式生成
    _sendSSE(res, { type: 'status', message: `AI 引擎: ${engine} · 开始生成...` });

    let fullContent = '';
    for await (const chunk of aiAdapter.stream(prompt, engine)) {
      fullContent += chunk;
      _sendSSE(res, { type: 'chunk', content: chunk });
    }

    // 4. 自动保存
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const safeTopic = (topic || 'untitled').replace(/[<>:"/\\|?*]/g, '_').slice(0, 30);
    const filename = `${today}-${safeTopic}.md`;

    const platformMap = {
      '母稿': '母稿', '小红书': '小红书', '公众号': '公众号',
      '即刻': '即刻', 'X推文': 'X', 'linuxdo': 'linuxdo',
      'GitHub': 'GitHub', '朋友圈': '朋友圈',
    };
    const platform = platformMap[skill] || '母稿';

    outputManager.writeFile(platform, filename, fullContent);

    console.log(`  ${_ts()}  [创作] ✓ 完成  文件=${platform}/${filename}  输出=${fullContent.length}字`);
    _sendSSE(res, {
      type: 'done',
      file: `${platform}/${filename}`,
      length: fullContent.length,
    });

  } catch (e) {
    console.error(`  ${_ts()}  [创作] ✗ 失败: ${e.message}`);
    _sendSSE(res, { type: 'error', message: e.message });
  }

  res.end();
});

function _sendSSE(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function _ts() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}

module.exports = router;
