/**
 * [INPUT]: 无
 * [OUTPUT]: Views.toolbox 对象
 * [POS]: views/ 的工具箱页面，聚合可脱离主工作流的独立模块
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const ToolboxView = {
  render() {
    const app = document.getElementById('app');

    const groups = [
      {
        title: '文本处理',
        items: [
          { hash: '#/rewrite', title: '洗稿改写', desc: '对单篇内容做局部重写、自然化处理、风格切换。' },
          { hash: '#/compliance', title: '合规检查', desc: '独立扫描文本风险，不必走完整流程。' },
        ],
      },
      {
        title: '生产管理',
        items: [
          { hash: '#/content', title: '内容管理', desc: '查看输出文件、预览内容、删除无效产物。' },
          { hash: '#/review', title: '周复盘', desc: '统计本周产出并生成复盘报告。' },
        ],
      },
      {
        title: '系统配置',
        items: [
          { hash: '#/config', title: '配置管理', desc: '维护平台、规则、环境相关配置。' },
          { hash: '#/hotspots', title: '热点信息', desc: '独立处理热点读取与筛选，再把内容送入工作流第一步。' },
          { hash: '#/pipeline', title: '全流程工作流', desc: '需要端到端串行执行时，进入 6 步生产主线。' },
        ],
      },
    ];

    let html = `
      <h2>工具箱</h2>
      <p style="font-size:13px;color:var(--muted);margin-bottom:20px">
        这里收纳从全流程中拆出来的模块。原则是：能独立做的事，尽量不要强制走完整链路。
      </p>
    `;

    for (const group of groups) {
      html += `<div class="toolbox-group">`;
      html += `<h3>${group.title}</h3>`;
      html += `<div class="toolbox-grid">`;
      html += group.items.map((item) => `
        <a class="tool-card" href="${item.hash}">
          <div class="tool-card-title">${item.title}</div>
          <div class="tool-card-desc">${item.desc}</div>
          <div class="tool-card-link">打开模块</div>
        </a>
      `).join('');
      html += `</div></div>`;
    }

    app.innerHTML = html;
  },
};
