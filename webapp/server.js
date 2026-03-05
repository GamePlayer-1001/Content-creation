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
//  中间件
// ============================================================
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
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// ============================================================
//  启动
// ============================================================
const PORT = process.env.PORT || 3210;
app.listen(PORT, () => {
  console.log('');
  console.log('  ┌──────────────────────────────────────┐');
  console.log('  │  内容推广工具集 — Web 控制台          │');
  console.log(`  │  http://localhost:${PORT}               │`);
  console.log('  │  Ctrl+C 退出                          │');
  console.log('  └──────────────────────────────────────┘');
  console.log('');
});
