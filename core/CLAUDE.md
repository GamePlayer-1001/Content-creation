# core/
> L2 | 父级: /CLAUDE.md

成员清单
config/: 运行时配置收口层，统一环境变量口径。
pipeline/: 9阶段内容流水线的共享编排核心。
services/: 可被 WebApp/CLI 共用的领域服务。

法则: core 是唯一执行真相源·WebApp/CLI 不得复制业务逻辑·阶段定义集中维护

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
