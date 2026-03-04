/**
 * [INPUT]: 依赖 node:fs, node:path; 依赖 ./types 的 StickerEmotion
 * [OUTPUT]: pickSticker(), resetPool()
 * [POS]: pipeline 的表情包随机池，保证同视频内不重复
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { StickerEmotion } from './types';

// 每种情绪的 shuffle queue
const pools: Map<string, string[]> = new Map();

// 简单 seed-free shuffle（Fisher-Yates）
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadPool(emotion: StickerEmotion, basePath: string): string[] {
  const dir = path.join(basePath, emotion);
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .map(f => path.join(emotion, f));
}

/**
 * 从指定情绪的表情包池中取一张，不重复直到池耗尽
 * 返回相对于 stickers/ 目录的路径，如 "shock/01.png"
 */
export function pickSticker(emotion: StickerEmotion, basePath: string): string {
  const key = `${basePath}:${emotion}`;
  let pool = pools.get(key);

  if (!pool || pool.length === 0) {
    const files = loadPool(emotion, basePath);
    pool = shuffle(files);
    pools.set(key, pool);
  }

  if (pool.length === 0) {
    // fallback: 无图片时返回空字符串，模板侧需处理
    return '';
  }

  return pool.pop()!;
}

/** 重置所有池（用于新视频渲染前） */
export function resetPool(): void {
  pools.clear();
}
