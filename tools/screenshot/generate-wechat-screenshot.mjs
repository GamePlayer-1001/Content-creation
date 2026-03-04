/**
 * [INPUT]: .md 文案文件路径 (CLI argv)
 * [OUTPUT]: 分屏 PNG 截图到 output 目录
 * [POS]: CLI 入口，串联 parse → nickname → avatar → split-screen 流水线
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 *
 * 用法: node generate-wechat-screenshot.mjs "path/to/file.md" [--output-dir "path"]
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import puppeteer from 'puppeteer';
import { parseMd, generateVirtualDates } from './lib/parse-md.mjs';
import { generateNickname } from './lib/nickname.mjs';
import { downloadAvatar } from './lib/avatar.mjs';
import { generateScreenshots } from './lib/split-screens.mjs';

// ================================================================
//  参数解析
// ================================================================

const args = process.argv.slice(2);
let mdPath = '';
const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..');
let outputDir = path.join(PROJECT_ROOT, 'output');

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output-dir' && args[i + 1]) { outputDir = path.resolve(args[++i]); }
  else if (!args[i].startsWith('-')) { mdPath = args[i]; }
}

if (!mdPath) {
  console.error('用法: node generate-wechat-screenshot.mjs "path/to/file.md" [--output-dir "path"]');
  process.exit(1);
}

const absPath = path.resolve(mdPath);
if (!fs.existsSync(absPath)) {
  console.error(`file not found: ${absPath}`);
  process.exit(1);
}

// ================================================================
//  主流程
// ================================================================

async function main() {
  console.log(`[wechat-screenshot] parsing: ${absPath}`);

  // 1. 解析 MD
  const scenario = parseMd(absPath);
  if (scenario.items.length === 0) {
    console.log('no dialog items found, skipping');
    process.exit(0);
  }
  console.log(`  ${scenario.characters.length} characters, ${scenario.items.length} items`);

  // 2. 生成昵称
  for (const ch of scenario.characters) {
    ch.displayName = generateNickname(ch);
  }
  const leftChar  = scenario.characters.find(c => c.side === 'left');
  const rightChar = scenario.characters.find(c => c.side === 'right');
  const leftName  = leftChar?.displayName || '对方';
  const rightName = rightChar?.displayName || '我';
  console.log(`  nicknames: left(${leftName}) right(${rightName})`);

  // 3. 虚拟日期
  const tsLabels = scenario.items.filter(i => i.kind === 'timestamp').map(i => i.label);
  if (tsLabels.length > 0) {
    const dates = generateVirtualDates(tsLabels);
    let idx = 0;
    for (const item of scenario.items) {
      if (item.kind === 'timestamp') item.label = dates[idx++];
    }
  }

  // 4. 下载头像
  const cacheDir = path.join(import.meta.dirname, '.cache', 'avatars');
  const leftAvatarPath  = await downloadAvatar(leftName, cacheDir);
  const rightAvatarPath = await downloadAvatar(rightName, cacheDir);

  // 5. 构建渲染上下文
  const avatars = {};
  const sides = {};
  for (const ch of scenario.characters) {
    sides[ch.id] = ch.side;
    avatars[ch.id] = ch.side === 'left' ? leftAvatarPath : rightAvatarPath;
  }

  const ctx = {
    avatars,
    sides,
    chatTitle: leftName,
    navTitle: leftName,
  };

  // 6. 启动 Puppeteer
  console.log('  launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--allow-file-access-from-files',
      '--disable-web-security',
    ],
  });

  // 7. 生成分屏截图
  const screenshots = await generateScreenshots(scenario.items, ctx, browser);
  await browser.close();

  // 8. 写入文件
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const baseName = path.basename(absPath, path.extname(absPath));

  const outputPaths = [];
  for (let i = 0; i < screenshots.length; i++) {
    const fileName = screenshots.length === 1
      ? `${baseName}-微信截图.png`
      : `${baseName}-微信截图-${i + 1}.png`;
    const outPath = path.join(outputDir, fileName);
    fs.writeFileSync(outPath, screenshots[i]);
    outputPaths.push(outPath);
    console.log(`  saved: ${outPath}`);
  }

  console.log(`\n[wechat-screenshot] done! ${screenshots.length} screenshots generated`);
  return outputPaths;
}

main().catch(err => {
  console.error('[wechat-screenshot] failed:', err.message);
  process.exit(1);
});
