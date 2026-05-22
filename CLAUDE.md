# 内容生成输出 - 新版 Content Forge

当前主入口为 `content-forge`，旧版 `webapp/core/cli` 已从主线移除。

<directory>
content-forge/  - 新版应用主目录
  client/       - React + Vite 前端
  server/       - Express 后端与 API 路由
  config/       - 配置中心、规则资产、平台规范
  templates/    - 写作范文、中文学术论文、英文学术论文
  tools/        - 新版辅助工具
  dist/         - 前端构建产物
start.bat       - Windows 双击启动新版应用
归档/           - 旧版资料归档，只作参考
</directory>

<runtime>
dev command: npm run dev
backend: http://localhost:3210
frontend: http://localhost:5173
</runtime>

<rules>
规则与模板已经内聚到 `content-forge/config` 和 `content-forge/templates`。
不要再恢复旧版 `webapp`、`core`、`cli` 作为主线入口。
</rules>