# output/
> L2 | 父级: /CLAUDE.md

所有生成内容的输出目录 — Skills 自动写入，按平台分目录存储。

## 成员清单

`母稿/`: 核心长文（所有内容的源头），由 /母稿 skill 写入
`小红书/`: 小红书文案（.md），由 /小红书 和 /全平台分发 写入
`公众号/`: 公众号/百家号/今日头条文章（每篇3个文件），由 /公众号 写入
`即刻/`: 即刻短文，由 /即刻 写入
`X/`: 英文推文，由 /X推文 写入
`linuxdo/`: 技术社区帖，由 /linuxdo 写入
`GitHub/`: GitHub Discussion/PR/Issue 草稿，由 /GitHub 写入
`朋友圈/`: 朋友圈文案，由 /朋友圈 写入
`封面/`: 封面图片（.png），由 generate-cover.mjs 生成
`卡片/`: 小红书卡片图片（.png），由 render_xhs.py 生成
`复盘/`: 周复盘报告，由 /周复盘 写入

## 文件命名约定

`{日期}-{主题关键词}.md` — 如 `20260304-AI工具效率对比.md`

## 注意

此目录下的 .png 文件被 .gitignore 排除。.md 文件按需 commit。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
