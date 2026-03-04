/**
 * [INPUT]: .md 文案文件（聊天记录体格式）
 * [OUTPUT]: { title, characters[], items[] } 结构化对话数据
 * [POS]: 流水线入口，被 generate-wechat-screenshot.mjs 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import * as fs from 'node:fs';

// ================================================================
//  正则集 — 提取自 render-dialog-video.mjs + 红包/系统消息扩展
// ================================================================

const RE_DIALOG     = /^([A-Za-z\u4e00-\u9fff\u3400-\u4dbf]+)[：:]\s*(.+)$/;
const RE_TIMESTAMP  = /^\*\*(.+)\*\*$/;
const RE_CHAR_TITLE = /^\*\*人物设定[：:]?\*\*$/;
const RE_CHAR_LINE  = /^-\s*([A-Za-z\u4e00-\u9fff]+)[\s（(]([^）)]+)[）)]\s*[——\-\s]*(.*)$/;
const RE_POSTSCRIPT = /^\*\*后记\*\*$/;
const RE_TRANSFER   = /^【转账\s*([\d.]+)】$/;
const RE_RECEIVED   = /^【已收款】$/;
const RE_VOICECALL  = /^【提示[：:](.+)】$/;
const RE_PURE_PUNCT = /^[！？…!?。，,~～.\s]+$/;

// --- 新增：红包 + 系统消息 ---
const RE_REDPACKET     = /^【红包(?:\s+(.+?))?】$/;
const RE_REDPACKET_GET = /^【已领取(?:红包)?】$/;
const RE_SYSTEM_MSG    = /^【系统[：:](.+)】$/;
const RE_SYSTEM_BOLD   = /^已通过好友验证|已添加了|以上是打招呼的内容/;

const EXCLUDED_TS = ['人物设定', '后记', '图片'];

// ================================================================
//  情绪推断 — 纯标点消息 → 表情包 emotion
// ================================================================

export function inferEmotion(text) {
  const ex = (text.match(/[！!]/g) || []).length;
  const qu = (text.match(/[？?]/g) || []).length;
  const el = (text.match(/[…。.]/g) || []).length;
  if (qu > ex && qu > el) return 'confused';
  if (el > ex && el > qu) return 'speechless';
  return 'shock';
}

// ================================================================
//  主解析器
// ================================================================

export function parseMd(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/);
  let state = 'PREAMBLE';
  let title = '';
  const characters = [];
  const items = [];
  const speakerSet = new Set();

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    if (RE_POSTSCRIPT.test(t)) { state = 'POSTSCRIPT'; continue; }
    if (state === 'POSTSCRIPT') continue;
    if (RE_CHAR_TITLE.test(t)) { state = 'CHARACTERS'; continue; }

    if (state === 'PREAMBLE') {
      if (t.startsWith('#')) title = t.replace(/^#+\s*/, '');
      if (RE_CHAR_LINE.test(t)) { state = 'CHARACTERS'; }
      else if (RE_DIALOG.test(t)) { state = 'DIALOG'; }
      else continue;
    }

    if (state === 'CHARACTERS') {
      const m = t.match(RE_CHAR_LINE);
      if (m) {
        characters.push({
          id: m[1], name: m[1], description: m[3] || m[2],
          side: characters.length === 0 ? 'right' : 'left',
        });
        continue;
      }
      if (t && !t.startsWith('-')) state = 'DIALOG';
      else continue;
    }

    if (state === 'DIALOG') {
      // --- 时间戳 / 系统消息（粗体行） ---
      const tsM = t.match(RE_TIMESTAMP);
      if (tsM) {
        const label = tsM[1].replace(/^[（(]|[）)]$/g, '');
        if (RE_SYSTEM_BOLD.test(label)) {
          items.push({ kind: 'system', text: label });
        } else if (!EXCLUDED_TS.some(ex => label.includes(ex))) {
          items.push({ kind: 'timestamp', label });
        }
        continue;
      }

      // --- 顶层语音通话提示 ---
      const vcM = t.match(RE_VOICECALL);
      if (vcM) {
        items.push({ kind: 'voicecall', description: vcM[1].trim() });
        continue;
      }

      // --- 对话行 ---
      const dlg = t.match(RE_DIALOG);
      if (dlg) {
        const speaker = dlg[1];
        const text = dlg[2].trim();
        speakerSet.add(speaker);

        // 转账
        const tfM = text.match(RE_TRANSFER);
        if (tfM) { items.push({ kind: 'transfer', speaker, amount: parseFloat(tfM[1]) }); continue; }

        // 已收款
        if (RE_RECEIVED.test(text)) { items.push({ kind: 'received', speaker }); continue; }

        // 红包
        const rpM = text.match(RE_REDPACKET);
        if (rpM) { items.push({ kind: 'redpacket', speaker, remark: rpM[1] || '恭喜发财，大吉大利' }); continue; }

        // 已领取红包
        if (RE_REDPACKET_GET.test(text)) { items.push({ kind: 'redpacket_get', speaker }); continue; }

        // 系统消息（对话内）
        const sysM = text.match(RE_SYSTEM_MSG);
        if (sysM) { items.push({ kind: 'system', text: sysM[1].trim() }); continue; }

        // 语音通话（对话内）
        const vcI = text.match(RE_VOICECALL);
        if (vcI) { items.push({ kind: 'voicecall', description: vcI[1].trim() }); continue; }

        // 纯标点 → 表情包
        if (RE_PURE_PUNCT.test(text)) {
          items.push({ kind: 'sticker', speaker, emotion: inferEmotion(text) });
          continue;
        }

        // 普通文字
        items.push({ kind: 'message', speaker, text });
        continue;
      }
    }
  }

  // 自动推断角色（无人物设定段时）
  if (characters.length === 0 && speakerSet.size > 0) {
    let idx = 0;
    for (const sp of speakerSet) {
      characters.push({
        id: sp, name: sp, description: '',
        side: idx === 0 ? 'right' : 'left',
      });
      idx++;
    }
  }

  return { title, characters, items };
}

// ================================================================
//  虚拟日期生成 — 时间标签 → 真实格式日期
// ================================================================

export function generateVirtualDates(timestampLabels) {
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 86400000);
  const base = new Date(twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime()));
  base.setHours(9 + Math.floor(Math.random() * 13), Math.floor(Math.random() * 60), 0, 0);

  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
  let current = new Date(base);
  const results = [];

  for (const label of timestampLabels) {
    let offset = 120 + Math.floor(Math.random() * 240);
    const minM = label.match(/(\d+)\s*分钟/);
    if (minM) offset = parseInt(minM[1]);
    const hrM = label.match(/(\d+)\s*小时/);
    if (hrM) offset = parseInt(hrM[1]) * 60;
    if (/第二天|次日/.test(label)) offset = 24 * 60;
    const dayM = label.match(/(\d+)\s*天后/);
    if (dayM) offset = parseInt(dayM[1]) * 24 * 60;
    if (/周末/.test(label)) offset = (3 + Math.floor(Math.random() * 4)) * 24 * 60;

    current = new Date(current.getTime() + offset * 60000);
    const h = String(current.getHours()).padStart(2, '0');
    const m = String(current.getMinutes()).padStart(2, '0');
    const time = `${h}:${m}`;
    const diffDays = Math.floor((now.getTime() - current.getTime()) / 86400000);

    if (diffDays <= 0) results.push(time);
    else if (diffDays === 1) results.push(`昨天 ${time}`);
    else if (diffDays < 7) results.push(`星期${WEEKDAYS[current.getDay()]} ${time}`);
    else results.push(`${current.getMonth() + 1}月${current.getDate()}日 ${time}`);
  }

  return results;
}
