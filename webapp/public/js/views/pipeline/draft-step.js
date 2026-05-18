/**
 * [INPUT]: 依赖 PipelineView 状态与共享输出读写方法
 * [OUTPUT]: 挂接 _renderDraft 母稿阶段视图
 * [POS]: views/pipeline 的母稿阶段模块，负责输入承接、创作方向选择、母稿生成与保存
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineView, {
  _renderDraft() {
    const el = document.getElementById('pipeline-content');
    let html = `<h3>第 1 步：根据输入内容生成母稿</h3>`;
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

    html += this._buildInputSourceSummary();

    html += `
      <div class="form-group">
        <label class="form-label">输入素材</label>
        <textarea class="form-textarea" id="pl-input" placeholder="输入关键词、想法，或粘贴一段长文本/热帖内容..."
          style="min-height:220px">${this.state.input}</textarea>
      </div>
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">补充信息</div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:8px">
          这些内容会和输入素材一起进入母稿生成，适合承接热点页同步过来的事实、限制和参考链接。
        </div>
        <div class="form-group">
          <label class="form-label">关键事实（facts）</label>
          <textarea class="form-textarea" id="pl-hotspot-facts" style="min-height:80px">${escapeHtml(this.state.hotspotFactsText || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">约束条件（constraints）</label>
          <textarea class="form-textarea" id="pl-hotspot-constraints" style="min-height:80px">${escapeHtml(this.state.hotspotConstraintsText || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">参考素材（materials）</label>
          <textarea class="form-textarea" id="pl-hotspot-materials" style="min-height:80px">${escapeHtml(this.state.hotspotMaterialsText || '')}</textarea>
        </div>
      </div>
    `;

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
        <button class="btn" id="pl-back2">返回热点信息</button>
        <button class="btn btn-primary" id="pl-next2" ${!this.state.draftContent ? 'disabled' : ''}>
          下一步: 多平台改写
        </button>
      </div>
    `;

    el.innerHTML = html;
    this._bindInputSourceSummary();

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
      location.hash = '#/hotspots';
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
      const synced = await this._syncDraftInputFromForm();
      if (!synced) return;

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
