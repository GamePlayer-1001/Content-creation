/**
 * [INPUT]: 依赖 core/pipeline 与 outputManager 共享执行链
 * [OUTPUT]: 提供 shared step executor 集成测试
 * [POS]: tools/tests 关键集成测试
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const TaskStateStore = require('../../core/pipeline/task-state-store');
const WorkflowRunner = require('../../core/pipeline/workflow-runner');
const PipelineStepExecutor = require('../../core/pipeline/step-executor');
const OutputManager = require('../../webapp/services/output-manager');

function createFixture() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shared-pipeline-'));
  const outputDir = path.join(tmpDir, 'output');
  const stateFile = path.join(tmpDir, 'state.json');
  const store = new TaskStateStore(stateFile);
  const runner = new WorkflowRunner(store);
  const outputManager = new OutputManager(outputDir);

  const aiAdapter = {
    async generate(prompt, engine = 'claude') {
      const normalized = String(prompt || '').replace(/\s+/g, ' ').trim();
      return `[${engine}] ${normalized.slice(0, 240)}`;
    },
  };

  const skillLoader = {
    buildPrompt(skillName, args = {}) {
      return [
        `skill=${skillName}`,
        `topic=${args.topic || ''}`,
        `label=${args.contentLabel || ''}`,
        `draft=${String(args.draftContent || '').slice(0, 200)}`,
      ].join('\n');
    },
  };

  const complianceEngine = {
    check(text) {
      return {
        score: text.includes('risk') ? 70 : 92,
        hits: text.includes('risk') ? [{ word: 'risk' }] : [],
      };
    },
  };

  const hotspotService = {
    async listHotspots({ query = '', source = 'manual' } = {}) {
      return {
        source,
        query,
        total: 2,
        fetchedAt: '2026-03-24T00:00:00.000Z',
        warnings: [],
        items: [
          {
            id: 'hotspot-1',
            title: 'AI workflow bottleneck',
            summary: 'Teams hit a review bottleneck after draft generation.',
            source,
          },
          {
            id: 'hotspot-2',
            title: 'Fallback hotspot',
            summary: 'Secondary hotspot',
            source,
          },
        ],
      };
    },
  };

  const stepExecutor = new PipelineStepExecutor({
    runner,
    hotspotService,
    aiAdapter,
    skillLoader,
    outputManager,
    complianceEngine,
    imageGenerator: null,
    projectRoot: tmpDir,
    logger: { log() {} },
  });

  return {
    runner,
    stepExecutor,
    outputManager,
    cleanup() {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    },
  };
}

async function runImplementedTextStages(stepExecutor, taskId) {
  await stepExecutor.runStep(taskId, { stage: 'hotspot-list', query: 'AI', source: 'manual' });
  await stepExecutor.runStep(taskId, { stage: 'hotspot-select', hotspotId: 'hotspot-1', confirm: true });
  await stepExecutor.runStep(taskId, {
    stage: 'hotspot-enrich',
    enrichment: 'Need a contrarian take on workflow bottlenecks.',
    facts: ['Review takes longer than drafting'],
    constraints: ['No hype'],
    materials: ['team retrospective'],
    confirm: true,
  });
  await stepExecutor.runStep(taskId, {
    stage: 'draft-generate',
    input: 'Why review bottlenecks matter more than draft speed',
    style: 'contrast',
    engine: 'codex',
  });
  await stepExecutor.runStep(taskId, {
    stage: 'platform-rewrite',
    platforms: ['GitHub', 'Medium'],
    engine: 'codex',
  });
  await stepExecutor.runStep(taskId, {
    stage: 'review-optimize',
    platforms: ['GitHub', 'Medium'],
    engine: 'codex',
    confirm: true,
  });
  await stepExecutor.runStep(taskId, {
    stage: 'layout-compose',
    platforms: ['GitHub', 'Medium'],
    confirm: true,
  });
  return stepExecutor.runStep(taskId, {
    stage: 'export-output',
    platforms: ['GitHub', 'Medium'],
  });
}

test('shared step executor completes draft-to-export text pipeline', async () => {
  const { runner, stepExecutor, outputManager, cleanup } = createFixture();
  try {
    const created = runner.createTask({ title: 'shared-execution-demo' }).task;
    const exportResult = await runImplementedTextStages(stepExecutor, created.id);

    assert.equal(exportResult.stage, 'export-output');
    assert.equal(exportResult.task.status, 'completed');
    assert.equal(exportResult.task.currentStage, 'export-output');

    const metadata = exportResult.task.metadata || {};
    assert.ok(metadata.draftFile);
    assert.equal(Object.keys(metadata.platformFiles || {}).length, 2);
    assert.equal((metadata.optimizedPlatforms || []).length, 2);
    assert.equal((metadata.layoutFiles || []).length, 2);
    assert.equal((metadata.finalFiles || []).length, 2);

    const finalFiles = metadata.finalFiles || [];
    for (const file of finalFiles) {
      const [platform, filename] = file.split('/');
      const text = outputManager.readFile(platform, filename);
      assert.match(text, /\[codex\]/);
    }
  } finally {
    cleanup();
  }
});

test('run-range style execution stops at confirmation stage and can resume', async () => {
  const { runner, stepExecutor, cleanup } = createFixture();
  try {
    const created = runner.createTask({ title: 'run-range-confirmation-demo' }).task;
    await stepExecutor.runStep(created.id, { stage: 'hotspot-list', query: 'AI', source: 'manual' });
    await stepExecutor.runStep(created.id, { stage: 'hotspot-select', hotspotId: 'hotspot-1', confirm: true });
    await stepExecutor.runStep(created.id, {
      stage: 'hotspot-enrich',
      enrichment: 'Need a clear bottleneck story.',
      confirm: true,
    });

    const stageSequence = ['draft-generate', 'platform-rewrite', 'review-optimize', 'layout-compose', 'export-output'];
    const executed = [];
    let stopAt = '';
    for (const stage of stageSequence) {
      const result = await stepExecutor.runStep(created.id, {
        stage,
        input: 'Review bottlenecks beat draft speed',
        platforms: ['GitHub'],
        engine: 'codex',
      });
      executed.push(stage);
      if (result.requiresConfirmation) {
        stopAt = stage;
        break;
      }
    }

    assert.equal(stopAt, 'review-optimize');
    const waitingTask = runner.getTask(created.id);
    assert.equal(waitingTask.status, 'awaiting_confirmation');
    assert.equal(waitingTask.pendingConfirmationStage, 'review-optimize');

    const resumeResult = await stepExecutor.runStep(created.id, {
      stage: 'review-optimize',
      platforms: ['GitHub'],
      engine: 'codex',
      confirm: true,
    });
    assert.equal(resumeResult.requiresConfirmation, false);

    const layoutResult = await stepExecutor.runStep(created.id, {
      stage: 'layout-compose',
      platforms: ['GitHub'],
      confirm: true,
    });
    assert.equal(layoutResult.requiresConfirmation, false);

    const exportResult = await stepExecutor.runStep(created.id, {
      stage: 'export-output',
      platforms: ['GitHub'],
    });
    assert.equal(exportResult.task.status, 'completed');
  } finally {
    cleanup();
  }
});
