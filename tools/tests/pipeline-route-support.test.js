/**
 * [INPUT]: 依赖 webapp/routes/pipeline-route-support 的 legacy SSE helper 与 node:test
 * [OUTPUT]: 提供 pipeline-route-support 单元测试
 * [POS]: tools/tests 的路由辅助回归测试，验证 legacy SSE 协议与文本结果读取保持稳定
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  hydrateTextResult,
  runLegacySseStep,
} = require('../../webapp/routes/pipeline-route-support');

function createSseRecorder() {
  return {
    headers: [],
    chunks: [],
    ended: false,
    setHeader(name, value) {
      this.headers.push([name, value]);
    },
    flushHeaders() {},
    write(chunk) {
      this.chunks.push(String(chunk));
    },
    end() {
      this.ended = true;
    },
  };
}

function parseSseEvents(res) {
  return res.chunks
    .map((chunk) => chunk.match(/^data:\s*(.+)$/m))
    .filter(Boolean)
    .map((match) => JSON.parse(match[1]));
}

test('hydrateTextResult reads file content and falls back to provided length', () => {
  const outputManager = {
    readFile(platform, filename) {
      return `${platform}:${filename}:content`;
    },
  };

  const hydrated = hydrateTextResult(outputManager, {
    file: 'GitHub/sample.md',
  }, { platform: 'GitHub' });

  assert.deepEqual(hydrated, {
    platform: 'GitHub',
    file: 'GitHub/sample.md',
    content: 'GitHub:sample.md:content',
    length: 'GitHub:sample.md:content'.length,
  });

  const empty = hydrateTextResult(outputManager, {
    file: '',
    length: 12,
  });
  assert.equal(empty.length, 12);
  assert.equal(empty.content, '');
});

test('runLegacySseStep sends done payload and closes stream', async () => {
  const res = createSseRecorder();

  await runLegacySseStep(res, {
    resolveTaskId: () => 'task-1',
    beforeRun: (taskId) => {
      assert.equal(taskId, 'task-1');
      res.write(`data: ${JSON.stringify({ type: 'status', taskId })}\n\n`);
    },
    run: async (taskId) => ({
      task: { id: taskId },
    }),
    afterRun: () => ({
      results: [{ platform: 'GitHub' }],
    }),
  });

  const events = parseSseEvents(res);
  assert.equal(events[0].type, 'status');
  assert.deepEqual(events[1], {
    type: 'done',
    results: [{ platform: 'GitHub' }],
    task: { id: 'task-1' },
    taskProgressError: null,
  });
  assert.equal(res.ended, true);
});

test('runLegacySseStep sends validation error without invoking runner', async () => {
  const res = createSseRecorder();
  let executed = false;

  await runLegacySseStep(res, {
    validate: () => '缺少参数',
    run: async () => {
      executed = true;
      return {};
    },
  });

  const events = parseSseEvents(res);
  assert.deepEqual(events, [{ type: 'error', message: '缺少参数' }]);
  assert.equal(executed, false);
  assert.equal(res.ended, true);
});
