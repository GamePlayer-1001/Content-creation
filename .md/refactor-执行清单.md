# 反AI体系重构 — 执行清单

> 创建时间: 2026-03-11
> 状态: 待确认后执行
> 关联: [需求记录](refactor-需求记录.md) | [最终方案](refactor-最终方案.md)

## Phase 0: 审计（信息归拢）

- [ ] 提取 creator.yaml 全部16段内容，标注每段归属哪个新文件
- [ ] 扫描13个平台Skill，提取所有硬编码的降AI/润色/质量规则
- [ ] 对比Skill规则与creator.yaml规则的差异，标注Skill中独有的平台特化信息
- [ ] 扫描优化去AI.md和洗稿.md，提取它们的独有规则
- [ ] 生成完整的"规则信息清单"，确认零遗漏

## Phase 1: 创建 config/rules/ 下的4个规则文件

- [ ] 创建 config/rules/ 目录
- [ ] 编写 config/rules/persona.md
  - 来源: creator.yaml 的 persona + creation_directions + viral_methodology + title_elements + interaction_design
- [ ] 编写 config/rules/writing-rules.md
  - 来源: creator.yaml 的 blacklist + polish_engine + code_protection + metadata_spec
  - 合并: 各Skill中的平台特化润色规则 → platform_tuning 段
  - 新增: english_blacklist（英文词汇级黑名单）
  - 新增: polish_engine_en（英文润色规则，从Medium/Quora/Reddit/X Skill中提取）
- [ ] 编写 config/rules/quality.md
  - 来源: creator.yaml 的 quality_gate + platform_quality_gate + adversarial_review + ai_detection_dimensions + anti_detection + viral_potential
- [ ] 编写 config/rules/tropes.md
  - 新增: 34条trope完整处理逻辑（来源tropes.fyi + 中文本地化）
  - 6类: word_choice(4) + sentence_structure(9) + paragraph_structure(2) + tone(9) + formatting(3) + composition(7)
- [ ] 验证: 4个新文件的信息总量 >= creator.yaml 的信息总量 + Skill中独有规则

## Phase 2: 更新工具Skill（核心降AI能力）

- [ ] 修改 优化去AI.md — 配置引用替换 + 增加trope扫描步骤
- [ ] 修改 洗稿.md — 配置引用替换 + 增加trope扫描引用

## Phase 3: 更新中文平台Skill

- [ ] 修改 小红书.md — 瘦身 + 平台身份锁定 + 引用替换
- [ ] 修改 知乎.md — 同上
- [ ] 修改 即刻.md — 同上
- [ ] 修改 linuxdo.md — 同上
- [ ] 修改 公众号.md — 同上 + **新增降AI味段落**（当前缺失）
- [ ] 修改 朋友圈.md — 同上 + **新增trope扫描**（当前缺失）
- [ ] 修改 母稿.md — 增加 composition 类 trope 检查

## Phase 4: 更新英文平台Skill

- [ ] 修改 Medium.md — 瘦身 + 平台身份锁定 + 引用替换
- [ ] 修改 Quora.md — 同上
- [ ] 修改 Reddit.md — 同上
- [ ] 修改 X推文.md — 同上（精简版trope扫描）
- [ ] 修改 GitHub.md — 轻量 formatting 类扫描

## Phase 5: 分发集成 + Webapp适配

- [ ] 修改 全平台分发.md — 加载配置增加 config/rules/ 引用
- [ ] 修改 webapp/services/skill-loader.js:
  - CONFIG_PATTERNS 增加 config/rules/*.md 匹配
  - 截断阈值 5000 → 20000
  - 删除 creator.yaml 的 pattern 条目
- [ ] 修改 config/platforms.yaml — 每个平台增加 polish_intensity + trope_emphasis 字段

## Phase 6: 清理 + GEB文档

- [ ] 删除 config/creator.yaml（确认所有信息已迁移后）
- [ ] 更新 CLAUDE.md (L1) — 目录结构 + 配置层描述
- [ ] 更新 config/CLAUDE.md (L2) — 成员清单增加 rules/ 目录
- [ ] 创建 config/rules/CLAUDE.md (L2) — 4个规则文件的职责描述
- [ ] 更新 .claude/commands/CLAUDE.md (L2) — 各Skill描述更新

## Phase 7: 验证

- [ ] 信息完整性: diff 旧creator.yaml内容 vs 4个新文件内容，确认零丢失
- [ ] Skill引用: 22个Skill中不再出现 `config/creator.yaml`，全部替换为 `config/rules/*.md`
- [ ] 平台隔离: 检查每个Skill头部有平台身份锁定
- [ ] Webapp: 启动 webapp，流水线 Step2/3 正常调用新配置文件
- [ ] 实际测试: 用已有母稿执行 /小红书、/X推文、/优化去AI 各一次，确认输出质量
- [ ] GEB合规: L1/L2 CLAUDE.md 全部同步更新

## 预估

- **改动文件数**: 32个（4新建 + 1删除 + 24修改 + 3文档更新）
- **新增内容**: ~1350行（主要是 tropes.md ~720行 + writing-rules.md 合并扩展 ~250行）
- **每Phase完成后 git commit**

[PROTOCOL]: 变更时更新此文件
