# AI 写作模式识别与改写手册 (Tropes)

> 消费方: 优化去AI.md / 洗稿.md / 各平台Skill(润色阶段) / 母稿.md(composition类)
> 来源: tropes.fyi 34条模式 + 中文本地化 + creator.yaml anti_detection
> [PROTOCOL]: 变更时更新此头部，然后检查 config/CLAUDE.md

---

## 使用说明

### 扫描流程

1. **全量扫描**: 优化去AI / 洗稿 → 扫描全部6类34条
2. **精简扫描**: 平台Skill → 按 `config/platforms.yaml` 的 `trope_emphasis` 字段扫描指定类别
3. **创作阶段**: 母稿 → 仅扫描 composition 类（7条）

### 每条 Trope 结构

- **模式描述**: 这个模式长什么样
- **根因分析**: 为什么 AI 会这样写（训练数据偏差 / RLHF 强化 / 解码策略）
- **识别模式**: 中文 + 英文的具体匹配模式
- **改写策略**: 怎么改才自然
- **示例**: Bad → Good 的中英对照
- **严重度**: critical / high / medium / low
- **上限**: 每篇文章允许出现的最大次数

### 严重度说明

| 级别 | 含义 | 处理 |
|------|------|------|
| critical | AI指纹级特征，检测器重点抓 | 必须消除，0容忍 |
| high | 高频AI模式，3次以上即暴露 | 最多保留1次 |
| medium | 偶尔使用可接受 | 控制频率 |
| low | 轻微AI倾向 | 注意即可 |

---

## 一、词汇选择类 Word Choice（4条）

### 1. AI高频词 / AI Vocabulary Crutches
**类别**: word_choice | **严重度**: critical | **上限**: 0次/篇

**模式描述**:
反复使用AI偏好的"高级"词汇。这些词在训练数据中被标注为"好的写作"，但真人几乎不用。

**根因分析**:
RLHF训练时，标注者倾向给使用"高级词汇"的输出更高评分。模型学会了用这些词来获得奖励，而非因为它们适合语境。

**识别模式**:
- 中文: 绽放、涅槃、启迪、沉淀、升华、洗礼、蜕变、觉醒、顿悟、赋能、共振、深邃、璀璨
- 英文: delve, utilize, leverage, robust, streamline, harness, comprehensive, innovative, arguably, notably, furthermore, moreover

**改写策略**:
用最简单的日常词替代。如果删掉这个词句子仍然成立，直接删。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 这次经历让我获得了一次精神洗礼 | Let's delve into this comprehensive framework |
| Good | 这次经历把我整明白了 | Let's look at this framework |

---

### 2. 过度修饰 / Adverb Stuffing
**类别**: word_choice | **严重度**: high | **上限**: 1次/篇

**模式描述**:
堆砌副词和形容词来填充句子，让表达显得"丰富"但实际空洞。

**根因分析**:
模型倾向生成更长的输出（更长=更好的隐含偏见），副词是最低成本的填充方式。

**识别模式**:
- 中文: 深深地、静静地、温柔地、轻轻地、默默地、缓缓地、悄悄地、慢慢地、渐渐地、真正地、完全地
- 英文: truly, really, incredibly, absolutely, fundamentally, essentially, literally, significantly, dramatically, profoundly

**改写策略**:
删除副词，用具体动作描写替代。"她轻轻地走过来" → "她踮着脚过来的"。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 他深深地意识到这个问题的真正重要性 | This is truly a fundamentally important shift |
| Good | 他当场愣住了——问题比想的大 | This shift matters more than most people realize |

---

### 3. 假权威引用 / Vague Authority Appeals
**类别**: word_choice | **严重度**: high | **上限**: 0次/篇

**模式描述**:
引用不存在或模糊的权威来源，用"研究表明""专家认为"来伪造可信度。

**根因分析**:
训练数据中科普/新闻文章大量使用此模式。模型复制了形式但无法提供真实来源。

**识别模式**:
- 中文: 研究表明、专家认为、据调查显示、有人认为、据说、数据显示（无具体来源）
- 英文: "Studies show...", "Research suggests...", "Experts argue...", "According to research...", "It has been observed that..."

**改写策略**:
要么引用具体来源（论文/人名/机构），要么删掉权威外壳直接表态。说不出来源就别装。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 研究表明，90%的人都有这个问题 | Studies show that most developers prefer this approach |
| Good | 我团队5个人，4个都踩过这个坑 | In my team of five, four hit this exact problem |

---

### 4. 万能连接词 / Filler Transitions
**类别**: word_choice | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
用"此外""另外""同时"等连接词机械串联段落，缺乏真正的逻辑过渡。

**根因分析**:
Transformer的注意力机制在段落边界需要过渡标记来维持连贯性。模型过度依赖这些"胶水词"。

**识别模式**:
- 中文: 此外、另外、同时、与此同时、不仅如此、值得一提的是、除此之外
- 英文: Additionally, Furthermore, Moreover, In addition, It's worth noting that, What's more

**改写策略**:
删除连接词，让段落自然衔接。如果删了读不通，说明两段之间本来就没有真正的逻辑关系——要么合并要么砍掉一段。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 此外，我们还需要考虑另一个问题 | Additionally, we should also consider the performance implications |
| Good | 还有个事——性能也会出问题 | Performance takes a hit too |

---

## 二、句式结构类 Sentence Structure（9条）

### 5. 否定式假深刻 / Negative Parallelism
**类别**: sentence_structure | **严重度**: high | **上限**: 1次/篇

**模式描述**:
用"不是X——而是Y"制造虚假深刻感。单篇一次是修辞技巧，三次以上是AI指纹。

**根因分析**:
训练数据中对比修辞被标注为高质量写作，RLHF强化了"surprise reframe"偏好。模型发现这个句式能稳定获得高分。

**识别模式**:
- 中文: "不是X，而是Y" / "不是X——是Y" / "并非X，实则Y" / "与其说X，不如说Y"
- 英文: "It's not X — it's Y" / "not because X, but because Y" / "less about X, more about Y"

**改写策略**:
去掉否定框架，直接陈述核心观点。如需对比，用叙事过渡代替工整对仗。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 这不是偷懒——是效率革命 | It's not about working harder — it's about working smarter |
| Good | 说白了就是图省事，但省得聪明 | Working smarter sounds nice. Here's what it actually looks like |

---

### 6. 三段式排比 / Tricolon Lists
**类别**: sentence_structure | **严重度**: high | **上限**: 1次/篇

**模式描述**:
三个并列短语组成工整排比。"更快、更强、更好"式结构。

**根因分析**:
修辞学中"三"的力量被过度训练。模型对三元组有强烈偏好，几乎任何主题都会生成三段式。

**识别模式**:
- 中文: "A、B、C" / "不仅A，还B，更C" / "从A到B再到C" / 三个结构相同的短句
- 英文: "X, Y, and Z" pattern / "It's about X. It's about Y. It's about Z."

**改写策略**:
打破三元结构：只保留最强的一个展开说，或者用2个、4个打破"三"的节奏感。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 这让我们更高效、更专注、更有创造力 | It makes us faster, smarter, and more creative |
| Good | 效率是真的上去了。至于创造力嘛…看你怎么定义 | Speed improved. Creativity? Depends how you measure it |

---

### 7. 设问自答 / Rhetorical Question-Answer
**类别**: sentence_structure | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
提出一个问题然后立即自己回答，制造虚假的对话感。

**根因分析**:
对话式训练数据（Q&A、教程）中这个模式极其常见。模型将其泛化到所有场景。

**识别模式**:
- 中文: "那么问题来了，XXX？答案是..." / "你可能会问...其实..." / "这意味着什么？意味着..."
- 英文: "So what does this mean? It means..." / "But why? Because..." / "The question is... And the answer is..."

**改写策略**:
保留问题但不要立即回答——让读者自己想一秒。或者直接陈述观点，不装对话。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 那这意味着什么？这意味着我们需要重新思考整个方法 | So what does this mean? It means we need to rethink our entire approach |
| Good | 整个方法可能都得推翻。我知道这听起来很激进 | The whole approach might need to go. I know that sounds extreme |

---

### 8. 冒号式定义 / Colon Definitions
**类别**: sentence_structure | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
用冒号引出定义或解释，"X: 就是Y"的教科书式表达。

**根因分析**:
训练数据中教程、词典、技术文档大量使用此格式。模型在需要解释概念时默认采用。

**识别模式**:
- 中文: "XX：就是指..." / "核心在于：..." / "关键点：..."
- 英文: "Here's the thing:" / "The key insight:" / "The takeaway:" / "Translation:"

**改写策略**:
把定义融入叙事，不要像在写词典。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 关键洞察：市场正在发生根本性转变 | The key insight: the market is fundamentally shifting |
| Good | 市场变了。不是微调，是换赛道 | The market didn't adjust. It jumped tracks |

---

### 9. 条件句公式 / If-Then Formulas
**类别**: sentence_structure | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
"如果你...那么你就..."的标准条件句反复出现。

**根因分析**:
建议/教程类训练数据中条件句是主力句式。模型将其作为给建议的默认模板。

**识别模式**:
- 中文: "如果你想X，那么你需要Y" / "只要你X，就能Y" / "当你X的时候，Y就会..."
- 英文: "If you want X, you need Y" / "If you're looking to..." / "When you X, you'll find that Y"

**改写策略**:
直接说该做什么，不用假设铺垫。或用自己的经历替代泛化建议。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 如果你想提高效率，那么你需要学会这三个方法 | If you want to improve your workflow, you need to start with these three steps |
| Good | 我去年效率翻倍靠的就是一件事 | One change doubled my output last year |

---

### 10. 时间递进 / Temporal Progression
**类别**: sentence_structure | **严重度**: medium | **上限**: 1次/篇

**模式描述**:
用"过去...现在...未来..."的时间线组织全文结构。

**根因分析**:
时间线是最安全的叙事结构——不需要观点就能填满篇幅。模型在不确定怎么组织内容时默认使用。

**识别模式**:
- 中文: "过去我们...如今...未来将..." / "从前...现在...以后..."
- 英文: "In the past... Today... In the future..." / "X years ago... Now... Going forward..."

**改写策略**:
打破线性时间——倒叙、插叙、或直接从"现在"切入不回顾过去。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 过去我们用手动方式，现在有了AI，未来将完全自动化 | In the past, we did X manually. Today, we have AI. In the future, everything will be automated |
| Good | 上个月还在手动搞，这个月AI全干了。下个月？不敢想 | Last month: manual. This month: AI does it. Next month? I'm scared to think about it |

---

### 11. 虚假因果 / False Causality
**类别**: sentence_structure | **严重度**: high | **上限**: 1次/篇

**模式描述**:
用"因此""所以""这导致了"等词制造不存在的因果关系。

**根因分析**:
模型倾向生成逻辑连贯的文本。当两个事实之间没有真正因果关系时，模型会插入因果词来"缝合"。

**识别模式**:
- 中文: "因此...""所以...""这直接导致了...""正因为如此..."（前后实际无因果）
- 英文: "This means that..." / "As a result..." / "Therefore..." / "This leads to..."（without real causation）

**改写策略**:
如果因果关系不确定，用"我猜""可能""巧的是"替代因果词。或者干脆分开说，不强行关联。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | AI的兴起导致了人们对创造力的重新定义 | The rise of AI has fundamentally redefined our understanding of creativity |
| Good | AI火了之后，大家开始吵"什么算创造力"这个问题 | After AI blew up, everyone started arguing about what "creativity" even means |

---

### 12. 升华式递进 / Escalating Stakes
**类别**: sentence_structure | **严重度**: high | **上限**: 1次/篇

**模式描述**:
从小到大、从个人到全人类的刻意升华。"这不只是XX——这关乎整个YY的未来"。

**根因分析**:
RLHF训练中，标注者倾向给"有大局观"的回答更高分。模型学会了在结尾人为拔高。

**识别模式**:
- 中文: "这不仅仅是...更是..." / "这关乎...的未来" / "这将改变..." / "意义远不止于此"
- 英文: "This isn't just about X — it's about Y" / "The implications go far beyond..." / "This will fundamentally change..."

**改写策略**:
保持你讨论的层级。如果你在聊一个工具，就说工具的事，别扯到人类文明。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 这不仅是一次技术革命，更是人类认知的一次升维 | This isn't just a technological shift — it's a fundamental reimagining of human potential |
| Good | 这工具确实好用，但也就是个工具 | Great tool. Still just a tool |

---

### 13. 列表式陈述 / List Dependency
**类别**: sentence_structure | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
默认用编号列表或要点来组织所有内容，即使内容更适合叙事。

**根因分析**:
列表格式在指令微调数据中占比极高（ChatGPT式回答几乎全是列表）。模型将列表视为"有条理"的默认输出。

**识别模式**:
- 中文: "1. ... 2. ... 3. ..." / "首先...其次...最后..." / 整篇全是要点
- 英文: Numbered lists / bullet points / "Here are X things..." / "First... Second... Third..."

**改写策略**:
把列表改成自然段落叙事。如果必须列举，打乱数量（不要3个也不要5个），用不等长条目。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 这里有三个关键点：1. 效率 2. 成本 3. 质量 | Here are 3 key takeaways: 1. Speed 2. Cost 3. Quality |
| Good | 效率上去了，成本也控住了。质量嘛——这才是真正值得聊的 | Speed's up, costs are down. Quality though — that's where it gets interesting |

---

## 三、段落结构类 Paragraph Structure（2条）

### 14. 主题句公式 / Topic Sentence Formula
**类别**: paragraph_structure | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
每段第一句都是该段的总结/主题句，像论文一样工整。

**根因分析**:
学术写作和SAT作文训练数据中这是标准格式。模型将论文写法泛化到所有文体。

**识别模式**:
- 中文: 每段首句都能独立概括全段内容，删掉后面的句子仍成立
- 英文: 每段开头句与该段其余内容形成 topic sentence → supporting detail 结构

**改写策略**:
偶尔让段落从细节或故事开始，最后才揭示要点。或者不总结，让读者自己归纳。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | AI正在改变内容创作领域。目前已有超过60%的... | AI is transforming content creation. Over 60% of companies now... |
| Good | 上个月帮朋友写公众号，写完他问我"你是不是用AI了" | My friend asked if I used AI for his article last month |

---

### 15. 等长段落 / Uniform Paragraph Length
**类别**: paragraph_structure | **严重度**: medium | **上限**: 0次/篇（指全文段落等长的情况）

**模式描述**:
所有段落长度高度一致（都是3-4句），缺乏节奏变化。

**根因分析**:
模型在生成时倾向"匀速输出"——每段分配差不多的token数。这产生了机械的均匀感。

**识别模式**:
- 中文: 段落字数标准差极小，无明显长短交替
- 英文: 所有段落在3-5句之间，无1句段落也无7+句段落

**改写策略**:
刻意制造长短交替。插入1句独立段落（情绪爆发点），允许6-8句长段落存在。Burstiness节奏：短-长-短-中-超短。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | [4句段落][4句段落][4句段落][4句段落] | [3-sentence para][3-sentence para][3-sentence para] |
| Good | [1句] 一句话独立成段。[6句长段落展开论述] [2句过渡] [1句] 收尾金句。 | [1 sentence punch] [5-sentence development] [2-sentence bridge] [1 sentence closer] |

---

## 四、语气腔调类 Tone（9条）

### 16. 假谦虚 / False Humility
**类别**: tone | **严重度**: high | **上限**: 1次/篇

**模式描述**:
"我只是个普通人，但我发现了这个惊天洞察"式的虚假谦虚。

**根因分析**:
RLHF训练强化了"谦逊但有见地"的模式——这被标注者评为"讨喜"。结果是每次都谦虚一下再说话。

**识别模式**:
- 中文: "我也不是专家，但..." / "可能我说得不对..." / "纯属个人看法..." + 后接非常确定的结论
- 英文: "I'm no expert, but..." / "I might be wrong, but..." / "This is just my opinion, but..." + followed by a bold claim

**改写策略**:
不确定就说不确定，确定就直说。别先谦虚再输出。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 我也不是什么专家，但我觉得这个行业正在发生根本性变化 | I'm no expert, but I believe we're witnessing a fundamental shift in the industry |
| Good | 这行业在变，变得挺猛的 | The industry's changing. Fast |

---

### 17. 假对话感 / Manufactured Intimacy
**类别**: tone | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
用"让我们""我们一起"制造虚假的读者亲密感。

**根因分析**:
对话式训练数据强化了模型对"we"和"包容性"语言的偏好。模型认为用"我们"比"你"更安全。

**识别模式**:
- 中文: "让我们一起来看看..." / "我们都知道..." / "我们不得不承认..."
- 英文: "Let's dive in..." / "Let's explore..." / "As we can see..." / "We all know that..."

**改写策略**:
用"我"替代"我们"。说自己的经历，不要代表所有人。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 让我们一起来探索这个话题 | Let's dive into this fascinating topic together |
| Good | 我来说说我踩过的坑 | Here's where I got burned |

---

### 18. 过度热情 / Hyperbolic Enthusiasm
**类别**: tone | **严重度**: high | **上限**: 1次/篇

**模式描述**:
对所有事物都表现出极度兴奋，每件事都是"amazing""incredible""革命性的"。

**根因分析**:
正面情绪在RLHF中获得更高奖励。模型学会了"夸就完了"——积极永远比中立安全。

**识别模式**:
- 中文: "太厉害了""简直是革命性的""令人难以置信""颠覆性的""惊人的""绝绝子"（非刻意网络语境）
- 英文: "incredible", "amazing", "game-changing", "revolutionary", "mind-blowing", "fascinating"

**改写策略**:
降低温度。好用就说好用，不用说改变世界。具体说好在哪里，不要用形容词堆砌。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 这个工具简直是革命性的！它完全颠覆了我的工作方式！ | This tool is absolutely game-changing! It's completely revolutionized my workflow! |
| Good | 这工具省了我每天两小时，真的 | This tool saves me two hours a day. Not exaggerating |

---

### 19. 中立骑墙 / Fence-Sitting
**类别**: tone | **严重度**: high | **上限**: 1次/篇

**模式描述**:
对每个议题都给出"两面都有道理"的中立立场，不敢表态。

**根因分析**:
安全训练让模型回避争议性立场。"两面都说"是最安全的策略——不会被投诉。

**识别模式**:
- 中文: "一方面...另一方面..." / "固然...但也..." / "这是个复杂的问题" / "需要辩证看待"
- 英文: "On one hand... on the other hand..." / "It's a nuanced issue" / "There are valid points on both sides"

**改写策略**:
选一边站。不一定要极端，但要有立场。给出你的判断，允许读者不同意。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 关于AI是否会取代程序员，双方都有道理 | There are valid arguments on both sides of the AI debate |
| Good | AI不会取代程序员。但会让不用AI的程序员失业 | AI won't replace programmers. It'll replace programmers who don't use it |

---

### 20. 教师口吻 / Pedagogical Tone
**类别**: tone | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
居高临下的教育口吻，像老师在给学生上课。

**根因分析**:
指令微调数据大量来自教程/FAQ/知识库。模型默认进入"教学模式"。

**识别模式**:
- 中文: "需要注意的是..." / "重要的是要理解..." / "你需要知道的是..." / "简单来说..."
- 英文: "It's important to understand that..." / "Keep in mind that..." / "You need to know..." / "Simply put..."

**改写策略**:
把教学改成分享。"你需要知道X" → "我发现X挺有用"。平等交流，不要居高临下。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 需要注意的是，这种方法并不适用于所有场景 | It's important to understand that this approach doesn't work in every scenario |
| Good | 但这招不是万能的——我在项目B上就翻车了 | Doesn't always work though. I bombed on project B using this exact method |

---

### 21. 假共情 / Performative Empathy
**类别**: tone | **严重度**: high | **上限**: 0次/篇

**模式描述**:
用"我理解你的感受""这确实很难"来模拟共情，但紧接着就跳转到解决方案。

**根因分析**:
安全训练要求模型"先共情再回答"。这产生了模板化的假共情——形式正确但情感为空。

**识别模式**:
- 中文: "我理解你的感受..." / "这确实不容易..." / "我完全能体会..." + 立即转向建议
- 英文: "I completely understand..." / "That must be frustrating..." / "I hear you..." + immediate pivot to advice

**改写策略**:
如果你有真实相关经历就分享，没有就别装懂。共情不是句式，是经历。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 我完全理解你的困惑。这确实是个让人头疼的问题。不过我有几个建议... | I completely understand your frustration. It must be difficult. Here are some suggestions... |
| Good | 去年我也遇到一样的问题，当时差点放弃 | I hit the same wall last year. Almost quit |

---

### 22. 万物二元 / Binary Framing
**类别**: tone | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
把复杂问题简化为二选一："要么A要么B""不是赢就是输"。

**根因分析**:
二元对立是最简单的论证结构——不需要处理灰色地带。模型偏好这种"干净"的分析。

**识别模式**:
- 中文: "要么...要么..." / "只有两种选择..." / "不是...就是..."
- 英文: "Either... or..." / "You're either... or you're..." / "There are only two options..."

**改写策略**:
承认灰色地带的存在。现实中大多数问题有第三、第四种可能。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 你要么拥抱AI，要么被AI淘汰 | You either embrace AI or get left behind |
| Good | AI你不学也行，但最好知道它能干啥，关键时候用得上 | You don't need to go all-in on AI. But knowing what it can do helps when you're stuck |

---

### 23. 模拟深度 / Simulated Depth
**类别**: tone | **严重度**: high | **上限**: 1次/篇

**模式描述**:
用哲学化的抽象表达模拟思考深度，但实际上没有提供新信息。

**根因分析**:
训练数据中"深度思考"的样本通常伴随抽象语言。模型学会了用抽象语言来"表演思考"。

**识别模式**:
- 中文: "从本质上来说..." / "深层原因在于..." / "这背后折射出..." / "这引发了一个更深层的思考..."
- 英文: "At its core..." / "Fundamentally..." / "This raises a deeper question..." / "The real question is..."

**改写策略**:
删除"深度表演词"，检查剩下的内容是否仍然有洞察。如果删了就空了——说明本来就没有深度。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 从本质上来说，这背后折射出了人与技术关系的深层困境 | At its core, this reflects a fundamental tension in the relationship between humans and technology |
| Good | 人用AI偷懒，AI用人的偷懒数据学习，这死循环挺搞笑的 | People use AI to cut corners. AI learns from the cut corners. Funny loop |

---

### 24. 确定性膨胀 / Certainty Inflation
**类别**: tone | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
对不确定的事物表现出过度确定。"毫无疑问""必然会""一定能"。

**根因分析**:
RLHF训练中自信的回答获得更高评分。模型学会了用确定性语言来获取信任。

**识别模式**:
- 中文: "毫无疑问""必然会""一定能""注定""无疑是""显然"
- 英文: "Without a doubt", "Certainly", "Undoubtedly", "It's clear that", "Obviously", "There's no question"

**改写策略**:
对不确定的事说"我猜""大概""按目前趋势看"。真正确定的事不需要加确定性修饰词。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 毫无疑问，AI将彻底改变教育行业 | Without a doubt, AI will completely transform the education sector |
| Good | AI对教育的影响？目前看着挺猛的，但最终啥样谁也说不准 | AI's impact on education looks massive right now. Where it actually lands? Anyone's guess |

---

## 五、格式排版类 Formatting（3条）

### 25. Markdown依赖 / Markdown Overuse
**类别**: formatting | **严重度**: medium | **上限**: 按平台定

**模式描述**:
在不需要的场景过度使用Markdown格式（粗体、标题、列表、代码块）。

**根因分析**:
ChatGPT输出默认Markdown格式。模型将Markdown与"组织良好的回答"画等号。

**识别模式**:
- 大量粗体标记（**xxx**）
- 不必要的多级标题
- 每个要点都用列表
- 社交媒体内容使用Markdown

**改写策略**:
社交平台（小红书/即刻/朋友圈/X）纯文本。技术文章可保留少量格式。知乎/公众号可用但节制。

**适用平台表**:

| 平台 | Markdown | 处理 |
|------|----------|------|
| 小红书/即刻/朋友圈/X | 禁止 | 纯文本，表情符号代替格式 |
| 知乎/公众号 | 节制 | 只用分割线和少量粗体 |
| Medium/Reddit/linuxdo | 允许 | 但控制标题层级和列表数量 |
| GitHub | 完全允许 | 技术文档本身需要格式 |

---

### 26. 表情符号滥用 / Emoji Overload
**类别**: formatting | **严重度**: low | **上限**: 按平台定

**模式描述**:
每句话或每段都加表情符号，以为这样就"有温度"。

**根因分析**:
社交媒体训练数据中表情符号频率高。模型将emoji与"亲和力"关联。

**识别模式**:
- 每段都有emoji
- 同一emoji连续使用
- 与内容情绪不匹配的emoji
- 正式语境使用emoji

**改写策略**:
小红书/即刻可用但间隔要大。知乎/公众号/Medium/Reddit极少用或不用。关键：emoji出现在情绪高点而非均匀分布。

---

### 27. 过度格式化 / Over-Structuring
**类别**: formatting | **严重度**: high | **上限**: 0次/篇

**模式描述**:
三级以上标题、嵌套列表、多级缩进。把社交内容写成了技术文档。

**根因分析**:
模型被训练生成"结构化"输出——多层级=更有组织。但社交内容的"结构"应该是隐形的。

**识别模式**:
- H3/H4级标题出现在社交内容中
- 嵌套列表（列表中的列表）
- 超过两层的缩进
- 整篇都是格式、几乎没有段落叙事

**改写策略**:
社交内容的结构通过段落分隔和节奏变化来实现，不靠标题和列表。只有教程/指南类内容才需要可见结构。

---

## 六、篇章构成类 Composition（7条）

### 28. 三段式结构 / Five-Paragraph Essay
**类别**: composition | **严重度**: high | **上限**: 0次/篇

**模式描述**:
引言→正文1→正文2→正文3→结论的标准论文结构。

**根因分析**:
学术写作训练数据的深度影响。五段论是最"安全"的结构——永远不会出错，也永远不会出彩。

**识别模式**:
- 中文: 开头段总起 → 三个平行论点段 → 总结段
- 英文: Introduction → Body 1,2,3 → Conclusion

**改写策略**:
用故事结构、倒叙、悬念或问题驱动替代论文结构。如果内容天然适合这个结构，至少让论点之间有递进而非并列。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | [引言：AI很重要][论点1：效率][论点2：成本][论点3：质量][总结：所以AI很重要] | [Intro: AI matters][Point 1][Point 2][Point 3][Conclusion: AI matters] |
| Good | 上周一个事让我重新想了想AI。[故事展开]→[核心冲突]→[反转]→[开放式结尾] | Something happened last week that made me rethink AI entirely. [story] → [conflict] → [twist] → [open ending] |

---

### 29. 万能总结 / Summary Conclusions
**类别**: composition | **严重度**: critical | **上限**: 0次/篇

**模式描述**:
结尾重复前文要点，"综上所述""总的来说"。

**根因分析**:
论文写作规范要求结论段。模型将学术规范泛化到所有场景，每次都写总结。

**识别模式**:
- 中文: "综上所述""总而言之""概括来说""归根结底""总之""综上""总的来说"
- 英文: "In conclusion", "To sum up", "In summary", "As we've seen", "To wrap up", "All in all"

**改写策略**:
删除总结段。用金句、行动号召或开放式问题收尾。读者不需要你重复一遍他们刚看完的东西。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 综上所述，AI正在改变我们的工作方式，我们需要积极适应这一变化 | In conclusion, AI is transforming our work and we need to adapt to stay competitive |
| Good | 我的建议？先别管AI能不能取代你——先试试它能帮你省多少时间 | My advice? Stop worrying about AI replacing you. Start finding out how much time it saves |

---

### 30. 开头套路 / Template Openings
**类别**: composition | **严重度**: critical | **上限**: 0次/篇

**模式描述**:
"在当今快速发展的时代""随着XX的兴起"式开头。

**根因分析**:
安全、通用的开头在训练数据中频率极高。模型将"安全开头"作为默认策略。

**识别模式**:
- 中文: "随着...的发展" / "在当今时代" / "近年来" / "伴随着" / "众所周知" / "不可否认"
- 英文: "In today's rapidly evolving..." / "In the ever-changing landscape of..." / "As we navigate..." / "In an era of..."

**改写策略**:
用故事/数据/事件直接开头。第一句就要制造好奇缺口。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 随着人工智能技术的飞速发展，越来越多的人开始关注AI对就业的影响 | In today's rapidly evolving technological landscape, AI is increasingly impacting how we work |
| Good | 上周我同事被裁了。他是我们组技术最好的 | My best developer got laid off last week. Best on the team |

---

### 31. 人为平衡 / Artificial Balance
**类别**: composition | **严重度**: high | **上限**: 1次/篇

**模式描述**:
在强调优点后一定要"平衡"地提到缺点，反之亦然。每个论点都有等量的"但是"。

**根因分析**:
安全训练强调"全面性"和"不偏颇"。模型学会了对每个立场自动生成反面。

**识别模式**:
- 中文: 每段正面观点后都跟一段"当然也有挑战" / "不过也要注意" / "但也不是没有问题"
- 英文: Every positive followed by "However..." / "That said..." / "On the flip side..."

**改写策略**:
写文章不是辩论赛。如果你认为优点大于缺点，就多花笔墨在优点上，缺点一笔带过。反之亦然。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | AI提高了效率。但与此同时，也带来了隐私方面的担忧。此外它还存在偏见问题。当然效率提升是值得肯定的 | AI improves efficiency. However, it raises privacy concerns. That said, the benefits are significant. On the other hand... |
| Good | AI把效率拉满了。隐私？是有点问题，但目前来看值得这个交换 | AI cranks up efficiency. Privacy tradeoff exists but feels worth it right now |

---

### 32. 观点稀释 / Hedge Stacking
**类别**: composition | **严重度**: medium | **上限**: 2次/篇

**模式描述**:
在一个观点上堆叠多个限定词，把本来有力的论述变得模糊。

**根因分析**:
安全训练让模型回避绝对性陈述。模型习惯在每个观点上加多层"也许""可能""在某种程度上"来自我保护。

**识别模式**:
- 中文: "在某种程度上可能也许..." / "不一定，但大概率..." / 单句中出现2个以上限定词
- 英文: "It could potentially perhaps..." / "might arguably be somewhat..." / multiple hedges in one sentence

**改写策略**:
一句话最多一个限定词。如果你不确定，说"我不确定"比堆限定词诚实。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 在某种程度上，这可能在一定条件下或许能带来一些改变 | This could potentially, in some cases, arguably lead to some degree of improvement |
| Good | 这可能有用——但我没验证过 | This might work. Haven't tested it though |

---

### 33. 万能呼吁 / Generic Call to Action
**类别**: composition | **严重度**: medium | **上限**: 1次/篇

**模式描述**:
结尾用"让我们一起""不妨想想""行动起来"等空洞的行动号召。

**根因分析**:
营销文案和演讲稿训练数据中CTA（Call to Action）是标配。模型将其泛化到所有结尾。

**识别模式**:
- 中文: "让我们一起..." / "何不从今天开始..." / "是时候...了" / "行动起来吧"
- 英文: "Let's embrace..." / "It's time to..." / "Why not start today..." / "The future is in our hands"

**改写策略**:
如果有具体行动就说具体的（"打开终端跑一遍这个命令"），没有就不要假装有。金句收尾比空洞号召强。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 让我们一起拥抱AI时代，创造更美好的未来！ | Let's embrace the AI revolution and build a better future together! |
| Good | 建议先花30分钟试试，别光看不动手 | Spend 30 minutes trying it. That's it. Just 30 minutes |

---

### 34. 假悬念 / Manufactured Suspense
**类别**: composition | **严重度**: medium | **上限**: 1次/篇

**模式描述**:
用"接下来的内容可能会改变你的看法""你绝对想不到"制造虚假悬念但交付平庸内容。

**根因分析**:
点击诱饵标题的训练数据教会模型用悬念钩子。但模型往往无法交付与悬念匹配的内容。

**识别模式**:
- 中文: "接下来要说的可能会颠覆你的认知" / "你绝对想不到" / "真相是..." / "秘密在于..."
- 英文: "What I'm about to tell you will change everything" / "You won't believe..." / "The secret is..." / "Here's what nobody tells you..."

**改写策略**:
如果你有真正的反直觉洞察，直接说出来——洞察本身就是钩子。如果洞察没那么震撼，别用震撼的包装。

**示例**:

| | 中文 | 英文 |
|---|---|---|
| Bad | 你绝对想不到，AI最大的价值竟然是... | What nobody tells you about AI is that its biggest value is actually... |
| Good | AI最值钱的不是生成能力——是帮你判断什么不该做 | AI's biggest value isn't generation. It's helping you decide what NOT to do |

---

## 附录：按类别快速索引

### word_choice（词汇选择）—— 4条
| # | 名称 | 严重度 | 上限 |
|---|------|--------|------|
| 1 | AI高频词 | critical | 0 |
| 2 | 过度修饰 | high | 1 |
| 3 | 假权威引用 | high | 0 |
| 4 | 万能连接词 | medium | 2 |

### sentence_structure（句式结构）—— 9条
| # | 名称 | 严重度 | 上限 |
|---|------|--------|------|
| 5 | 否定式假深刻 | high | 1 |
| 6 | 三段式排比 | high | 1 |
| 7 | 设问自答 | medium | 2 |
| 8 | 冒号式定义 | medium | 2 |
| 9 | 条件句公式 | medium | 2 |
| 10 | 时间递进 | medium | 1 |
| 11 | 虚假因果 | high | 1 |
| 12 | 升华式递进 | high | 1 |
| 13 | 列表式陈述 | medium | 2 |

### paragraph_structure（段落结构）—— 2条
| # | 名称 | 严重度 | 上限 |
|---|------|--------|------|
| 14 | 主题句公式 | medium | 2 |
| 15 | 等长段落 | medium | 0 |

### tone（语气腔调）—— 9条
| # | 名称 | 严重度 | 上限 |
|---|------|--------|------|
| 16 | 假谦虚 | high | 1 |
| 17 | 假对话感 | medium | 2 |
| 18 | 过度热情 | high | 1 |
| 19 | 中立骑墙 | high | 1 |
| 20 | 教师口吻 | medium | 2 |
| 21 | 假共情 | high | 0 |
| 22 | 万物二元 | medium | 2 |
| 23 | 模拟深度 | high | 1 |
| 24 | 确定性膨胀 | medium | 2 |

### formatting（格式排版）—— 3条
| # | 名称 | 严重度 | 上限 |
|---|------|--------|------|
| 25 | Markdown依赖 | medium | 按平台 |
| 26 | 表情符号滥用 | low | 按平台 |
| 27 | 过度格式化 | high | 0 |

### composition（篇章构成）—— 7条
| # | 名称 | 严重度 | 上限 |
|---|------|--------|------|
| 28 | 三段式结构 | high | 0 |
| 29 | 万能总结 | critical | 0 |
| 30 | 开头套路 | critical | 0 |
| 31 | 人为平衡 | high | 1 |
| 32 | 观点稀释 | medium | 2 |
| 33 | 万能呼吁 | medium | 1 |
| 34 | 假悬念 | medium | 1 |
