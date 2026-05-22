# config/
> L2 | 父级: /CLAUDE.md

可配置层 — 换赛道只改这里，Skills 和 Tools 本身赛道无关。

## 成员清单

### YAML 配置（Skills 读取）
`product.yaml`: 产品/品牌/赛道/选题池/各平台账号，换产品改这个文件
`platforms.yaml`: 13平台语气风格规则（A/B/C/D/E/F 六组）+ 配图命名规范
`schedule.yaml`: 60天推广排期 + 日类型系统 + 起始日期 + 3时段自动发布时间表
`compliance.yaml`: 合规规则库 — 敏感词黑名单/功效暗示红线/导流禁止/谨慎词频次/真实性/行为检测
### rules/ 子目录（Markdown 规则，AI 消费）
`rules/persona.md`: 人设 + 8种创作方向 + 病毒方法论 + 标题元素池 + 互动设计
`rules/writing-rules.md`: 中英黑名单 + 三轮润色引擎 + 平台力度覆盖 + 代码块保护
`rules/quality.md`: 母稿门控 + 平台门控 + 四轨审核 + Cold Editor + 反AI检测
`rules/tropes.md`: 34条AI写作模式（识别+根因+改写策略+中英示例）

### JSON 配置（Tools 读取）
`icons.json`: Lucide 图标分类映射（12类 × 1000+ 图标），供 /图标封面 使用
`hashtags.json`: 标签库（12类 × 83标签），供发布工具自动添加标签
`topics.json`: 热门话题库，供 /热点抓取 更新和选题参考
`promotion.json`: 推广策略（4种风格权重），供内容管道选择风格
`selectors.json`: 小红书 CSS 选择器，供自动化发布工具定位页面元素

### 环境配置
`.env.example`: 环境变量模板（主变量 GOOGLE_GENAI_API_KEY；兼容 GOOGLE_AI_KEY / GEMINI_API_KEY；以及 OPENROUTER_API_KEY / DEEPSEEK_API_KEY 等）

## 依赖关系

所有 Skills 在执行时读取 YAML 配置。tools/ 下的自动化工具读取 JSON 配置。config 本身不依赖任何其他模块。

## 修改影响

改 product.yaml → 所有平台内容的品牌信息和赛道关键词变化
改 platforms.yaml → 对应平台的语气/长度/频率/配图命名变化
改 schedule.yaml → 今日任务排期计算 + 自动发布时段变化
改 compliance.yaml → 合规检查的规则库变化
改 rules/*.md → 所有创作内容的人设/润色/质量标准/反AI检测策略变化
改 JSON 配置 → 对应自动化工具的行为变化

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
