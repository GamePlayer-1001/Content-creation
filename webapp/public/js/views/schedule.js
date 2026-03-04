/**
 * [INPUT]: 依赖 API.get('/schedule')
 * [OUTPUT]: Views.schedule 对象
 * [POS]: views/ 的排期管理页面
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const ScheduleView = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading">加载中</div>';

    try {
      const days = await API.get('/schedule');
      const today = new Date().toISOString().slice(0, 10);

      let html = `<h2>60 天排期</h2>`;

      // Phase 图例
      html += `<div class="stats-row" style="margin-bottom:16px">
        <span class="stat-badge">P0 弹药准备</span>
        <span class="stat-badge" style="border-left:3px solid var(--border)">P1 冷启动</span>
        <span class="stat-badge" style="border-left:3px solid var(--fg)">P2 放大期</span>
      </div>`;

      // 星期标题
      const weekNames = ['一', '二', '三', '四', '五', '六', '日'];
      html += `<div class="schedule-grid">`;
      for (const w of weekNames) {
        html += `<div class="schedule-weekday">${w}</div>`;
      }

      // 填充第一周前的空白
      const firstWeekday = days[0]?.weekday || 1;
      for (let i = 1; i < firstWeekday; i++) {
        html += `<div></div>`;
      }

      // 每天的格子
      for (const d of days) {
        const isToday = d.date === today;
        const typeEmoji = d.dayType.type === 'rest' ? '' : d.dayType.type === 'light' ? '' : '';
        html += `
          <div class="schedule-day phase-${d.phase.phase} ${isToday ? 'today' : ''}"
               title="Day ${d.dayN} · ${d.dayType.label} · ${d.phase.label}">
            <div class="day-n">${d.dayN}</div>
            <div class="day-date">${d.date.slice(5)}</div>
          </div>
        `;
      }

      html += `</div>`;

      // 阶段统计
      const p0 = days.filter(d => d.phase.phase === 0).length;
      const p1 = days.filter(d => d.phase.phase === 1).length;
      const p2 = days.filter(d => d.phase.phase === 2).length;
      html += `<div class="stats-row">
        <span class="stat-badge"><strong>P0</strong>${p0}天</span>
        <span class="stat-badge"><strong>P1</strong>${p1}天</span>
        <span class="stat-badge"><strong>P2</strong>${p2}天</span>
        <span class="stat-badge"><strong>内容日</strong>${days.filter(d => d.dayType.type === 'content').length}天</span>
        <span class="stat-badge"><strong>轻量日</strong>${days.filter(d => d.dayType.type === 'light').length}天</span>
        <span class="stat-badge"><strong>休息日</strong>${days.filter(d => d.dayType.type === 'rest').length}天</span>
      </div>`;

      app.innerHTML = html;
    } catch (e) {
      app.innerHTML = `<div class="empty">加载失败: ${e.message}</div>`;
    }
  }
};
