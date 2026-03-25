# webapp/public/js/views/pipeline/
> L2 | 父级: /webapp/public/js/views/CLAUDE.md

成员清单
shared.js: 流水线页面共享工具与初始状态工厂，收口转义、列表解析与并发控制。
input-step.js: 热点准备阶段视图，负责任务恢复、热点选择与补充信息录入。
draft-step.js: 母稿阶段视图，负责创作方向选择、母稿生成与保存。
platform-step.js: 平台改写阶段视图，负责平台勾选、自然化编辑与结果保存。
image-step.js: 图片阶段视图，负责双轨提炼、配图配置与批量生图。
output-step.js: 排版导出阶段视图，负责组装最终文件、重置状态与结果复制。

法则: 阶段视图按职责拆分·共享状态留在 PipelineView·子模块只挂接页面方法

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
