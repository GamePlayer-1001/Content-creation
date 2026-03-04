/**
 * [INPUT]: 依赖 API 调用合规检查接口
 * [OUTPUT]: ComplianceView 对象
 * [POS]: views/ 的合规检查页面, 原生 6 维扫描
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const ComplianceView = {
  render() {
    const app = document.getElementById('app');

    let html = `<h2>合规检查</h2>`;
    html += `<p style="font-size:13px;color:var(--muted);margin-bottom:16px">
      基于 compliance.yaml 的 6 维规则引擎，实时扫描内容合规风险。
    </p>`;

    html += `<div class="form-group">
      <label class="form-label">粘贴待检查文本</label>
      <textarea class="form-input" id="comp-text" rows="8" placeholder="将内容粘贴到这里..."></textarea>
    </div>`;

    html += `<div class="btn-group">
      <button class="btn btn-primary" id="comp-check">开始扫描</button>
      <button class="btn" id="comp-reload">刷新规则</button>
    </div>`;

    html += `<div id="comp-results" style="display:none"></div>`;

    app.innerHTML = html;

    document.getElementById('comp-check').onclick = async () => {
      const text = document.getElementById('comp-text').value;
      if (!text.trim()) { showToast('请输入文本内容', 'error'); return; }

      try {
        const result = await API.post('/compliance/check', { text });
        this._renderResults(result, text);
      } catch (e) {
        showToast(e.message, 'error');
      }
    };

    document.getElementById('comp-reload').onclick = async () => {
      try {
        await API.post('/compliance/reload', {});
        showToast('规则已刷新');
      } catch (e) {
        showToast(e.message, 'error');
      }
    };
  },

  _renderResults(result, text) {
    const el = document.getElementById('comp-results');
    el.style.display = 'block';

    const scoreClass = result.score >= 80 ? 'score-safe' : result.score >= 50 ? 'score-warn' : 'score-danger';

    let html = `<div class="card" style="margin-top:16px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3>扫描结果</h3>
        <span class="${scoreClass}" style="font-size:24px;font-weight:700">${result.score} 分</span>
      </div>
      <p style="color:var(--muted)">${result.summary}</p>
    </div>`;

    // 6 维度详情
    html += `<div class="card-grid" style="margin-top:16px">`;
    for (const dim of result.dimensions) {
      const status = dim.hits.length === 0 ? '✓ 通过' : `✗ ${dim.hits.length} 项`;
      const color = dim.hits.length === 0 ? 'var(--muted)' : 'var(--fg)';
      html += `<div class="card">
        <div class="card-header" style="font-size:14px">${dim.name}</div>
        <div style="font-size:20px;font-weight:700;color:${color}">${status}</div>
        ${dim.deduction > 0 ? `<div class="card-sub">扣 ${dim.deduction} 分</div>` : ''}
      </div>`;
    }
    html += `</div>`;

    // 命中详情
    if (result.hits.length > 0) {
      html += `<div class="card" style="margin-top:16px">
        <h3>命中详情 (${result.hits.length})</h3>
        <table class="table"><thead><tr>
          <th>关键词</th><th>分类</th><th>级别</th><th>次数</th><th>建议</th>
        </tr></thead><tbody>`;

      for (const hit of result.hits) {
        const sevLabel = hit.severity === 'critical' ? '严重' : '警告';
        const sevStyle = hit.severity === 'critical' ? 'font-weight:700' : '';
        html += `<tr>
          <td style="${sevStyle}">${hit.word}</td>
          <td>${hit.category}</td>
          <td>${sevLabel}</td>
          <td>${hit.count}</td>
          <td style="color:var(--muted)">${hit.suggestion || '-'}</td>
        </tr>`;
      }
      html += `</tbody></table></div>`;

      // 高亮文本
      html += `<div class="card" style="margin-top:16px">
        <h3>高亮预览</h3>
        <div class="md-preview">${this._highlightText(text, result.hits)}</div>
      </div>`;
    }

    el.innerHTML = html;
  },

  _highlightText(text, hits) {
    const marks = [];
    for (const hit of hits) {
      for (const pos of hit.positions) {
        marks.push({ start: pos, end: pos + hit.word.length, word: hit.word });
      }
    }
    marks.sort((a, b) => a.start - b.start);

    let result = '';
    let cursor = 0;
    for (const m of marks) {
      if (m.start < cursor) continue;
      result += this._escape(text.slice(cursor, m.start));
      result += `<mark style="background:#ff0;color:#000;padding:0 2px">${this._escape(text.slice(m.start, m.end))}</mark>`;
      cursor = m.end;
    }
    result += this._escape(text.slice(cursor));
    return result.replace(/\n/g, '<br>');
  },

  _escape(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
};
