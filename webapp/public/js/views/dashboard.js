/**
 * [INPUT]: 依赖 API.get('/dashboard')
 * [OUTPUT]: Views.dashboard 对象
 * [POS]: views/ 的仪表盘页面, 首页默认视图
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const DashboardView = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading">加载中</div>';

    try {
      const data = await API.get('/dashboard');
      const { date, weekday, stats, todayFiles, todayCount, imageEnabled } = data;

      let html = `<h2>仪表盘</h2>`;

      // 头部状态
      html += `<div class="card-grid">
        <div class="card">
          <div class="card-header">日期</div>
          <div class="card-value" style="font-size:20px">${date}</div>
          <div class="card-sub">星期${weekday}</div>
        </div>
        <div class="card">
          <div class="card-header">今日产出</div>
          <div class="card-value">${todayCount || 0}</div>
          <div class="card-sub">篇内容</div>
        </div>
        <div class="card">
          <div class="card-header">图片引擎</div>
          <div class="card-value" style="font-size:16px">${imageEnabled ? 'Nano Banana Pro' : '未配置'}</div>
          <div class="card-sub">${imageEnabled ? '就绪' : '需配置 GOOGLE_AI_KEY'}</div>
        </div>
      </div>`;

      // 产出统计
      html += `<h3>产出统计</h3>`;
      html += `<div class="stats-row">`;
      const mainPlatforms = ['母稿', '小红书', '公众号', '即刻', 'X', 'linuxdo', 'GitHub', '朋友圈'];
      for (const p of mainPlatforms) {
        const count = stats[p] || 0;
        html += `<span class="stat-badge"><strong>${p}</strong>${count}</span>`;
      }
      html += `</div>`;

      // 今日已完成
      if (todayCount > 0) {
        html += `<h3>今日已产出 (${todayCount})</h3>`;
        html += `<div class="stats-row">`;
        for (const [p, files] of Object.entries(todayFiles)) {
          for (const f of files) {
            html += `<span class="stat-badge">${p}/${f}</span>`;
          }
        }
        html += `</div>`;
      }

      // 快捷操作
      html += `
        <h3 style="margin-top:24px">快捷操作</h3>
        <div class="quick-actions">
          <button class="btn btn-primary" onclick="location.hash='#/pipeline'">内容流水线</button>
          <button class="btn" onclick="location.hash='#/search'">热帖搜索</button>
          <button class="btn" onclick="location.hash='#/compliance'">合规检查</button>
          <button class="btn" onclick="location.hash='#/content'">内容管理</button>
        </div>
      `;

      app.innerHTML = html;
    } catch (e) {
      app.innerHTML = `<div class="empty">加载失败: ${e.message}</div>`;
    }
  }
};
