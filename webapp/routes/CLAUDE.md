# webapp/routes/
> L2 | 父级: /webapp/CLAUDE.md

成员清单
compliance.js: 合规检查 API，负责规则扫描与重载。
config.js: 配置管理 API，读写 config/ 下的配置文件。
content.js: 内容管理 API，浏览与读写 output/ 产物。
creation.js: 通用创作 API，暴露技能列表、引擎列表与单次创作流。
dashboard.js: 仪表盘聚合 API，汇总产出与今日信息。
image.js: 图片生成 API，负责封面/配图生成与 prompt 存储。
pipeline.js: 内容流水线主 API，暴露任务、阶段、热点、平台与样式接口，并挂载 legacy 子路由。
pipeline-legacy-routes.js: 流水线兼容路由层，保留旧工作流接口协议并桥接 shared pipeline。
pipeline-route-support.js: 流水线路由辅助层，负责参数归一化、legacy SSE 执行器、任务快照与输出文件辅助函数。
review.js: 周复盘 API，负责统计与 AI 复盘生成。
rewrite.js: 洗稿 API，负责对已有内容做风格改写。

法则: 路由只做协议转换与参数校验·复杂逻辑优先下沉 services/core

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
