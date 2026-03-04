/**
 * [INPUT]: seed 字符串, 缓存目录路径
 * [OUTPUT]: 本地头像文件路径（200x200 jpg）
 * [POS]: 工具函数，被 generate-wechat-screenshot.mjs 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ================================================================
//  头像下载 — picsum.photos seed 保证同名同图
// ================================================================

export async function downloadAvatar(seed, cacheDir) {
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  const filePath = path.join(cacheDir, `${seed}.jpg`);
  if (fs.existsSync(filePath)) return filePath;

  console.log(`  downloading avatar: ${seed}...`);
  const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/200/200`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`avatar download failed: ${res.status}`);
  fs.writeFileSync(filePath, Buffer.from(await res.arrayBuffer()));
  return filePath;
}
