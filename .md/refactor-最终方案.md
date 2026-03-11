# 反AI体系重构 — 最终方案

> 创建时间: 2026-03-11
> 状态: 待用户确认后执行
> 关联: [需求记录](refactor-需求记录.md) | [执行清单](refactor-执行清单.md)

## 一、架构决策

### 1.1 文件格式原则

| 消费者 | 格式 | 理由 |
|--------|------|------|
| 代码程序化解析 | YAML/JSON | 代码需要 parse 结构化数据 |
| 纯AI消费的规则 | **Markdown** | 内容是prompt的一部分，markdown是prompt的母语 |

### 1.2 配置层重构

**creator.yaml (453行) → 拆为 config/rules/ 下 4 个 .md 文件：**

```
config/
├── rules/                  # 新目录: 纯AI消费的规则文件
│   ├── persona.md          # ~200行 | 人设+创作方向+病毒方法论+标题元素+互动设计
│   ├── writing-rules.md    # ~250行 | 中英黑名单+三轮润色引擎+英文润色+平台力度覆盖+代码保护
│   ├── quality.md          # ~180行 | 母稿门控+平台门控+四轨审核+对抗审查+AI检测维度+反AI策略
│   └── tropes.md           # ~720行 | 34条AI模式(识别+根因+改写+示例) ← 新增
│
├── platforms.yaml          # 不变，微增 polish_intensity/trope_emphasis 字段
├── product.yaml            # 不变
├── compliance.yaml         # 不变
├── schedule.yaml           # 不变
├── hashtags.json           # 不变
├── icons.json              # 不变
├── topics.json             # 不变
├── promotion.json          # 不变
├── selectors.json          # 不变
└── .env                    # 不变
```

**creator.yaml 删除**（内容全部迁移到 config/rules/ 下的4个文件中）。

### 1.3 信息守恒策略

**先归拢，再拆分**：

1. **审计阶段**: 扫描 creator.yaml + 13个平台Skill + 优化去AI + 洗稿，提取所有润色/质量/反AI规则
2. **合并阶段**: 把Skill中硬编码的平台特化规则合并到规则文件中
   - 例: X推文的碎片量化指标 → writing-rules.md 的 platform_tuning 段
   - 例: Medium的缩写规则 → writing-rules.md 的英文润色段
   - 例: 公众号/朋友圈的缺失规则 → 补齐到 writing-rules.md
3. **拆分阶段**: 在合并后的完整信息上按职责拆分

### 1.4 防混淆机制

每个平台Skill头部保留平台身份锁定：

```markdown
## 平台身份
- 平台键: x_twitter
- 语言: 英文
- 润色配置: config/rules/writing-rules.md → platform_tuning.x_twitter
- trope侧重: word_choice, tone
```

全平台分发中每个子步骤开头显式切换平台键。

## 二、Skill层简化

### 2.1 变化前后对比

**变更前**: 每个Skill ~150行，其中~40行是硬编码的润色/质量规则
**变更后**: 每个Skill ~110行，润色/质量部分替换为配置引用

```markdown
# 变更前（小红书.md 中的硬编码）
### 第一轮：降AI味
- 删除书面连接词（首先/其次/最后/总之/综上/此外…）
- 替换书面词（但是→但，因为→就因为，非常→超/巨/贼…）
- 打破完美逻辑链，拉大句子长短差异
- 省略主语，破坏工整感

# 变更后（引用配置）
### 润色与反AI
1. 对照 `config/rules/tropes.md` 执行 Trope 模式扫描（每类最多1处）
2. 按 `config/rules/writing-rules.md` 的 platform_tuning.xiaohongshu 执行三轮润色
3. 按 `config/rules/quality.md` 的平台门控执行质量检查
```

### 2.2 Skill文件数量

不变，仍然22个。每个更薄更聚焦于"平台内容适配逻辑"。

## 三、流水线引用关系

```
母稿创作:
  persona.md (人设+方向) + writing-rules.md (黑名单) + quality.md (母稿门控)
  + tropes.md (仅 composition 类)

平台适配:
  platforms.yaml (语气+润色力度) + writing-rules.md (润色引擎)
  + tropes.md (全类别) + quality.md (平台门控) + compliance.yaml (合规)

去AI优化:
  writing-rules.md (黑名单+润色) + tropes.md (全类别) + quality.md (AI检测)

洗稿:
  writing-rules.md (黑名单) + tropes.md (全类别) + quality.md (AI检测)
```

## 四、Webapp适配

### 4.1 skill-loader.js 改动

```javascript
// CONFIG_PATTERNS 增加 rules/ 目录下的 .md 文件匹配
{ regex: /config\/rules\/persona\.md/g, file: 'rules/persona.md' },
{ regex: /config\/rules\/writing-rules\.md/g, file: 'rules/writing-rules.md' },
{ regex: /config\/rules\/quality\.md/g, file: 'rules/quality.md' },
{ regex: /config\/rules\/tropes\.md/g, file: 'rules/tropes.md' },

// 截断阈值提高: 5000 → 20000
const trimmed = content.length > 20000 ? content.slice(0, 20000) + '\n...(已截断)' : content;
```

### 4.2 移除旧引用

所有Skill中 `config/creator.yaml` 的引用替换为对应的 `config/rules/*.md` 引用。
CONFIG_PATTERNS 中删除 creator.yaml 的条目。

## 五、tropes.md 结构设计

每条 trope 的标准格式：

```markdown
### 5. 否定式假深刻 / Negative Parallelism
**类别**: sentence_structure | **严重度**: high | **上限**: 1次/篇

**模式描述**:
用"不是X——而是Y"制造虚假深刻感。单篇一次是修辞技巧，三次以上是AI指纹。

**根因分析**:
训练数据中对比修辞被标注为高质量写作，RLHF强化了"surprise reframe"偏好。

**识别模式**:
- 中文: "不是X，而是Y" / "不是X——是Y" / "并非X，实则Y" / "与其说X，不如说Y"
- 英文: "It's not X -- it's Y" / "not because X, but because Y"

**改写策略**:
去掉否定框架，直接陈述核心观点。如需对比，用叙事过渡代替工整对仗。

**示例**:
| | 中文 | 英文 |
|---|---|---|
| Bad | 这不是偷懒——是效率 | It's not bold. It's backwards. |
| Good | 说白了就是图省事 | That approach is backwards. |
```

34条按6类分组: word_choice(4) → sentence_structure(9) → paragraph_structure(2) → tone(9) → formatting(3) → composition(7)

## 六、文件改动总览

| 类型 | 数量 | 说明 |
|------|------|------|
| 新建 | 4个 config/rules/*.md | persona + writing-rules + quality + tropes |
| 删除 | 1个 config/creator.yaml | 内容全部迁移 |
| 修改 | 22个 .claude/commands/*.md | Skill瘦身 + 引用替换 |
| 修改 | 1个 webapp/services/skill-loader.js | CONFIG_PATTERNS + 截断阈值 |
| 修改 | 1个 config/platforms.yaml | 增加 polish_intensity/trope_emphasis |
| 更新 | 3个 CLAUDE.md | L1 + config/L2 + commands/L2 |
| **合计** | **32个文件** | |

[PROTOCOL]: 变更时更新此文件
