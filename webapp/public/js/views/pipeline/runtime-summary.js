/**
 * [INPUT]: 依赖 escapeHtml 与 parseTextList
 * [OUTPUT]: 扩展 PipelineTaskRuntime 的摘要卡、阶段推断与控制面板辅助方法
 * [POS]: views/pipeline 的运行时摘要层，被 pipeline.js 页面壳与动作层复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineTaskRuntime, {
  _renderTaskSummaryCard() {
    const task = this.state.taskSnapshot;
    if (!task) return '';

    const metadata = task.metadata && typeof task.metadata === 'object' ? task.metadata : {};
    const stageOutputs = metadata.stageOutputs && typeof metadata.stageOutputs === 'object'
      ? metadata.stageOutputs
      : {};
    const stageKeys = Object.keys(stageOutputs);
    const artifacts = Array.isArray(metadata.artifacts) ? metadata.artifacts : [];
    const checkpoints = Array.isArray(metadata.checkpoints) ? metadata.checkpoints : [];
    const latestCheckpoint = checkpoints.length ? checkpoints[checkpoints.length - 1] : null;
    const finalFiles = Array.isArray(metadata.finalFiles) ? metadata.finalFiles : [];
    const runRange = metadata.runRange && typeof metadata.runRange === 'object' ? metadata.runRange : null;
    const nextStage = this._resolveNextRunnableStage(task);
    const implementedStages = this._getImplementedStages();
    const lastStage = implementedStages.length > 0 ? implementedStages[implementedStages.length - 1] : null;
    const pendingStage = task?.pendingConfirmationStage || '';
    const rewindableStages = this._getRewindableStages(task);
    const runNextLabel = pendingStage
      ? `确认阶段: ${pendingStage}`
      : (nextStage ? `执行下一阶段: ${nextStage.key}` : '阶段已全部完成');
    const runRangeLabel = pendingStage
      ? `待确认后可批量执行: ${pendingStage}`
      : (nextStage && lastStage ? `从 ${nextStage.key} 跑到 ${lastStage.key}` : '无可执行区间');

    const stageRows = stageKeys.slice(-4).map((key) => {
      const output = stageOutputs[key] || {};
      const stamp = output.at ? output.at.replace('T', ' ').slice(0, 19) : '-';
      return `
        <div style="font-size:11px;color:var(--muted);margin-top:4px">
          <code>${key}</code> · ${stamp}
        </div>
      `;
    }).join('');

    const finalRows = finalFiles.slice(-3).map((file) => `
      <div style="font-size:11px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
        ${file}
      </div>
    `).join('');

    const runRangeRow = runRange ? `
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
        <div style="font-size:11px;color:var(--muted)">最近批量执行</div>
        <div style="font-size:12px;margin-top:2px">
          ${runRange.fromStage || '-'} → ${runRange.toStage || '-'}
          · 失败 ${Array.isArray(runRange.failedStages) ? runRange.failedStages.length : 0}
          · ${runRange.pendingConfirmationStage ? `待确认 ${runRange.pendingConfirmationStage}` : `建议续跑 ${runRange.resumeFromStage || '-'}`}
        </div>
      </div>
    ` : '';

    const runControlRow = `
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
        <div style="font-size:11px;color:var(--muted)">阶段控制台</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:6px">
          <button class="btn btn-sm" id="pl-task-run-next" ${(pendingStage || nextStage) ? '' : 'disabled'}>
            ${runNextLabel}
          </button>
          <button class="btn btn-sm" id="pl-task-run-range" ${(!pendingStage && nextStage && lastStage) ? '' : 'disabled'}>
            ${runRangeLabel}
          </button>
          <span id="pl-task-run-status" style="font-size:11px;color:var(--muted)"></span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px">
          <select class="form-select" id="pl-task-rewind-stage" style="width:auto;min-width:180px" ${rewindableStages.length ? '' : 'disabled'}>
            ${rewindableStages.length
              ? rewindableStages.map((stage) => `<option value="${stage.key}">${stage.order}. ${escapeHtml(stage.label)}</option>`).join('')
              : '<option value="">无可回退阶段</option>'}
          </select>
          <button class="btn btn-sm" id="pl-task-rewind" ${rewindableStages.length ? '' : 'disabled'}>回退到所选阶段</button>
          <button class="btn btn-sm" id="pl-task-rewind-run" ${rewindableStages.length ? '' : 'disabled'}>回退并执行</button>
        </div>
      </div>
    `;

    const checkpointRows = checkpoints.slice(-6).reverse().map((cp) => {
      const stamp = cp?.at ? String(cp.at).replace('T', ' ').slice(0, 19) : '-';
      const stage = cp?.stage || '-';
      const source = cp?.source || '-';
      const note = cp?.note || '';
      return `
        <div style="font-size:11px;color:var(--muted);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${stamp} · <code>${stage}</code> · ${source}${note ? ` · ${note}` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="card" style="margin:-4px 0 14px">
        <div class="card-header">任务摘要</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;font-size:12px">
          <div>
            <div style="color:var(--muted)">阶段输出</div>
            <div style="margin-top:2px">${stageKeys.length}</div>
          </div>
          <div>
            <div style="color:var(--muted)">产物条目</div>
            <div style="margin-top:2px">${artifacts.length}</div>
          </div>
          <div>
            <div style="color:var(--muted)">检查点</div>
            <div style="margin-top:2px">${checkpoints.length}</div>
          </div>
          <div>
            <div style="color:var(--muted)">最近检查点</div>
            <div style="margin-top:2px">${latestCheckpoint?.stage || '-'}</div>
          </div>
        </div>
        ${stageRows ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)"><div style="font-size:11px;color:var(--muted)">最近阶段输出</div>${stageRows}</div>` : ''}
        ${finalRows ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)"><div style="font-size:11px;color:var(--muted)">最近导出文件</div>${finalRows}</div>` : ''}
        ${runControlRow}
        ${runRangeRow}
        ${checkpointRows ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)"><div style="font-size:11px;color:var(--muted)">执行时间线</div>${checkpointRows}</div>` : ''}
      </div>
    `;
  },

  _getImplementedStages() {
    return (Array.isArray(this.state.pipelineStages) ? this.state.pipelineStages : [])
      .filter((stage) => stage && stage.key && stage.implemented)
      .sort((a, b) => a.order - b.order);
  },

  _resolveNextRunnableStage(task = this.state.taskSnapshot) {
    const implemented = this._getImplementedStages();
    if (implemented.length === 0) return null;
    const completed = new Set(Array.isArray(task?.completedStages) ? task.completedStages : []);
    return implemented.find((stage) => !completed.has(stage.key)) || null;
  },

  _getRewindableStages(task = this.state.taskSnapshot) {
    const implemented = this._getImplementedStages();
    if (implemented.length === 0) return [];
    const anchorKey = task?.pendingConfirmationStage || task?.currentStage || '';
    if (!anchorKey) return [];
    const anchor = implemented.find((stage) => stage.key === anchorKey);
    if (!anchor) return [];
    return implemented.filter((stage) => stage.order <= anchor.order);
  },

  _buildTaskRunPayload() {
    const fallbackPlatforms = this.state.platformResults.map((item) => item.platform).filter(Boolean);
    return {
      source: this.state.hotspotSource || 'auto',
      query: this.state.hotspotQuery || '',
      limit: 20,
      hotspotId: this.state.selectedHotspot?.id || this.state.selectedHotspot?.title || '',
      enrichment: this.state.input || '',
      facts: parseTextList(this.state.hotspotFactsText || ''),
      constraints: parseTextList(this.state.hotspotConstraintsText || ''),
      materials: parseTextList(this.state.hotspotMaterialsText || ''),
      input: this.state.input || '',
      style: this.state.style || '',
      engine: this.state.engine || 'claude',
      platforms: this.state.platforms.length > 0 ? this.state.platforms : fallbackPlatforms,
      draftFile: this.state.draftFile || '',
      draftContent: this.state.draftContent || '',
      note: 'WebApp 任务摘要卡阶段执行',
      confirm: false,
    };
  },
});
