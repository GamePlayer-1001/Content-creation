/**
 * [INPUT]: 依赖 API
 * [OUTPUT]: Views.content 对象
 * [POS]: views/ 的内容管理页面
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const ContentView = {
  currentPlatform: null,

  async render() {
    const app = document.getElementById('app');
    let platforms = [];
    try { platforms = await API.get('/content'); } catch {}

    let html = `<h2>内容管理</h2>`;

    // 平台 Tabs
    html += `<div class="tabs" id="content-tabs">`;
    for (const p of platforms) {
      const active = (this.currentPlatform || platforms[0]?.name) === p.name ? 'active' : '';
      html += `<div class="tab ${active}" data-platform="${p.name}">${p.name} (${p.count})</div>`;
    }
    html += `</div>`;

    html += `<div id="content-list"></div>`;
    html += `<div id="content-preview" style="display:none"></div>`;

    app.innerHTML = html;

    // Tab 事件
    document.querySelectorAll('#content-tabs .tab').forEach(tab => {
      tab.onclick = () => {
        this.currentPlatform = tab.dataset.platform;
        document.querySelectorAll('#content-tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this._loadFiles(tab.dataset.platform);
      };
    });

    // 默认加载第一个
    if (platforms.length > 0) {
      this.currentPlatform = this.currentPlatform || platforms[0].name;
      this._loadFiles(this.currentPlatform);
    }
  },

  async _loadFiles(platform) {
    const listEl = document.getElementById('content-list');
    const previewEl = document.getElementById('content-preview');
    previewEl.style.display = 'none';

    let files = [];
    try { files = await API.get(`/content/${platform}`); } catch {}

    if (files.length === 0) {
      listEl.innerHTML = `<div class="empty">暂无内容</div>`;
      return;
    }

    let html = '';
    for (const f of files) {
      if (f.isDir) continue;
      const size = f.size > 1024 ? `${(f.size / 1024).toFixed(1)}KB` : `${f.size}B`;
      const date = f.modified.slice(0, 10);
      html += `
        <div class="file-item" data-file="${f.name}">
          <span class="file-name">${f.name}</span>
          <span class="file-meta">${size} · ${date}</span>
          <button class="btn btn-sm" data-action="delete" data-file="${f.name}">删除</button>
        </div>
      `;
    }
    listEl.innerHTML = html;

    // 点击文件预览
    listEl.querySelectorAll('.file-item').forEach(item => {
      item.onclick = async (e) => {
        if (e.target.dataset.action === 'delete') {
          e.stopPropagation();
          if (confirm(`确定删除 ${e.target.dataset.file}？`)) {
            try {
              await API.del(`/content/${platform}/${e.target.dataset.file}`);
              showToast('已删除');
              this._loadFiles(platform);
            } catch (err) { showToast(err.message, 'error'); }
          }
          return;
        }

        const filename = item.dataset.file;
        try {
          const { content } = await API.get(`/content/${platform}/${filename}`);
          previewEl.style.display = 'block';
          previewEl.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <h3>${filename}</h3>
              <div class="btn-group" style="margin:0">
                <button class="btn btn-sm" id="cp-copy">复制</button>
                <button class="btn btn-sm" id="cp-close">关闭</button>
              </div>
            </div>
            <div class="md-preview">${typeof marked !== 'undefined' ? marked.parse(content) : content}</div>
          `;
          document.getElementById('cp-copy').onclick = () => {
            navigator.clipboard.writeText(content);
            showToast('已复制到剪贴板');
          };
          document.getElementById('cp-close').onclick = () => {
            previewEl.style.display = 'none';
          };
        } catch (err) { showToast(err.message, 'error'); }
      };
    });
  }
};
