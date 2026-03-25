/**
 * [INPUT]: 依赖 PipelineView 状态、createInitialPipelineState 与共享文件读写
 * [OUTPUT]: 挂接排版导出阶段相关方法
 * [POS]: views/pipeline 的输出阶段模块，负责排版导出、结果展示与状态重置
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineView, {
  async _renderOutput() {
    const el = document.getElementById('pipeline-content');
    const finalContents = this.state.platformResults;
    const hasFinalResults = this.state.finalResults.length > 0;

    let html = `<h3>阶段 8-9：排版与最终输出</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        先生成排版稿，再导出纯文本文件和 Obsidian 打开链接
      </p>
    `;

    html += `
      <button class="btn btn-primary" id="pl-assemble" style="margin-bottom:20px" ${finalContents.length === 0 ? 'disabled' : ''}>
        ${hasFinalResults ? '重新组装最终文件' : '组装最终文件'}
      </button>
      <div id="pl-final-results"></div>
    `;

    if (hasFinalResults) {
      html += `<div id="pl-final-links"></div>`;
    }

    html += `
      <div class="pipeline-nav">
        <button class="btn" id="pl-back6">上一步</button>
        <button class="btn btn-primary" id="pl-restart">重新开始</button>
      </div>
    `;

    el.innerHTML = html;

    if (hasFinalResults) {
      this._showFinalLinks();
    }

    document.getElementById('pl-back6').onclick = () => {
      this._focusStage('visual-generate');
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

    document.getElementById('pl-assemble').onclick = async () => {
      const btn = document.getElementById('pl-assemble');
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
        const layoutFiles = Array.isArray(composeResult?.results)
          ? composeResult.results.map((x) => x.file).filter(Boolean)
          : [];

        btn.textContent = '导出中...';
        const result = await API.post('/pipeline/assemble', {
          contents,
          images: this.state.images,
          layoutFiles,
          taskId: this.state.taskId,
        });

        this._updateTaskFromResponse(result);
        this.state.finalResults = result.results;
        this._showFinalLinks();
        btn.textContent = '重新组装最终文件';
        btn.disabled = false;
      } catch (e) {
        showToast(e.message, 'error');
        btn.textContent = this.state.finalResults.length > 0 ? '重新组装最终文件' : '组装最终文件';
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
