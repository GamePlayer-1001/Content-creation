#!/usr/bin/env node
/**
 * [INPUT]: 依赖 core/pipeline 共享层
 * [OUTPUT]: CLI Runner（阶段查看、任务创建、任务推进、任务查询）
 * [POS]: app/cli 的最小可用入口，验证双通道共享任务状态
 */

const path = require('path');

const { PIPELINE_STAGES } = require('../../core/pipeline/stages');
const TaskStateStore = require('../../core/pipeline/task-state-store');
const WorkflowRunner = require('../../core/pipeline/workflow-runner');

const OUTPUT_DIR = path.join(__dirname, '..', '..', 'output');
const STATE_FILE = path.join(OUTPUT_DIR, 'logs', 'pipeline-task-state.json');

const store = new TaskStateStore(STATE_FILE);
const runner = new WorkflowRunner(store);

const args = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];

function main() {
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

function printHelp() {
  console.log(`
用法:
  node app/cli/runner.js stages
  node app/cli/runner.js tasks list [--limit 20]
  node app/cli/runner.js task create --title "热点任务" [--source manual]
  node app/cli/runner.js task show --id task-xxxx
  node app/cli/runner.js task advance --id task-xxxx --to review-optimize [--confirm] [--note "备注"]
`);
}

main();
