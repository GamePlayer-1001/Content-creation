/**
 * [INPUT]: 依赖 shared.js 暴露的公共工具
 * [OUTPUT]: 声明 PipelineTaskRuntime 运行时聚合对象
 * [POS]: views/ 的流水线运行时引导层，被 runtime 子模块扩展并最终混入 pipeline.js
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const PipelineTaskRuntime = {};
