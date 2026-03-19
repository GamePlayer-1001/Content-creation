#!/usr/bin/env node
/**
 * [INPUT]: 依赖 core/pipeline 共享层
 * [OUTPUT]: CLI Runner（阶段查看、任务创建、任务推进、任务查询、已实现阶段执行）
 * [POS]: app/cli 的最小可用入口，验证双通道共享任务状态
 */

const path = require('path');
const fs = require('fs');

_loadDotenv();

const { PIPELINE_STAGES } = require('../../core/pipeline/stages');
const TaskStateStore = require('../../core/pipeline/task-state-store');
const WorkflowRunner = require('../../core/pipeline/workflow-runner');
const PipelineStepExecutor = require('../../core/pipeline/step-executor');
const ConfigManager = require('../../webapp/services/config-manager');
const OutputManager = require('../../webapp/services/output-manager');
const AIAdapter = require('../../webapp/services/ai-adapter');
const SkillLoader = require('../../webapp/services/skill-loader');
const ComplianceEngine = require('../../webapp/services/compliance-engine');
const ImageGenerator = require('../../webapp/services/image-generator');
const { resolveRuntimeEnv } = require('../../core/config/runtime-env');

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const CONFIG_DIR = path.join(PROJECT_ROOT, 'config');
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'output');
const COMMANDS_DIR = path.join(PROJECT_ROOT, '.claude', 'commands');
const TEMPLATES_DIR = path.join(PROJECT_ROOT, 'templates');
const STATE_FILE = path.join(OUTPUT_DIR, 'logs', 'pipeline-task-state.json');

const runtimeEnv = resolveRuntimeEnv(process.env);
const store = new TaskStateStore(STATE_FILE);
const runner = new WorkflowRunner(store);
const configManager = new ConfigManager(CONFIG_DIR);
const outputManager = new OutputManager(OUTPUT_DIR);
const aiAdapter = new AIAdapter();
const skillLoader = new SkillLoader(COMMANDS_DIR, configManager, TEMPLATES_DIR);
const complianceEngine = new ComplianceEngine(configManager);
const imageGenerator = runtimeEnv.image.apiKey
  ? new ImageGenerator(runtimeEnv.image.apiKey, OUTPUT_DIR, runtimeEnv.image.model)
  : null;
const stepExecutor = new PipelineStepExecutor({
  runner,
  aiAdapter,
  skillLoader,
  outputManager,
  complianceEngine,
  imageGenerator,
  projectRoot: PROJECT_ROOT,
});
const EXECUTABLE_STAGE_SET = new Set([
  'draft-generate',
  'platform-rewrite',
  'review-optimize',
  'visual-generate',
  'export-output',
]);
if (!imageGenerator) {
  EXECUTABLE_STAGE_SET.delete('visual-generate');
}

const args = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];

async function main() {
  try {
    if (!command || command === 'help' || command === '--help') {
      printHelp();
      return;
    }

    if (command === 'stages') {
      printStages();
      return;
    }

    if (command === 'tasks' && subcommand === 'list') {
      const limit = Number(flagValue('--limit', '20'));
      printTaskList(runner.listTasks(Number.isNaN(limit) ? 20 : limit));
      return;
    }

    if (command === 'task' && subcommand === 'create') {
      const title = flagValue('--title', '').trim();
      const source = flagValue('--source', 'manual').trim() || 'manual';
      const created = runner.createTask({ title, source });
      console.log(JSON.stringify(created, null, 2));
      return;
    }

    if (command === 'task' && subcommand === 'show') {
      const taskId = requiredFlag('--id');
      const task = runner.getTask(taskId);
      if (!task) {
        console.error(`任务不存在: ${taskId}`);
        process.exitCode = 1;
        return;
      }
      console.log(JSON.stringify(task, null, 2));
      return;
    }

    if (command === 'task' && subcommand === 'advance') {
      const taskId = requiredFlag('--id');
      const toStage = requiredFlag('--to');
      const note = flagValue('--note', '');
      const confirm = hasFlag('--confirm');
      const result = runner.advanceTask(taskId, { toStage, confirm, note });
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    if (command === 'task' && subcommand === 'run-step') {
      const taskId = requiredFlag('--id');
      const stage = flagValue('--stage', '').trim() || flagValue('--to', '').trim();
      if (!stage) {
        throw new Error('缺少参数: --stage (或 --to)');
      }

      const runOptions = buildRunOptions();
      const result = await stepExecutor.runStep(taskId, { stage, ...runOptions });
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    if (command === 'task' && subcommand === 'run-range') {
      const taskId = requiredFlag('--id');
      const fromStage = flagValue('--from', '').trim();
      const toStage = flagValue('--to', '').trim();
      if (!fromStage || !toStage) {
        throw new Error('缺少参数: --from 与 --to');
      }
      const onError = resolveOnError(flagValue('--on-error', 'stop'));
      const retry = resolveRetry(flagValue('--retry', '0'));
      const stageList = resolveStageRange(fromStage, toStage);
      if (stageList.length === 0) {
        throw new Error(`区间内没有可执行阶段: ${fromStage} -> ${toStage}`);
      }

      const runOptions = buildRunOptions();
      const results = [];
      for (const stage of stageList) {
        const stageResult = await executeStageWithRetry(taskId, stage, runOptions, retry);
        results.push(stageResult);

        if (!stageResult.ok && onError === 'stop') {
          throw new Error(
            `run-range 在阶段 ${stage} 失败（已重试 ${stageResult.attempts} 次）：${stageResult.error}`
          );
        }
      }
      console.log(JSON.stringify({
        taskId,
        fromStage,
        toStage,
        onError,
        retry,
        executedStages: stageList,
        results,
      }, null, 2));
      return;
    }

    console.error(`未知命令: ${args.join(' ')}`);
    printHelp();
    process.exitCode = 1;
  } catch (error) {
    console.error(error.message || String(error));
    process.exitCode = 1;
  }
}

function printStages() {
  console.log('内容生产 9 阶段（共享定义）');
  for (const stage of PIPELINE_STAGES) {
    const flags = [
      stage.implemented ? 'implemented' : 'planned',
      stage.requiresConfirmation ? 'needs-confirm' : 'auto',
    ].join(', ');
    console.log(
      `${String(stage.order).padStart(2, '0')}. ${stage.key.padEnd(16)} ${stage.label} [${flags}]`
    );
  }
}

function printTaskList(tasks) {
  if (!tasks.length) {
    console.log('暂无任务');
    return;
  }
  for (const task of tasks) {
    console.log(
      `${task.id} | ${task.status} | ${task.currentStage || '-'} | ${task.title}`
    );
  }
}

function flagValue(name, fallback = '') {
  const idx = args.indexOf(name);
  if (idx === -1 || idx + 1 >= args.length) return fallback;
  return args[idx + 1];
}

function splitListFlag(name) {
  const raw = flagValue(name, '').trim();
  if (!raw) return [];
  return raw.split(',').map((x) => x.trim()).filter(Boolean);
}

function requiredFlag(name) {
  const value = flagValue(name, '').trim();
  if (!value) {
    throw new Error(`缺少参数: ${name}`);
  }
  return value;
}

function hasFlag(name) {
  return args.includes(name);
}

function resolveTextInput(directFlag, fileFlag) {
  const direct = flagValue(directFlag, '');
  if (direct) return direct;
  const filePath = flagValue(fileFlag, '').trim();
  if (!filePath) return '';
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

function buildRunOptions() {
  return {
    input: resolveTextInput('--input', '--input-file'),
    draftContent: resolveTextInput('--draft-content', '--draft-content-file'),
    draftFile: flagValue('--draft-file', '').trim(),
    style: flagValue('--style', '').trim(),
    engine: flagValue('--engine', 'claude').trim() || 'claude',
    platforms: splitListFlag('--platforms'),
    imagePrompt: resolveTextInput('--image-prompt', '--image-prompt-file'),
    stylePrompt: flagValue('--style-prompt', '').trim(),
    coverTitle: flagValue('--cover-title', '').trim(),
    coverSubtitle: flagValue('--cover-subtitle', '').trim(),
    imageType: flagValue('--image-type', '').trim(),
    aspectRatio: flagValue('--aspect-ratio', '').trim(),
    imageSize: flagValue('--image-size', '').trim(),
    note: flagValue('--note', ''),
    confirm: hasFlag('--confirm'),
  };
}

function resolveStageRange(fromStage, toStage) {
  const fromDef = PIPELINE_STAGES.find((s) => s.key === fromStage);
  const toDef = PIPELINE_STAGES.find((s) => s.key === toStage);
  if (!fromDef || !toDef) {
    throw new Error(`阶段不存在: ${fromStage} / ${toStage}`);
  }
  if (fromDef.order > toDef.order) {
    throw new Error(`阶段顺序非法: ${fromStage} 在 ${toStage} 之后`);
  }

  return PIPELINE_STAGES
    .filter((s) => s.order >= fromDef.order && s.order <= toDef.order)
    .filter((s) => EXECUTABLE_STAGE_SET.has(s.key))
    .map((s) => s.key);
}

async function executeStageWithRetry(taskId, stage, runOptions, retry) {
  let attempts = 0;
  let lastError = null;
  while (attempts <= retry) {
    attempts += 1;
    try {
      const result = await stepExecutor.runStep(taskId, {
        stage,
        ...runOptions,
        note: runOptions.note || `CLI run-range 执行 ${stage}`,
      });
      return {
        stage,
        ok: true,
        attempts,
        result,
      };
    } catch (error) {
      lastError = error;
    }
  }

  return {
    stage,
    ok: false,
    attempts,
    error: lastError?.message || '未知错误',
  };
}

function resolveOnError(raw) {
  const value = String(raw || 'stop').trim().toLowerCase();
  if (value === 'stop' || value === 'skip') return value;
  throw new Error(`不支持的 --on-error: ${raw}（可选: stop|skip）`);
}

function resolveRetry(raw) {
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new Error(`不支持的 --retry: ${raw}（需为 >=0 的整数）`);
  }
  return parsed;
}

function printHelp() {
  console.log(`
用法:
  node app/cli/runner.js stages
  node app/cli/runner.js tasks list [--limit 20]
  node app/cli/runner.js task create --title "热点任务" [--source manual]
  node app/cli/runner.js task show --id task-xxxx
  node app/cli/runner.js task advance --id task-xxxx --to review-optimize [--confirm] [--note "备注"]
  node app/cli/runner.js task run-step --id task-xxxx --stage draft-generate --input "素材"
  node app/cli/runner.js task run-step --id task-xxxx --stage platform-rewrite [--platforms 公众号,知乎]
  node app/cli/runner.js task run-step --id task-xxxx --stage review-optimize [--platforms 公众号,知乎]
  node app/cli/runner.js task run-step --id task-xxxx --stage visual-generate [--platforms 公众号] [--image-type both]
  node app/cli/runner.js task run-step --id task-xxxx --stage export-output [--platforms 公众号,知乎]
  node app/cli/runner.js task run-range --id task-xxxx --from draft-generate --to export-output

说明:
  --input / --input-file                    传入输入素材（draft-generate）
  --draft-content / --draft-content-file    直接传入母稿（platform-rewrite）
  --draft-file                              指定母稿文件（platform-rewrite）
  --platforms                               逗号分隔的平台名（默认全部/全量）
  --image-prompt / --image-prompt-file      图片提示词（visual-generate）
  --style-prompt                            图片风格补充提示（visual-generate）
  --cover-title / --cover-subtitle          封面文字（image-type=cover|both）
  --image-type                              cover|illustration|both（默认 illustration）
  --aspect-ratio / --image-size             图片比例/尺寸（默认 1:1 / 1K）
  --engine                                  指定 AI 引擎（默认 claude）
  --confirm                                  对非确认阶段显式传入确认标记
  --on-error                                run-range 失败策略: stop|skip（默认 stop）
  --retry                                   run-range 单阶段失败重试次数（默认 0）
  run-range                                 仅执行当前 CLI 已支持的阶段（draft/platform/review/visual/export）
  visual-generate                           依赖图片 API Key，未配置时 run-range 会自动跳过该阶段
`);
}

function _loadDotenv() {
  const envPath = path.join(__dirname, '..', '..', 'config', '.env');
  try {
    const dotenv = require('dotenv');
    dotenv.config({ path: envPath });
    return;
  } catch {}

  try {
    const dotenv = require('../../webapp/node_modules/dotenv');
    dotenv.config({ path: envPath });
  } catch {}
}

main();
