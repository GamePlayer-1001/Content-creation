# 反AI体系重构 - 合并稿

更新时间：2026-03-20
状态：方案已收口，待按阶段执行

---

## 一、背景与目标

本专题目标是将高质量反AI写作体系完整纳入现有项目，并从“单文件+Skill硬编码”升级到“规则分层+统一引用”。

核心要求：

1. 34 条规则全量纳入（不裁剪）
2. 每条规则保留完整处理逻辑（识别/根因/改写/示例）
3. 覆盖 13 平台（中英文均受益）
4. 重构过程信息守恒（不丢平台特化规则）

---

## 二、关键决策

1. 文件格式原则
- 代码解析消费：YAML/JSON
- 纯AI规则消费：Markdown

2. 配置重构原则
- 原 `creator.yaml` 拆分为 `config/rules/*.md` 职责化文件
- Skill 层尽量“变薄”，以引用规则代替硬编码

3. 平台防混淆原则
- 每个平台 Skill 显式锁定平台身份键
- 分发流程中每步显式切换平台键

4. 信息守恒原则
- 先审计归拢，再拆分重构，最后替换引用

---

## 三、目标结构（反AI相关）

```text
config/
└─ rules/
   ├─ persona.md
   ├─ writing-rules.md
   ├─ quality.md
   └─ tropes.md
```

建议职责：

- `persona.md`：人设、创作方向、方法论
- `writing-rules.md`：黑名单、润色引擎、平台调优
- `quality.md`：质量门控、审查、反AI检测维度
- `tropes.md`：34条模式（识别/根因/改写/示例）

---

## 四、Skill 层调整原则

- 保留 22 个 Skill 文件，不减少入口数量
- 去除重复硬编码规则，改为读取 `config/rules/*.md`
- Skill 侧重点收敛为“平台适配逻辑 + 参数上下文”

预期收益：

- 单点改规则，全平台受益
- 降低引用漂移和维护成本
- 可在 WebApp / CLI 中稳定复用

---

## 五、执行清单（合并后）

### Phase 0 审计归拢
- [ ] 全量提取旧 `creator.yaml` 规则
- [ ] 扫描 13 平台 Skill 的硬编码规则
- [ ] 扫描 `优化去AI` 与 `洗稿` 的独有规则
- [ ] 输出完整规则清单，确认零遗漏

### Phase 1 建立 rules 四文件
- [ ] 新建 `config/rules/`
- [ ] 生成 `persona.md`
- [ ] 生成 `writing-rules.md`（含平台特化）
- [ ] 生成 `quality.md`
- [ ] 生成 `tropes.md`（34条）

### Phase 2 更新关键工具 Skill
- [ ] 更新 `优化去AI.md`
- [ ] 更新 `洗稿.md`

### Phase 3 更新中文平台 Skill
- [ ] 小红书 / 知乎 / 即刻 / linuxdo / 公众号 / 朋友圈 / 母稿

### Phase 4 更新英文平台 Skill
- [ ] Medium / Quora / Reddit / X推文 / GitHub

### Phase 5 分发与 WebApp 适配
- [ ] 更新全平台分发命令引用
- [ ] 更新 `skill-loader` 对 rules 的加载逻辑
- [ ] 更新 `platforms.yaml` 平台调优字段

### Phase 6 清理与文档同步
- [ ] 删除 `config/creator.yaml`（仅在确认迁移完整后）
- [ ] 同步 L1/L2 CLAUDE 文档

### Phase 7 验证
- [ ] 信息完整性对比（零丢失）
- [ ] Skill 引用检查（无旧路径残留）
- [ ] 平台隔离检查（身份键锁定）
- [ ] WebApp/CLI 实测（母稿、平台改写、优化）

---

## 六、验收标准

- 规则总量与细节不低于旧体系
- 13 平台均走统一规则引用链
- WebApp 与 CLI 在反AI链路上输出一致
- 规则更新可做到“单点修改，多处生效”

---

## 七、来源文档（已合并）

- `refactor-需求记录.md`
- `refactor-最终方案.md`
- `refactor-执行清单.md`
