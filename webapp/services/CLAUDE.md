# webapp/services/
> L2 | 父级: /webapp/CLAUDE.md

成员清单
ai-adapter.js: 统一 AI 引擎适配层，封装 CLI/API 调用差异。
compliance-engine.js: 合规规则引擎，执行内容扫描。
config-manager.js: 配置管理器，负责 YAML/JSON 读写。
image-generator.js: 图片生成器，封装 Gemini 图像接口。
output-manager.js: output/ 目录管理器，负责内容读写与统计。
prompt-store.js: 图片 prompt 历史存储与管理。
schedule-engine.js: 排期计算引擎，生成 Day N 与今日任务语义。
skill-loader.js: 命令模板装载器，把 `.claude/commands` 转成完整 Prompt。

法则: services 是 Web 侧适配层·规则读取与输出读写集中·避免路由层重复拼装

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
