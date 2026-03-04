# config/
> L2 | 父级: /CLAUDE.md

可配置层 — 换赛道只改这里，Skills 本身赛道无关。

## 成员清单

`product.yaml`: 产品/品牌/赛道/选题池/各平台账号，换产品改这个文件
`platforms.yaml`: 9平台语气风格规则（A组长图文/B组技术/C组社交/D组国际/E组私域）
`schedule.yaml`: 60天推广排期 + 日类型系统（内容日/轻量日/休息日）+ 起始日期
`compliance.yaml`: 合规规则库 — 敏感词黑名单/功效暗示红线/导流禁止/谨慎词频次/真实性/行为检测
`creator.yaml`: 创作者人设 + 三轮润色引擎参数 + 四种思维模板 + 标题元素池 + 互动设计 + 质量门控

## 依赖关系

所有 Skills 在执行时读取这些配置。config 本身不依赖任何其他模块。

## 修改影响

改 product.yaml → 所有平台内容的品牌信息和赛道关键词变化
改 platforms.yaml → 对应平台的语气/长度/频率变化
改 schedule.yaml → 今日任务和周复盘的排期计算变化
改 compliance.yaml → 合规检查的规则库变化
改 creator.yaml → 所有创作内容的风格和质量标准变化

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
