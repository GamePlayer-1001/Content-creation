/**
 * [INPUT]: 依赖 express/dotenv, 依赖 services/ 和 routes/ 全体模块
 * [OUTPUT]: 对外提供 HTTP 服务 (localhost:PORT)
 * [POS]: webapp/ 的入口文件, 装载中间件 + 挂载路由 + 启动监听
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', 'config', '.env') });
const express = require('express');
const path = require('path');

// ============================================================
//  项目路径常量
// ============================================================
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONFIG_DIR   = path.join(PROJECT_ROOT, 'config');
const OUTPUT_DIR   = path.join(PROJECT_ROOT, 'output');
const COMMANDS_DIR = path.join(PROJECT_ROOT, '.claude', 'commands');
const TEMPLATES_DIR = path.join(PROJECT_ROOT, 'templates');

// ============================================================
//  初始化服务
// ============================================================
const ConfigManager    = require('./services/config-manager');
const ScheduleEngine   = require('./services/schedule-engine');
const OutputManager    = require('./services/output-manager');
const AIAdapter        = require('./services/ai-adapter');
const SkillLoader      = require('./services/skill-loader');
const ComplianceEngine = require('./services/compliance-engine');
const ImageGenerator   = require('./services/image-generator');
const PromptStore      = require('./services/prompt-store');

const configManager    = new ConfigManager(CONFIG_DIR);
const scheduleEngine   = new ScheduleEngine(configManager);
const outputManager    = new OutputManager(OUTPUT_DIR);
const aiAdapter        = new AIAdapter();
const skillLoader      = new SkillLoader(COMMANDS_DIR, configManager, TEMPLATES_DIR);
const complianceEngine = new ComplianceEngine(configManager);
const promptStore      = new PromptStore(CONFIG_DIR);

// 图片生成: 仅在配置了 GOOGLE_AI_KEY 时启用
const imageGenerator = process.env.GOOGLE_AI_KEY
  ? new ImageGenerator(process.env.GOOGLE_AI_KEY, OUTPUT_DIR)
  : null;

if (!imageGenerator) {
  console.warn('[WARN] GOOGLE_AI_KEY 未配置, 图片生成功能不可用');
}

// 挂载到 app.locals 供路由访问
const app = express();
app.locals.projectRoot      = PROJECT_ROOT;
app.locals.configDir        = CONFIG_DIR;
app.locals.outputDir        = OUTPUT_DIR;
app.locals.commandsDir      = COMMANDS_DIR;
app.locals.templatesDir     = TEMPLATES_DIR;
app.locals.configManager    = configManager;
app.locals.scheduleEngine   = scheduleEngine;
app.locals.outputManager    = outputManager;
app.locals.aiAdapter        = aiAdapter;
app.locals.skillLoader      = skillLoader;
app.locals.complianceEngine = complianceEngine;
app.locals.imageGenerator   = imageGenerator;
app.locals.promptStore      = promptStore;

// ============================================================
//  请求日志中间件
// ============================================================
function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });

    // 状态码着色标记
    const tag = status < 300 ? '✓' : status < 400 ? '→' : status < 500 ? '!' : '✗';
    const line = `  ${time}  ${tag} ${method.padEnd(6)} ${status}  ${url}  ${ms}ms`;

    // SSE 长连接标注
    if (res.getHeader('content-type')?.includes('text/event-stream')) {
      console.log(`${line}  [SSE]`);
    } else {
      console.log(line);
    }
  });

  next();
}

// ============================================================
//  中间件
// ============================================================
app.use(requestLogger);
app.use(express.json({ limit: '5mb' }));
app.use(express.text({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
//  路由挂载
// ============================================================
app.use('/api', require('./routes/dashboard'));
app.use('/api', require('./routes/content'));
app.use('/api', require('./routes/config'));
app.use('/api', require('./routes/compliance'));
app.use('/api', require('./routes/creation'));
app.use('/api', require('./routes/rewrite'));
app.use('/api', require('./routes/review'));
app.use('/api/pipeline', require('./routes/pipeline'));
app.use('/api/image', require('./routes/image'));

// ============================================================
//  SPA 回退 — 所有非 API 路由返回 index.html
// ============================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
//  错误处理
// ============================================================
app.use((err, req, res, _next) => {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  console.error(`  ${time}  ✗ [ERROR] ${req.method} ${req.url}`);
  console.error(`           ${err.message}`);
  if (err.stack) {
    const loc = err.stack.split('\n')[1]?.trim();
    if (loc) console.error(`           ${loc}`);
  }
  res.status(err.status || 500).json({ error: err.message });
});

// ============================================================
//  启动
// ============================================================
const PORT = process.env.PORT || 3210;
app.listen(PORT, () => {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  console.log('');
  console.log('  ┌──────────────────────────────────────────┐');
  console.log('  │  内容推广工具集 — Web 控制台              │');
  console.log(`  │  http://localhost:${PORT}                   │`);
  console.log('  │  Ctrl+C 退出                              │');
  console.log('  └──────────────────────────────────────────┘');
  console.log('');
  console.log('  服务状态:');
  console.log(`    AI 引擎    Claude CLI (本地)    ✓`);
  console.log(`    AI 引擎    OpenRouter           ${process.env.OPENROUTER_API_KEY ? '✓' : '—'}`);
  console.log(`    AI 引擎    DeepSeek             ${process.env.DEEPSEEK_API_KEY ? '✓' : '—'}`);
  console.log(`    图片生成   Nano Banana Pro      ${imageGenerator ? '✓' : '—'}`);
  console.log(`    配置目录   ${CONFIG_DIR}`);
  console.log(`    输出目录   ${OUTPUT_DIR}`);
  console.log('');
  console.log(`  ${time}  服务就绪，等待请求...`);
  console.log('  ─────────────────────────────────────────');
});
