# core/pipeline/
> L2 | 父级: /core/CLAUDE.md

成员清单
catalog.js: 创作方向与平台目录常量，避免 WebApp/CLI 常量漂移。
layout-composer.js: 根据平台稿与视觉素材组装排版 Markdown。
stages.js: 9阶段定义单一信号源，声明顺序、说明与确认策略。
step-executor.js: 共享阶段执行器，串联热点、母稿、改写、优化、配图、排版与导出。
task-state-store.js: 任务状态 JSON 存储层，负责任务持久化。
workflow-runner.js: 任务推进器，负责阶段推进、确认与回退。

法则: 阶段顺序显式·状态落盘集中·执行动作与路由表现分离

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
