# webapp/public/js/views/
> L2 | 父级: /webapp/public/js/CLAUDE.md

成员清单
compliance.js: 合规检查页面视图。
config.js: 配置管理页面视图。
content.js: 内容管理页面视图。
dashboard.js: 首页总览页面视图，展示主入口与工具箱分区。
pipeline/: 流水线阶段子模块目录，按 6 步生产主线拆分页面实现。
pipeline-task-runtime.js: 流水线运行时引导层，承接 runtime 子模块装配。
pipeline.js: 6 步内容流水线页面视图壳，复用共享 9 阶段执行状态。
review.js: 周复盘页面视图。
rewrite.js: 洗稿页面视图。
search.js: 热点信息页面视图，负责向工作流第一步导流。
toolbox.js: 工具箱页面视图，聚合独立模块入口。

法则: 一视图一页面·页面语义与后端路由一一对应·阶段页面不得私有化阶段定义

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
