# webapp/public/js/views/pipeline/
> L2 | 父级: /webapp/public/js/views/CLAUDE.md

成员清单
shared.js: 流水线页面共享工具与初始状态工厂，收口转义、列表解析与并发控制。
runtime-state.js: 流水线运行时状态层，负责任务恢复、热点同步、6 步映射与共享结果回填。
runtime-summary.js: 流水线任务摘要层，负责摘要卡、下一阶段推断与回退候选计算。
runtime-actions.js: 流水线任务动作层，负责阶段执行、回退、批量运行与按钮绑定。
input-step.js: 输入源辅助模块，负责热点预填摘要、补充信息与输入同步。
draft-step.js: 第 1 步母稿阶段视图，负责根据输入内容生成母稿。
platform-step.js: 第 2-3 步平台阶段视图，负责多平台改写、审查优化与结果保存。
image-step.js: 图片阶段视图，负责双轨提炼、配图配置与批量生图。
output-step.js: 第 5-6 步排版导出阶段视图，负责排版、导出、重置状态与结果复制。

法则: 阶段视图按职责拆分·共享状态留在 PipelineView·子模块只挂接页面方法

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
