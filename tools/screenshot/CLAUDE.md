# wechat-screenshot/
> L2 | 父级: tools/CLAUDE.md → CLAUDE.md

wxdh CSS + Puppeteer: .md 聊天记录体 → 像素级微信对话分屏截图

## 架构决策

不启动 wxdh 的 Vue JS。只复用其 CSS + 图标资源（d:\Software\wxdh-temp\static\app\），
由自己构造 HTML DOM → Puppeteer file:// 渲染 → 1125x2436 iPhone X @3x 截图。

## 成员清单

generate-wechat-screenshot.mjs: CLI 入口，串联 parse → nickname → avatar → split-screen 流水线
package.json: 唯一外部依赖 puppeteer

lib/parse-md.mjs: MD 状态机解析器（PREAMBLE→CHARACTERS→DIALOG→POSTSCRIPT），
  支持 message/timestamp/transfer/received/redpacket/redpacket_get/system/voicecall/sticker 9 种 kind
lib/build-html.mjs: parseMd items[] → wxdh CSS class 映射 → 完整 HTML 字符串，
  支持 measure(高度测量) 和 render(完整手机框) 两种模式
lib/split-screens.mjs: 三阶段分屏引擎：测量高度 → 贪心装箱(1831px/屏) → 逐屏 page.goto + screenshot
lib/nickname.mjs: 单字母角色 ID → 关键词匹配 → 中文昵称
lib/avatar.mjs: picsum.photos seed 下载头像，缓存到 .cache/avatars/

## 外部依赖

- wxdh 项目（d:\Software\wxdh-temp\）：CSS + 图标 + 字体，不执行其 JS
- 表情包目录（D:\Software\内容\表情包\）：9 维情绪分类 PNG/JPG

## 用法

```
node generate-wechat-screenshot.mjs "path/to/file.md" [--output-dir "path"]
```

默认输出到 D:\Software\内容\output\{baseName}-微信截图-{N}.png

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
