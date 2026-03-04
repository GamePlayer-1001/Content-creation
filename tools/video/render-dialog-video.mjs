/**
 * [INPUT]: 依赖 @remotion/bundler, @remotion/renderer; 依赖 pipeline/* (通过动态编译)
 * [OUTPUT]: 渲染 .mp4 视频到指定目录（默认 D:\Software\内容\output\）
 * [POS]: CLI 入口脚本，串联整个 .md → .mp4 流水线
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 *
 * 用法: node scripts/render-dialog-video.mjs "path/to/file.md" [--output-dir "path"]
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ================================================================
//  内联解析器（避免 TypeScript 编译依赖）
// ================================================================

const RE_DIALOG = /^([A-Za-z\u4e00-\u9fff\u3400-\u4dbf]+)[：:]\s*(.+)$/;
const RE_TIMESTAMP = /^\*\*(.+)\*\*$/;
const RE_CHAR_TITLE = /^\*\*人物设定[：:]?\*\*$/;
const RE_CHAR_LINE = /^-\s*([A-Za-z\u4e00-\u9fff]+)[\s（(]([^）)]+)[）)]\s*[——\-\s]*(.*)$/;
const RE_POSTSCRIPT = /^\*\*后记\*\*$/;
const RE_TRANSFER = /^【转账\s*([\d.]+)】$/;
const RE_RECEIVED = /^【已收款】$/;
const RE_VOICECALL = /^【提示[：:](.+)】$/;
const RE_PURE_PUNCT = /^[！？…!?。，,~～.\s]+$/;
const EXCLUDED_TS = ['人物设定', '后记', '图片'];

function inferEmotion(text) {
  const ex = (text.match(/[！!]/g) || []).length;
  const qu = (text.match(/[？?]/g) || []).length;
  const el = (text.match(/[…。\.]/g) || []).length;
  if (qu > ex && qu > el) return 'confused';
  if (el > ex && el > qu) return 'speechless';
  return 'shock';
}

function parseMd(filePath) {
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
      const tsM = t.match(RE_TIMESTAMP);
      if (tsM) {
        const label = tsM[1].replace(/^[（(]|[）)]$/g, '');
        if (!EXCLUDED_TS.some(ex => label.includes(ex))) {
          items.push({ kind: 'timestamp', label });
        }
        continue;
      }

      const vcM = t.match(RE_VOICECALL);
      if (vcM) { items.push({ kind: 'voicecall', description: vcM[1].trim() }); continue; }

      const dlg = t.match(RE_DIALOG);
      if (dlg) {
        const speaker = dlg[1];
        const text = dlg[2].trim();
        speakerSet.add(speaker);

        const tfM = text.match(RE_TRANSFER);
        if (tfM) { items.push({ kind: 'transfer', speaker, amount: parseFloat(tfM[1]) }); continue; }
        if (RE_RECEIVED.test(text)) { items.push({ kind: 'received', speaker }); continue; }
        const vcI = text.match(RE_VOICECALL);
        if (vcI) { items.push({ kind: 'voicecall', description: vcI[1].trim() }); continue; }
        if (RE_PURE_PUNCT.test(text)) { items.push({ kind: 'sticker', speaker, emotion: inferEmotion(text) }); continue; }
        items.push({ kind: 'message', speaker, text });
        continue;
      }
    }
  }

  if (characters.length === 0 && speakerSet.size > 0) {
    let idx = 0;
    for (const sp of speakerSet) {
      characters.push({ id: sp, name: sp, description: '', side: idx === 0 ? 'right' : 'left' });
      idx++;
    }
  }

  return { title, characters, items };
}

// ================================================================
//  分集器
// ================================================================

function splitEpisodes(scenario, maxItems = 40) {
  const { items, characters, title } = scenario;
  if (items.length === 0) return [];

  const splitPoints = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === 'timestamp') splitPoints.push(i);
  }

  const segments = [];
  let start = 0;
  for (const sp of splitPoints) {
    if (sp > start) segments.push(items.slice(start, sp));
    start = sp;
  }
  if (start < items.length) segments.push(items.slice(start));

  const episodes = [];
  let buffer = [];
  for (const seg of segments) {
    buffer = buffer.concat(seg);
    if (buffer.length >= maxItems) { episodes.push(buffer); buffer = []; }
  }
  if (buffer.length > 0) {
    if (buffer.length < 8 && episodes.length > 0) {
      episodes[episodes.length - 1] = episodes[episodes.length - 1].concat(buffer);
    } else {
      episodes.push(buffer);
    }
  }
  if (episodes.length === 0) episodes.push(items);

  return episodes.map((ep, idx) => ({
    index: idx, total: episodes.length, title, characters, items: ep,
  }));
}

// ================================================================
//  帧计算器
// ================================================================

const GAPS = {
  message_short: 45, message_medium: 60, message_long: 80,
  message_same_speaker: 30, transfer: 70, received: 50,
  voicecall: 90, timestamp: 60, sticker: 55,
};

function resolveSide(speaker, characters) {
  const c = characters.find(ch => ch.id === speaker || ch.name === speaker);
  return c?.side ?? 'left';
}

// 表情包选取（简单版）
const stickerPools = {};
function pickSticker(emotion, basePath) {
  const dir = path.join(basePath, emotion);
  if (!fs.existsSync(dir)) return '';
  const key = `${dir}`;
  if (!stickerPools[key] || stickerPools[key].length === 0) {
    const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
    // shuffle
    for (let i = files.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [files[i], files[j]] = [files[j], files[i]];
    }
    stickerPools[key] = files.map(f => `${emotion}/${f}`);
  }
  return stickerPools[key].length > 0 ? stickerPools[key].pop() : '';
}

function calculateFrames(episode, stickerBasePath) {
  const result = [];
  let currentFrame = 30;
  let prevSpeaker = null;

  for (const item of episode.items) {
    let gap;
    if (item.kind === 'message') {
      gap = prevSpeaker === item.speaker ? GAPS.message_same_speaker
        : item.text.length < 10 ? GAPS.message_short
        : item.text.length < 30 ? GAPS.message_medium : GAPS.message_long;
    } else {
      gap = GAPS[item.kind] || 60;
    }
    currentFrame += gap;

    switch (item.kind) {
      case 'message':
        result.push({ kind: 'message', side: resolveSide(item.speaker, episode.characters), text: item.text, startFrame: currentFrame });
        prevSpeaker = item.speaker; break;
      case 'transfer':
        result.push({ kind: 'transfer', side: resolveSide(item.speaker, episode.characters), amount: item.amount, startFrame: currentFrame });
        prevSpeaker = item.speaker; break;
      case 'received':
        result.push({ kind: 'received', side: resolveSide(item.speaker, episode.characters), startFrame: currentFrame });
        prevSpeaker = item.speaker; break;
      case 'voicecall':
        result.push({ kind: 'voicecall', description: item.description, startFrame: currentFrame });
        prevSpeaker = null; break;
      case 'timestamp':
        result.push({ kind: 'timestamp', label: item.label, startFrame: currentFrame });
        prevSpeaker = null; break;
      case 'sticker':
        result.push({ kind: 'sticker', side: resolveSide(item.speaker, episode.characters), stickerPath: pickSticker(item.emotion, stickerBasePath), startFrame: currentFrame });
        prevSpeaker = item.speaker; break;
    }
  }

  return { items: result, durationInFrames: currentFrame + 60 };
}

// ================================================================
//  虚拟日期生成
// ================================================================

function generateVirtualDates(timestampLabels) {
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
  const base = new Date(twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime()));
  base.setHours(9 + Math.floor(Math.random() * 13), Math.floor(Math.random() * 60), 0, 0);

  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
  let current = new Date(base);
  const results = [];

  for (const label of timestampLabels) {
    let offset = 120 + Math.floor(Math.random() * 240); // 默认 2-6 小时
    const minM = label.match(/(\d+)\s*分钟/);
    if (minM) offset = parseInt(minM[1]);
    const hrM = label.match(/(\d+)\s*小时/);
    if (hrM) offset = parseInt(hrM[1]) * 60;
    if (/第二天|次日/.test(label)) offset = 24 * 60;
    const dayM = label.match(/(\d+)\s*天后/);
    if (dayM) offset = parseInt(dayM[1]) * 24 * 60;
    if (/周末/.test(label)) offset = (3 + Math.floor(Math.random() * 4)) * 24 * 60;

    current = new Date(current.getTime() + offset * 60 * 1000);
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

// ================================================================
//  昵称生成 —— 单字母 ID 自动杜撰中文昵称
// ================================================================

function generateNickname(character) {
  if (!/^[A-Za-z]$/.test(character.id)) return character.name;

  const desc = character.description || '';
  const seed = character.id.charCodeAt(0);

  if (/算命|命理|先生|大师|占卜|易|卜/.test(desc)) {
    const pool = ['云归先生', '道一', '玄清', '栖霞先生'];
    return pool[seed % pool.length];
  }
  if (/暗恋|新人|咨询|女|小姐|闺蜜|室友/.test(desc)) {
    const pool = ['小鹿', '阿念', '糖糖', '小柒'];
    return pool[seed % pool.length];
  }
  if (/男|同事|工程师|老板|上司/.test(desc)) {
    const pool = ['阿远', '陆白', '沈默', '林渊'];
    return pool[seed % pool.length];
  }
  const pool = ['小七', '阿远', '默默', '小半'];
  return pool[seed % pool.length];
}

// ================================================================
//  主流程
// ================================================================

async function main() {
  const argv = process.argv.slice(2);
  let mdPath = '';
  let customOutputDir = '';

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--output-dir' && argv[i + 1]) { customOutputDir = argv[++i]; }
    else if (!argv[i].startsWith('-')) { mdPath = argv[i]; }
  }

  if (!mdPath) {
    console.error('用法: node scripts/render-dialog-video.mjs "path/to/file.md" [--output-dir "path"]');
    process.exit(1);
  }

  const absPath = path.resolve(mdPath);
  if (!fs.existsSync(absPath)) {
    console.error(`文件不存在: ${absPath}`);
    process.exit(1);
  }

  console.log(`📄 解析文件: ${absPath}`);

  // 1. 解析
  const scenario = parseMd(absPath);
  if (scenario.items.length === 0) {
    console.log('⚠️ 未检测到对话内容，跳过视频生成');
    process.exit(0);
  }

  console.log(`📊 检测到 ${scenario.characters.length} 个角色, ${scenario.items.length} 条对话项`);

  // 2. 处理时间标记 → 虚拟日期
  const tsLabels = scenario.items
    .filter(i => i.kind === 'timestamp')
    .map(i => i.label);

  if (tsLabels.length > 0) {
    const dates = generateVirtualDates(tsLabels);
    let dateIdx = 0;
    for (const item of scenario.items) {
      if (item.kind === 'timestamp') {
        item.label = dates[dateIdx++];
      }
    }
  }

  // 3. 分集
  const episodes = splitEpisodes(scenario);
  console.log(`📦 分集: ${episodes.length} 集`);

  // 4. 生成昵称
  for (const ch of scenario.characters) {
    ch.displayName = generateNickname(ch);
  }
  const leftChar = scenario.characters.find(c => c.side === 'left');
  const rightChar = scenario.characters.find(c => c.side === 'right');
  const leftName = leftChar?.displayName || '对方';
  const rightName = rightChar?.displayName || '我';
  console.log(`👤 昵称: 左(${leftName}) 右(${rightName})`);

  // 5. 头像: picsum.photos 真实摄影图，seed 确保同名同图，预下载到 public/avatars/
  const avatarDir = path.join(PROJECT_ROOT, 'public', 'avatars');
  if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

  async function downloadAvatar(seed, filePath) {
    if (fs.existsSync(filePath)) return;
    console.log(`📷 下载头像: ${seed}...`);
    const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/200/200`;
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`下载头像失败: ${res.status}`);
    fs.writeFileSync(filePath, Buffer.from(await res.arrayBuffer()));
  }

  const leftAvatarFile = `${leftName}.jpg`;
  const rightAvatarFile = `${rightName}.jpg`;
  await downloadAvatar(leftName, path.join(avatarDir, leftAvatarFile));
  await downloadAvatar(rightName, path.join(avatarDir, rightAvatarFile));
  const leftAvatar = `avatars/${leftAvatarFile}`;
  const rightAvatar = `avatars/${rightAvatarFile}`;

  // 6. Bundle Remotion（必须在头像下载之后，bundle 会打包 public/ 目录）
  console.log('🔧 打包 Remotion 组件...');
  const entryPoint = path.join(PROJECT_ROOT, 'src', 'index.ts');
  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  // 7. 逐集渲染
  const stickerBasePath = path.resolve('D:\\Software\\内容\\表情包');
  const outputDir = path.resolve(customOutputDir || 'D:\\Software\\内容\\output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const baseName = path.basename(absPath, path.extname(absPath));

  for (const episode of episodes) {
    const { items: renderItems, durationInFrames } = calculateFrames(episode, stickerBasePath);

    const inputProps = {
      chatName: leftName,
      items: renderItems,
      durationInFrames,
      leftName,
      rightName,
      leftAvatar,
      rightAvatar,
    };

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'wechat-dialog-video',
      inputProps,
    });

    const outputFileName = episodes.length > 1
      ? `${baseName}-第${episode.index + 1}集.mp4`
      : `${baseName}.mp4`;
    const outputLocation = path.join(outputDir, outputFileName);

    console.log(`🎬 渲染第 ${episode.index + 1} 集 (${durationInFrames} 帧, ${(durationInFrames / 30).toFixed(1)}秒)...`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation,
      inputProps,
    });

    console.log(`✅ 完成: ${outputLocation}`);
  }

  console.log(`\n🎉 全部渲染完成！共 ${episodes.length} 个视频`);
}

main().catch(err => {
  console.error('❌ 渲染失败:', err.message);
  process.exit(1);
});
