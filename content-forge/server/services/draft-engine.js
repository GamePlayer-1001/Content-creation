/**
 * 母稿生成引擎
 * 多轮示范 + 采样参数优化 + 代码级后处理，三管齐下去AI味
 */
import { streamChat } from './ai-client.js';
import { sampleTemplates, buildStylePrompt } from './style-analyzer.js';
import { getPlatformRules } from './rules-loader.js';
import { humanizeText } from './humanize.js';

// ————— 极简人格（不讲规则，只定语气）—————
const PERSONA = `你是个写了十年公众号的博主。写东西跟跟朋友发微信语音似的——想到哪说到哪，有时候一句话就是一段，有时候不打标点能写一大串。你讨厌端着，讨厌说教，讨厌那种一看就是网上抄来的套话。你有自己的观点并且不怕得罪人。`;

// ————— 结构性禁令（词汇级由 humanize.js 代码处理）—————
const STRUCTURE_BAN = `【结构禁令】
× 开头禁止"在当今/随着XX的发展"——直接讲事、讲人、讲场景
× 禁止"首先…其次…最后…"——不要编号论证，像聊天一样自然过渡
× 禁止"总而言之/综上所述"——结尾留个问题或一句狠话
× "不是X而是Y"最多出现1次
× 禁止三段排比"更X、更Y、更Z"
× 不要每段都是"观点+论据"的工整结构
× 段落长度必须不均匀：至少3个段落只有一句话，至少1个段落超过5句话`;

// ————— 多轮示范：让模型看到"我之前写的人话长什么样" —————
const EXAMPLE_TOPIC = '知识付费到底值不值';
const EXAMPLE_RESPONSE = `上周末帮朋友搬家，在他书架底下翻出一本2019年的《得到》笔记本。翻了几页。满满当当的手写笔记，"第一性原理""飞轮效应""认知升级"——每个词旁边都画了星号和感叹号。

你知道那种感觉吗，就是一个人刚碰到新概念时候那股子兴奋劲儿。

但猜怎么着？五年过去了，他一个都没用上。笔记本吃灰，人还是该迷茫迷茫，该纠结纠结。去年想跳槽，纠结了整整三个月——什么"第一性原理"完全不好使。

这事儿让我想到一个特扎心的结论：

大部分人的"学习"就是在集邮。

集概念，集框架，集金句。每集一个就感觉自己又"升级"了。朋友圈转发一篇万字长文，配上"深度好文"四个字，仿佛自己也深度了。但你仔细想——真正改变过你行为的知识，一辈子能数出几条？我反正掰着手指头数，超不过五条。而且没有一条是从付费课程里学的，全是吃了亏之后自己琢磨出来的。

<!-- IMAGE: 一本落灰的笔记本摊开在搬家纸箱上 -->

我不是说学习没用。

我是说，大部分人对"学习"这件事有个误解——以为知道了就等于做到了。知道和做到之间隔着太平洋。我自己就是个典型。看了一百篇"早起改变人生"，起了三天，第四天闹钟响的时候我的手比脑子快——啪，关掉，翻身。

所以现在我对所有教你"如何如何"的内容都保留态度。不是人家写得不好，是我知道自己执行力就那样。与其花两小时听别人方法论，不如花两小时试一个小实验。试完你就知道行不行了，比听一百场分享靠谱。

那知识付费到底值不值？

我的答案是：当消遣挺好的。别指望它改变你的人生——能改变你人生的那个知识，通常是免费的，只是你当时不愿意听。`;

// ————— 改写提示：让第二个模型用完全不同的方式表达同样的内容 —————
const REWRITE_SYSTEM = `你的任务：把一篇文章用完全不同的措辞重新写一遍。

具体做法：
- 每个句子都换一种说法，不要保留原文的句式结构
- 用口语化、随意的方式表达，像在跟朋友聊天
- 有些句子故意写短（三五个字），有些故意写长（一口气不断句）
- 偶尔加入"怎么说呢""反正""你懂的""说白了"这种口语碎片
- 偶尔用破折号——像这样——在句中插入想法
- 段落长度要极不均匀
- 保持原文核心观点和信息不变
- 保留所有Markdown格式、标题、<!-- IMAGE: --> 标记
- 不要加新内容，只改写表达方式`;

/**
 * 生成母稿（两阶段：DeepSeek初稿 → GPT-4o-mini改写 → 代码后处理）
 */
export async function generateDraft(topic, context, res) {
  const samples = await sampleTemplates('wechat', 3);
  const styleHint = buildStylePrompt(samples);

  const sampleTexts = samples
    .map((s, i) => `--- 范文${i + 1}「${s.title}」---\n${s.content.slice(0, 2500)}`)
    .join('\n\n');

  // SSE 流式返回
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // ===== 阶段1：DeepSeek 生成初稿（不流式给用户）=====
  res.write(`data: ${JSON.stringify({ type: 'phase', content: '🔥 阶段1/2：正在构思初稿...' })}\n\n`);

  const draftMessages = [
    { role: 'system', content: `${PERSONA}\n\n${STRUCTURE_BAN}` },
    { role: 'user', content: `写篇关于"${EXAMPLE_TOPIC}"的文章` },
    { role: 'assistant', content: EXAMPLE_RESPONSE },
    {
      role: 'user',
      content: `好，就这个味道。现在写一篇新的。

参考这些真人文章的节奏和语感：

${sampleTexts}

---

${styleHint}

---

主题：${topic}
${context ? `补充：${context}` : ''}

格式：1500-3000字，Markdown，用标题分段，配图位置标 <!-- IMAGE: 描述 -->（最多3处）`,
    },
  ];

  let rawDraft = '';
  try {
    rawDraft = await streamChat(draftMessages, null, {
      temperature: 0.9,
      maxTokens: 6000,
      frequencyPenalty: 0.5,
      presencePenalty: 0.3,
      topP: 0.9,
    });
  } catch (err) {
    // 初稿生成失败，直接报错
    res.write(`data: ${JSON.stringify({ type: 'error', message: '初稿生成失败：' + err.message })}\n\n`);
    res.end();
    return '';
  }

  // ===== 阶段2：GPT-4o-mini 用不同的token分布改写（流式给用户）=====
  res.write(`data: ${JSON.stringify({ type: 'phase', content: '✍️ 阶段2/2：正在深度改写去AI化...' })}\n\n`);

  const rewriteMessages = [
    { role: 'system', content: REWRITE_SYSTEM },
    { role: 'user', content: `改写这篇文章：\n\n${rawDraft}` },
  ];

  // 使用 dlapi 端点 + GPT-4o-mini（与DeepSeek不同的模型架构 = 不同的token分布）
  const rewriteApiBase = process.env.AI_API_BASE || 'https://api.dlapi.xyz/v1';
  const rewriteApiKey = process.env.AI_API_KEY || '';

  let finalContent = '';
  try {
    finalContent = await streamChat(rewriteMessages, (chunk) => {
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
    }, {
      model: 'gpt-4o-mini',
      apiBase: rewriteApiBase,
      apiKey: rewriteApiKey,
      temperature: 0.85,
      maxTokens: 6000,
      frequencyPenalty: 0.3,
      presencePenalty: 0.2,
    });

    // 代码级后处理
    const humanized = humanizeText(finalContent);
    res.write(`data: ${JSON.stringify({ type: 'done', content: humanized })}\n\n`);
  } catch (rewriteErr) {
    // GPT-4o-mini改写失败，回退到直接用代码后处理DeepSeek初稿
    console.warn('GPT-4o-mini改写失败，回退到代码后处理：', rewriteErr.message);
    const fallback = humanizeText(rawDraft);
    res.write(`data: ${JSON.stringify({ type: 'done', content: fallback })}\n\n`);
  }

  res.end();
  return finalContent || rawDraft;
}

/**
 * 平台适配改写（流式返回）
 */
export async function adaptForPlatform(content, platform, res) {
  const platformRule = getPlatformRules(platform);

  const englishPlatforms = ['x', 'medium', 'quora', 'reddit'];
  const isEnglish = englishPlatforms.includes(platform);

  const samples = await sampleTemplates(platform, 2);
  const sampleText = samples.length > 0
    ? `\n\n该平台真人文章参考：\n${samples[0].content.slice(0, 1500)}`
    : '';

  const messages = [
    {
      role: 'system',
      content: `${PERSONA}\n\n${STRUCTURE_BAN}\n\n你还精通各平台社区文化，改写时像那个平台的老用户在发帖。`,
    },
    {
      role: 'user',
      content: `改写下面的文章，适配这个平台：

${platformRule}
${sampleText}

${isEnglish ? '输出英文，native speaker语感，不要翻译腔。' : ''}

原文：
${content}

要求：核心观点不变，语气结构长度完全适配平台，保留 <!-- IMAGE: --> 标记，结尾加互动钩子。${isEnglish ? '输出英文。' : ''}`,
    },
  ];

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  let fullContent = '';
  try {
    fullContent = await streamChat(messages, (chunk) => {
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
    }, {
      temperature: 0.88,
      maxTokens: 6000,
      frequencyPenalty: 0.4,
      presencePenalty: 0.2,
    });

    // 中文平台做后处理，英文平台跳过
    const final = isEnglish ? fullContent : humanizeText(fullContent);
    res.write(`data: ${JSON.stringify({ type: 'done', content: final })}\n\n`);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
  }

  res.end();
  return fullContent;
}
