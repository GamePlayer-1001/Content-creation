/**
 * [INPUT]: 依赖 API/showToast/escapeHtml/parseTextList
 * [OUTPUT]: 导出 PipelineTaskRuntime 任务运行时方法集合
 * [POS]: views/pipeline 的任务上下文与阶段控制层，被 pipeline.js 混入使用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const PipelineTaskRuntime = {
  _updateTaskFromResponse(payload) {
    const task = payload?.task;
    if (!task) return;
    this.state.taskId = task.id || this.state.taskId;
    this.state.taskStatus = task.status || this.state.taskStatus;
    this.state.taskCurrentStage = task.currentStage || this.state.taskCurrentStage;
    this.state.taskSnapshot = task;
    this.state.activeStageKey = task.pendingConfirmationStage || task.currentStage || this.state.activeStageKey;
    if (Array.isArray(this.state.recentTasks)) {
      const idx = this.state.recentTasks.findIndex((item) => item.id === task.id);
      if (idx >= 0) {
        this.state.recentTasks[idx] = { ...this.state.recentTasks[idx], ...task };
      } else {
        this.state.recentTasks.unshift(task);
        this.state.recentTasks = this.state.recentTasks.slice(0, 8);
      }
    }
    if (payload?.taskProgressError) {
      showToast(`任务状态同步警告: ${payload.taskProgressError}`, 'error');
    }
  },

  _normalizeFilePath(filePath) {
    return String(filePath || '').trim();
  },

  _readSharedExecutionText(filePath) {
    const normalized = this._normalizeFilePath(filePath);
    if (!normalized || !normalized.includes('/')) {
      throw new Error(`无效输出文件路径: ${normalized || '(empty)'}`);
    }
    return API.readOutputFile(normalized);
  },

  _writeSharedExecutionText(filePath, content) {
    const normalized = this._normalizeFilePath(filePath);
    if (!normalized || !normalized.includes('/')) {
      throw new Error(`无效输出文件路径: ${normalized || '(empty)'}`);
    }
    return API.writeOutputFile(normalized, content);
  },

  async _loadSharedTextOutputs(items, mapFn) {
    const list = Array.isArray(items) ? items : [];
    const results = await Promise.allSettled(list.map(async (item, index) => {
      const mapped = mapFn ? mapFn(item, index) : item;
      if (!mapped?.file) return null;
      const data = await this._readSharedExecutionText(mapped.file);
      return {
        ...mapped,
        content: data?.content || '',
      };
    }));

    return results
      .filter((entry) => entry.status === 'fulfilled' && entry.value)
      .map((entry) => {
        const value = entry.value;
        return {
          ...value,
          length: value.length || value.content.length,
        };
      });
  },

  async _hydrateTaskExecutionResults(task = this.state.taskSnapshot) {
    if (!task) return;

    const metadata = task?.metadata && typeof task.metadata === 'object' ? task.metadata : {};
    this.state.draftFile = '';
    this.state.draftContent = '';
    this.state.platforms = [];
    this.state.platformsOptimize = [];
    this.state.platformResults = [];
    this.state.finalResults = [];
    this.state.images = [];
    this.state.coverExtractions = {};
    this.state.illustrationExtractions = {};
    this.state.coverStylePrompts = {};
    this.state.illustrationStylePrompts = {};
    const draftFile = this._normalizeFilePath(metadata.draftFile || '');
    const platformFileMap = metadata.platformFiles && typeof metadata.platformFiles === 'object'
      ? metadata.platformFiles
      : {};
    const platformResultsMeta = Array.isArray(metadata.platformResults) ? metadata.platformResults : [];
    const platformEntries = platformResultsMeta.length > 0
      ? platformResultsMeta
        .filter((item) => item?.platform && this._normalizeFilePath(item.file).includes('/'))
        .map((item) => ({ platform: item.platform, file: item.file, length: item.length || 0 }))
      : Object.entries(platformFileMap)
        .filter(([, file]) => this._normalizeFilePath(file).includes('/'))
        .map(([platform, file]) => ({ platform, file }));
    const finalResultsMeta = Array.isArray(metadata.finalResults) ? metadata.finalResults : [];
    const finalFiles = Array.isArray(metadata.finalFiles) ? metadata.finalFiles : [];
    const imageAssets = Array.isArray(metadata.imageAssets) ? metadata.imageAssets : [];
    const optimizedPlatforms = Array.isArray(metadata.optimizedPlatforms) ? metadata.optimizedPlatforms : [];

    if (draftFile) {
      try {
        const draftData = await this._readSharedExecutionText(draftFile);
        this.state.draftFile = draftFile;
        this.state.draftContent = draftData?.content || '';
      } catch {
        this.state.draftFile = '';
        this.state.draftContent = '';
      }
    }

    if (platformEntries.length > 0) {
      const restoredResults = await this._loadSharedTextOutputs(platformEntries, (item) => item);
      if (restoredResults.length > 0) {
        this.state.platformResults = restoredResults;
        this.state.platforms = restoredResults.map((item) => item.platform).filter(Boolean);
        this.state.platformsOptimize = this.state.platforms.filter((platform) => optimizedPlatforms.includes(platform));
      }
    }

    if (imageAssets.length > 0) {
      this.state.images = imageAssets
        .filter((item) => item?.platform && item?.path)
        .map((item) => ({
          platform: item.platform,
          imageType: item.imageType || 'illustration',
          path: item.path,
          filename: item.filename || '',
        }));
      for (const item of this.state.images) {
        if (item.imageType === 'cover') {
          this.state.coverExtractions[item.platform] = this.state.coverExtractions[item.platform] || {};
        } else {
          this.state.illustrationExtractions[item.platform] = this.state.illustrationExtractions[item.platform] || '';
        }
      }
    }

    if (finalResultsMeta.length > 0) {
      this.state.finalResults = finalResultsMeta
        .filter((item) => item?.file)
        .map((item) => ({
          platform: item.platform || '',
          file: item.file,
          obsidianUri: item.obsidianUri || '',
          length: item.length || 0,
        }));
    } else if (finalFiles.length > 0) {
      this.state.finalResults = finalFiles
        .filter((file) => this._normalizeFilePath(file))
        .map((file) => ({ file, platform: '', obsidianUri: '', length: 0 }));
    }
  },

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

  async _confirmPendingStage(stageKey) {
    if (!this.state.taskId || !stageKey) return null;
    const result = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/advance`, {
      toStage: stageKey,
      confirm: true,
      note: `WebApp 确认阶段: ${stageKey}`,
    });
    this._updateTaskFromResponse(result);
    return result;
  },

  async _rewindTask(stageKey) {
    if (!this.state.taskId || !stageKey) return null;
    const result = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/rewind`, {
      toStage: stageKey,
      note: `WebApp 回退到阶段: ${stageKey}`,
    });
    this._updateTaskFromResponse(result);
    return result;
  },

  async _runTaskStage(stageKey) {
    if (!this.state.taskId || !stageKey) return null;
    const payload = {
      stage: stageKey,
      ...this._buildTaskRunPayload(),
    };
    const result = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/run-step`, payload);
    this._updateTaskFromResponse(result);
    return result;
  },

  async _runTaskRange(fromStage, toStage) {
    if (!this.state.taskId || !fromStage || !toStage) return null;
    const payload = {
      fromStage,
      toStage,
      onError: 'stop',
      retry: 0,
      ...this._buildTaskRunPayload(),
    };
    const result = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/run-range`, payload);
    try {
      const latest = await API.get(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}`);
      this._updateTaskFromResponse(latest);
    } catch {}
    return result;
  },

  _bindTaskActions() {
    const runNextBtn = document.getElementById('pl-task-run-next');
    const runRangeBtn = document.getElementById('pl-task-run-range');
    const rewindSelect = document.getElementById('pl-task-rewind-stage');
    const rewindBtn = document.getElementById('pl-task-rewind');
    const rewindRunBtn = document.getElementById('pl-task-rewind-run');
    const statusEl = document.getElementById('pl-task-run-status');
    if (!runNextBtn && !runRangeBtn && !rewindBtn && !rewindRunBtn) return;
    const baseRunNextDisabled = runNextBtn ? runNextBtn.disabled : true;
    const baseRunRangeDisabled = runRangeBtn ? runRangeBtn.disabled : true;
    const baseRewindDisabled = rewindBtn ? rewindBtn.disabled : true;
    const baseRewindRunDisabled = rewindRunBtn ? rewindRunBtn.disabled : true;

    const setStatus = (text, isError = false) => {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = isError ? '#b91c1c' : 'var(--muted)';
    };

    const setButtonsDisabled = (disabled) => {
      if (runNextBtn) runNextBtn.disabled = baseRunNextDisabled || disabled;
      if (runRangeBtn) runRangeBtn.disabled = baseRunRangeDisabled || disabled;
      if (rewindBtn) rewindBtn.disabled = baseRewindDisabled || disabled;
      if (rewindRunBtn) rewindRunBtn.disabled = baseRewindRunDisabled || disabled;
      if (rewindSelect) rewindSelect.disabled = disabled || (!rewindSelect.options?.length);
    };

    if (runNextBtn) {
      runNextBtn.onclick = async () => {
        const pendingStage = this.state.taskSnapshot?.pendingConfirmationStage || '';
        const next = this._resolveNextRunnableStage(this.state.taskSnapshot);
        if (!pendingStage && !next) {
          showToast('任务阶段已全部完成');
          return;
        }
        setButtonsDisabled(true);
        setStatus(pendingStage ? `确认中: ${pendingStage} ...` : `执行中: ${next.key} ...`);
        try {
          const result = pendingStage
            ? await this._confirmPendingStage(pendingStage)
            : await this._runTaskStage(next.key);
          await this._hydrateTaskExecutionResults(result?.task || this.state.taskSnapshot);
          if (pendingStage) {
            showToast(`阶段确认完成: ${pendingStage}`);
            setStatus(`已确认: ${pendingStage}`);
          } else if (result?.requiresConfirmation) {
            showToast(`阶段待确认: ${next.key}`);
            setStatus(`待确认: ${next.key}`);
          } else {
            showToast(`阶段执行完成: ${next.key}`);
            setStatus(`完成: ${next.key}`);
          }
          await this.render();
        } catch (error) {
          showToast(error.message, 'error');
          setStatus(`失败: ${error.message}`, true);
          setButtonsDisabled(false);
        }
      };
    }

    if (runRangeBtn) {
      runRangeBtn.onclick = async () => {
        const next = this._resolveNextRunnableStage(this.state.taskSnapshot);
        const implemented = this._getImplementedStages();
        const last = implemented.length > 0 ? implemented[implemented.length - 1] : null;
        if (!next || !last) {
          showToast('无可执行区间');
          return;
        }
        setButtonsDisabled(true);
        setStatus(`批量执行中: ${next.key} -> ${last.key} ...`);
        try {
          const result = await this._runTaskRange(next.key, last.key);
          await this._hydrateTaskExecutionResults(this.state.taskSnapshot);
          const failed = Array.isArray(result?.failedStages) ? result.failedStages : [];
          const pendingStage = result?.pendingConfirmationStage || '';
          if (pendingStage) {
            showToast(`批量执行已停在待确认阶段: ${pendingStage}`);
            setStatus(`待确认: ${pendingStage}`);
          } else if (failed.length > 0) {
            showToast(`批量执行完成，失败阶段: ${failed.join(', ')}`, 'error');
            setStatus(`完成（有失败）: ${failed.join(', ')}`, true);
          } else {
            showToast(`批量执行完成: ${next.key} -> ${last.key}`);
            setStatus(`完成: ${next.key} -> ${last.key}`);
          }
          await this.render();
        } catch (error) {
          showToast(error.message, 'error');
          setStatus(`失败: ${error.message}`, true);
          setButtonsDisabled(false);
        }
      };
    }

    if (rewindBtn) {
      rewindBtn.onclick = async () => {
        const stageKey = rewindSelect?.value || '';
        if (!stageKey) {
          showToast('请选择回退阶段');
          return;
        }
        setButtonsDisabled(true);
        setStatus(`回退中: ${stageKey} ...`);
        try {
          const result = await this._rewindTask(stageKey);
          this._focusStage(stageKey);
          await this._hydrateTaskExecutionResults(result?.task || this.state.taskSnapshot);
          showToast(`已回退到阶段: ${stageKey}`);
          setStatus(`已回退: ${stageKey}`);
          await this.render();
        } catch (error) {
          showToast(error.message, 'error');
          setStatus(`回退失败: ${error.message}`, true);
          setButtonsDisabled(false);
        }
      };
    }

    if (rewindRunBtn) {
      rewindRunBtn.onclick = async () => {
        const stageKey = rewindSelect?.value || '';
        if (!stageKey) {
          showToast('请选择回退阶段');
          return;
        }
        setButtonsDisabled(true);
        setStatus(`回退并执行: ${stageKey} ...`);
        try {
          await this._rewindTask(stageKey);
          const result = await this._runTaskStage(stageKey);
          this._focusStage(stageKey);
          await this._hydrateTaskExecutionResults(result?.task || this.state.taskSnapshot);
          if (result?.requiresConfirmation) {
            showToast(`阶段待确认: ${stageKey}`);
            setStatus(`待确认: ${stageKey}`);
          } else {
            showToast(`已回退并执行: ${stageKey}`);
            setStatus(`完成: ${stageKey}`);
          }
          await this.render();
        } catch (error) {
          showToast(error.message, 'error');
          setStatus(`回退并执行失败: ${error.message}`, true);
          setButtonsDisabled(false);
        }
      };
    }
  },

  _renderStageProgressStrip() {
    const stages = Array.isArray(this.state.pipelineStages) ? this.state.pipelineStages : [];
    if (stages.length === 0) return '';

    const task = this.state.taskSnapshot || {};
    const completed = new Set(Array.isArray(task?.completedStages) ? task.completedStages : []);
    const current = task?.currentStage || '';
    const waiting = task?.pendingConfirmationStage || '';

    const chips = stages.map((stage) => {
      let status = 'planned';
      if (completed.has(stage.key)) status = 'done';
      else if (current === stage.key) status = 'current';
      else if (waiting === stage.key) status = 'waiting';
      else if (stage.implemented) status = 'ready';

      const colorMap = {
        done: '#16a34a',
        current: '#2563eb',
        waiting: '#d97706',
        ready: '#64748b',
        planned: '#9ca3af',
      };
      const dot = colorMap[status] || '#9ca3af';
      const hint = stage.implemented ? '已实现' : '规划中';
      return `
        <div style="display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:999px;padding:4px 10px;font-size:11px;white-space:nowrap">
          <span style="width:7px;height:7px;border-radius:50%;background:${dot};display:inline-block"></span>
          <span>${stage.order}. ${escapeHtml(stage.label)}</span>
          <span style="color:var(--muted)">(${hint})</span>
        </div>
      `;
    }).join('');

    return `
      <div class="card" style="margin:-2px 0 12px">
        <div class="card-header">9阶段进度</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${chips}</div>
      </div>
    `;
  },

  async _loadRecentTasks(force = false) {
    if (!force && this.state.recentTasks.length > 0) return;
    try {
      const data = await API.get('/pipeline/tasks?limit=8');
      this.state.recentTasks = Array.isArray(data?.tasks) ? data.tasks : [];
    } catch {
      this.state.recentTasks = [];
    }
  },

  async _loadPipelineStages(force = false) {
    if (!force && this.state.pipelineStages.length > 0) return;
    try {
      const data = await API.get('/pipeline/stages');
      if (Array.isArray(data) && data.length > 0) {
        this.state.pipelineStages = data;
        return;
      }
    } catch {}

    this.state.pipelineStages = [
      { key: 'hotspot-list', order: 1, label: '读谷歌表格热点列表', implemented: true },
      { key: 'hotspot-select', order: 2, label: '选热点', implemented: true },
      { key: 'hotspot-enrich', order: 3, label: '录入热点详细内容', implemented: true },
      { key: 'draft-generate', order: 4, label: '生成母稿', implemented: true },
      { key: 'platform-rewrite', order: 5, label: '多平台改写', implemented: true },
      { key: 'review-optimize', order: 6, label: '自然化编辑 / 质量门控', implemented: true },
      { key: 'visual-generate', order: 7, label: '生成多张配图', implemented: true },
      { key: 'layout-compose', order: 8, label: '排版', implemented: true },
      { key: 'export-output', order: 9, label: '导出图文结果并可打开', implemented: true },
    ];
  },

  async _loadHotspots(force = false) {
    if (!force && this.state.hotspots.length > 0) return;
    try {
      const query = encodeURIComponent(this.state.hotspotQuery || '');
      const source = encodeURIComponent(this.state.hotspotSource || 'auto');
      const data = await API.get(`/pipeline/hotspots?query=${query}&limit=20&source=${source}`);
      this.state.hotspots = Array.isArray(data?.items) ? data.items : [];
      this.state.hotspotWarnings = Array.isArray(data?.warnings) ? data.warnings : [];
      this.state.hotspotSourceUsed = data?.source || '';
    } catch (e) {
      this.state.hotspots = [];
      this.state.hotspotWarnings = [`热点池读取失败: ${e.message}`];
      this.state.hotspotSourceUsed = '';
    }
  },

  async _syncHotspotStage() {
    if (!this.state.taskId) return;
    try {
      const data = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/hotspot-list`, {
        query: this.state.hotspotQuery || '',
        source: this.state.hotspotSource || 'auto',
        limit: 20,
        note: 'WebApp Step1 输入素材阶段同步热点列表',
      });
      this._updateTaskFromResponse(data);
      if (Array.isArray(data?.items)) {
        this.state.hotspots = data.items;
      }
      this.state.hotspotWarnings = Array.isArray(data?.warnings) ? data.warnings : [];
      this.state.hotspotSourceUsed = data?.source || this.state.hotspotSourceUsed;
      if (this.state.hotspotWarnings.length > 0) {
        showToast(`热点读取提示: ${this.state.hotspotWarnings[0]}`);
      }
    } catch (e) {
      showToast(`热点阶段同步失败: ${e.message}`, 'error');
    }
  },

  async _syncHotspotSelect() {
    if (!this.state.taskId || !this.state.selectedHotspot) return;
    try {
      const payload = {
        hotspotId: this.state.selectedHotspot.id || this.state.selectedHotspot.title || '',
        hotspot: this.state.selectedHotspot,
        confirm: true,
        note: 'WebApp Step1 选择热点',
      };
      const data = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/hotspot-select`, payload);
      this._updateTaskFromResponse(data);
    } catch (e) {
      showToast(`热点选择同步失败: ${e.message}`, 'error');
    }
  },

  async _syncHotspotEnrich({ enrichment = '', facts = [], constraints = [], materials = [] } = {}) {
    if (!this.state.taskId) return;
    try {
      const data = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/hotspot-enrich`, {
        enrichment: enrichment || '',
        facts,
        constraints,
        materials,
        confirm: true,
        note: 'WebApp Step1 录入热点补充信息',
      });
      this._updateTaskFromResponse(data);
    } catch (e) {
      showToast(`热点补充信息同步失败: ${e.message}`, 'error');
    }
  },

  _mapStageToViewStep(stageKey) {
    if (!stageKey) return 0;
    if (['hotspot-list', 'hotspot-select', 'hotspot-enrich'].includes(stageKey)) return 0;
    if (stageKey === 'draft-generate') return 1;
    if (['platform-rewrite', 'review-optimize'].includes(stageKey)) return 2;
    if (stageKey === 'visual-generate') return 3;
    if (['layout-compose', 'export-output'].includes(stageKey)) return 4;
    return 0;
  },

  async _restoreTask(taskId, { silent = false, rerender = true } = {}) {
    try {
      const data = await API.get(`/pipeline/tasks/${encodeURIComponent(taskId)}`);
      this._updateTaskFromResponse(data);
      const task = data?.task;
      if (!task) return;
      await this._hydrateTaskExecutionResults(task);

      const restoreStage = task?.pendingConfirmationStage || task?.currentStage || '';
      const restoreStep = this._mapStageToViewStep(restoreStage);
      this.state.step = restoreStep;
      this.state.activeStageKey = restoreStage || this._getDefaultStageKeyForPanel(restoreStep, { preferLast: true });
      if (!this.state.input && task.title) {
        this.state.input = task.title;
      }
      if (task?.metadata?.style) {
        this.state.style = task.metadata.style;
      }
      const hotspotSnapshot = task?.metadata?.hotspotListSnapshot;
      if (Array.isArray(hotspotSnapshot?.items) && hotspotSnapshot.items.length > 0) {
        this.state.hotspots = hotspotSnapshot.items;
        this.state.hotspotQuery = hotspotSnapshot.query || '';
        this.state.hotspotSource = hotspotSnapshot.source || this.state.hotspotSource;
        this.state.hotspotSourceUsed = hotspotSnapshot.source || '';
      }
      if (task?.metadata?.selectedHotspot) {
        this.state.selectedHotspot = task.metadata.selectedHotspot;
      }
      if (task?.metadata?.hotspotEnrichment) {
        const enrich = task.metadata.hotspotEnrichment;
        if (enrich.enrichment) {
          this.state.input = enrich.enrichment;
        }
        this.state.hotspotFactsText = Array.isArray(enrich.facts) ? enrich.facts.join('\n') : '';
        this.state.hotspotConstraintsText = Array.isArray(enrich.constraints) ? enrich.constraints.join('\n') : '';
        this.state.hotspotMaterialsText = Array.isArray(enrich.materials) ? enrich.materials.join('\n') : '';
      }
      if (!silent) {
        showToast(`已恢复任务: ${task.id}`);
      }
      if (rerender) {
        this.render();
      }
    } catch (e) {
      showToast(`恢复任务失败: ${e.message}`, 'error');
    }
  },

  async _restoreHandoffTask() {
    const taskId = sessionStorage.getItem('pipeline_task_handoff');
    if (!taskId || taskId === this.state.taskId) return;
    sessionStorage.removeItem('pipeline_task_handoff');
    await this._restoreTask(taskId, { silent: true, rerender: false });
  },
};
