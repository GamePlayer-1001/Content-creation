---
title: "ai-website-cloner-template：一条命令，让 AI 帮你像素级克隆任意网站"
source: "https://mp.weixin.qq.com/s/jOTEqOjMYbU87ITeGIXt6Q"
author:
  - "[[野草之外]]"
published:
created: 2026-04-13
description: "看到别人的网页设计很棒，想复刻又不想手写每一行 CSS？这个模板让 Claude Code、Cursor、Copilot 等 AI 编程工具帮你自动截取设计令牌、提取资源、拆分组件、并行重建——输入一个 URL，输出一份可运行的 Next."
tags:
  - "clippings"
---
原创 野草之外 *2026年4月1日 14:11*

## ai-website-cloner-template：一条命令，让 AI 帮你像素级克隆任意网站

> 你看到一个网站设计很棒，想做成自己的页面，但手动量间距、调配色、对布局，可能要花好几天。 `ai-website-cloner-template` 是一个可复用的克隆模板——把目标 URL 丢给你的 AI 编程助手，它会自动截屏分析、提取设计令牌、下载所有资源，然后并行重建出一份像素级还原的 Next.js 项目。

**GitHub 地址**

https://github.com/JCodesMore/ai-website-cloner-template

**技术栈**

Next.js 16 + React 19 + shadcn/ui + Tailwind CSS v4

![图片](https://mmbiz.qpic.cn/mmbiz_png/hnIWuXkRtlEeHicfkjPB5hye3Z13roQrtV15BicUNpwbejUsMg7ohlV2Z6lgIe9kxiaaXmarYYne7rGn1ia8grpDrIfayDWzq6juqFhTGCiaoY7U/640?from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

---

### 为什么需要这个项目？

仿站或者说"参考设计"是前端开发中极其常见的需求，但传统方式效率很低：

- **痛点 1：手动提取设计令牌太耗时。** 你需要打开 DevTools 逐个元素查 `getComputedStyle()` ，记录颜色值、字体、间距、圆角、阴影……几十个变量抄下来可能要一两个小时。
- **痛点 2：组件结构靠肉眼看，经常遗漏状态。** 按钮 hover 怎么变、导航栏滚动怎么收起、响应式断点在哪——这些交互细节光看静态截图根本发现不了。
- **痛点 3：从截图到代码的转化全靠手写。** 设计稿确认后，每个区块都要手动翻译成 JSX + Tailwind，重复劳动量大，还容易跟原版对不上。
- **痛点 4：不同 AI 工具各有一套用法，没有统一流程。** 你可能想用 Claude Code 克隆一个站，又想用 Cursor 克隆另一个，但没有一个模板能同时适配这些工具。

`ai-website-cloner-template` 的思路很简单： **把"仿站"这个多步骤的手工流程，变成一条 AI 编程助手可以自动执行的 pipeline。**

> "Don't rebuild from scratch. Let your AI agent do the heavy lifting."

---

### 核心内容

#### 1\. 五阶段自动化 Pipeline

`/clone-website <url>` 触发后，整个克隆过程按五个阶段依次执行：

- **Reconnaissance（侦察）** ：自动截屏、滚动、点击、hover，收集目标页面在各个状态下的视觉信息，同时提取设计令牌（颜色、字体、间距、阴影、圆角等）。
- **Foundation（地基）** ：把提取到的字体、颜色、全局样式更新到项目中，下载所有图片和视频资源到本地 `public/` 目录。
- **Component Specs（组件规格）** ：为页面中的每个区块/组件生成详细的规格文件，包含精确的 CSS 计算值、交互状态、内容结构和响应式断点。
- **Parallel Build（并行构建）** ：利用 Git Worktree 启动多个 Builder Agent，每个 Agent 负责重建一个区块/组件，并行工作互不干扰。
- **Assembly & QA（组装与质检）** ：合并所有 Worktree 的工作成果，组装成完整页面，与原站进行视觉对比验证。

这不是"让 AI 猜页面长什么样"，而是把 `getComputedStyle()` 的精确数值、交互模型、多状态内容全部喂给 Agent，确保每个像素都有据可依。

#### 2\. 全平台 AI 编程工具支持

这个模板不是只绑定了 Claude Code。它通过 `AGENTS.md` 作为唯一指令源，自动同步到各个平台：

| Agent | 状态 |

| --- | --- |

| Claude Code | 推荐（Opus 4.6 效果最好） |

| Codex CLI | 支持 |

| GitHub Copilot | 支持 |

| Cursor | 支持 |

| Windsurf | 支持 |

| Gemini CLI | 支持 |

| Cline | 支持 |

| Roo Code | 支持 |

| Continue | 支持 |

| Amazon Q | 支持 |

| Augment Code | 支持 |

| Aider | 支持 |

不管你用哪个 AI 编程工具，核心流程是一样的：打开项目 → 运行 `/clone-website <url>` → 等待克隆完成。

#### 3\. 精确到 CSS 计算值的组件规格

每个组件的规格文件不是简单的截图 + 描述，而是包含：

- 精确的 `getComputedStyle()` 数值（不是近似值）
- 各交互状态下的样式（default / hover / focus / active）
- 响应式断点和对应的布局变化
- 资源路径（图片、图标、字体）
- 文字内容（标题、正文、按钮文案）

这意味着 Builder Agent 拿到的不是"一个看起来像 header 的东西"，而是"header 的背景色是 `#1a1a2e` ，padding 是 `16px 24px` ，hover 时背景变 `#16213e` "——精确到可以直接写代码。

---

### 技术亮点

- **Git Worktree 并行构建，大幅缩短克隆时间。** 每个区块由独立的 Builder Agent 在独立的 Worktree 中工作，互不冲突，充分利用多 Agent 的并行能力。
- **设计令牌自动提取，不靠猜测。** 侦察阶段会通过浏览器 API 获取真实的 CSS 计算值，而不是让 AI "看图猜颜色"。
- **AGENTS.md 单一信源，一次编写全平台适配。** 所有平台的指令文件都由同一个源文件自动生成，修改一处即可同步到所有 Agent。
- **Next.js 16 + Tailwind CSS v4 现代技术栈。** 克隆产出的不是过时的代码，而是可以直接二次开发的现代前端项目。

---

### 适合人群

**前端开发者**

你想快速复刻一个参考设计作为项目起点，而不是从零手写每一个区块的样式。

**独立开发者和创业者**

你需要快速做出一个看起来专业的 Landing Page，但没有设计师配合，也不想花太多时间在样式调优上。

**AI 编程工具的深度用户**

你想验证 AI 编程助手在真实复杂任务中的能力上限，或者想学习如何设计多 Agent 协作的 pipeline。

**UI/UX 设计师转前端**

你熟悉设计但不熟悉代码，想让 AI 帮你把设计稿直接翻译成高质量的前端代码，同时理解组件化的思路。

注意：需要 Node.js 20+ 环境和至少一个 AI 编程工具（推荐 Claude Code Opus 4.6）。克隆过程会产生 API 调用费用，复杂页面可能消耗较多 token。

---

### 如何开始使用

1\. **克隆项目并安装依赖** ：

\`\`\`bash

git clone https://github.com/JCodesMore/ai-website-cloner-template.git my-clone

cd my-clone

npm install

\`\`\`

2\. **启动你的 AI 编程工具** （推荐 Claude Code）。

3\. **运行克隆命令** ：

\`\`\`

/clone-website <目标网站URL>

\`\`\`

4\. **等待完成** ，然后在 `src/` 中查看克隆结果。

5\. **可选：自定义修改** ——克隆后的项目是一个标准的 Next.js 项目，你可以自由修改和扩展。

建议使用路径：

| 你的情况 | 建议 |

|---------|------|

| 第一次用，想试试效果 | 先克隆一个简单的单页网站（如个人博客首页） |

| 已经熟悉流程，要复刻复杂站 | 优先使用 Claude Code Opus 4.6，效果最好 |

| 不想用 Claude Code | 打开 `AGENTS.md` 查看你所用工具的适配说明 |

| 想做二次开发 | 克隆完成后像普通 Next.js 项目一样 `npm run dev` 启动 |

---

### 项目特色

#### 一条命令启动

不需要配置复杂的参数或脚本，输入 URL 就能开始克隆，适合快速验证和迭代。

#### 多 Agent 并行构建

利用 Git Worktree 机制，让多个 Builder Agent 同时工作，页面有多少区块就启动多少个 Agent，互不阻塞。

#### 精确的设计令牌提取

不是"看起来像"，而是通过浏览器 API 获取真实的 CSS 计算值，确保克隆结果像素级还原。

#### 可直接二次开发

克隆产出的是标准 Next.js + Tailwind 项目，带完整的 TypeScript 类型定义和组件结构，可以直接在此基础上修改。

#### MIT 开源协议

完全免费，可商用，没有使用限制。

#### 全平台覆盖

13 个主流 AI 编程工具全部支持，不锁定在某个特定工具上。

---

### 声明

- 本项目完全开源免费，MIT 协议，可商用。
- 克隆他人网站时请遵守相关版权和知识产权法律法规，建议仅用于学习和个人项目参考。
- AI 编程工具会产生 API 调用费用，复杂页面克隆可能消耗较多 token，请根据自身情况评估。
- 项目依赖 Node.js 20+ 环境，克隆过程需要网络访问目标网站以下载资源。
- 克隆产出包含从目标网站下载的图片、视频等资源，使用时请注意这些资源本身的版权归属。

---

### 写在最后

"参考设计"这件事在前端圈存在了十几年，但一直是体力活。量间距、抄颜色、对布局——这些工作不涉及创意，却消耗大量时间。AI 编程助手的出现，让"把设计翻译成代码"这件事有了自动化的可能。

`ai-website-cloner-template` 的价值不只是帮你省几天时间，更重要的是它展示了一种工作范式： **把复杂的前端工程任务拆解成 AI 可以理解的 pipeline，让多个 Agent 并行协作，最终产出可以直接使用的代码。**

无论你是想快速出一个 Landing Page、学习别人页面的实现方式，还是纯粹想体验 AI 编程工具的上限，这个项目都值得你试一试。

**如果这个项目对你有帮助，别忘了给它一个 Star ⭐**

---

*推荐理由：把"仿站"从纯手工变成 AI 自动化流水线，适合需要快速复刻网页设计的前端开发者和独立开发者。*

作者提示: 个人观点，仅供参考

阅读原文

继续滑动看下一个

野草之外

向上滑动看下一个