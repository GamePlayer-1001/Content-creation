# CAT5 改进建议 Backlog

> 记录使用过程中发现的问题和改进建议

---

## 待处理

### 1. Agent 模式代码块保护

**问题描述**: Agent 模式（特别是协作模式）会对文章中的示例代码进行改动，把「文章里的示例代码」当成「可以优化的项目代码」处理。

**发现时间**: 2025-12-22

**影响范围**: `/rewrite --collab`, `/write --collab`

**建议方案**:

| 方案 | 实现位置 | 说明 |
|------|---------|------|
| A. Skill层保护 | `agent-quality/SKILL.md`, `agent-writer/SKILL.md` | 加硬规则：代码块属于示例，禁止修改 |
| B. 命令参数 | `/rewrite`, `/write` | 加 `--preserve-code` 参数 |
| C. Supervisor声明 | `supervisor-orchestrator/SKILL.md` | 分发任务时声明代码块是内容的一部分 |

**推荐**: 多层保护，A+C 组合

**状态**: 🟡 待实现

---

## 已完成

（暂无）

---

**更新时间**: 2025-12-22
