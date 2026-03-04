/**
 * [INPUT]: 依赖 API (SSE stream)
 * [OUTPUT]: DistributeView 对象
 * [POS]: views/ 的全平台分发页面, 逐平台 SSE 进度
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const DistributeView = {
  async render() {
    const app = document.getElementById('app');

    let drafts = [];
    try { drafts = await API.get('/content/母稿'); } catch {}

    const platforms = ['公众号', '小红书', '即刻', 'X推文', 'linuxdo', 'GitHub', '朋友圈'];
    const engine = localStorage.getItem('ai_engine') || 'claude';

    let html = `<h2>全平台分发</h2>`;

    html += `<div class="form-group">
      <label class="form-label">选择母稿</label>
      <select class="form-select" id="dist-draft">
        <option value="">-- 请选择 --</option>
        ${drafts.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
      </select>
    </div>`;

    html += `<div class="form-group">
      <label class="form-label">AI 引擎</label>
      <select class="form-select" id="dist-engine">
        <option value="claude" ${engine === 'claude' ? 'selected' : ''}>Claude CLI</option>
        <option value="openrouter" ${engine === 'openrouter' ? 'selected' : ''}>OpenRouter</option>
        <option value="deepseek" ${engine === 'deepseek' ? 'selected' : ''}>DeepSeek</option>
      </select>
    </div>`;

    html += `<div class="btn-group">
      <button class="btn btn-primary" id="dist-start">开始分发</button>
    </div>`;

    // 平台进度卡片
    html += `<div class="card-grid" id="dist-progress">`;
    for (const p of platforms) {
      html += `
        <div class="card" id="dist-card-${CSS.escape(p)}">
          <div class="card-header">${p}</div>
          <div class="card-sub" id="dist-status-${CSS.escape(p)}">等待中</div>
          <div class="progress-bar"><div class="progress-fill" id="dist-bar-${CSS.escape(p)}" style="width:0"></div></div>
        </div>
      `;
    }
    html += `</div>`;

    // 汇总区
    html += `<div id="dist-summary" style="display:none" class="card"></div>`;

    app.innerHTML = html;

    document.getElementById('dist-start').onclick = async () => {
      const draft = document.getElementById('dist-draft').value;
      if (!draft) { showToast('请选择母稿', 'error'); return; }

      const selectedEngine = document.getElementById('dist-engine').value;
      const btn = document.getElementById('dist-start');
      btn.disabled = true;
      btn.textContent = '分发中...';

      // 重置所有卡片
      platforms.forEach(p => {
        const esc = CSS.escape(p);
        const statusEl = document.getElementById(`dist-status-${esc}`);
        const barEl = document.getElementById(`dist-bar-${esc}`);
        if (statusEl) statusEl.textContent = '等待中';
        if (barEl) barEl.style.width = '0';
      });

      let currentPlatform = '';
      let completed = 0;

      await API.stream('/distribute', { draft, engine: selectedEngine }, (data) => {
        const esc = data.platform ? CSS.escape(data.platform) : '';

        switch (data.type) {
          case 'platform_start':
            currentPlatform = data.platform;
            const sEl = document.getElementById(`dist-status-${esc}`);
            if (sEl) sEl.textContent = '生成中...';
            const bEl = document.getElementById(`dist-bar-${esc}`);
            if (bEl) bEl.style.width = '30%';
            break;

          case 'chunk':
            // 更新进度条动画
            if (data.platform) {
              const bar = document.getElementById(`dist-bar-${CSS.escape(data.platform)}`);
              if (bar) bar.style.width = '60%';
            }
            break;

          case 'platform_done':
            completed++;
            const doneStatus = document.getElementById(`dist-status-${esc}`);
            if (doneStatus) doneStatus.textContent = `完成 · ${data.length} 字`;
            const doneBar = document.getElementById(`dist-bar-${esc}`);
            if (doneBar) doneBar.style.width = '100%';
            const card = document.getElementById(`dist-card-${esc}`);
            if (card) card.style.borderColor = 'var(--fg)';
            break;

          case 'platform_error':
            const errStatus = document.getElementById(`dist-status-${esc}`);
            if (errStatus) errStatus.textContent = `失败`;
            const errBar = document.getElementById(`dist-bar-${esc}`);
            if (errBar) { errBar.style.width = '100%'; errBar.style.background = '#999'; }
            break;

          case 'done':
            const summaryEl = document.getElementById('dist-summary');
            summaryEl.style.display = 'block';
            summaryEl.innerHTML = `<h3>分发完成</h3>
              <p>成功: ${data.success} / ${data.total} 个平台</p>
              ${data.results.map(r => r.error
                ? `<div style="color:var(--muted)">${r.platform}: 失败 - ${r.error}</div>`
                : `<div>${r.platform}: ${r.file} (${r.length} 字)</div>`
              ).join('')}`;
            break;

          case 'error':
            showToast(data.message, 'error');
            break;
        }
      });

      btn.disabled = false;
      btn.textContent = '开始分发';
    };
  }
};
