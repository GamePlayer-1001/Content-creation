# webapp/
> L2 | 父级: /CLAUDE.md

成员清单
server.js: Express 入口，装载服务、共享流水线与 HTTP 路由。
package.json: Web 控制台依赖与启动脚本。
routes/: HTTP API 层，向前端暴露内容流水线、配置、内容、合规、复盘等接口。
services/: Web 侧适配服务层，负责 AI、配置、输出、排期、图片与规则装载。
public/: Vanilla JS SPA 静态资源，承载控制台界面与交互。

法则: Web 只保留交互与兼容层·共享执行尽量收口到 core/·前后端阶段口径一致

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
