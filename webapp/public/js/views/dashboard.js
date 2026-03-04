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
      const { dayN, date, weekday, dayType, phase, tasks, stats, todayFiles } = data;

      // 头部状态卡片
      let html = `<h2>仪表盘</h2>`;
      html += `<div class="card-grid">`;
      html += `
        <div class="card">
          <div class="card-header">推广日</div>
          <div class="card-value">Day ${dayN}</div>
          <div class="card-sub">${date} ${weekday}</div>
        </div>
        <div class="card">
          <div class="card-header">阶段</div>
          <div class="card-value">P${phase.phase}</div>
          <div class="card-sub">${phase.label}</div>
        </div>
        <div class="card">
          <div class="card-header">日类型</div>
          <div class="card-value">${dayType.label}</div>
          <div class="card-sub">预计 ${dayType.hours}</div>
        </div>
      `;
      html += `</div>`;

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
      const todayCount = Object.values(todayFiles).flat().length;
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

      // 今日任务
      html += `<h3>今日任务</h3>`;
      html += `<ul class="task-list">`;
      for (const t of tasks) {
        const skillBtn = t.skill
          ? `<span class="task-skill" onclick="location.hash='#/workshop'">${t.skill}</span>`
          : '';
        html += `
          <li class="task-item">
            <span class="task-time">${t.time}</span>
            <span class="task-name">${t.task}</span>
            ${skillBtn}
          </li>
        `;
      }
      html += `</ul>`;

      // 快捷操作
      html += `
        <h3 style="margin-top:24px">快捷操作</h3>
        <div class="quick-actions">
          <button class="btn btn-primary" onclick="location.hash='#/workshop'">开始创作</button>
          <button class="btn" onclick="location.hash='#/distribute'">全平台分发</button>
          <button class="btn" onclick="location.hash='#/compliance'">合规检查</button>
          <button class="btn" onclick="location.hash='#/schedule'">查看排期</button>
        </div>
      `;

      // 阶段提醒
      if (phase.focus) {
        html += `
          <div class="card" style="margin-top:24px;border-style:dashed">
            <div class="card-header">阶段提醒</div>
            <div style="font-size:13px">${phase.focus}</div>
          </div>
        `;
      }

      app.innerHTML = html;
    } catch (e) {
      app.innerHTML = `<div class="empty">加载失败: ${e.message}</div>`;
    }
  }
};
