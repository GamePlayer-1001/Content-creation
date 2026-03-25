/**
 * [INPUT]: 依赖 PipelineView 状态与共享输出读写方法
 * [OUTPUT]: 挂接 _renderDraft 母稿阶段视图
 * [POS]: views/pipeline 的母稿阶段模块，负责创作方向选择、母稿生成与保存
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineView, {
  _renderDraft() {
    const el = document.getElementById('pipeline-content');
    let html = `<h3>阶段 4：选择创作方向并生成母稿</h3>`;
    const styleList = this.state.styleCatalog.length > 0 ? this.state.styleCatalog : this.STYLE_FALLBACK;
    const engineOptions = this.state.engineOptions.length > 0
      ? this.state.engineOptions
      : [{ value: 'claude', label: 'Claude CLI (本地)', available: true }];
    const engineOptionRows = engineOptions.map((item) => {
      const value = String(item?.value || '').trim();
      if (!value) return '';
      const label = item?.label || value;
      const selected = this.state.engine === value ? 'selected' : '';
      const unavailable = item?.available === false;
      const disabled = unavailable ? 'disabled' : '';
      const suffix = unavailable ? ' (未配置)' : '';
      return `<option value="${escapeHtml(value)}" ${selected} ${disabled}>${escapeHtml(`${label}${suffix}`)}</option>`;
    }).join('');

    html += `<div class="style-grid">`;
    styleList.forEach((s) => {
      const sel = this.state.style === s.key ? 'selected' : '';
      html += `
        <div class="style-option ${sel}" data-style="${s.key}">
          <div class="style-name">${s.label || s.name || s.key}</div>
          <div class="style-desc">${s.desc}</div>
        </div>`;
    });
    html += `</div>`;

    html += `
      <div class="form-group">
        <label class="form-label">AI 引擎</label>
        <select class="form-select" id="pl-engine">
          ${engineOptionRows}
        </select>
      </div>
    `;

    html += `
      <div class="btn-group">
        <button class="btn btn-primary" id="pl-gen-draft">生成母稿</button>
        <button class="btn" id="pl-stop-draft" style="display:none">停止</button>
      </div>
      <div class="stream-output" id="pl-draft-output" style="display:none"></div>
    `;

    if (this.state.draftContent) {
      html += `
        <div class="form-group" style="margin-top:16px">
          <label class="form-label">母稿内容 (可编辑)</label>
          <textarea class="form-textarea" id="pl-draft-edit" style="min-height:300px">${this.state.draftContent}</textarea>
          <button class="btn btn-sm" id="pl-save-draft" style="margin-top:8px">保存到文件</button>
        </div>
      `;
    }

    html += `
      <div class="pipeline-nav">
        <button class="btn" id="pl-back2">上一步</button>
        <button class="btn btn-primary" id="pl-next2" ${!this.state.draftContent ? 'disabled' : ''}>
          下一步: 多平台生成
        </button>
      </div>
    `;

    el.innerHTML = html;

    document.querySelectorAll('.style-option').forEach((opt) => {
      opt.onclick = () => {
        document.querySelectorAll('.style-option').forEach((item) => item.classList.remove('selected'));
        opt.classList.add('selected');
        this.state.style = opt.dataset.style;
      };
    });

    document.getElementById('pl-engine').onchange = (e) => {
      this.state.engine = e.target.value;
      localStorage.setItem('ai_engine', e.target.value);
    };

    document.getElementById('pl-back2').onclick = () => {
      this._focusStage('hotspot-enrich');
      this.render();
    };

    document.getElementById('pl-next2').onclick = () => {
      const editEl = document.getElementById('pl-draft-edit');
      if (editEl) this.state.draftContent = editEl.value;
      this._focusStage('platform-rewrite');
      this.render();
    };

    const saveDraftBtn = document.getElementById('pl-save-draft');
    if (saveDraftBtn) {
      saveDraftBtn.onclick = async () => {
        const editEl = document.getElementById('pl-draft-edit');
        if (!editEl || !this.state.draftFile) return;
        try {
          await this._writeSharedExecutionText(this.state.draftFile, editEl.value);
          this.state.draftContent = editEl.value;
          showToast('母稿已保存');
        } catch (e) {
          showToast(`保存失败: ${e.message}`, 'error');
        }
      };
    }

    let renderer = null;
    const genBtn = document.getElementById('pl-gen-draft');
    const stopBtn = document.getElementById('pl-stop-draft');
    const outputEl = document.getElementById('pl-draft-output');

    genBtn.onclick = async () => {
      const ready = await this._ensureTaskContext();
      if (!ready) return;

      outputEl.style.display = 'block';
      genBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';

      renderer = new StreamRenderer(outputEl);
      const result = await renderer.start('/pipeline/draft', {
        input: this.state.input,
        style: this.state.style,
        engine: this.state.engine,
        taskId: this.state.taskId,
      });

      stopBtn.style.display = 'none';
      genBtn.style.display = 'inline-block';

      if (result && renderer.getContent()) {
        this._updateTaskFromResponse(result);
        this.state.draftContent = renderer.getContent();
        this.state.draftFile = result.file || '';
        this._renderDraft();
      }
    };

    stopBtn.onclick = () => {
      if (renderer) renderer.stop();
      stopBtn.style.display = 'none';
      genBtn.style.display = 'inline-block';
    };
  },
});
