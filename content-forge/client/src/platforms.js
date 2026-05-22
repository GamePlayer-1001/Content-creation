/**
 * 全平台定义 — 对应 config/platforms.yaml 的12个平台
 * 按组分类：A长图文 / B技术社区 / C社交平台 / D国际长文 / E国际社交 / F私域
 */

export const PLATFORM_GROUPS = [
  {
    label: '中文长图文',
    platforms: [
      { id: 'wechat', name: '微信公众号', width: 375 },
      { id: 'toutiao', name: '今日头条', width: 414 },
      { id: 'zhihu', name: '知乎', width: 414 },
    ],
  },
  {
    label: '中文社交',
    platforms: [
      { id: 'xiaohongshu', name: '小红书', width: 375 },
      { id: 'jike', name: '即刻', width: 375 },
      { id: 'pengyouquan', name: '朋友圈', width: 375 },
    ],
  },
  {
    label: '技术社区',
    platforms: [
      { id: 'linuxdo', name: 'LinuxDo', width: 414 },
      { id: 'github', name: 'GitHub', width: 414 },
    ],
  },
  {
    label: '国际平台',
    platforms: [
      { id: 'x', name: 'X', width: 375 },
      { id: 'medium', name: 'Medium', width: 414 },
      { id: 'quora', name: 'Quora', width: 414 },
      { id: 'reddit', name: 'Reddit', width: 414 },
    ],
  },
];

// 扁平列表
export const ALL_PLATFORMS = PLATFORM_GROUPS.flatMap(g => g.platforms);

// 快速查询
export function getPlatformById(id) {
  return ALL_PLATFORMS.find(p => p.id === id) || ALL_PLATFORMS[0];
}
