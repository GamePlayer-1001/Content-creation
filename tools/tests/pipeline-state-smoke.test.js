/**
 * [INPUT]: 依赖 WorkflowRunner 阶段定义 与 node:test
 * [OUTPUT]: 提供任务状态 smoke tests
 * [POS]: tools/tests 轻量回归测试
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const TaskStateStore = require('../../core/pipeline/task-state-store');
const WorkflowRunner = require('../../core/pipeline/workflow-runner');

function createRunner() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pipeline-state-'));
  const stateFile = path.join(tmpDir, 'state.json');
  const store = new TaskStateStore(stateFile);
  return {
    runner: new WorkflowRunner(store),
    cleanup() {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    },
  };
}

test('required confirmation blocks later stages until confirmed', () => {
  const { runner, cleanup } = createRunner();
  try {
    const created = runner.createTask({ title: 'confirm-demo' }).task;

    const waiting = runner.advanceTask(created.id, {
      toStage: 'hotspot-select',
      confirm: false,
    });

    assert.equal(waiting.advanced, false);
    assert.equal(waiting.requiresConfirmation, true);
    assert.equal(waiting.task.status, 'awaiting_confirmation');
    assert.equal(waiting.task.pendingConfirmationStage, 'hotspot-select');

    assert.throws(
      () => runner.advanceTask(created.id, { toStage: 'draft-generate', confirm: false }),
      /待确认阶段/
    );

    const confirmed = runner.advanceTask(created.id, {
      toStage: 'hotspot-select',
      confirm: true,
    });

    assert.equal(confirmed.advanced, true);
    assert.equal(confirmed.task.currentStage, 'hotspot-select');
    assert.equal(confirmed.task.pendingConfirmationStage, null);
  } finally {
    cleanup();
  }
});

test('rewindTask trims completed stages and clears pending confirmation', () => {
  const { runner, cleanup } = createRunner();
  try {
    const created = runner.createTask({ title: 'rewind-demo' }).task;
    runner.advanceTask(created.id, { toStage: 'hotspot-list' });
    runner.advanceTask(created.id, { toStage: 'hotspot-select', confirm: true });
    runner.advanceTask(created.id, { toStage: 'hotspot-enrich', confirm: true });
    runner.advanceTask(created.id, { toStage: 'draft-generate' });

    const rewound = runner.rewindTask(created.id, {
      toStage: 'hotspot-select',
      note: 'smoke test rewind',
    });

    assert.equal(rewound.rewound, true);
    assert.equal(rewound.nextRecommendedStage, 'hotspot-select');
    assert.equal(rewound.task.currentStage, 'hotspot-list');
    assert.equal(rewound.task.pendingConfirmationStage, null);
    assert.deepEqual(rewound.task.completedStages, ['hotspot-list']);
    assert.equal(rewound.task.status, 'in_progress');

    const lastHistory = rewound.task.history[rewound.task.history.length - 1];
    assert.equal(lastHistory.type, 'stage_rewound');
    assert.equal(lastHistory.fromStage, 'draft-generate');
    assert.equal(lastHistory.toStage, 'hotspot-select');
  } finally {
    cleanup();
  }
});
