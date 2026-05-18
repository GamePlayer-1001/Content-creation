/**
 * [INPUT]: 依赖 API.get('/dashboard')
 * [OUTPUT]: Views.dashboard 对象
 * [POS]: views/ 的首页总览，承接主入口与工具箱分区入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const DashboardView = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading">加载中...</div>';

    try {
      const data = await API.get('/dashboard');
      const { date, weekday, stats, todayFiles, todayCount, imageEnabled } = data;
      const hotspotCount = (stats && (stats['母稿'] || 0)) ? stats['母稿'] : 0;

      let html = '<h2>首页总览</h2>';

      html += `
        <div class="card-grid">
          <div class="card">
            <div class="card-header">日期</div>
            <div class="card-value" style="font-size:20px">${date}</div>
            <div class="card-sub">星期${weekday}</div>
          </div>
          <div class="card">
            <div class="card-header">今日产出</div>
            <div class="card-value">${todayCount || 0}</div>
            <div class="card-sub">输出文件数</div>
          </div>
          <div class="card">
            <div class="card-header">图片能力</div>
            <div class="card-value" style="font-size:16px">${imageEnabled ? '已启用' : '未配置'}</div>
            <div class="card-sub">${imageEnabled ? '可生成封面与配图' : '需要 GOOGLE_GENAI_API_KEY'}</div>
          </div>
        </div>
      `;

      html += `
        <div class="section-grid" style="margin-bottom:24px">
          <div class="feature-panel feature-panel-hotspot">
            <div class="feature-kicker">Part 1</div>
            <h3>热点信息</h3>
            <p class="feature-copy">读取热点池、筛选主题，把热点内容送入工作流第一步作为母稿输入素材。</p>
            <div class="feature-meta">独立热点中心，负责选题导入，不再占用工作流步骤</div>
            <div class="feature-actions">
              <button class="btn btn-primary" onclick="location.hash='#/hotspots'">打开热点中心</button>
              <button class="btn" onclick="location.hash='#/pipeline'">直接进入工作流</button>
            </div>
          </div>

          <div class="feature-panel feature-panel-pipeline">
            <div class="feature-kicker">Part 2</div>
            <h3>全流程工作流</h3>
            <p class="feature-copy">按 6 步推进：母稿、多平台改写、合规审查与去 AI 味、配图、排版、导出并打开。</p>
            <div class="feature-meta">热点作为外部输入接入，工作流只承接正式生产步骤</div>
            <div class="feature-actions">
              <button class="btn btn-primary" onclick="location.hash='#/pipeline'">打开工作流</button>
            </div>
          </div>

          <div class="feature-panel feature-panel-toolbox">
            <div class="feature-kicker">Part 3</div>
            <h3>工具箱</h3>
            <p class="feature-copy">把全流程中的能力拆成可单独调用的工具模块，适合局部处理与人工补刀。</p>
            <div class="feature-meta">洗稿改写、合规检查、内容管理、配置管理、周复盘</div>
            <div class="feature-actions">
              <button class="btn btn-primary" onclick="location.hash='#/toolbox'">打开工具箱</button>
            </div>
          </div>
        </div>
      `;

      html += '<h3>输出统计</h3>';
      html += '<div class="stats-row">';
      const mainPlatforms = ['母稿', '小红书', '公众号', '即刻', 'X', 'linuxdo', 'GitHub', '朋友圈'];
      for (const p of mainPlatforms) {
        const count = stats[p] || 0;
        html += `<span class="stat-badge"><strong>${p}</strong>${count}</span>`;
      }
      html += '</div>';

      if (todayCount > 0) {
        html += `<h3>今日产出 (${todayCount})</h3><div class="stats-row">`;
        for (const [platform, files] of Object.entries(todayFiles)) {
          for (const file of files) {
            html += `<span class="stat-badge">${platform}/${file}</span>`;
          }
        }
        html += '</div>';
      }

      app.innerHTML = html;
    } catch (e) {
      app.innerHTML = `<div class="empty">加载失败: ${e.message}</div>`;
    }
  },
};
