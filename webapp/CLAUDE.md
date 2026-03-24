# webapp/
> L2 | 父级: /CLAUDE.md

本地 Web 控制台，当前承担 9 阶段内容工作流的图形化入口。
技术栈为 Express + Vanilla JS SPA，支持 SSE 流式输出。

## 当前口径

- 工作流语义是 9 阶段，不再使用旧的 5 步串行口径。
- 前端主导航已切换为真实的 9 阶段导航：
  - 1 热点列表
  - 2 选择热点
  - 3 热点补充
  - 4 母稿生成
  - 5 多平台改写
  - 6 审核优化
  - 7 视觉素材
  - 8 排版
  - 9 导出结果
- 当前内容区仍按 5 组面板复用：
  - 1-3 热点准备
  - 4 母稿生成
  - 5-6 平台处理
  - 7 视觉素材
  - 8-9 排版导出
- 任务摘要卡已支持：
  - 查看 `pendingConfirmationStage`
  - 确认下一阶段
  - 回退到指定阶段
  - 回退并重新执行
  - 查看最近 `runRange` 快照

## 关键目录

```text
webapp/
├─ server.js
├─ package.json
├─ routes/
│  ├─ pipeline.js
│  ├─ image.js
│  ├─ content.js
│  ├─ config.js
│  ├─ compliance.js
│  ├─ rewrite.js
│  ├─ creation.js
│  ├─ dashboard.js
│  └─ review.js
├─ services/
│  ├─ ai-adapter.js
│  ├─ skill-loader.js
│  ├─ config-manager.js
│  ├─ output-manager.js
│  ├─ schedule-engine.js
│  ├─ compliance-engine.js
│  ├─ image-generator.js
│  └─ prompt-store.js
└─ public/
   ├─ index.html
   ├─ css/style.css
   └─ js/
      ├─ app.js
      ├─ api.js
      ├─ components/
      └─ views/
```

## pipeline.js 现状

后端提供的核心接口包括：

- `GET /api/pipeline/stages`
- `GET /api/pipeline/tasks`
- `POST /api/pipeline/tasks`
- `POST /api/pipeline/tasks/:taskId/advance`
- `POST /api/pipeline/tasks/:taskId/rewind`
- `POST /api/pipeline/tasks/:taskId/run-step`
- `POST /api/pipeline/tasks/:taskId/run-range`
- `POST /api/pipeline/tasks/:taskId/hotspot-list`
- `POST /api/pipeline/tasks/:taskId/hotspot-select`
- `POST /api/pipeline/tasks/:taskId/hotspot-enrich`
- `POST /api/pipeline/draft`
- `POST /api/pipeline/platforms`
- `POST /api/pipeline/optimize`
- `POST /api/pipeline/compose`
- `POST /api/pipeline/assemble`

已完成的共享收口：

- 热点三阶段已改为复用 `core/pipeline/step-executor`
- `run-range` 结果会持久化到任务元数据
- 待确认阶段不会再被默认自动放行

仍待收口：

- draft / platforms / optimize / compose / assemble 仍保留 Web 路由遗留实现

## 启动方式

```bash
cd webapp
npm install
node server.js
```

默认地址：`http://localhost:3210`
