/**
 * [INPUT]: 依赖 ./types（间接）
 * [OUTPUT]: generateVirtualDates()
 * [POS]: pipeline 的虚拟日期生成器，将相对时间标记转为微信格式时间
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ================================================================
//  中文时间标记 → 分钟偏移
// ================================================================

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function parseRelativeOffset(label: string): number {
  // "X分钟后"
  const minMatch = label.match(/(\d+)\s*分钟/);
  if (minMatch) return parseInt(minMatch[1]);

  // "X小时后"
  const hourMatch = label.match(/(\d+)\s*小时/);
  if (hourMatch) return parseInt(hourMatch[1]) * 60;

  // "第二天" / "第X天" / "次日"
  if (/第二天|次日/.test(label)) return 24 * 60;
  const dayMatch = label.match(/第(\d+)天/);
  if (dayMatch) return parseInt(dayMatch[1]) * 24 * 60;

  // "X天后" / "三天后"
  const daysLater = label.match(/([一二三四五六七八九十\d]+)\s*天后/);
  if (daysLater) {
    const n = chineseToNum(daysLater[1]);
    return n * 24 * 60;
  }

  // "第二天下午" / "下午"
  if (/下午/.test(label)) return 24 * 60 + randomInt(120, 300);

  // "周末" / "周末晚上"
  if (/周末/.test(label)) return (randomInt(3, 6)) * 24 * 60;

  // "晚上"
  if (/晚上/.test(label)) return 24 * 60 + randomInt(360, 540);

  // 默认: 2-6 小时后
  return randomInt(120, 360);
}

function chineseToNum(s: string): number {
  const map: Record<string, number> = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
  };
  return map[s] ?? parseInt(s) || 1;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ================================================================
//  微信时间格式化
// ================================================================

function formatWeChatTime(date: Date, refDate: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const time = `${h}:${m}`;

  const diffDays = Math.floor(
    (refDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return time;
  if (diffDays === 1) return `昨天 ${time}`;
  if (diffDays < 7) return `星期${WEEKDAYS[date.getDay()]} ${time}`;
  return `${date.getMonth() + 1}月${date.getDate()}日 ${time}`;
}

// ================================================================
//  主函数
// ================================================================

export function generateVirtualDates(
  timestampLabels: string[],
): string[] {
  // 随机基准: 过去两年内
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
  const rangeMs = now.getTime() - twoYearsAgo.getTime();
  const baseDate = new Date(twoYearsAgo.getTime() + Math.random() * rangeMs);

  // 设置初始时间为白天（9-21点）
  baseDate.setHours(randomInt(9, 21), randomInt(0, 59), 0, 0);

  let current = new Date(baseDate);
  const results: string[] = [];

  for (const label of timestampLabels) {
    const offsetMin = parseRelativeOffset(label);
    current = new Date(current.getTime() + offsetMin * 60 * 1000);
    results.push(formatWeChatTime(current, now));
  }

  return results;
}
