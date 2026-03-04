# config/
> L2 | 父级: /CLAUDE.md

可配置层 — 换赛道只改这里，Skills 和 Tools 本身赛道无关。

## 成员清单

### YAML 配置（Skills 读取）
`product.yaml`: 产品/品牌/赛道/选题池/各平台账号，换产品改这个文件
`platforms.yaml`: 9平台语气风格规则（A组长图文/B组技术/C组社交/D组国际/E组私域）+ 配图命名规范
`schedule.yaml`: 60天推广排期 + 日类型系统 + 起始日期 + 3时段自动发布时间表
`compliance.yaml`: 合规规则库 — 敏感词黑名单/功效暗示红线/导流禁止/谨慎词频次/真实性/行为检测
`creator.yaml`: 创作者人设 + 三轮润色引擎 + 四种思维模板 + 标题元素池 + 互动设计 + 质量门控 + AI检测规避策略 + 内容元数据规范

### JSON 配置（Tools 读取）
`icons.json`: Lucide 图标分类映射（12类 × 1000+ 图标），供 /图标封面 使用
`hashtags.json`: 标签库（12类 × 83标签），供发布工具自动添加标签
`topics.json`: 热门话题库，供 /热点抓取 更新和选题参考
`promotion.json`: 推广策略（4种风格权重），供内容管道选择风格
`selectors.json`: 小红书 CSS 选择器，供自动化发布工具定位页面元素

### 环境配置
`.env.example`: 环境变量模板（XHS_COOKIE/GEMINI_API_KEY/ANTHROPIC_API_KEY 等）

## 依赖关系

所有 Skills 在执行时读取 YAML 配置。tools/ 下的自动化工具读取 JSON 配置。config 本身不依赖任何其他模块。

## 修改影响

改 product.yaml → 所有平台内容的品牌信息和赛道关键词变化
改 platforms.yaml → 对应平台的语气/长度/频率/配图命名变化
改 schedule.yaml → 今日任务和周复盘的排期计算 + 自动发布时段变化
改 compliance.yaml → 合规检查的规则库变化
改 creator.yaml → 所有创作内容的风格/质量标准/AI检测规避策略变化
改 JSON 配置 → 对应自动化工具的行为变化

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
