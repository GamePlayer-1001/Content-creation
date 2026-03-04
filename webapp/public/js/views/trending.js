/**
 * [INPUT]: 依赖 API (SSE stream + REST)
 * [OUTPUT]: TrendingView 对象
 * [POS]: views/ 的热点抓取页面, 爬虫触发 + 话题库
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const TrendingView = {
  async render() {
    const app = document.getElementById('app');

    let html = `<h2>热点抓取</h2>`;

    html += `<div class="btn-group">
      <button class="btn btn-primary" id="trend-xhs">抓取小红书热点</button>
      <button class="btn" id="trend-rss">抓取 RSS 热点</button>
      <button class="btn" id="trend-topics">查看话题库</button>
    </div>`;

    html += `<div id="trend-status" style="display:none" class="card"></div>`;
    html += `<div id="trend-results"></div>`;

    app.innerHTML = html;

    // 加载已有结果
    this._loadResults();

    document.getElementById('trend-xhs').onclick = () => this._startScrape('xhs');
    document.getElementById('trend-rss').onclick = () => this._startScrape('rss');
    document.getElementById('trend-topics').onclick = () => this._showTopics();
  },

  async _startScrape(platform) {
    const statusEl = document.getElementById('trend-status');
    statusEl.style.display = 'block';
    statusEl.innerHTML = `<p>正在抓取 ${platform} 热点...</p>`;

    let output = '';

    await API.stream('/trending', { platform }, (data) => {
      switch (data.type) {
        case 'status':
          statusEl.innerHTML = `<p>${data.message}</p>`;
          break;
        case 'chunk':
          output += data.content;
          statusEl.innerHTML = `<p>正在抓取...</p><pre style="max-height:200px;overflow:auto;font-size:12px">${output.slice(-500)}</pre>`;
          break;
        case 'done':
          statusEl.innerHTML = `<p>抓取完成</p>`;
          if (data.results) {
            this._renderResults(data.results);
          } else if (data.raw) {
            statusEl.innerHTML += `<pre style="max-height:300px;overflow:auto;font-size:12px">${data.raw}</pre>`;
          }
          break;
        case 'error':
          statusEl.innerHTML = `<p style="color:var(--muted)">抓取失败: ${data.message}</p>`;
          showToast(data.message, 'error');
          break;
      }
    });
  },

  async _loadResults() {
    const el = document.getElementById('trend-results');
    try {
      const results = await API.get('/trending/results');
      if (results.length === 0) {
        el.innerHTML = '<div class="empty">暂无热点数据。点击上方按钮开始抓取。</div>';
        return;
      }

      let html = '<h3 style="margin-top:24px">历史结果</h3>';
      for (const r of results) {
        html += `<div class="card" style="margin-top:8px">
          <div class="card-header">${r.file}</div>
          ${r.data ? `<pre style="max-height:200px;overflow:auto;font-size:12px">${JSON.stringify(r.data, null, 2)}</pre>` : '<div class="card-sub">无法解析</div>'}
        </div>`;
      }
      el.innerHTML = html;
    } catch {
      el.innerHTML = '<div class="empty">暂无热点数据。点击上方按钮开始抓取。</div>';
    }
  },

  _renderResults(results) {
    const el = document.getElementById('trend-results');
    if (!Array.isArray(results)) {
      el.innerHTML = `<div class="card" style="margin-top:16px"><pre>${JSON.stringify(results, null, 2)}</pre></div>`;
      return;
    }

    let html = `<table class="table" style="margin-top:16px">
      <thead><tr><th>#</th><th>话题</th><th>热度</th><th>来源</th></tr></thead><tbody>`;
    results.forEach((item, i) => {
      html += `<tr>
        <td>${i + 1}</td>
        <td>${item.title || item.topic || JSON.stringify(item).slice(0, 60)}</td>
        <td>${item.heat || item.score || '-'}</td>
        <td>${item.source || '-'}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    el.innerHTML = html;
  },

  async _showTopics() {
    const el = document.getElementById('trend-results');
    try {
      const topics = await API.get('/trending/topics');
      if (!topics || (Array.isArray(topics) && topics.length === 0)) {
        el.innerHTML = '<div class="empty">话题库为空</div>';
        return;
      }

      let html = '<h3 style="margin-top:24px">话题库</h3>';
      if (Array.isArray(topics)) {
        html += '<div class="card-grid">';
        topics.forEach(t => {
          const label = typeof t === 'string' ? t : (t.title || t.name || JSON.stringify(t));
          html += `<div class="card" style="cursor:pointer" onclick="location.hash='#/workshop'">${label}</div>`;
        });
        html += '</div>';
      } else {
        // 对象格式 — 按分类显示
        for (const [cat, items] of Object.entries(topics)) {
          html += `<h4 style="margin-top:16px">${cat}</h4><div class="card-grid">`;
          (Array.isArray(items) ? items : []).forEach(t => {
            const label = typeof t === 'string' ? t : (t.title || t.name || JSON.stringify(t));
            html += `<div class="card" style="cursor:pointer" onclick="location.hash='#/workshop'">${label}</div>`;
          });
          html += '</div>';
        }
      }
      el.innerHTML = html;
    } catch (e) {
      showToast(e.message, 'error');
    }
  },
};
