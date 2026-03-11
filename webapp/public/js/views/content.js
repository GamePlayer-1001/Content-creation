/**
 * [INPUT]: 依赖 API, showToast, marked
 * [OUTPUT]: Views.content 对象
 * [POS]: views/ 的内容管理页面, 支持子目录导航 + 图片缩略图预览
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ============================================================
//  图片扩展名检测
// ============================================================
const IMG_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
function isImageFile(name) {
  const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
  return IMG_EXTENSIONS.includes(ext);
}

const ContentView = {
  currentPlatform: null,
  currentSubdir: null,   // 当前子目录 (如 '图片' 下的 '小红书')

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

    // 面包屑导航 (子目录时显示)
    html += `<div id="content-breadcrumb" style="display:none"></div>`;
    html += `<div id="content-list"></div>`;
    html += `<div id="content-preview" style="display:none"></div>`;

    app.innerHTML = html;

    // Tab 事件
    document.querySelectorAll('#content-tabs .tab').forEach(tab => {
      tab.onclick = () => {
        this.currentPlatform = tab.dataset.platform;
        this.currentSubdir = null;
        document.querySelectorAll('#content-tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this._loadFiles(tab.dataset.platform);
      };
    });

    // 默认加载第一个
    if (platforms.length > 0) {
      this.currentPlatform = this.currentPlatform || platforms[0].name;
      if (this.currentSubdir) {
        this._loadFiles(this.currentPlatform, this.currentSubdir);
      } else {
        this._loadFiles(this.currentPlatform);
      }
    }
  },

  // ============================================================
  //  加载文件列表 (支持子目录)
  // ============================================================
  async _loadFiles(platform, subdir) {
    const listEl = document.getElementById('content-list');
    const previewEl = document.getElementById('content-preview');
    const breadcrumbEl = document.getElementById('content-breadcrumb');
    previewEl.style.display = 'none';

    const apiPath = subdir ? `/content/${platform}/${subdir}` : `/content/${platform}`;
    let files = [];
    try { files = await API.get(apiPath); } catch {}

    // 面包屑
    if (subdir) {
      breadcrumbEl.style.display = 'block';
      breadcrumbEl.innerHTML = `
        <span class="breadcrumb-link" id="bc-back" style="cursor:pointer;color:var(--accent);text-decoration:underline">
          ${platform}
        </span> / <strong>${subdir}</strong>
        <span style="margin-left:8px;color:var(--muted);font-size:0.85em">(${files.length} 项)</span>
      `;
      document.getElementById('bc-back').onclick = () => {
        this.currentSubdir = null;
        this._loadFiles(platform);
      };
    } else {
      breadcrumbEl.style.display = 'none';
    }

    if (files.length === 0) {
      listEl.innerHTML = `<div class="empty">暂无内容</div>`;
      return;
    }

    // 分离: 子目录 vs 文件
    const dirs = files.filter(f => f.isDir);
    const regularFiles = files.filter(f => !f.isDir);
    const imageFiles = regularFiles.filter(f => isImageFile(f.name));
    const textFiles = regularFiles.filter(f => !isImageFile(f.name));

    let html = '';

    // --- 子目录卡片 ---
    if (dirs.length > 0) {
      html += `<div class="subdir-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:16px">`;
      for (const d of dirs) {
        html += `
          <div class="subdir-card" data-subdir="${d.name}"
               style="padding:12px;background:var(--bg-secondary,#f5f5f5);border-radius:8px;cursor:pointer;text-align:center;border:1px solid var(--border,#ddd);transition:background .15s">
            <div style="font-size:1.5em;margin-bottom:4px">\uD83D\uDCC1</div>
            <div style="font-weight:500">${d.name}</div>
          </div>
        `;
      }
      html += `</div>`;
    }

    // --- 图片网格 ---
    if (imageFiles.length > 0) {
      const basePath = subdir ? `/output/${platform}/${subdir}` : `/output/${platform}`;
      html += `<div class="image-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:16px">`;
      for (const f of imageFiles) {
        const imgUrl = `${basePath}/${encodeURIComponent(f.name)}`;
        const size = f.size > 1024 ? `${(f.size / 1024).toFixed(0)}KB` : `${f.size}B`;
        html += `
          <div class="image-card" data-file="${f.name}" style="border-radius:8px;overflow:hidden;border:1px solid var(--border,#ddd);cursor:pointer">
            <img src="${imgUrl}" alt="${f.name}" loading="lazy"
                 style="width:100%;aspect-ratio:1;object-fit:cover;display:block;background:#eee" />
            <div style="padding:6px 8px;font-size:0.8em;display:flex;justify-content:space-between;align-items:center">
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px" title="${f.name}">${f.name}</span>
              <button class="btn btn-sm" data-action="delete" data-file="${f.name}" style="padding:2px 6px;font-size:0.75em">\u5220</button>
            </div>
          </div>
        `;
      }
      html += `</div>`;
    }

    // --- 文本文件列表 ---
    for (const f of textFiles) {
      const size = f.size > 1024 ? `${(f.size / 1024).toFixed(1)}KB` : `${f.size}B`;
      const date = f.modified.slice(0, 10);
      html += `
        <div class="file-item" data-file="${f.name}">
          <span class="file-name">${f.name}</span>
          <span class="file-meta">${size} \u00B7 ${date}</span>
          <button class="btn btn-sm" data-action="delete" data-file="${f.name}">\u5220\u9664</button>
        </div>
      `;
    }

    listEl.innerHTML = html;

    // --- 子目录点击 ---
    listEl.querySelectorAll('.subdir-card').forEach(card => {
      card.onmouseenter = () => card.style.background = 'var(--bg-hover,#e8e8e8)';
      card.onmouseleave = () => card.style.background = 'var(--bg-secondary,#f5f5f5)';
      card.onclick = () => {
        this.currentSubdir = card.dataset.subdir;
        this._loadFiles(platform, card.dataset.subdir);
      };
    });

    // --- 图片点击 → 大图预览 ---
    listEl.querySelectorAll('.image-card').forEach(card => {
      card.onclick = (e) => {
        if (e.target.dataset.action === 'delete') {
          e.stopPropagation();
          this._handleDelete(platform, e.target.dataset.file, subdir);
          return;
        }
        const img = card.querySelector('img');
        if (!img) return;
        previewEl.style.display = 'block';
        previewEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3>${card.dataset.file}</h3>
            <button class="btn btn-sm" id="cp-close">\u5173\u95ED</button>
          </div>
          <img src="${img.src}" alt="${card.dataset.file}" style="max-width:100%;border-radius:8px" />
        `;
        document.getElementById('cp-close').onclick = () => { previewEl.style.display = 'none'; };
      };
    });

    // --- 文本文件点击 → 预览 ---
    listEl.querySelectorAll('.file-item').forEach(item => {
      item.onclick = async (e) => {
        if (e.target.dataset.action === 'delete') {
          e.stopPropagation();
          this._handleDelete(platform, e.target.dataset.file, subdir);
          return;
        }
        const filename = item.dataset.file;
        const apiFile = subdir
          ? `/content/${platform}/${subdir}/${filename}`
          : `/content/${platform}/${filename}`;
        try {
          const data = await API.get(apiFile);
          previewEl.style.display = 'block';
          previewEl.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <h3>${filename}</h3>
              <div class="btn-group" style="margin:0">
                <button class="btn btn-sm" id="cp-copy">\u590D\u5236</button>
                <button class="btn btn-sm" id="cp-close">\u5173\u95ED</button>
              </div>
            </div>
            <div class="md-preview">${typeof marked !== 'undefined' ? marked.parse(data.content) : data.content}</div>
          `;
          document.getElementById('cp-copy').onclick = () => {
            navigator.clipboard.writeText(data.content);
            showToast('\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F');
          };
          document.getElementById('cp-close').onclick = () => { previewEl.style.display = 'none'; };
        } catch (err) { showToast(err.message, 'error'); }
      };
    });
  },

  // ============================================================
  //  删除文件
  // ============================================================
  async _handleDelete(platform, filename, subdir) {
    if (!confirm(`\u786E\u5B9A\u5220\u9664 ${filename}\uFF1F`)) return;
    const apiPath = subdir
      ? `/content/${platform}/${subdir}/${filename}`
      : `/content/${platform}/${filename}`;
    try {
      await API.del(apiPath);
      showToast('\u5DF2\u5220\u9664');
      this._loadFiles(platform, subdir);
    } catch (err) { showToast(err.message, 'error'); }
  },
};
