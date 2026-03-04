# tools/tests/
> L2 | 父级: tools/CLAUDE.md → /CLAUDE.md

从 Auto-Redbook-Skills 迁移的测试脚本集。覆盖发布、生成、封面等核心功能的集成测试。

## 成员清单

test_complete_system.py: 端到端系统测试，验证完整流水线
test_generation.py: 内容生成测试，验证 Claude API 调用和模板渲染
test_icon_cover.py: Lucide图标封面生成测试
test_publish.py: 小红书发布功能测试
test_publish_manual.py: 手动发布流程测试
test_simple_publish.py: 简化发布测试（快速验证）

## 注意

这些测试脚本中的 import 路径仍引用原 Auto-Redbook-Skills 结构，运行前需适配为 tools/ 下的新路径。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
