# webapp/
> L2 | 父级: /CLAUDE.md

本地 Web 控制台，将 17 个 CLI Skill 转化为浏览器可视化操作界面。
Express + Vanilla JS SPA，黑白极简设计，SSE 流式 AI 输出。

## 架构

```
webapp/
├── server.js              # Express 入口，装载服务+路由+中间件
├── package.json           # 3 依赖: express + js-yaml + dotenv
├── .env                   # AI_ENGINE / PORT / API Keys
│
├── services/              # 核心服务层（纯逻辑，无 HTTP）
│   ├── ai-adapter.js      # AI 统一适配器: Claude CLI / OpenRouter / DeepSeek
│   ├── skill-loader.js    # .claude/commands/*.md → 注入配置 → 完整 Prompt
│   ├── config-manager.js  # config/ 目录 YAML/JSON 读写
│   ├── output-manager.js  # output/ 目录扫描/读写/统计
│   ├── schedule-engine.js # Day N + Phase + 日类型 + 任务清单
│   └── compliance-engine.js # 6维合规规则引擎(from compliance.yaml)
│
├── routes/                # API 路由层（Express Router）
│   ├── dashboard.js       # GET /api/dashboard (聚合统计)
│   ├── creation.js        # POST /api/create (SSE 流式创作)
│   ├── distribution.js    # POST /api/distribute (SSE 逐平台分发)
│   ├── rewrite.js         # POST /api/rewrite (SSE 洗稿)
│   ├── content.js         # CRUD /api/content/:platform/:file
│   ├── config.js          # GET/PUT /api/config/:name
│   ├── schedule.js        # GET /api/schedule
│   ├── compliance.js      # POST /api/compliance/check
│   ├── trending.js        # POST /api/trending (SSE) + GET /api/trending/topics
│   └── review.js          # GET /api/review/weekly + POST /api/review/generate (SSE)
│
└── public/                # 前端 SPA（纯 Vanilla JS）
    ├── index.html         # SPA 壳
    ├── css/style.css      # 黑白设计系统 + 暗色模式
    ├── lib/marked.min.js  # Markdown 渲染
    └── js/
        ├── app.js         # Hash 路由器
        ├── api.js         # API 客户端 (REST + SSE)
        ├── components/    # 可复用 UI 组件
        │   ├── stream.js  # SSE 流式渲染器（自带 fetch + abort）
        │   ├── nav.js     # 侧边导航
        │   ├── toast.js   # 通知提示
        │   ├── editor.js  # 文本编辑器
        │   └── modal.js   # 模态框
        └── views/         # 10 个页面视图
            ├── dashboard.js   # 仪表盘: Day N / Phase / 统计
            ├── workshop.js    # 创作工坊: Skill选择 + AI流式生成
            ├── distribute.js  # 全平台分发: 7平台进度卡片
            ├── content.js     # 内容管理: 平台Tab + 预览
            ├── config.js      # 配置管理: YAML/JSON编辑
            ├── compliance.js  # 合规检查: 6维扫描 + 高亮
            ├── rewrite.js     # 洗稿: 5风格 + AI流式
            ├── trending.js    # 热点抓取: 爬虫触发 + 话题库
            ├── schedule.js    # 排期管理: 60天Grid
            └── review.js      # 周复盘: 统计 + AI报告
```

## AI 服务层

| 引擎 | 方式 | 需要 Key |
|------|------|---------|
| Claude CLI (默认) | `spawn('claude', ['--print', ...])` + 临时文件 | 无，本地已认证 |
| OpenRouter | HTTPS POST + SSE 解析 | .env OPENROUTER_API_KEY |
| DeepSeek | HTTPS POST + SSE 解析 | .env DEEPSEEK_API_KEY |

## 设计规范

- 黑白配色: `--bg:#fff --fg:#111 --border:#d0d0d0`
- 暗色模式: `@media (prefers-color-scheme: dark)` 自动反转
- 字体: 系统字体 + 等宽字体代码区
- 流式输出: SSE (text/event-stream) + `data: JSON\n\n` 协议

## 启动方式

```bash
# 一键启动
双击 start.bat

# 手动启动
cd webapp && npm install && node server.js
# 访问 http://localhost:3210
```

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
