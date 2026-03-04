/**
 * [INPUT]: parseMd() 输出的 items[] + 角色配置 + wxdh 资源路径
 * [OUTPUT]: 完整 HTML 字符串（供 Puppeteer 渲染）
 * [POS]: 核心模板引擎，被 split-screens.mjs 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import * as path from 'node:path';
import * as fs from 'node:fs';

// ================================================================
//  常量 — wxdh 资源路径 + 手机尺寸
// ================================================================

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..', '..', '..');
const CSS_DIR   = path.join(PROJECT_ROOT, 'assets', 'wechat-css');
const IMG_DIR   = path.join(PROJECT_ROOT, 'assets', 'wechat-images');

const PHONE_W = 1125;
const PHONE_H = 2436;

/** Windows path → file:// URL */
function fileUrl(p) {
  return 'file:///' + p.replace(/\\/g, '/');
}

// ================================================================
//  表情包选取 — 从 表情包/ 目录随机选取
// ================================================================

const stickerPools = {};
function pickSticker(emotion) {
  const baseDir = path.join(PROJECT_ROOT, 'assets', 'stickers');
  const dir = path.join(baseDir, emotion);
  if (!fs.existsSync(dir)) return '';

  if (!stickerPools[dir] || stickerPools[dir].length === 0) {
    const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f));
    for (let i = files.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [files[i], files[j]] = [files[j], files[i]];
    }
    stickerPools[dir] = files.map(f => path.join(dir, f));
  }
  return stickerPools[dir].length > 0 ? stickerPools[dir].pop() : '';
}

// ================================================================
//  HTML 转义
// ================================================================

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ================================================================
//  单条对话 → HTML 片段
// ================================================================

function renderDialog(item, ctx) {
  const { avatars, sides, chatTitle } = ctx;

  // 解析方向：speaker → side
  const side = item.speaker ? (sides[item.speaker] || 'left') : null;
  const isRight = side === 'right';
  const wrapCls = isRight ? 'wechat-dialog wechat-dialog-right' : 'wechat-dialog';
  const avatarUrl = item.speaker ? (avatars[item.speaker] || '') : '';
  const faceHtml = avatarUrl
    ? `<div class="wechat-dialog-face"><img src="${esc(fileUrl(avatarUrl))}" /></div>`
    : '';

  switch (item.kind) {
    // --- 文字消息 ---
    case 'message':
      return `<div class="${wrapCls}">${faceHtml}<div class="wechat-dialog-text">${esc(item.text)}</div></div>`;

    // --- 时间戳 ---
    case 'timestamp':
      return `<div class="wechat-dialog"><div class="wechat-dialog-notice"><span>${esc(item.label)}</span></div></div>`;

    // --- 系统消息 ---
    case 'system':
      return `<div class="wechat-dialog"><div class="wechat-dialog-notice"><span class="wechat-dialog-notice-system">${esc(item.text)}</span></div></div>`;

    // --- 语音通话提示 ---
    case 'voicecall':
      return `<div class="wechat-dialog"><div class="wechat-dialog-notice"><span class="wechat-dialog-notice-system">${esc(item.description)}</span></div></div>`;

    // --- 转账（待领取） ---
    case 'transfer':
      return `<div class="${wrapCls}">${faceHtml}
        <div class="wechat-dialog-text wechat-dialog-trans">
          <div class="wechat-dialog-trans-content"><i></i>
            <div><span>&yen;${item.amount.toFixed(2)}</span><font>转账给${esc(chatTitle)}</font></div>
          </div>
          <div class="wechat-dialog-trans-bottom"><span>微信转账</span></div>
        </div></div>`;

    // --- 已收款 ---
    case 'received':
      return `<div class="${wrapCls}">${faceHtml}
        <div class="wechat-dialog-text wechat-dialog-trans wechat-dialog-trans-get">
          <div class="wechat-dialog-trans-content"><i></i>
            <div><span>已收款</span><font>微信转账</font></div>
          </div>
          <div class="wechat-dialog-trans-bottom"><span>微信转账</span></div>
        </div></div>`;

    // --- 红包（未领取） ---
    case 'redpacket':
      return `<div class="${wrapCls}">${faceHtml}
        <div class="wechat-dialog-text wechat-dialog-trans">
          <div class="wechat-dialog-trans-content wechat-dialog-redp-content"><i></i>
            <div><span>${esc(item.remark)}</span></div>
          </div>
          <div class="wechat-dialog-trans-bottom"><span>微信红包</span></div>
        </div></div>`;

    // --- 红包（已领取） ---
    case 'redpacket_get':
      return `<div class="${wrapCls}">${faceHtml}
        <div class="wechat-dialog-text wechat-dialog-trans wechat-dialog-trans-get">
          <div class="wechat-dialog-trans-content wechat-dialog-redp-content"><i></i>
            <div><span>恭喜发财，大吉大利</span><font>已领取</font></div>
          </div>
          <div class="wechat-dialog-trans-bottom"><span>微信红包</span></div>
        </div></div>`;

    // --- 表情包 ---
    case 'sticker': {
      const stickerPath = pickSticker(item.emotion);
      if (!stickerPath) return `<div class="${wrapCls}">${faceHtml}<div class="wechat-dialog-text">[表情]</div></div>`;
      return `<div class="${wrapCls}">${faceHtml}
        <div class="wechat-dialog-text wechat-dialog-image"><img src="${esc(fileUrl(stickerPath))}" /></div></div>`;
    }

    default:
      return '';
  }
}

// ================================================================
//  完整 HTML 文档生成
// ================================================================

/**
 * @param {object[]} items    - parseMd 输出的 items 子集
 * @param {object}   ctx      - { avatars, sides, chatTitle, navTitle }
 * @param {object}   opts     - { measure: boolean } measure=true 则不渲染手机框
 */
export function buildHtml(items, ctx, opts = {}) {
  const { measure = false } = opts;
  const { navTitle = '聊天' } = ctx;

  const cssUrl    = fileUrl(path.join(CSS_DIR, 'app.css'));
  const dialogsHtml = items.map(item => renderDialog(item, ctx)).join('\n');

  // 测量模式：只渲染对话区域，溢出可见
  if (measure) {
    return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<link rel="stylesheet" href="${cssUrl}">
<style>
  body { margin: 0; padding: 0; background: #ededed; }
  .phone { width: ${PHONE_W}px; height: auto !important; position: relative; }
  .phone-top, .phone-bottom { display: none !important; }
  .phone-body { position: relative !important; top: 0 !important; bottom: auto !important;
    height: auto !important; overflow: visible !important; }
</style>
</head><body>
<div class="phone"><div class="phone-body"><div class="wechat-content">${dialogsHtml}</div></div></div>
</body></html>`;
  }

  // 渲染模式：完整手机框
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<link rel="stylesheet" href="${cssUrl}">
<style>
  body { margin: 0; padding: 0; }
  .phone-body { overflow: hidden !important; }
</style>
</head><body>
<div class="phone">
  <div class="phone-top">
    <div class="phone-bar">
      <div class="phone-time">09:41</div>
      <div class="phone-sigle phone-sigle-v4">signal</div>
      <div class="phone-wifi">wifi</div>
      <div class="phone-battery"><span><font style="width:80%">bat</font></span></div>
    </div>
    <div class="phone-nav">
      <div class="phone-nav-left"><div class="phone-nav-back">back</div></div>
      <div class="phone-nav-center"><span><font>${esc(navTitle)}</font></span></div>
      <div class="phone-nav-right"><div class="phone-nav-more">more</div></div>
    </div>
  </div>
  <div class="phone-body"><div class="wechat-content">${dialogsHtml}</div></div>
  <div class="phone-bottom">
    <div class="phone-bottom-chat">
      <div class="wechat-bottom">
        <div class="wechat-bottom-icon wechat-voice-icon">voice</div>
        <div class="wechat-input">input</div>
        <div class="wechat-bottom-icon wechat-emoji-icon">emoji</div>
        <div class="wechat-bottom-icon wechat-more-icon">more</div>
      </div>
    </div>
    <div class="phone-bottom-bar"><i>home</i></div>
  </div>
</div>
</body></html>`;
}
