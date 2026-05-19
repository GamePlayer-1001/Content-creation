---
title: "Anthropic 这次真正暴露出来的，不只是 Claude Code 代码，而是它未来一段时间的路线图"
source: "https://mp.weixin.qq.com/s/34Eee828PeN5qkEReffbVg"
author:
  - "[[coso huang]]"
published:
created: 2026-04-13
description: "以前想判断 Claude Code 下一步要做什么，外界通常只能等官方自己讲。"
tags:
  - "clippings"
---
原创 coso huang *2026年3月31日 20:27*

> 以前想判断 Claude Code 下一步要做什么，外界通常只能等官方自己讲。2026 年 3 月 31 日下午，社区里围绕 `cli.js.map` 的讨论突然集中起来，这才让一件更重要的事浮出水面：我们第一次可以顺着工程接线，而不是顺着发布文案，去读 Anthropic 接下来准备把 Claude Code 做成什么。

今天下午社区里最热闹的关键词当然是“源码”。

但如果只把这件事理解成一次普通的打包失误，反而会错过真正有意思的部分。

我更在意的是另一层变化：

**过去我们只能看 Anthropic 已经公开讲出来的故事，这次却第一次能沿着 source map 回到真实模块、真实命令和真实 feature gate，提前读它尚未完整对外讲出的方向。**

按照目前外界流传的复现方式：

```
npm pack @anthropic-ai/claude-code@2.1.88 --registry=https://registry.npmjs.org/
npm install
npm run build
node dist/cli.js --help
```

这次真正改变观察方式的，也不是“包能不能装上”，而是：

`cli.js.map` 让许多原本埋在打包产物里的逻辑，重新对应回了 `src/main.tsx` 、 `src/commands.ts` 、 `src/services/*` 、 `src/coordinator/*` 这类接近开发态的源码路径。

这和过去那种靠反编译碎片、运行时行为、字符串搜索去猜功能的方式完全不是一回事。

所以这次真正有价值的，不只是八卦，而是一次非常罕见的“路线图前瞻窗口”。

Anthropic 一直很喜欢先默默开发、先埋 feature gate、先把协议和状态机接好，跑一段时间后再统一对外公布。以前外界通常只能等它自己开口，这次却第一次可以顺着源码接线，提前窥见它准备往哪条方向发力。

## 一、这次最重要的变化，不是某个隐藏命令，而是分析方式变了

过去大家分析这类产品，往往有一个天然滞后：

- • 官方发了，外界才知道
- • 用户实测了，外界才知道边界
- • 博客写了，外界才知道产品定义

但这次不是。

这次我们第一次可以从代码层看到很多“尚未完全公开，但已经进入工程实现”的方向。

而且从这份代码树看，Anthropic 并不是在给 Claude Code 补几个小功能，而是在悄悄重写它的产品形态。

这里也要先加一个判断边界：

**这更像是一份从 npm 包和 source map 里还原出来的源码快照，不一定等于 Anthropic 内部完整仓库。**

也正因为如此，文中讨论的是“已经能从工程接线里确认的方向”，不是断言“这些能力今天都已经对所有用户公开可用”。

如果把结论先说在前面，我认为未来 6 到 12 个月，Claude Code 最值得关注的五条线是：

1. 1\. 从一次性 CLI 助手，转向持续在线的 assistant
2. 2\. 从单代理，转向 coordinator 调度多个 worker
3. 3\. 从本地终端工具，转向本地加 Web 的混合工作流
4. 4\. 从临时上下文，转向个人记忆和团队记忆系统
5. 5\. 从纯效率工具，转向带陪伴感和留存机制的产品层

也就是说，Anthropic 想做的已经不只是“一个会写代码的命令行”。

他们更像是在把 Claude Code 做成一个长期驻留的软件工程代理系统。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

## 二、KAIROS 暴露出的信号最强：Claude Code 正在从“对话工具”变成“持续助手”

这份源码里最值得盯住的 feature 之一，就是 `KAIROS` 。

从 `src/commands.ts` 可以直接看到， `KAIROS` 不只是一个零散实验开关，它同时牵出了几组能力：

- • `assistant`
- • `brief`
- • `proactive`
- • GitHub webhook 相关能力

而在 `src/main.tsx` 里， `assistant mode` 的注释写得已经非常直白了：当设置满足条件时，会强制 brief，初始化 assistant team，并把这个会话当成一种长生命周期运行形态，而不是一轮一轮的短会话。

更关键的是， `src/memdir/memdir.ts` 里有一句信息量非常大的描述：

**assistant sessions are effectively perpetual**

这句话背后其实是在改产品哲学。

过去我们理解 CLI agent，通常还是“开一个 session，干一件事，结束”。

但 Claude Code 在 `KAIROS` 这条线上显然不是这么想的。

它开始把 assistant 看成：

- • 长时间存在
- • 持续积累上下文
- • 会跨天记忆
- • 会把新记忆写入每日日志
- • 再由夜间流程做整理和蒸馏

这意味着什么？

意味着 Anthropic 正在把 Claude Code 从“回答当前问题”，推向“长期跟着你做事”。

这是未来一年我认为影响最大的一条线。

因为一旦 assistant 进入持续模式，产品竞争就不再只是：

- • 谁这次回答得更聪明

而会变成：

- • 谁能连续几天都保持上下文
- • 谁能更稳定地记住项目状态
- • 谁能在用户不重新解释背景的情况下继续推进工作

如果这条线走通，Claude Code 的定位会从 coding assistant 进一步升级成真正的 working companion。

## 三、COORDINATOR\_MODE 说明 Anthropic 的下一个战场，是多代理协作吞吐

第二条非常明确的线，是 `COORDINATOR_MODE` 。

`src/coordinator/coordinatorMode.ts` 已经不是“给 agent 加个并发按钮”这么简单，而是写出了一整套 coordinator system prompt，明确规定：

- • 主代理负责和用户对话
- • worker 负责 research、implementation、verification
- • 可以并行拉起多个 worker
- • coordinator 的职责是编排、汇总、继续派发

这说明 Anthropic 已经不再把“多代理”理解成一个炫技 demo，而是在把它做成复杂任务的标准求解方式。

这背后的产品判断非常重要：

**单代理模型再强，复杂工程任务的吞吐仍然有限。**

真正决定大型任务效率的，往往不是某一次推理有多强，而是：

- • 能不能拆任务
- • 能不能并行研究
- • 能不能把不同 worker 的结果合并起来
- • 能不能让一个主代理持续掌控全局状态

从这份代码看，Anthropic 已经非常明确地在往这个方向走。

所以未来一年，Claude Code 很可能会越来越像一个“工程调度器”，而不只是一个“终端里的聊天框”。

对于用户来说，这会直接带来两个影响。

第一，复杂任务的完成速度会明显上升。

第二，产品门槛也会抬高。

因为多代理真正难的地方不是“能 spawn 几个 agent”，而是：

- • 如何避免重复劳动
- • 如何避免 worker 相互覆盖
- • 如何处理共享上下文
- • 如何保证最终答案仍然是一个统一的、可信的输出

而 `COORDINATOR_MODE` 恰恰说明 Anthropic 已经开始从 prompt、工具权限、消息协议这些底层环节处理这个问题了。

## 四、ULTRAPLAN 和相关 teleport 基础设施，说明本地 CLI 正在和 Web 端合并成一个系统

如果说 `KAIROS` 代表持续助手， `COORDINATOR_MODE` 代表多代理协作，那么 `ULTRAPLAN` 暴露出来的，就是 Claude Code 正在从“本地工具”变成“本地加远程”的混合系统。

`src/commands/ultraplan.tsx` 里对这个功能的描述已经很清楚：

- • Claude Code on the web 起草高级计划
- • 用户可以在浏览器里编辑和批准
- • 之后可以继续在远端执行
- • 也可以 teleport 回本地终端

而 `src/utils/ultraplan/ccrSession.ts` 里甚至已经把执行目标写成了两类：

- • `local`
- • `remote`

这不是一个小功能。

它意味着 Anthropic 正在打通两个以前分开的世界：

- • 本地终端里的开发工作流
- • Web 端更适合长时任务、审批流、可视化状态的工作流

为什么这件事重要？

因为纯本地 CLI 的上限其实很明显：

- • 长任务不够可视化
- • 协作和审批不方便
- • 用户离开终端后任务就容易断开
- • 企业流程很难挂上去

而一旦本地和 Web 端打通，Claude Code 的能力边界会立刻扩大：

- • 规划可以在 Web 里做
- • 执行可以在远端持续跑
- • 最终结果可以 PR 化回流
- • 用户可以在本地和远端之间切换工作位置

这其实是在把 Claude Code 从一个工具，推向一个工作流平台。

值得注意的是，这份快照里的独立 `teleport` 命令本身还是 stub， `src/commands/teleport/index.js` 直接返回了禁用状态。

这说明现阶段更准确的判断不是“功能已经全面可用”，而是：

**相关基础设施和产品意图已经存在，但对外暴露的形态还在收口。**

换句话说，方向是真的，入口未必已经全部公开。

## 五、TEAMMEM 加 /dream，说明 Anthropic 想把记忆从个人助手推进到组织知识层

很多人第一次看这份代码，最容易低估的可能是记忆系统。

但我反而觉得， `TEAMMEM` 和 `/dream` 这条线很可能是未来一年最有组织价值、也最有争议的一条线。

`src/memdir/memdir.ts` 已经把 assistant 模式下的记忆机制写得很清楚：

- • 日常新记忆不是不断重写 `MEMORY.md`
- • 而是按日期追加到 daily log
- • 夜间再做 consolidate
- • 最后蒸馏成可供后续会话读取的索引

`src/services/autoDream/autoDream.ts` 则进一步说明，后台确实存在一个自动 consolidation 机制，会在时间门槛和会话数量门槛满足后触发。

而 `src/services/teamMemorySync/index.ts` 更关键。

这里已经不是个人记忆，而是团队记忆同步服务了。代码里直接写到：

- • team memory 按 repo 作用域共享
- • 面向 authenticated org members
- • 本地文件系统与服务端 API 双向同步

这件事一旦做起来，Claude Code 的意义就会变掉。

它不再只是“我和 AI 的一次会话”，而会慢慢变成：

- • 我们团队的决策可以被沉淀
- • 某个仓库的经验可以被共享
- • 项目上下文不必每个人都重新喂一次
- • 组织知识开始通过 agent 读写和再分发

这会非常强。

但它也天然带来新问题：

- • 权限边界怎么管
- • 错误记忆怎么传播
- • 哪些信息应该被长期记住
- • 团队共享记忆如何防止污染

所以未来一年，记忆系统大概率会成为 Anthropic 在企业化场景里最重要、也最需要治理的一层。

## 六、还有两个容易被社区放大的点：Undercover Mode 和 Buddy System

除了前面那几条主线，这次源码里还有两个特别容易在社区传播中被放大的点。

一个是 `Undercover Mode` 。

另一个是 `Buddy System` 。

这两个点都是真实存在的，但如果讲得不够准确，也很容易变成情绪化解读。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

### 1\. Undercover Mode 确实存在，但它首先是一个 ant-only 的内部安全分支

从 `src/utils/undercover.ts` 可以直接看到， `Undercover Mode` 不是社区脑补出来的。

里面不仅明确写了：

**Do not blow your cover.**

而且还把设计目的说得非常直接：

- • 面向 public/open-source repo 协作
- • 避免泄露内部模型代号、未公开版本号、内部仓库名和内部工具信息
- • 不让 commit message、PR title、PR body 出现这些痕迹

这里最关键的几个事实是：

- • 它是 `process.env.USER_TYPE === 'ant'` 分支下的逻辑，不是所有对外构建都天然带这个行为
- • 它的默认策略是 `auto` ，也就是除非仓库被明确识别为 allowlist 里的内部私有仓库，否则按安全默认值开启
- • 代码里明确写了 **there is NO force-OFF**

所以“默认开启且无法强制关闭”这个说法，准确版本应该是：

**在 Anthropic 内部的 ant build 里，它对外部仓库走的是安全默认开启，而且没有 force-off。**

更有意思的是，这不只是提示词层的一句警告。

`src/utils/attribution.ts` 里还直接把 attribution 清空了：

- • commit attribution 变成空
- • PR attribution 变成空

也就是说，像：

- • `Generated with Claude Code`
- • `Co-Authored-By`

这类常见 AI 痕迹，在 undercover 状态下是会被主动剥离的。

从公关视角看，这当然会引发争议。

但如果纯从产品和工程角度看，它更重要的意义是：

**Anthropic 对模型输出表面、身份痕迹和品牌暴露有非常强的系统级控制力。**

### 2\. Buddy System 也不是空壳，它确实是一套接了 UI 的电子宠物层

`Buddy` 这条线比很多人想象得更完整，不只是“代码里藏了几只小动物”。

从 `src/buddy/types.ts` 和 `src/buddy/companion.ts` 看，社区里流传的很多细节基本都能对上：

- • 18 种物种
- • 5 种稀有度，权重分别是 `60 / 25 / 10 / 4 / 1`
- • 5 个属性： `DEBUGGING` 、 `PATIENCE` 、 `CHAOS` 、 `WISDOM` 、 `SNARK`
- • 帽子配件包括 `crown` 、 `tophat` 、 `propeller` 、 `halo` 、 `wizard` 、 `beanie` 、 `tinyduck`
- • `shiny` 的概率是 `1%`

而且你提到的随机性实现也是真的。

这里用的是：

- • 用户 ID
- • 固定 salt
- • `Mulberry32` 伪随机数生成器

这意味着它并不是“每次刷新都随机抽一只”，而是：

**对同一个用户来说，它是确定性生成、稳定复现的。**

这很像游戏里“你的专属初始角色设定”，而不是一次性抽卡。

更有意思的是，物种列表里确实有 `capybara` ，而且源码注释还专门解释了为什么这个词要运行时拼出来：

它和某个模型代号探针冲突，所以开发者刻意避免把字面量直接打进 bundle。

这说明社区流传的那个“某个动物名和内部模型代号重名”的细节，不是空穴来风，代码里确实留了痕迹。

同时， `Buddy` 也不是只停留在底层类型定义。

从 `src/buddy/useBuddyNotification.tsx` 、 `src/buddy/CompanionSprite.tsx` 、 `src/screens/REPL.tsx` 能看到：

- • 有 `/buddy` teaser 通知
- • 有 companion sprite
- • 有气泡反应和 pet 动效
- • 有真实的 REPL 界面挂载

所以更准确的说法不是“隐藏彩蛋代码”，而是：

**它是一套已经接到交互层的 companion 系统，只是它不属于 Claude Code 的主能力战场。**

### 3\. 这两个点合起来，恰好补完了 Anthropic 的另一面

`Undercover Mode` 说明 Anthropic 很在意一件事：

- • 模型在外部世界如何呈现自己
- • 哪些痕迹绝对不能露
- • 品牌、代号、身份信息如何被系统性约束

`Buddy System` 则说明 Anthropic 也在意另一件事：

- • 用户和产品之间能不能建立更长的关系
- • 工具之外有没有陪伴感
- • 高频使用时，界面有没有轻人格化层

一个偏控制，一个偏留存。

一个偏外部输出治理，一个偏内部产品关系设计。

它们都不是 Claude Code 主能力的中心，但都很能说明 Anthropic 做产品时的手法。

## 七、BUDDY 不是主能力层，但它暴露了一个产品信号：Anthropic 也在思考留存

如果把 `Buddy` 单独拿出来看，它依然不构成 Claude Code 的主能力护城河。

真正拉开差距的，还是持续会话、多代理、远端工作流和记忆系统。

但 `Buddy` 这条线的价值，在于它让我们看到 Anthropic 并不只是在卷能力。

它也在认真经营下面这些东西：

**Anthropic 已经不满足于把 Claude Code 当成纯工具，他们也在想怎么增加使用习惯、情感锚点和长期留存。**

这意味着未来 Claude Code 可能会同时存在两层演化：

- • 底层越来越工程化、自动化、组织化
- • 表层越来越拟人化、陪伴化、可持续使用

从增长视角看，这很合理。

因为只靠“我比别人多一个功能”，未必足够建立长期使用频率。

而一旦产品开始持续在线、记住你、陪着你、替你调度任务，那它和用户的关系就不再是“偶尔调用一次的工具关系”了。

## 八、真正该关注的不是“有没有隐藏功能”，而是 Anthropic 正在重写 Claude Code 的物种形态

如果只把这次事件理解成“npm 包里露出几个隐藏命令”，其实会看轻很多更大的东西。

从这份代码里我看到的更像是五条合流中的主线：

- • `KAIROS` 把 Claude Code 推向持续在线 assistant
- • `COORDINATOR_MODE` 把它推向多代理工程编排
- • `ULTRAPLAN` 把它推向本地与 Web 混合工作流
- • `TEAMMEM` 和 `/dream` 把它推向组织知识系统
- • `BUDDY` 把它推向更强的长期留存关系

这些线合起来，Claude Code 的未来就不再像一个单点产品，而更像一个分层系统：

- • 底层是工具和协议
- • 中层是记忆、任务、代理编排
- • 上层是本地端、Web 端、团队协作和用户关系
- ![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

所以如果你问我，从这次源码窗口里最应该看到什么。

我的答案不是：

“Anthropic 藏了多少命令。”

而是：

**Anthropic 正在把 Claude Code 从一个强大的 CLI 助手，升级成一个长期在线的软件工程代理平台。**

## 九、以前要等发布，现在可以先读代码了

这次对行业观察者、开发者、产品经理都很有意思的一点是：

以后我们未必需要总等到官方把故事讲完，才知道他们准备去哪里。

很多时候，真正的路线图不在发布会里，而在这些地方：

- • feature gate
- • 命令接线
- • 状态机
- • 同步服务
- • 权限模型
- • 本地与远端的桥接代码

过去我们总把“读代码”理解成工程师的内部工作。

但从这次开始，读代码也重新变成了一种产品研究方法。

你不一定能立刻用上这些功能。

但你已经可以更早地知道：

- • 哪条线只是想法
- • 哪条线已经进入工程实现
- • 哪条线距离公开发布只差最后一层 gate

这也是我觉得这次事件真正有意思的地方。

它不只是让大家围观了一次源码窗口。

更像是提前把 Anthropic 接下来一年的一部分方向，直接写在了我们面前。

## 十、最后一句判断

如果未来一年只能押一个变化，我会押 `KAIROS` 。

如果只能押第二个变化，我会押 `COORDINATOR_MODE` 。

如果从商业价值看第三个最值得盯的，我会押 `ULTRAPLAN + TEAMMEM` 。

因为真正能把 Claude Code 和普通 AI 编程工具拉开差距的，不会只是“回答得更聪明”。

而是它能不能做到下面这件事：

**持续记住你，持续替你拆事，持续跨端运行，持续把个人效率变成团队效率。**

一旦这几条线都做实，Claude Code 就不再只是一个命令。

它会更像一个常驻的软件工程协作者。

欢迎讨论

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

**微信扫一扫赞赏作者**

继续滑动看下一个

星尘洞见

向上滑动看下一个