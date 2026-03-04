/**
 * [INPUT]: parseMd items[] + Puppeteer browser + 角色配置
 * [OUTPUT]: PNG Buffer[] 截图数组
 * [POS]: 分屏引擎，被 generate-wechat-screenshot.mjs 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { buildHtml } from './build-html.mjs';

// ================================================================
//  手机布局常量（iPhone X @3x）
// ================================================================

const PHONE_W  = 1125;
const PHONE_H  = 2436;
const TOP_H    = 264;   // phone-bar(132) + phone-nav(132)
const BOTTOM_H = 269;   // phone-bottom-chat(167) + phone-bottom-bar(102)
const PAD      = 72;    // wechat-content padding: 36px * 2
const CONTENT_H = PHONE_H - TOP_H - BOTTOM_H - PAD;  // 1831px

const CACHE_DIR = path.resolve('D:/Software/内容/tools/wechat-screenshot/.cache');

// ================================================================
//  临时文件 → page.goto('file://') 确保 CSS 资源可加载
// ================================================================

async function loadHtml(page, html) {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  const tmpFile = path.join(CACHE_DIR, `_render_${Date.now()}.html`);
  fs.writeFileSync(tmpFile, html, 'utf-8');
  const fileUrl = 'file:///' + tmpFile.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await sleep(300);
  fs.unlinkSync(tmpFile);
}

// ================================================================
//  主流程：测量 → 分组 → 逐屏渲染
// ================================================================

export async function generateScreenshots(items, ctx, browser) {
  const page = await browser.newPage();

  // --- Phase 1: 测量每条对话的渲染高度 ---
  const measureHtml = buildHtml(items, ctx, { measure: true });
  await page.setViewport({ width: PHONE_W, height: 10000 });
  await loadHtml(page, measureHtml);

  const heights = await page.$$eval('.wechat-dialog', els =>
    els.map(el => {
      const style = window.getComputedStyle(el);
      return el.offsetHeight + parseInt(style.marginBottom || '0');
    })
  );

  if (heights.length !== items.length) {
    console.warn(`  height count mismatch: ${heights.length} vs ${items.length} items`);
  }

  // --- Phase 2: 贪心装箱 — 不切断气泡 ---
  const screens = [];
  let buf = [];
  let accH = 0;

  for (let i = 0; i < items.length; i++) {
    const h = heights[i] || 200;
    if (accH + h > CONTENT_H && buf.length > 0) {
      screens.push(buf);
      buf = [];
      accH = 0;
    }
    buf.push(items[i]);
    accH += h;
  }
  if (buf.length > 0) screens.push(buf);

  console.log(`  split into ${screens.length} screens (${items.length} items total)`);

  // --- Phase 3: 逐屏渲染截图 ---
  const results = [];
  await page.setViewport({ width: PHONE_W, height: PHONE_H });

  for (let i = 0; i < screens.length; i++) {
    const html = buildHtml(screens[i], ctx, { measure: false });
    await loadHtml(page, html);

    const png = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: PHONE_W, height: PHONE_H },
    });
    results.push(png);
    console.log(`  rendered screen ${i + 1}/${screens.length}`);
  }

  await page.close();
  return results;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
