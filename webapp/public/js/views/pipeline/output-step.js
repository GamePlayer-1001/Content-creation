/**
 * [INPUT]: 依赖 PipelineView 状态、createInitialPipelineState 与共享文件读写
 * [OUTPUT]: 挂接排版与导出阶段相关方法
 * [POS]: views/pipeline 的输出阶段模块，负责排版、导出、结果展示与状态重置
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineView, {
  async _renderLayout() {
    const el = document.getElementById('pipeline-content');
    const finalContents = this.state.platformResults;
    const hasFinalResults = this.state.finalResults.length > 0;

    let html = `<h3>第 5 步：排版</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        先基于平台内容与配图生成排版稿，再进入最后的导出与打开。
      </p>
      <button class="btn btn-primary" id="pl-compose-layout" style="margin-bottom:20px" ${finalContents.length === 0 ? 'disabled' : ''}>
        生成排版稿
      </button>
      <div id="pl-layout-results"></div>
      <div class="pipeline-nav">
        <button class="btn" id="pl-back-layout">上一步</button>
        <button class="btn btn-primary" id="pl-next-layout" ${!hasFinalResults ? 'disabled' : ''}>下一步: 导出结果并打开</button>
      </div>
    `;

    el.innerHTML = html;
    this._renderLayoutSummary();

    document.getElementById('pl-back-layout').onclick = () => {
      this._focusStage('visual-generate');
      this.render();
    };
    document.getElementById('pl-next-layout').onclick = () => {
      this._focusStage('export-output');
      this.render();
    };

    document.getElementById('pl-compose-layout').onclick = async () => {
      const btn = document.getElementById('pl-compose-layout');
      btn.disabled = true;
      btn.textContent = '排版中...';

      try {
        const contents = finalContents.map((r) => ({
          platform: r.platform,
          content: r.content || '',
          file: r.file || '',
        }));

        const composeResult = await API.post('/pipeline/compose', {
          contents,
          images: this.state.images,
          taskId: this.state.taskId,
        });
        this._updateTaskFromResponse(composeResult);
        this.state.finalResults = Array.isArray(composeResult?.results) ? composeResult.results : this.state.finalResults;
        this._renderLayoutSummary();
        const nextBtn = document.getElementById('pl-next-layout');
        if (nextBtn) nextBtn.disabled = this.state.finalResults.length === 0;
        btn.textContent = '重新生成排版稿';
        btn.disabled = false;
      } catch (e) {
        showToast(e.message, 'error');
        btn.textContent = '生成排版稿';
        btn.disabled = false;
      }
    };
  },

  _renderLayoutSummary() {
    const container = document.getElementById('pl-layout-results');
    if (!container) return;
    if (this.state.finalResults.length === 0) {
      container.innerHTML = '<div class="empty">还没有排版稿，先执行一次排版。</div>';
      return;
    }

    const html = this.state.finalResults.map((item) => `
      <div class="file-link">
        <span class="link-icon">&#128221;</span>
        <span class="link-name">${item.file}</span>
      </div>
    `).join('');
    container.innerHTML = `<div class="file-links">${html}</div>`;
  },

  async _renderExport() {
    const el = document.getElementById('pipeline-content');
    const finalContents = this.state.platformResults;
    const hasFinalResults = this.state.finalResults.length > 0;

    let html = `<h3>第 6 步：导出结果并打开</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        把排版稿导出为最终图文结果，并提供复制与 Obsidian 打开入口。
      </p>
      <button class="btn btn-primary" id="pl-export-output" ${!hasFinalResults ? 'disabled' : ''}>
        ${hasFinalResults ? '导出结果并打开' : '请先完成排版'}
      </button>
      <div id="pl-final-results"></div>
      <div id="pl-final-links"></div>
      <div class="pipeline-nav">
        <button class="btn" id="pl-back-export">上一步</button>
        <button class="btn btn-primary" id="pl-restart">重新开始</button>
      </div>
    `;

    el.innerHTML = html;
    if (hasFinalResults) {
      this._showFinalLinks();
    }

    document.getElementById('pl-back-export').onclick = () => {
      this._focusStage('layout-compose');
      this.render();
    };
    document.getElementById('pl-restart').onclick = () => {
      const {
        engine,
        platformCatalog,
        styleCatalog,
        engineOptions,
        recentTasks,
        hotspotSource,
        pipelineStages,
      } = this.state;
      this.state = createInitialPipelineState({
        recentTasks,
        hotspotSource: hotspotSource || 'auto',
        engine,
        platformCatalog,
        styleCatalog,
        engineOptions,
        pipelineStages,
      });
      this.render();
    };

    document.getElementById('pl-export-output').onclick = async () => {
      const btn = document.getElementById('pl-export-output');
      btn.disabled = true;
      btn.textContent = '导出中...';
      try {
        const contents = finalContents.map((r) => ({
          platform: r.platform,
          content: r.content || '',
          file: r.file || '',
        }));
        const layoutFiles = this.state.finalResults.map((item) => item.file).filter(Boolean);
        const result = await API.post('/pipeline/assemble', {
          contents,
          images: this.state.images,
          layoutFiles,
          taskId: this.state.taskId,
        });
        this._updateTaskFromResponse(result);
        this.state.finalResults = result.results;
        this._showFinalLinks();
        btn.textContent = '重新导出';
        btn.disabled = false;
      } catch (e) {
        showToast(e.message, 'error');
        btn.textContent = '导出结果并打开';
        btn.disabled = false;
      }
    };
  },

  _showFinalLinks() {
    let container = document.getElementById('pl-final-links');
    if (!container) {
      container = document.getElementById('pl-final-results');
    }

    let html = `<h3 style="margin-top:16px">输出文件</h3>
      <div class="file-links">`;

    this.state.finalResults.forEach((r) => {
      const copyArg = JSON.stringify(r.file || '');
      const actionLink = r.obsidianUri
        ? `<a class="link-action" href="${r.obsidianUri}" style="text-decoration:none;color:inherit">Obsidian 打开</a>`
        : '<span class="link-action" style="opacity:.6">Obsidian 链接待恢复</span>';
      html += `
        <div class="file-link">
          <span class="link-icon">&#128196;</span>
          <span class="link-name">${r.file}</span>
          <span class="link-action" onclick='PipelineView._copyFile(${copyArg})'>复制</span>
          ${actionLink}
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  async _copyFile(filePath) {
    try {
      const data = await this._readSharedExecutionText(filePath);
      await navigator.clipboard.writeText(data.content || data);
      showToast('已复制到剪贴板');
    } catch (_error) {
      showToast('复制失败', 'error');
    }
  },
});
