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

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const CONFIG_DIR = path.join(PROJECT_ROOT, 'config');
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'output');
const COMMANDS_DIR = path.join(PROJECT_ROOT, '.claude', 'commands');
const TEMPLATES_DIR = path.join(PROJECT_ROOT, 'templates');
const STATE_FILE = path.join(OUTPUT_DIR, 'logs', 'pipeline-task-state.json');

const store = new TaskStateStore(STATE_FILE);
const runner = new WorkflowRunner(store);
const configManager = new ConfigManager(CONFIG_DIR);
const outputManager = new OutputManager(OUTPUT_DIR);
const aiAdapter = new AIAdapter();
const skillLoader = new SkillLoader(COMMANDS_DIR, configManager, TEMPLATES_DIR);
const complianceEngine = new ComplianceEngine(configManager);
const stepExecutor = new PipelineStepExecutor({
  runner,
  aiAdapter,
  skillLoader,
  outputManager,
  complianceEngine,
  projectRoot: PROJECT_ROOT,
});

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

      const input = resolveTextInput('--input', '--input-file');
      const draftContent = resolveTextInput('--draft-content', '--draft-content-file');
      const draftFile = flagValue('--draft-file', '').trim();
      const style = flagValue('--style', '').trim();
      const engine = flagValue('--engine', 'claude').trim() || 'claude';
      const platforms = splitListFlag('--platforms');
      const note = flagValue('--note', '');
      const confirm = hasFlag('--confirm');

      const result = await stepExecutor.runStep(taskId, {
        stage,
        input,
        style,
        engine,
        platforms,
        draftFile,
        draftContent,
        note,
        confirm,
      });
      console.log(JSON.stringify(result, null, 2));
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
  node app/cli/runner.js task run-step --id task-xxxx --stage export-output [--platforms 公众号,知乎]

说明:
  --input / --input-file                    传入输入素材（draft-generate）
  --draft-content / --draft-content-file    直接传入母稿（platform-rewrite）
  --draft-file                              指定母稿文件（platform-rewrite）
  --platforms                               逗号分隔的平台名（默认全部/全量）
  --engine                                  指定 AI 引擎（默认 claude）
  --confirm                                  对非确认阶段显式传入确认标记
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
