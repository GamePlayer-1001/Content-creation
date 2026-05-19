---
title: "Craft Agents - The Open Source Agent Interface"
source: "https://agents.craft.do/"
author:
  - "[[Craft Agent]]"
published:
created: 2026-04-08
description: "An open source desktop app for working with AI agents. Connect any API or MCP server. Multitask naturally. Make it yours."
tags:
  - "clippings"
---
![Craft Agents](https://agents.craft.do/assets/agents_logo-CVam6lgs.svg)

## Work with most powerful agents in the world, with the UX they deserve

Works with **Claude**, **ChatGPT**, **OpenRouter**, **local models**, and more.  
Connect to anything — either via Browser, API, MCP server, or local filesystem.  
Multitask naturally. Build your next-gen workflow with agents.

[![Craft Agents interface](https://agents.craft.do/assets/agent-screenshot-hBdY4zpi.webp)](https://www.youtube.com/watch?v=xQouiAIilvU)

## Things that are hard to believe "just work"

### How do I connect to Linear, Gmail, Slack...?

Just tell the agent "add Linear as a source." Really. It finds public APIs and MCP servers, reads their documentation, fetches credentials, and sets everything up. Sources become instantly available. No config files, no setup wizards.

[Check out how I just connected to Slack →](https://agents.craft.do/s/DRNQEiy8w2e1v5LPgKl8b)

### But I already have my MCP config JSON...

Great. Paste it. The agent handles the rest.

### What about local MCPs? I need those.

Fully supported. Stdio-based MCP servers run as local subprocesses right on your machine. Point it at an npx command, a Python script, or any local binary. It just works.

### Surely it can't handle custom APIs?

It can. Paste an OpenAPI spec, some endpoint URLs, screenshots of docs, whatever you have. It will figure it out and guide you through the rest. And if there's no API? It opens a browser and does the work directly on the website.

### But I meant APIs. Not MCPs. Are you sure?

Yes. Craft Agents is built to connect to anything. We have it hooked up to a direct Postgres DB behind a jumpbox. And for services with no API at all, the agent opens a built-in browser, logs in, and gets the job done. Skills + Sources + Browser = magic.

### Wait, it has a browser?

Yes. A full Chromium browser, built in. The agent can navigate pages, fill forms, click buttons, extract data, and take screenshots. Sign into a service yourself, then let the agent take over. Or let it browse autonomously. It sees what you see.

### How do I import my Claude Code skills and MCPs?

Ask it. Tell the agent you want to use your skills from Claude Code. It imports them. Done.

[Here I imported all my skills in one go →](https://agents.craft.do/s/gWCFqwhObFWaNJIEJmd6j)

### How do I create a new skill?

Ask it. Describe what the skill should do, give it context. It takes care of the rest.

### And then, restart the app, right?

No. Everything is instant. Mention skills or sources with @, even mid-conversation.

### So I can just... ask it anything?

Yes. That's the core idea. Agent-native software means you describe what you want, and it figures out how — via APIs, MCP servers, code, or the browser. That's a good use of tokens. The agent doing the work for you.

## Bring your own model

Use Claude with your Anthropic API key. Connect your ChatGPT Plus subscription. Route through OpenRouter for 400+ models. Run fully offline with Ollama or LM Studio. Switch anytime — your workflow stays the same.

### Claude

The most powerful coding agents. Direct API key or Max subscription.

### ChatGPT Plus

Use your existing OpenAI subscription. Full agent capabilities via Codex.

### OpenRouter, Vercel AI Gateway & more

Route through OpenRouter, Vercel AI Gateway, or any compatible gateway. Access hundreds of models through a single endpoint.

### Local Models

Run Ollama, LM Studio, or any OpenAI-compatible endpoint. Fully private, fully offline.

Compatible with Anthropic, OpenAI, Google Gemini, xAI Grok, Mistral, DeepSeek, Meta Llama, Cohere, Groq, Together.ai, Fireworks, Cerebras, Perplexity, Amazon Bedrock, Azure OpenAI, Google Vertex, Alibaba Qwen, MiniMax, Inflection Pi, Moonshot, DeepInfra, SambaNova, Zhipu AI, FriendliAI — and any OpenAI-compatible endpoint via OpenRouter, Ollama, or llama.cpp. Powered by the Vercel AI SDK.

---

## Connect to any API, MCP or local source

Your agents need information to be useful. Craft Agents lets you connect to anything: REST APIs, MCP servers, or your local filesystem. All in one place.

### Setup in seconds

Just tell the agent "connect to Linear". It fetches credentials, reads docs, and configures everything automatically.

### Private APIs welcome

No MCP required. Enrich your workflows with internal company data, private endpoints, and custom services.

### Apps on your device

Integrate Apple Notes, Obsidian vaults, local databases, and files directly into your agent workflows.

### Full control

Set fine-grained permissions per source. Define exactly what each connection can read, write, or execute.

## Multitasking, without the learning curve

The UX feels like email and task managers. Working with agents shouldn't feel different. Organize, prioritize, and switch contexts naturally.

![Multitasking interface](https://agents.craft.do/assets/Multitasking-DBsykYnu.webp)

### Work like you already do

Track what's done and what still needs work. Set up custom states that fit your workflow. Organize agent conversations just like messages in your inbox.

### Switch without losing focus

Jump between tasks freely. Each session keeps its full history. Pause one, start another, and return exactly where you left off.

### Runs in the background

Start long-running tasks and let them work while you focus on something else. Get notified when they're done.

## Explore, plan, refine, delegate

To get the most out of agents, you need to trust them with execution and focus on the bigger picture. Align on the goal, refine the approach together, then step back and let them work. Review the results when they're done. It's the same dynamic that makes great teams effective: clear direction, autonomy in execution, and accountability at the end.

![Explore and plan workflow](https://agents.craft.do/assets/plan-CJtfcn3V.webp)

### Explore mode

Read-only by default. Let the agent research, analyze, and draft a plan. Review proposals before any changes happen. Iterate until you're aligned.

### Execute mode

Once aligned, switch to Execute. The agent executes without interruption. Review the results when done, just like reviewing delivered work from a teammate.

## A browser, built right in

Navigate websites, fill forms, extract data, take screenshots — all without leaving your workflow. The agent sees what you see and acts on your behalf.

![Built-in browser](https://agents.craft.do/assets/browser-jqmFqJMu.webp)

## Share your plans, decisions and logic. Your entire conversation.

With AI, conversations become the documentation. Every decision, rationale, and implementation detail lives in the thread. Attach sessions to tickets, issues, or PRs. Share with your team so they understand not just what changed, but why.

[![Shared session interface](https://agents.craft.do/assets/shared_sessions-GK6jXNz5.webp)](https://agents.craft.do/s/xW1SfMIhfMvMfRL2pJKMI)

### Decisions with context

The conversation captures every trade-off considered, alternative rejected, and reason behind each choice. Context that usually gets lost is preserved.

### Link to your workflow

Attach shared sessions to Linear issues, GitHub PRs, or Confluence pages. Reviewers see the full reasoning, not just the end result.

### Host it yourself

Deploy the viewer on your own infrastructure. Keep everything internal and maintain full control over where your data lives.

## Make Craft Agents yours

Craft Agents adapts to how you work. Customize themes, create your own skills, and configure behaviors to match your preferences. Everything is a file you can edit, version, and share.

![Custom theming interface](https://agents.craft.do/assets/theming-D9f_y0jL.webp)

### Look, feel, and behavior

Themes, statuses, workflows, permissions. Everything lives in files the agent can edit in real time. Make it truly yours.

### Skills

Claude Code skills, built in. Create reusable prompts and workflows that the agent follows for specific tasks. Your shortcuts, your way.

## Agent Native Architecture

Software is changing. Instead of rigid, predetermined systems, applications can now grow and adapt with you. We built Craft Agents with [Agent Native](https://every.to/chain-of-thought/agent-native-architectures-how-to-build-apps-after-the-end-of-code) principles: the agent isn't a feature, it's the foundation.

![Agent native architecture](https://agents.craft.do/assets/agent_native-BRarMGPv.webp)

### Specification over implementation

Describe what you want, not how to build it. Features become prompts, not code. The agent handles the complexity.

### Flexible by design

Modify behavior through natural language. No complex settings UIs. Just describe the change and it happens.

### True flexibility

Modify every angle, from UI to behavior to integrations. Craft Agents is built entirely with Craft Agents. Every feature, every fix starts as a conversation.

## The future of personal software is remixing

We can't wait to see how you make it yours, shape it to your workflow, and build something that reflects your own taste.

[View Source Code](https://github.com/lukilabs/craft-agents-oss)