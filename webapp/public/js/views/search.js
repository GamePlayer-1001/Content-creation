/**
 * [INPUT]: 依赖 API
 * [OUTPUT]: Views.search 对象
 * [POS]: views/ 的热帖搜索页面 (占位, 搜索引擎后续接入)
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const SearchView = {
  async render() {
    const app = document.getElementById('app');

    const platforms = ['知乎', '小红书', 'X/Twitter', 'Reddit', '即刻', '微博', 'V2EX'];

    let html = `<h2>热帖搜索 <span class="coming-soon">搜索引擎接入中</span></h2>`;

    // 搜索栏
    html += `
      <div class="search-bar">
        <input class="form-input" id="search-input" placeholder="输入关键词搜索热帖..." />
        <button class="btn btn-primary" id="search-btn">搜索</button>
      </div>
    `;

    // 平台筛选
    html += `<div class="search-filters">`;
    html += `<span class="search-filter active" data-platform="all">全部</span>`;
    for (const p of platforms) {
      html += `<span class="search-filter" data-platform="${p}">${p}</span>`;
    }
    html += `</div>`;

    // 搜索结果区
    html += `<div id="search-results" class="search-results">
      <div class="empty">输入关键词开始搜索，找到合适的热帖后可直接导入到内容流水线</div>
    </div>`;

    // 使用说明
    html += `
      <div class="card" style="margin-top:24px;border-style:dashed">
        <div class="card-header">使用说明</div>
        <div style="font-size:13px;line-height:1.8">
          1. 输入关键词搜索各平台热帖<br>
          2. 点击帖子标题可在新标签页打开原文<br>
          3. 点击「复制」可复制帖子内容<br>
          4. 点击「导入流水线」可将帖子作为素材导入创作流水线
        </div>
      </div>
    `;

    app.innerHTML = html;

    // --- 事件绑定 ---
    // 平台筛选切换
    document.querySelectorAll('.search-filter').forEach(el => {
      el.onclick = () => {
        document.querySelectorAll('.search-filter').forEach(f => f.classList.remove('active'));
        el.classList.add('active');
      };
    });

    // 搜索按钮
    document.getElementById('search-btn').onclick = () => {
      const keyword = document.getElementById('search-input').value.trim();
      if (!keyword) {
        showToast('请输入搜索关键词', 'error');
        return;
      }
      this._showMockResults(keyword);
    };

    // 回车搜索
    document.getElementById('search-input').onkeydown = (e) => {
      if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
      }
    };
  },

  // 占位: 模拟搜索结果 (后续接真实 API)
  _showMockResults(keyword) {
    const container = document.getElementById('search-results');
    container.innerHTML = `
      <div class="empty" style="padding:24px">
        <div style="font-size:16px;margin-bottom:8px">搜索引擎接入中</div>
        <div style="font-size:13px;color:var(--muted)">
          关键词「${keyword}」已记录，搜索功能将在后续版本中接入。<br>
          你可以先手动将热帖内容粘贴到「内容流水线」中使用。
        </div>
        <button class="btn" style="margin-top:16px" onclick="location.hash='#/pipeline'">
          前往内容流水线
        </button>
      </div>
    `;
  },
};
