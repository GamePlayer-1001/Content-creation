---
title: "我开发了一个「吃掉」别人Skill来升级的饕餮.Skill，现在免费开源"
source: "https://mp.weixin.qq.com/s/bpWmjAbGqC7jA0o0hH9qNA?scene=1&click_id=6"
author:
  - "[[饼干哥哥]]"
published:
created: 2026-04-07
description: "从「写 Skill」到「养 Skill」"
tags:
  - "clippings"
---
原创 饼干哥哥 *2026年4月7日 08:14*

我让一个 Skill 吃掉了另一个 Skill，10 分钟后，它多了 4 个新能力。

不是手动复制粘贴，不是人肉对比两个 SKILL.md 然后一行行合并。是 AI 自己分析两个 Skill 的差异，提取优势模式，然后用目标 Skill 自己的技术栈重新实现。

这个干活的 Skill，我叫它「饕餮.skill」。今天免费开源，地址在文末。

![图片](https://mmbiz.qpic.cn/mmbiz_png/UQ9fsOliarQ9HGsu9ncbbEick7DTSUW2XzTXOO07kKmIZIXVubVU0QB1ezVxojEItuxnGkslZomztBgvvbTXicSTc29k8VRh2NFib1ayNnQ1jGw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

但这篇不是使用说明。我想讲的是：做饕餮.skill的过程中，我对「Skill 应该怎么写」这件事的认知被彻底改变了。以及，我从 Voyager、TextGrad、DSPy 这些项目里偷了哪些设计思路。

01

skills.sh 上有 9 万次安装了，但大多数 Skill 停在 v1

先聊点背景。

现在 Skill 生态已经爆了。skills.sh 上线到现在，累计安装量超过 9 万次，光 Vercel 官方那个 find-skills 就快 80 万了。微软一口气推了十几个 Azure Skill，Supabase、Expo、shadcn 都在发。

同事.skill 上周开源，5 天 8000 star，然后前任.skill、yourself-skill 全来了，一整个蒸馏宇宙。

Skill 已经从「少数人的极客玩具」变成了「AI 开发者的标准装备」。

但你有没有注意到一个问题：大部分 Skill，发布之后就没有然后了。

v1.0 发出来，收一波 star，readme 写得很漂亮。然后呢？用了一个月发现某个场景处理不了，想改，懒得动。看到别人的 Skill 某个功能做得比自己好，想整合，不知道怎么下手。

Skill 生态的真正瓶颈不是「怎么写一个 Skill」，而是「怎么让一个 Skill 持续进化」。

![Skill 生态爆发](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

Skill 生态爆发

02

Skill 不是写出来的，是养出来的

先说一个我踩了很久才想明白的事。

大多数人写 Skill 的思路是「从零到完美」——花三天写一个 SKILL.md，把所有场景都想到，所有边界条件都处理好，然后发布。这个思路有个致命问题：你不可能预见所有场景。

我的 research skill 就是典型例子。v1 版本花了两天写，覆盖了 Reddit、X、YouTube 等十几个平台。看起来挺完整。但上线用了一个月才发现，小红书抓取是残废的——轮播图只能拿第一页，评论数据丢了一半。

这不是 v1 写得烂。是某些需求只有在真实使用中才会浮现。

后来我在 skills.sh 上看到一个小红书专用的 summarizer skill，图文轮播穿透做得很漂亮。我想把这个能力整合到自己的 research skill 里。

手动做的过程极其痛苦。这个 Skill 用 playwright，我的底层是 Chrome CDP，技术栈完全不同。我得先读懂它为什么用 playwright 的某个 API，想清楚怎么用 CDP 达到同样效果，找到我的 SKILL.md 里该插入的位置，检查有没有指令冲突，然后测试。

做完的时候天都黑了。

效果确实好。但这个过程让我意识到一件事：Skill 的真正成长路径不是「一次写完」，而是「 **持续吞噬外部的优势并进化** 」。

03

为什么合并 Skill 不是复制粘贴

你可能觉得合并两个 Skill 就是把好的部分搬过去。我一开始也这么想。然后现实教做人了。

实际操作中，80% 的时间花在三件事上。

**第一个坑是技术栈适配。** 两个 Skill 大概率用不同的底层实现——一个 playwright 一个 CDP，一个 Python 一个 TypeScript。你不能直接搬代码，你得搞懂对方某个操作到底想干什么，然后用自己的技术栈重新实现。说白了就是语义级别的翻译。

**第二个坑更隐蔽：上下文依赖。** 一个 Skill 里的某个策略之所以有效，往往依赖它上下文中的其他指令。你把它单独拎出来塞到另一个 Skill，可能完全失效，甚至跟已有指令打架。

我碰过一个案例：参考 Skill 有一条「每次抓取后等待 3 秒再进行下一步」的规则。我直接搬过去，结果我的 research skill 在并发模式下变得奇慢无比——因为我的 Skill 本身已经有流控机制，两层等待叠加了。这种 bug 你不跑到真实场景里根本发现不了。

**第三个坑，也是最关键的：你要搬的不是代码，是模式。** 真正有价值的是参考 Skill 背后的设计思路——它的设计假设是什么？这个思路能不能用我的方式重新实现？

每次手动合并一个 Skill 都是大半天起步。

![合并 Skill 的痛点](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

合并 Skill 的痛点

04

饕餮.skill的设计哲学: 三个核心思路

做饕餮.skill之前，我系统看了三个做「AI 自我进化」的项目：Voyager（Wang et al., 斯坦福+英伟达 2023）、TextGrad（Yuksekgonul et al., 2024）、DSPy（Khattab et al., 斯坦福 2023）。从它们的成功和失败里，提炼出了三条铁律。

**铁律一：合并只发生在策略层，不碰实现层**

Voyager 早期的教训——把所有学到的技能不加区分地塞进库里，结果技能之间互相干扰。问题不在于技能太多，而在于它没有区分「你想做什么」和「你怎么做」。

饕餮.skill的做法是：吞入两个 Skill 之后，先提取参考 Skill 的策略意图——它在做什么、为什么这么做、设计假设是什么。然后用目标 Skill 已有的技术栈去重新实现这些策略。代码层面的东西不搬，只搬思路。

**铁律二：一次只改一个维度**

这条来自 TextGrad 和 DSPy。你一次改了 5 个地方结果变差了，你根本不知道哪个改动搞砸了。DSPy 的 MIPROv2 优化器每一步只调一个模块的 Prompt，TextGrad 每次反向传播也是逐变量更新。

饕餮.skill的注入策略也是渐进式的。它会把分析出的多个优势模式排优先级，逐个注入。每注入一个模式，输出一份 diff 报告，你可以接受或回滚。

这不是技术洁癖，是血泪教训。我早期测试的时候一次性注入了 4 个模式，结果有两个指令互相矛盾，debug 了半天。

**铁律三：每次注入前必须备份**

机器学习领域有个词叫灾难性遗忘——模型学新东西的时候忘掉旧知识。Skill 也一样。

我有一次给 writer skill 注入了一套新的结尾策略，当时测了三篇没问题。过了一周发现：原来的 CTA 模板失效了，因为新的结尾逻辑跟原有的 CTA 指令冲突，新的覆盖了旧的。找到问题的时候已经用这个「残废版」写了好几篇稿子了。

饕餮.skill在每次注入前自动创建.bak 备份。改坏了，一行命令恢复。

![三条铁律](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

三条铁律

05

内部怎么运转的：吞入 对齐 提取 注入

饕餮.skill跑起来分四个阶段。

**第一步，双向吞入。** 同时读取目标 Skill 和参考 Skill 的完整结构——SKILL.md、scripts 目录、references 目录、所有 supporting files。不是只看表面的说明文档，是把整个 Skill 目录结构全部读一遍。

**第二步，能力对齐。** 把两个 Skill 的能力拆成模块，一一对应。哪些能力我有它没有，哪些它有我没有，哪些我们都有但它做得更好。输出一张能力对比表。

**第三步，优势模式提取。** 这是最关键的一步。对于参考 Skill 做得更好的每个模块，饕餮.skill不是搬它的代码，而是提取它的「优势模式」——它用了什么策略？为什么这个策略在这个场景下有效？它的设计假设是什么？

**第四步，渐进注入。** 把提取出的模式按优先级排序，逐个注入到目标 Skill。每注入一个模式，生成一份 diff 报告，包含：注入位置、改动内容、设计理由、潜在风险。你可以逐条审批。

![四阶段流程](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

四阶段流程

06

实战效果：research skill 吃完后长什么样

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

光说不练假把式。看看我的 bggg-creator-research skill 吃掉小红书 summarizer skill 之后具体变了什么。

吃之前：还抓不到小红书。

吃之后：实现完整的小红书深度抓取章节——轮播图穿透指令、CDP 提取代码模板、评论过滤规则、多模态分析流程。原有的 Reddit、X、YouTube 等模块完全不受影响。

中间发生了什么？

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

饕餮.skill分析后发现参考 Skill 有 4 个核心优势：图文轮播穿透（模拟真实滑动翻页）、多模态内容提取（图片 OCR + 视频帧采样）、主题式综合（不按帖子罗列而是按主题重组信息）、评论垃圾过滤（过滤营销号和机器人评论）。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

关键是技术栈适配。参考 Skill 依赖 playwright-cli，我的 research skill 底层是 Chrome CDP。饕餮.skill没有引入 playwright，而是用现有 CDP 能力重新实现——用 /clickAt（真实鼠标事件模拟）替代 playwright 的点击逻辑，用 CDP 的 Tab 键导航替代选择器定位。零新增依赖，策略完整迁移。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

SKILL.md 从 v1.0 升到 v1.1。整个过程 10 分钟。上次手动做花了大半天。

![Before/After 对比](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

Before/After 对比

我后来又用饕餮.skill强化了 writer skill（吃了某个垂直业务下博主的写作风格体系，补了段落节奏控制）和 illustrator skill（吃了 baoyu-cover-image 的五维度 prompt 设计，补了配色方案和构图规则）。

07

做不到的事

诚实讲，两个场景饕餮.skill处理不好。

第一，两个 Skill 的编程语言差异太大（一个 Python 一个 TypeScript），饕餮.skill只能提取策略层面的建议，没法自动改写代码。SKILL.md 里的指令它能改，但 scripts 目录下的代码得你自己动手。

第二，参考 Skill 写得太烂——没结构、没注释、逻辑混乱——饕餮.skill的分析质量也会跟着下降。垃圾进，垃圾出。一个没有清晰结构的 SKILL.md，你让 AI 来分析也分析不出什么有价值的模式。

第三，饕餮.skill做不了跨架构的根本性重构。如果两个 Skill 的底层设计思路完全相反——一个是串行流水线，一个是并行 Agent 网络——饕餮.skill只能在局部模块层面做优化，没法帮你做架构级的决策。这种情况还是得自己判断。

08

开源地址

GitHub 地址：https://github.com/binggandata/bggg-skill-taotie

安装方式：把饕餮.skill Skill 放到.claude/skills/ 或.agents/skills/ 目录下就行了。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

使用方式，在 Claude Code 里说：

把 \[参考skill\] 喂给 \[目标skill\] 来优化 \[某个能力\]

不指定方向也行，饕餮.skill会自己跑一遍全面对比，告诉你参考 Skill 有几个值得学习的优势模式，你选择要不要注入。

09

从「写 Skill」到「养 Skill」

做完饕餮.skill之后，我对 Skill 开发的整个思路变了。

以前追求「从零写一个完美的 Skill」。现在不这么想了——先快速写一个 60 分的版本，然后持续找好的参考 Skill 喂给饕餮.skill去进化。每次进化保留版本记录，能看到 v1 到 v5 之间每个版本吃了什么、补了什么。

你不需要一开始就想清楚所有事情。你只需要建立一个能持续进化的机制。

现在 skills.sh 上有几百个 Skill。大部分人把它当下载市场用——找一个能用的装上，不好用就换下一个。但换一个思路：这几百个 Skill 不是成品，是原材料。你自己的 Skill 才是成品。别人的 Skill 里有你需要的零件，用饕餮.skill把零件拆出来装到你自己的 Skill 上。

你的时间不应该花在手动拆解别人的代码上，而是花在判断「该喂什么」上。选择吃什么，比怎么吃更重要。

觉得有用的，GitHub 给个 star。在评论区告诉我：你现在用的 Skill 最缺什么能力？你想让它「吃掉」谁？选几个好的场景我做成案例分享出来。

**微信扫一扫赞赏作者**

继续滑动看下一个

饼干哥哥AGI

向上滑动看下一个