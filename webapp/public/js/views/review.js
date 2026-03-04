/**
 * [INPUT]: 依赖 API + StreamRenderer
 * [OUTPUT]: ReviewView 对象
 * [POS]: views/ 的周复盘页面, 统计 + AI 报告生成
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const ReviewView = {
  async render() {
    const app = document.getElementById('app');
    const engine = localStorage.getItem('ai_engine') || 'claude';

    let html = `<h2>周复盘</h2>`;

    html += `<div class="btn-group">
      <button class="btn btn-primary" id="rev-scan">扫描本周产出</button>
      <button class="btn" id="rev-generate">AI 生成报告</button>
      <select class="form-select" id="rev-engine" style="width:auto;display:inline-block;margin-left:8px">
        <option value="claude" ${engine === 'claude' ? 'selected' : ''}>Claude CLI</option>
        <option value="openrouter" ${engine === 'openrouter' ? 'selected' : ''}>OpenRouter</option>
        <option value="deepseek" ${engine === 'deepseek' ? 'selected' : ''}>DeepSeek</option>
      </select>
    </div>`;

    html += `<div id="rev-stats"></div>`;
    html += `<div class="stream-output" id="rev-output" style="display:none"></div>`;

    app.innerHTML = html;

    document.getElementById('rev-scan').onclick = () => this._scanWeekly();
    document.getElementById('rev-generate').onclick = () => this._generateReport();
  },

  async _scanWeekly() {
    const el = document.getElementById('rev-stats');
    try {
      const data = await API.get('/review/weekly');

      let html = `<div class="card" style="margin-top:16px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3>本周产出统计</h3>
          <span>Day ${data.dayN} · Phase ${data.phase}</span>
        </div>
        <p style="color:var(--muted)">${data.weekStart} ~ ${data.weekEnd}</p>
      </div>`;

      html += `<div class="stat-row" style="margin-top:16px">
        <div class="stat-card"><div class="stat-value">${data.totalThisWeek}</div><div class="stat-label">本周产出</div></div>
        <div class="stat-card"><div class="stat-value">${data.totalAll}</div><div class="stat-label">总计</div></div>
      </div>`;

      // 逐平台详情
      html += `<div class="card" style="margin-top:16px">
        <h3>平台明细</h3>
        <table class="table"><thead><tr><th>平台</th><th>本周</th><th>总计</th><th>本周文件</th></tr></thead><tbody>`;

      for (const [platform, stats] of Object.entries(data.platforms)) {
        if (stats.total === 0 && stats.thisWeek === 0) continue;
        html += `<tr>
          <td>${platform}</td>
          <td style="font-weight:700">${stats.thisWeek}</td>
          <td>${stats.total}</td>
          <td style="font-size:12px;color:var(--muted)">${stats.files.join(', ') || '-'}</td>
        </tr>`;
      }
      html += `</tbody></table></div>`;

      el.innerHTML = html;
    } catch (e) {
      showToast(e.message, 'error');
    }
  },

  async _generateReport() {
    const outputEl = document.getElementById('rev-output');
    outputEl.style.display = 'block';

    const selectedEngine = document.getElementById('rev-engine').value;
    const genBtn = document.getElementById('rev-generate');
    genBtn.disabled = true;
    genBtn.textContent = '生成中...';

    const renderer = new StreamRenderer(outputEl);
    const result = await renderer.start('/review/generate', { engine: selectedEngine });

    genBtn.disabled = false;
    genBtn.textContent = 'AI 生成报告';

    if (result) {
      showToast(`报告已保存: ${result.file}`);
    }
  },
};
