/**
 * [INPUT]: 依赖 API/showToast 与 runtime-state/runtime-summary 暴露的方法
 * [OUTPUT]: 扩展 PipelineTaskRuntime 的执行动作与阶段控制按钮绑定
 * [POS]: views/pipeline 的运行时动作层，被 pipeline.js 页面壳在每次渲染后调用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineTaskRuntime, {
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
});
