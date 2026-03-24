# tools/tests/
> L2 | 父级: /tools/CLAUDE.md

成员清单
pipeline-state-smoke.test.js: 共享任务状态轻量回归测试，验证确认阻断与回退语义
shared-pipeline-execution.test.js: 共享 step executor 集成测试，覆盖 draft 到 export 的主链路
test_complete_system.py: 端到端系统测试，联调抓取、生成、发布等核心环节
test_generation.py: 内容生成链路测试，验证抓取到生成的基础闭环
test_icon_cover.py: 图标封面回归测试，检查图标封面渲染结果
test_publish.py: 标准发布流程测试，验证发布脚本与平台配置
test_publish_manual.py: 手工发布流程测试，验证人工辅助发布路径
test_simple_publish.py: 简化版发布冒烟测试，快速检查发布最小闭环

法则: tests 目录优先放回归与冒烟脚本，不承载生产逻辑；新增测试先说明覆盖边界，再落文件

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
