---
title: "codeany-ai/open-agent-sdk-typescript: Agent-SDK without CLI dependencies, as an alternative to claude-agent-sdk, completely open source"
source: "https://github.com/codeany-ai/open-agent-sdk-typescript"
author:
published:
created: 2026-04-03
description: "Agent-SDK without CLI dependencies, as an alternative to claude-agent-sdk, completely open source - codeany-ai/open-agent-sdk-typescript"
tags:
  - "clippings"
---
## Open Agent SDK (TypeScript)

Open-source Agent SDK that runs the full agent loop **in-process** — no subprocess or CLI required. Deploy anywhere: cloud, serverless, Docker, CI/CD.

Also available in **Go**: [open-agent-sdk-go](https://github.com/codeany-ai/open-agent-sdk-go)

## Get started

```
npm install @codeany/open-agent-sdk
```

Set your API key:

```
export CODEANY_API_KEY=your-api-key
```

Third-party providers (e.g. OpenRouter) are supported via `CODEANY_BASE_URL`:

```
export CODEANY_BASE_URL=https://openrouter.ai/api
export CODEANY_API_KEY=sk-or-...
export CODEANY_MODEL=anthropic/claude-sonnet-4
```

## Quick start

### One-shot query (streaming)

```
import { query } from "@codeany/open-agent-sdk";

for await (const message of query({
  prompt: "Read package.json and tell me the project name.",
  options: {
    allowedTools: ["Read", "Glob"],
    permissionMode: "bypassPermissions",
  },
})) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if ("text" in block) console.log(block.text);
    }
  }
}
```

### Simple blocking prompt

```
import { createAgent } from "@codeany/open-agent-sdk";

const agent = createAgent({ model: "claude-sonnet-4-6" });
const result = await agent.prompt("What files are in this project?");

console.log(result.text);
console.log(
  \`Turns: ${result.num_turns}, Tokens: ${result.usage.input_tokens + result.usage.output_tokens}\`,
);
```

### Multi-turn conversation

```
import { createAgent } from "@codeany/open-agent-sdk";

const agent = createAgent({ maxTurns: 5 });

const r1 = await agent.prompt(
  'Create a file /tmp/hello.txt with "Hello World"',
);
console.log(r1.text);

const r2 = await agent.prompt("Read back the file you just created");
console.log(r2.text);

console.log(\`Session messages: ${agent.getMessages().length}\`);
```

### Custom tools (Zod schema)

```
import { z } from "zod";
import { query, tool, createSdkMcpServer } from "@codeany/open-agent-sdk";

const getWeather = tool(
  "get_weather",
  "Get the temperature for a city",
  { city: z.string().describe("City name") },
  async ({ city }) => ({
    content: [{ type: "text", text: \`${city}: 22°C, sunny\` }],
  }),
);

const server = createSdkMcpServer({ name: "weather", tools: [getWeather] });

for await (const msg of query({
  prompt: "What is the weather in Tokyo?",
  options: { mcpServers: { weather: server } },
})) {
  if (msg.type === "result")
    console.log(\`Done: $${msg.total_cost_usd?.toFixed(4)}\`);
}
```

### Custom tools (low-level)

```
import {
  createAgent,
  getAllBaseTools,
  defineTool,
} from "@codeany/open-agent-sdk";

const calculator = defineTool({
  name: "Calculator",
  description: "Evaluate a math expression",
  inputSchema: {
    type: "object",
    properties: { expression: { type: "string" } },
    required: ["expression"],
  },
  isReadOnly: true,
  async call(input) {
    const result = Function(\`'use strict'; return (${input.expression})\`)();
    return \`${input.expression} = ${result}\`;
  },
});

const agent = createAgent({ tools: [...getAllBaseTools(), calculator] });
const r = await agent.prompt("Calculate 2**10 * 3");
console.log(r.text);
```

### MCP server integration

```
import { createAgent } from "@codeany/open-agent-sdk";

const agent = createAgent({
  mcpServers: {
    filesystem: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
    },
  },
});

const result = await agent.prompt("List files in /tmp");
console.log(result.text);
await agent.close();
```

### Subagents

```
import { query } from "@codeany/open-agent-sdk";

for await (const msg of query({
  prompt: "Use the code-reviewer agent to review src/index.ts",
  options: {
    agents: {
      "code-reviewer": {
        description: "Expert code reviewer",
        prompt: "Analyze code quality. Focus on security and performance.",
        tools: ["Read", "Glob", "Grep"],
      },
    },
  },
})) {
  if (msg.type === "result") console.log("Done");
}
```

### Permissions

```
import { query } from "@codeany/open-agent-sdk";

// Read-only agent — can only analyze, not modify
for await (const msg of query({
  prompt: "Review the code in src/ for best practices.",
  options: {
    allowedTools: ["Read", "Glob", "Grep"],
    permissionMode: "dontAsk",
  },
})) {
  // ...
}
```

### Web UI

A built-in web chat interface is included for testing:

```
npx tsx examples/web/server.ts
# Open http://localhost:8081
```

## API reference

### Top-level functions

| Function | Description |
| --- | --- |
| `query({ prompt, options })` | One-shot streaming query, returns `AsyncGenerator<SDKMessage>` |
| `createAgent(options)` | Create a reusable agent with session persistence |
| `tool(name, desc, schema, handler)` | Create a tool with Zod schema validation |
| `createSdkMcpServer({ name, tools })` | Bundle tools into an in-process MCP server |
| `defineTool(config)` | Low-level tool definition helper |
| `getAllBaseTools()` | Get all 34 built-in tools |
| `listSessions()` | List persisted sessions |
| `getSessionMessages(id)` | Retrieve messages from a session |
| `forkSession(id)` | Fork a session for branching |

### Agent methods

| Method | Description |
| --- | --- |
| `agent.query(prompt)` | Streaming query, returns `AsyncGenerator<SDKMessage>` |
| `agent.prompt(text)` | Blocking query, returns `Promise<QueryResult>` |
| `agent.getMessages()` | Get conversation history |
| `agent.clear()` | Reset session |
| `agent.interrupt()` | Abort current query |
| `agent.setModel(model)` | Change model mid-session |
| `agent.setPermissionMode(mode)` | Change permission mode |
| `agent.close()` | Close MCP connections, persist session |

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `string` | `claude-sonnet-4-6` | LLM model ID |
| `apiKey` | `string` | `CODEANY_API_KEY` | API key |
| `baseURL` | `string` | — | Custom API endpoint |
| `cwd` | `string` | `process.cwd()` | Working directory |
| `systemPrompt` | `string` | — | System prompt override |
| `appendSystemPrompt` | `string` | — | Append to default system prompt |
| `tools` | `ToolDefinition[]` | All built-in | Available tools |
| `allowedTools` | `string[]` | — | Tool allow-list |
| `disallowedTools` | `string[]` | — | Tool deny-list |
| `permissionMode` | `string` | `bypassPermissions` | `default` / `acceptEdits` / `dontAsk` / `bypassPermissions` / `plan` |
| `canUseTool` | `function` | — | Custom permission callback |
| `maxTurns` | `number` | `10` | Max agentic turns |
| `maxBudgetUsd` | `number` | — | Spending cap |
| `thinking` | `ThinkingConfig` | `{ type: 'adaptive' }` | Extended thinking |
| `effort` | `string` | `high` | Reasoning effort: `low` / `medium` / `high` / `max` |
| `mcpServers` | `Record<string, McpServerConfig>` | — | MCP server connections |
| `agents` | `Record<string, AgentDefinition>` | — | Subagent definitions |
| `hooks` | `Record<string, HookCallbackMatcher[]>` | — | Lifecycle hooks |
| `resume` | `string` | — | Resume session by ID |
| `continue` | `boolean` | `false` | Continue most recent session |
| `persistSession` | `boolean` | `true` | Persist session to disk |
| `sessionId` | `string` | auto | Explicit session ID |
| `outputFormat` | `{ type: 'json_schema', schema }` | — | Structured output |
| `sandbox` | `SandboxSettings` | — | Filesystem/network sandbox |
| `settingSources` | `SettingSource[]` | — | Load AGENT.md, project settings |
| `env` | `Record<string, string>` | — | Environment variables |
| `abortController` | `AbortController` | — | Cancellation controller |

### Environment variables

| Variable | Description |
| --- | --- |
| `CODEANY_API_KEY` | API key (required) |
| `CODEANY_MODEL` | Default model override |
| `CODEANY_BASE_URL` | Custom API endpoint |
| `CODEANY_AUTH_TOKEN` | Alternative auth token |

## Built-in tools

| Tool | Description |
| --- | --- |
| **Bash** | Execute shell commands |
| **Read** | Read files with line numbers |
| **Write** | Create / overwrite files |
| **Edit** | Precise string replacement in files |
| **Glob** | Find files by pattern |
| **Grep** | Search file contents with regex |
| **WebFetch** | Fetch and parse web content |
| **WebSearch** | Search the web |
| **NotebookEdit** | Edit Jupyter notebook cells |
| **Agent** | Spawn subagents for parallel work |
| **TaskCreate/List/Update/Get/Stop/Output** | Task management system |
| **TeamCreate/Delete** | Multi-agent team coordination |
| **SendMessage** | Inter-agent messaging |
| **EnterWorktree/ExitWorktree** | Git worktree isolation |
| **EnterPlanMode/ExitPlanMode** | Structured planning workflow |
| **AskUserQuestion** | Ask the user for input |
| **ToolSearch** | Discover lazy-loaded tools |
| **ListMcpResources/ReadMcpResource** | MCP resource access |
| **CronCreate/Delete/List** | Scheduled task management |
| **RemoteTrigger** | Remote agent triggers |
| **LSP** | Language Server Protocol (code intelligence) |
| **Config** | Dynamic configuration |
| **TodoWrite** | Session todo list |

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Your Application                    │
│                                                       │
│   import { createAgent } from '@codeany/open-agent-sdk' │
└────────────────────────┬─────────────────────────────┘
                         │
              ┌──────────▼──────────┐
              │       Agent         │  Session state, tool pool,
              │  query() / prompt() │  MCP connections
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │    QueryEngine      │  Agentic loop:
              │   submitMessage()   │  API call → tools → repeat
              └──────────┬──────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
   ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
   │  LLM API  │  │  34 Tools │  │    MCP     │
   │  Client   │  │ Bash,Read │  │  Servers   │
   │ (streaming)│  │ Edit,...  │  │ stdio/SSE/ │
   └───────────┘  └───────────┘  │ HTTP/SDK   │
                                  └───────────┘
```

**Key internals:**

| Component | Description |
| --- | --- |
| **QueryEngine** | Core agentic loop with auto-compact, retry, tool orchestration |
| **Auto-compact** | Summarizes conversation when context window fills up |
| **Micro-compact** | Truncates oversized tool results |
| **Retry** | Exponential backoff for rate limits and transient errors |
| **Token estimation** | Rough token counting for budget and compaction thresholds |
| **File cache** | LRU cache (100 entries, 25 MB) for file reads |
| **Hook system** | 20 lifecycle events (PreToolUse, PostToolUse, SessionStart,...) |
| **Session storage** | Persist / resume / fork sessions on disk |
| **Context injection** | Git status + AGENT.md automatically injected into system prompt |

## Examples

| # | File | Description |
| --- | --- | --- |
| 01 | `examples/01-simple-query.ts` | Streaming query with event handling |
| 02 | `examples/02-multi-tool.ts` | Multi-tool orchestration (Glob + Bash) |
| 03 | `examples/03-multi-turn.ts` | Multi-turn session persistence |
| 04 | `examples/04-prompt-api.ts` | Blocking `prompt()` API |
| 05 | `examples/05-custom-system-prompt.ts` | Custom system prompt |
| 06 | `examples/06-mcp-server.ts` | MCP server integration |
| 07 | `examples/07-custom-tools.ts` | Custom tools with `defineTool()` |
| 08 | `examples/08-official-api-compat.ts` | `query()` API pattern |
| 09 | `examples/09-subagents.ts` | Subagent delegation |
| 10 | `examples/10-permissions.ts` | Read-only agent with tool restrictions |
| 11 | `examples/11-custom-mcp-tools.ts` | `tool()` + `createSdkMcpServer()` |
| web | `examples/web/` | Web chat UI for testing |

Run any example:

```
npx tsx examples/01-simple-query.ts
```

Start the web UI:

```
npx tsx examples/web/server.ts
```

## Star History

[![Star History Chart](https://camo.githubusercontent.com/7847207abca5de7e8168d9da91ed099b4cf34240e683652e1a47147aa336f622/68747470733a2f2f6170692e737461722d686973746f72792e636f6d2f696d6167653f7265706f733d636f6465616e792d61692f6f70656e2d6167656e742d73646b2d7479706573637269707426747970653d74696d656c696e65266c6567656e643d746f702d6c656674)](https://www.star-history.com/?repos=codeany-ai%2Fopen-agent-sdk-typescript&type=timeline&legend=top-left)

## License

MIT