/**
 * [INPUT]: 依赖 ./types 的 ScenarioData, Episode, DialogItem
 * [OUTPUT]: splitEpisodes()
 * [POS]: pipeline 的分集器，按时间标记和上限拆分长对话
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { ScenarioData, Episode, DialogItem } from './types';

const DEFAULT_MAX_ITEMS = 40;
const MIN_ITEMS_PER_EPISODE = 8;

export function splitEpisodes(
  scenario: ScenarioData,
  maxItems = DEFAULT_MAX_ITEMS,
): Episode[] {
  const { items, characters, title } = scenario;

  if (items.length === 0) return [];

  // 找到所有 timestamp 的位置作为候选分割点
  const splitPoints: number[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === 'timestamp') splitPoints.push(i);
  }

  // 按分割点切段
  const segments: DialogItem[][] = [];
  let start = 0;

  for (const sp of splitPoints) {
    if (sp > start) {
      segments.push(items.slice(start, sp));
    }
    start = sp; // timestamp 归入下一段
  }
  if (start < items.length) {
    segments.push(items.slice(start));
  }

  // 合并过短的段，拆分过长的段
  const episodes: DialogItem[][] = [];
  let buffer: DialogItem[] = [];

  for (const seg of segments) {
    buffer = buffer.concat(seg);

    if (buffer.length >= maxItems) {
      episodes.push(buffer);
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    // 过短则合并到上一集
    if (buffer.length < MIN_ITEMS_PER_EPISODE && episodes.length > 0) {
      episodes[episodes.length - 1] = episodes[episodes.length - 1].concat(buffer);
    } else {
      episodes.push(buffer);
    }
  }

  // 如果只有一集且不超过上限，直接返回
  if (episodes.length === 0) {
    episodes.push(items);
  }

  return episodes.map((epItems, idx) => ({
    index: idx,
    total: episodes.length,
    title,
    characters,
    items: epItems,
  }));
}
