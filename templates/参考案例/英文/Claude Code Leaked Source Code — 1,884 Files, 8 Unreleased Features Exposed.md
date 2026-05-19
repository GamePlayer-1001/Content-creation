---
title: "Claude Code Leaked Source Code — 1,884 Files, 8 Unreleased Features Exposed"
source: "https://www.ccleaks.com/"
author:
  - "[[Abhishek]]"
published: 2026-03-31
created: 2026-04-03
description: "We reverse-engineered 1,884 files from Claude Code's leaked source. 8 unreleased features, hidden slash commands, secret environment variables, undocumented model IDs, and the full internal architecture — exposed."
tags:
  - "clippings"
---
01

## Unreleased Features

![BUDDY AI Pet](https://www.ccleaks.com/_next/image?url=%2Fimages%2Ffeature-buddy.webp&w=1200&q=85)

### BUDDY

— AI Companion Pet

Easter EggReleased

Every user gets a unique virtual pet that appears next to their terminal prompt. Your pet's species, rarity, and personality are generated from your account ID — so yours is one-of-a-kind.

RARITY DISTRIBUTION

Common60%Uncommon25%Rare10%Epic4%Legendary1%Shiny1%

SPECIES

duckgooseblobcatdragonoctopusowlpenguinturtlesnailghostaxolotlcapybaracactusrobotrabbitmushroomchonk

STATS

DEBUGGING78

PATIENCE62

CHAOS91

WISDOM55

SNARK84

COSMETICS

Eyes· ✦ × ◉ @ °

Hatscrown · tophat · propeller · halo · wizard · beanie · tinyduck

BEHAVIOR

Sprite tick500ms

Animationsidle fidgets · blinks

Speech bubbles10s duration

Pet interaction/buddy pet → ♥

Soul persistenceGenerated once, stored forever

![KAIROS persistent assistant](https://www.ccleaks.com/_next/image?url=%2Fimages%2Ffeature-kairos.webp&w=1200&q=85)

### KAIROS

— Persistent Assistant

Unreleased

An always-on mode where Claude remembers everything across sessions. It keeps daily logs of what you talked about and "dreams" overnight — automatically organizing your memories into useful notes while you sleep.

Feature Gatefeature('KAIROS') + tengu\_kairos

Daily Logs~/.claude/.../logs/YYYY/MM/DD.md

Log modeappend-only

Dream bashRead-only

Blocking budget15s max — auto-backgrounds

Brief outputSendUserMessage

Status modesnormal · proactive

Proactive triggerPeriodic <tick> prompts

Proactive actionActs or calls Sleep

DREAM PHASES

1\. Orient2. Gather3. Consolidate4. Prune

EXCLUSIVE TOOLS

SendUserFilePushNotificationSubscribePRSleepTool

![ULTRAPLAN remote planning](https://www.ccleaks.com/_next/image?url=%2Fimages%2Ffeature-ultraplan.webp&w=1200&q=85)

### ULTRAPLAN

— 30-Min Remote Planning

Unreleased

For complex tasks, Claude spins up a separate cloud instance that explores and plans for up to 30 minutes. You review and approve the plan in your browser before it runs.

ModelOpus 4.6 via tengu\_ultraplan\_model

Poll interval3s

FlowPoll → ExitPlanMode → approve/reject → loop or execute

Teleport"Teleport to terminal" archives remote, runs locally

![Coordinator Mode](https://www.ccleaks.com/_next/image?url=%2Fimages%2Ffeature-coordinator.webp&w=1200&q=85)

### Coordinator Mode

— Multi-Agent

ENV

Claude becomes a manager. It breaks your task into pieces, assigns each to a separate worker agent running in parallel, then combines their results.

ActivateCLAUDE\_CODE\_COORDINATOR\_MODE=1

Protocol<task-notification> XML

IsolationScratch dirs via tengu\_scratch

Continuevia SendMessage

NOTIFICATION FIELDS

statussummarytokensduration

![UDS Inbox cross-session IPC](https://www.ccleaks.com/_next/image?url=%2Fimages%2Ffeature-uds.webp&w=1200&q=85)

### UDS Inbox

— Cross-Session IPC

Unreleased

If you have multiple Claude sessions running on your machine, they can send messages to each other — like a team chat between your AI agents.

Teammateto: "researcher"

Local socketto: "uds:/.../sock"

Remoteto: "bridge:..."

DiscoveryListPeersTool reads ~/.claude/sessions/

![Bridge remote control](https://www.ccleaks.com/_next/image?url=%2Fimages%2Ffeature-bridge.webp&w=1200&q=85)

### Bridge

— Remote Control

Released

Run Claude on your local machine but control it from your phone or from claude.ai in the browser. Permissions, model changes, and tool approvals all sync in real time. Now available via claude.ai web interface.

Commandclaude remote-control

Init APIPOST /v1/environments/bridge

Transportpoll → WebSocket

CONTROL MESSAGES

initializeset\_modelcan\_use\_tool

![Daemon Mode session supervisor](https://www.ccleaks.com/_next/image?url=%2Fimages%2Ffeature-daemon.webp&w=1200&q=85)

### Daemon Mode

— Session Supervisor

Unreleased

Run Claude sessions in the background like system services. List them, check their logs, reattach to them, or kill them — like docker ps for your AI agents.

Backgroundclaude --bg <prompt> in tmux

On exitdetach (session persists)

COMMANDS

daemonpslogsattachkill

![Auto-Dream memory consolidation](https://www.ccleaks.com/_next/image?url=%2Fimages%2Ffeature-autodream.webp&w=1200&q=85)

### Auto-Dream

— Memory Consolidation

Unreleased

Between sessions, Claude reviews what it learned and organizes scattered notes into clean, structured memory files — like a student reviewing flashcards overnight.

Trigger≥24h + ≥5 sessions since last dream

Output limit<25KB

CONSOLIDATION PHASES

1\. Orient2. Gather3. Consolidate4. Prune

### 26 slash commands not in --help

`/ctx-viz` Visualizes the LLM's current context window and token usage

`/btw` Asks a quick side question without altering main session context

`/good-claude` Triggers a hidden Easter egg praise response

`/teleport` Moves your session state to another device (released)

`/summary` Generates a concise summary of your session history (released)

`/ultraplan` Activates an advanced autonomous planning mode for complex tasks

`/autofix-pr` Automatically generates and pushes fixes for failing PR checks

`/ant-trace` Dumps internal API telemetry and request routing traces

`/perf-issue` Generates and submits a detailed performance diagnostic report

`/debug-tool-call` Displays raw JSON inputs/outputs for the last tool execution

`/bughunter` Launches an adversarial agent to find bugs in your code

`/force-snip` Manually truncates session history to free context tokens

`/mock-limits` Simulates API rate limits to test fallback behaviors

`/bridge-kick` Forces a reconnection test for the local bridge daemon

`/backfill-sessions` Syncs missing local session logs with the remote database

`/break-cache` Invalidates the prompt cache to force a fresh completion

`/agents-platform` Opens the restricted internal agent management dashboard

`/onboarding` Restarts the initial interactive setup workflow (released)

`/oauth-refresh` Manually forces a refresh of your API OAuth tokens (released)

`/env` Inspects the sanitized environment variables visible to the agent

`/reset-limits` Resets local rate limiting counters for development

`/dream` Consolidates session memories and patterns into global context

`/version` Displays internal build numbers and feature flags

`/init-verifiers` Sets up automated testing verifiers for the workspace

### Undocumented launch flags

`--bare` Launch without hooks, plugins, or memory filesavailable

`--dump-system-prompt` Print the full hidden system prompt and exit

`--daemon-worker=<k>` Start as a background daemon subprocess worker

`--computer-use-mcp` Enable the Computer Use MCP server for screen control

`--claude-in-chrome-mcp` Enable Chrome browser automation via MCP

`--chrome-native-host` Run as Chrome extension native messaging host

`--bg` Run in a detached background tmux sessionavailable

`--spawn` Start in multi-agent spawn mode for parallel work

`--capacity <n>` Set max parallel worker count for agent swarms

`--worktree / -w` Isolate work in a temporary git worktreeavailable

### 32 feature flags compiled into the binary

`KAIROS` — Persistent AI assistant that runs continuously across sessions

`PROACTIVE` — Sleeping AI agents that run tasks proactively in the background

`COORDINATOR_MODE` — Multi-agent coordination for complex development tasks

`BRIDGE_MODE` — Remote control of your local Claude Code over the network

`DAEMON` — Background daemon to supervise and manage active sessions

`BG_SESSIONS` — Execute tasks silently in background terminal sessions

`ULTRAPLAN` — 30-minute autonomous planning phases for large features

`BUDDY` — Virtual AI companion pet with species, stats, and hats

`TORCH` — Opaque undocumented experimental mode for internal testing

`WORKFLOW_SCRIPTS` — Automates development workflows using custom scripts

`VOICE_MODE` — Voice interaction for hands-free coding · /voice works

`TEMPLATES` — Pre-built job templates for common development tasks

`CHICAGO_MCP` — Direct computer use via Chicago MCP · live for Max/Pro

`UDS_INBOX` — Inter-process communication using Unix domain sockets

`REACTIVE_COMPACT` — Automatically compacts context in real-time to save tokens

`CONTEXT_COLLAPSE` — Smartly collapses older context to maintain relevance

`HISTORY_SNIP` — Compresses conversation history into dense snippets

`CACHED_MICROCOMPACT` — Cached micro-compactions to speed up context retrieval

`TOKEN_BUDGET` — Strict per-turn token budgets to manage API costs

`EXTRACT_MEMORIES` — Continuously extracts long-term memories in the background

`OVERFLOW_TEST` — Strict testing for context window overflow scenarios

`TERMINAL_PANEL` — Captures terminal panel output directly for better context

`WEB_BROWSER` — Autonomously controls a headless web browser

`FORK_SUBAGENT` — Forks specialized sub-agents for parallel work

`DUMP_SYS_PROMPT` — Prints the complete hidden system prompt for debugging

`ABLATION_BASE` — Research-focused ablation mode to test model capabilities

`BYOC_RUNNER` — Bring-Your-Own-Compute runner for local model execution

`SELF_HOSTED` — Deploy the entire Claude Code backend on your own servers

`MONITOR_TOOL` — Built-in monitoring for agent performance and latency

`CCR_AUTO` — Auto-provisions cloud compute resources for heavy tasks

`MEM_SHAPE_TEL` — Telemetry on memory shaping and context retention patterns

`SKILL_SEARCH` — Experimental semantic search for discovering agent skills

### Gradual rollout gates (tengu\_\* namespace)

`tengu_malort_pedway` — computer use

`tengu_onyx_plover` — auto-dream

`tengu_kairos` — assistant mode

`tengu_ultraplan_model` — planning model

`tengu_cobalt_raccoon` — auto-compact

`tengu_portal_quail` — memory extract

`tengu_harbor` — MCP allowlist

`tengu_scratch` — worker scratch dirs

`tengu_herring_clock` — team memory

`tengu_chomp_inflection` — prompt suggest

Intercepted TransmissionREF: CC-2025-0401

### Debug & Profiling

`CLAUDE_CODE_PERFETTO_TRACE` Chrome trace via Perfetto

`CLAUDE_CODE_PROFILE_STARTUP` startup timing profiler

`CLAUDE_CODE_FRAME_TIMING_LOG` frame timing log output

`CLAUDE_CODE_VCR_RECORD` record HTTP interactions

`CLAUDE_CODE_DEBUG_REPAINTS` visualize UI repaints

### Runtime Overrides

`CLAUDE_CODE_OVERRIDE_DATE` inject fake date

`CLAUDE_CODE_MAX_CONTEXT_TOKENS` override context window

`MAX_THINKING_TOKENS` override thinking budget

`CLAUDE_CODE_EXTRA_BODY` inject extra API params

`AUTOCOMPACT_PCT_OVERRIDE` override compact threshold

`IDLE_THRESHOLD_MINUTES` idle threshold (75m default)

### Safety Bypass (Dangerous)

`DISABLE_COMMAND_INJECTION_CHECK` skip injection guard — DANGEROUS

`CLAUDE_CODE_ABLATION_BASELINE` disable ALL safety features

`DISABLE_INTERLEAVED_THINKING` disable interleaved thinking

### Anthropic Internal

`USER_TYPE=ant` unlock all internal features

`CLAUDE_INTERNAL_FC_OVERRIDES` override feature flags

`CLAUDE_MORERIGHT` "more right" layout

`CLAUDE_CODE_UNDERCOVER` undercover mode

`CLAUBBIT` internal testing

### Undercover Mode Strips All AI Evidence

When Anthropic employees contribute to public repos, a stealth system automatically strips all traces of AI involvement — commit messages, Co-Authored-By lines, model names. The prompt literally says ‘Do not blow your cover.’

`src/utils/undercover.ts`

### Capybara Encoded Char-by-Char to Evade Filters

The internal model codename ‘capybara’ is so protected they encode it as String.fromCharCode(99,97,112,121,98,97,114,97) to avoid triggering their own leak detector.

`src/buddy/types.ts:14`

### Auto-Permission System is Named ‘YOLO’

The function that decides whether Claude can run tools without asking is literally called classifyYoloAction() — with risk levels LOW/MEDIUM/HIGH using Claude to evaluate its own tool use.

`src/utils/permissions/yoloClassifier.ts`

### Tengu Telemetry Tracks 1000+ Event Types

Every action you take is logged under the ‘Tengu’ event prefix to Anthropic’s servers — tool grants, denials, YOLO decisions, session performance, subscription tier, and environment.

`src/services/analytics/`

### Computer Use Is Codenamed ‘Chicago’

Full GUI automation (mouse, clicks, screenshots) is gated behind tengu\_malort\_pedway. Employees bypass via ALLOW\_ANT\_COMPUTER\_USE\_MCP env var.

`src/utils/computerUse/gates.ts`

### Next Models Already Referenced in Code

The undercover prompt warns employees never to leak ‘opus-4-7’ and ‘sonnet-4-8’ — plausible next versions that don’t publicly exist yet.

`src/utils/undercover.ts:49`

### 22 Secret Anthropic Repos Exposed

The undercover allowlist reveals 22 private repository names: anthropics/casino, anthropics/trellis, anthropics/forge-web, anthropics/mycro\_manifests, anthropics/feldspar-testing, and more.

`src/utils/commitAttribution.ts`

### No Force-OFF Switch for Stealth Mode

There is explicitly NO way to permanently disable undercover mode. If the system can’t confirm it’s a private repo, stealth stays ON as defense-in-depth.

`src/utils/undercover.ts:16`

### Voice Mode Has Kill-Switch Named ‘Amber Quartz’

Voice mode exists with OAuth auth and an emergency off-switch called tengu\_amber\_quartz\_disabled, suggesting it’s still in active testing.

`src/voice/voiceModeEnabled.ts`

### AI Contributions Tracked to the Character

PR descriptions include exact percentage of AI-written code using character-level matching (e.g., ‘93% 3-shotted by claude-opus-4-6’) — stripped entirely in undercover mode.

`src/utils/commitAttribution.ts:325`

### 1M Context Disabled for HIPAA Deployments

The 1M token context window (vs 200K default) can be force-disabled with CLAUDE\_CODE\_DISABLE\_1M\_CONTEXT for healthcare compliance.

`src/utils/context.ts`

### Web Search Costs Exactly $0.01 Per Query

Each web search request is billed at a flat $0.01 regardless of results returned, tracked separately from token costs in the source.

`src/utils/modelCost.ts`

### Plan Mode V2 Spawns 3 Parallel Agents

Max/Team subscribers get 3 parallel exploration agents in plan mode; free users get 1. Override with CLAUDE\_CODE\_PLAN\_V2\_AGENT\_COUNT.

`src/utils/planModeV2.ts`

### @MODEL LAUNCH Tags Track Release Checklists

Source code contains @\[MODEL LAUNCH\] comment tags marking exactly which values engineers must update when Anthropic ships new models.

`src/utils/attribution.ts:70`

### Anti-Distillation Injects Fake Tools

Anthropic built an anti-distillation system that sends fake tool definitions to prevent competitors from training on Claude's outputs. Gated behind ANTI\_DISTILLATION\_CC feature flag and tengu\_anti\_distill\_fake\_tool\_injection.

`src/services/api/antiDistillation.ts`

### Every Request Fingerprinted via Hardcoded Salt

Each API request is tagged with a 3-char hex fingerprint: SHA256(SALT + msg\[4\] + msg\[7\] + msg\[20\] + version)\[:3\]. The salt '59cf53e54c78' is hardcoded and must match the server.

`src/utils/fingerprint.ts`

### ABLATION\_BASELINE Disables All Safety at Once

Setting CLAUDE\_CODE\_ABLATION\_BASELINE=1 force-enables CLAUDE\_CODE\_SIMPLE, DISABLE\_THINKING, DISABLE\_COMPACT, DISABLE\_AUTO\_MEMORY, and DISABLE\_BACKGROUND\_TASKS simultaneously — a research mode that strips Claude to bare metal.

`src/entrypoints/cli.tsx:21`

### Emergency Opus Kill Switch Disguised as Load Message

A hardcoded CUSTOM\_OFF\_SWITCH\_MESSAGE reads 'Opus is experiencing high load, please use /model to switch to Sonnet'. Despite the friendly wording, it's categorized internally as 'capacity\_off\_switch'.

`src/services/api/errors.ts:167`

### Binary-Level Client Attestation Written in Zig

A NATIVE\_CLIENT\_ATTESTATION feature injects a 'cch=c2dd6' placeholder into every API request body. Bun's native HTTP stack (Zig) overwrites it with a computed hash — proving the request came from a real binary.

`src/constants/system.ts:64-82`

### Transcript Classifier: Claude Judges Its Own Tool Safety

In auto-mode, a transcript classifier sends the full conversation to a side-query LLM call that decides whether to auto-approve tool use. Loads different permission templates for Anthropic employees vs external users.

`src/utils/permissions/yoloClassifier.ts`

### API Key Prefix Assembled at Runtime to Evade Own Scanner

The secret scanner constructs the Anthropic API key prefix as \['sk','ant','api'\].join('-') at runtime. Why? The literal string is banned by their own excluded-strings build check.

`src/services/teamMemorySync/secretScanner.ts:46`

### Full Prompt Dump Silently Logs Every API Call for Employees

For USER\_TYPE=ant builds, createDumpPromptsFetch() wraps every API call, writing the full request body AND streaming response to ~/.claude/dump-prompts/<session>.jsonl.

`src/services/api/dumpPrompts.ts`

### GrowthBook SDK So Broken They Cache Values Themselves

Two comments labeled 'WORKAROUND' explain GrowthBook's evalFeature() ignores pre-evaluated values from remote eval. Anthropic had to build their own caching layer on top.

`src/services/analytics/growthbook.ts:330-383`

### All Species Names Hex-Encoded to Dodge Leak Detector

The buddy pet system encodes ALL species names as String.fromCharCode() sequences. A comment explains: 'One species name collides with a model-codename canary in excluded-strings.txt.'

`src/buddy/types.ts:10-28`