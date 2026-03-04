# output/
> L2 | 父级: /CLAUDE.md

所有生成内容的输出目录 — Skills 和 Tools 自动写入，按平台/功能分目录存储。

## 成员清单

### 平台内容（Skills 写入）
`母稿/`: 核心长文（所有内容的源头），由 /母稿 skill 写入
`小红书/`: 小红书文案（.md），由 /小红书 和 /全平台分发 写入
`公众号/`: 公众号/百家号/今日头条文章（每篇3个文件），由 /公众号 写入
`即刻/`: 即刻短文，由 /即刻 写入
`X/`: 英文推文，由 /X推文 写入
`linuxdo/`: 技术社区帖，由 /linuxdo 写入
`GitHub/`: GitHub Discussion/PR/Issue 草稿，由 /GitHub 写入
`朋友圈/`: 朋友圈文案，由 /朋友圈 写入

### 媒体产物（Tools 写入）
`封面/`: 封面图片（.png），由 tools/cover/generate-cover.mjs 生成
`卡片/`: 小红书卡片图片（.png），由 tools/card/render_xhs.py 生成
`test_covers/`: 图标封面测试输出，由 tools/generator/content_with_icons.py 生成

### 管理产物
`复盘/`: 周复盘报告，由 /周复盘 写入

### 自动化管道（Tools 写入，.gitignore 排除）
`drafts/`: 草稿队列 — 内容管道生成的待审核草稿
`queue/`: 发布队列 — 审核通过待发布的内容（含图片+元数据）
`published/`: 已发布归档 — 发布成功后移入
`scraper/`: 热点抓取数据 — trending topics 原始数据存储

## 文件命名约定

`{日期}-{主题关键词}.md` — 如 `20260304-AI工具效率对比.md`
封面: `cover-{date}-{title_slug}.png`
卡片: `card-{date}-{title_slug}-{page}.png`

## 注意

drafts/、queue/、published/、scraper/、*.png、*.html 被 .gitignore 排除。.md 文件按需 commit。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
