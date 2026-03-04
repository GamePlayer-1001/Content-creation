/**
 * [INPUT]: 依赖 node:fs, node:path; 依赖 ./types 的 DialogItem, Character, ScenarioData, StickerEmotion
 * [OUTPUT]: parseMdToScenario(), isDialogFormat()
 * [POS]: pipeline 的入口，将 .md 文件转化为结构化 ScenarioData
 *        支持两种表情包触发：纯标点自动推断 + [中括号标记] 精确匹配 9 类情绪
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { DialogItem, Character, ScenarioData, StickerEmotion } from './types';

// ================================================================
//  正则模式
// ================================================================

// 对话行: "A: 内容" 或 "角色名：内容"（中英文冒号）
const RE_DIALOG = /^([A-Za-z\u4e00-\u9fff\u3400-\u4dbf]+)[：:]\s*(.+)$/;

// 时间标记: **第二天** / **（五分钟后）** / **(一小时后)**
const RE_TIMESTAMP = /^\*\*(.+)\*\*$/;

// 人物设定标题
const RE_CHAR_TITLE = /^\*\*人物设定[：:]?\*\*$/;

// 人物设定行: "- A（描述）—— 详细"  或  "- 小鹿（描述）—— 详细"
const RE_CHAR_LINE = /^-\s*([A-Za-z\u4e00-\u9fff]+)[\s（(]([^）)]+)[）)]\s*[——\-\s]*(.*)$/;

// 后记标题
const RE_POSTSCRIPT = /^\*\*后记\*\*$/;

// 特殊消息
const RE_TRANSFER = /^【转账\s*([\d.]+)】$/;
const RE_RECEIVED = /^【已收款】$/;
const RE_VOICECALL = /^【提示[：:](.+)】$/;

// 纯标点（无文字）—— 触发表情包
const RE_PURE_PUNCT = /^[！？…!?。，,~～.\s]+$/;

// 中括号表情标记: [开心的表情] / [震惊] / [害羞表情]
const RE_STICKER_BRACKET = /^\[([^\]]+)\]$/;

// 排除的时间标记（不是时间而是结构标记）
const EXCLUDED_TIMESTAMPS = ['人物设定', '后记', '图片'];

// ================================================================
//  情绪映射
// ================================================================

// 关键词 → 情绪（中括号标记用，优先级从上到下首次匹配）
const EMOTION_KEYWORDS: [RegExp, StickerEmotion][] = [
  // happy: 开心/愉快
  [/开心|高兴|愉快|快乐|笑|哈哈|嘻嘻|得意|满足/, 'happy'],
  // excited: 激动/期待
  [/激动|期待|兴奋|搓手|迫不及待|坐等|星星眼|亮晶晶|发光/, 'excited'],
  // love: 心动/害羞
  [/心动|害羞|脸红|爱心|喜欢|暗恋|羞涩|甜蜜|爱/, 'love'],
  // shock: 震惊/惊讶
  [/震惊|惊讶|吃惊|惊|叫|尖叫|爆炸|目瞪口呆|灵魂出窍|社死|吓/, 'shock'],
  // sad: 难过/委屈
  [/难过|伤心|委屈|哭|含泪|心碎|可怜|悲|泪|痛/, 'sad'],
  // angry: 生气/不满
  [/生气|愤怒|不满|暴怒|发火|气|怒|烦|讨厌|白眼/, 'angry'],
  // confused: 困惑/纠结
  [/困惑|疑惑|迷惑|不解|纠结|愣|懵|问号|思考|想/, 'confused'],
  // nervous: 紧张/不安
  [/紧张|不安|担心|慌|发抖|冷汗|忐忑|焦虑|害怕|怕/, 'nervous'],
  // speechless: 无语/无奈（兜底大类）
  [/无语|无奈|沉默|叹气|摊手|捂脸|躺|趴|睡|淡定|面无表情/, 'speechless'],
];

/** 中括号标记 → 情绪匹配（按关键词在文本中出现位置，最早命中者获胜） */
function matchBracketEmotion(label: string): StickerEmotion {
  let bestEmotion: StickerEmotion = 'shock';
  let bestPos = Infinity;

  for (const [re, emotion] of EMOTION_KEYWORDS) {
    const m = re.exec(label);
    if (m && m.index < bestPos) {
      bestPos = m.index;
      bestEmotion = emotion;
    }
  }

  return bestEmotion;
}

/** 纯标点 → 情绪推断（标点语义有限，只区分 3 大类） */
function inferEmotion(text: string): StickerEmotion {
  const exclamation = (text.match(/[！!]/g) || []).length;
  const question = (text.match(/[？?]/g) || []).length;
  const ellipsis = (text.match(/[…。\.]/g) || []).length;

  if (question > exclamation && question > ellipsis) return 'confused';
  if (ellipsis > exclamation && ellipsis > question) return 'speechless';
  return 'shock';
}

// ================================================================
//  状态机解析器
// ================================================================

type ParseState = 'PREAMBLE' | 'CHARACTERS' | 'DIALOG' | 'POSTSCRIPT';

export function parseMdToScenario(filePath: string): ScenarioData {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/);

  let state: ParseState = 'PREAMBLE';
  let title = '';
  const characters: Character[] = [];
  const items: DialogItem[] = [];
  const speakerSet = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // ----------------------------------------------------------
    //  状态转移检测
    // ----------------------------------------------------------

    // 进入后记 → 停止解析
    if (RE_POSTSCRIPT.test(line)) {
      state = 'POSTSCRIPT';
      continue;
    }
    if (state === 'POSTSCRIPT') continue;

    // 进入人物设定块
    if (RE_CHAR_TITLE.test(line)) {
      state = 'CHARACTERS';
      continue;
    }

    // ----------------------------------------------------------
    //  PREAMBLE: 提取标题
    // ----------------------------------------------------------
    if (state === 'PREAMBLE') {
      if (line.startsWith('#')) {
        title = line.replace(/^#+\s*/, '');
      }
      // 检测到人物设定行或对话行 → 进入 DIALOG
      if (RE_CHAR_LINE.test(line)) {
        state = 'CHARACTERS';
        // fall through to CHARACTERS processing
      } else if (RE_DIALOG.test(line) && !RE_CHAR_TITLE.test(line)) {
        state = 'DIALOG';
        // fall through to DIALOG processing
      } else {
        continue;
      }
    }

    // ----------------------------------------------------------
    //  CHARACTERS: 解析人物设定
    // ----------------------------------------------------------
    if (state === 'CHARACTERS') {
      const charMatch = line.match(RE_CHAR_LINE);
      if (charMatch) {
        characters.push({
          id: charMatch[1],
          name: charMatch[1],
          description: charMatch[3] || charMatch[2],
          side: characters.length === 0 ? 'right' : 'left',
        });
        continue;
      }
      // 非人物行 → 切换到 DIALOG
      if (line && !line.startsWith('-')) {
        state = 'DIALOG';
        // fall through
      } else {
        continue;
      }
    }

    // ----------------------------------------------------------
    //  DIALOG: 核心解析逻辑
    // ----------------------------------------------------------
    if (state === 'DIALOG') {
      // 1. 时间标记检测
      const tsMatch = line.match(RE_TIMESTAMP);
      if (tsMatch) {
        const label = tsMatch[1].replace(/^[（(]|[）)]$/g, '');
        // 排除非时间标记
        if (!EXCLUDED_TIMESTAMPS.some(ex => label.includes(ex))) {
          items.push({ kind: 'timestamp', label });
        }
        continue;
      }

      // 2. 独立系统消息（无说话人前缀）
      const vcMatch = line.match(RE_VOICECALL);
      if (vcMatch) {
        items.push({ kind: 'voicecall', description: vcMatch[1].trim() });
        continue;
      }

      // 3. 对话行
      const dlgMatch = line.match(RE_DIALOG);
      if (dlgMatch) {
        const speaker = dlgMatch[1];
        const text = dlgMatch[2].trim();
        speakerSet.add(speaker);

        // 3a. 转账
        const tfMatch = text.match(RE_TRANSFER);
        if (tfMatch) {
          items.push({ kind: 'transfer', speaker, amount: parseFloat(tfMatch[1]) });
          continue;
        }

        // 3b. 已收款
        if (RE_RECEIVED.test(text)) {
          items.push({ kind: 'received', speaker });
          continue;
        }

        // 3c. 通话提示（嵌在对话中）
        const vcInline = text.match(RE_VOICECALL);
        if (vcInline) {
          items.push({ kind: 'voicecall', description: vcInline[1].trim() });
          continue;
        }

        // 3d. 中括号表情标记 → 表情包（精确情绪匹配）
        const stickerMatch = text.match(RE_STICKER_BRACKET);
        if (stickerMatch) {
          items.push({ kind: 'sticker', speaker, emotion: matchBracketEmotion(stickerMatch[1]) });
          continue;
        }

        // 3e. 纯标点 → 表情包（粗粒度情绪推断）
        if (RE_PURE_PUNCT.test(text)) {
          items.push({ kind: 'sticker', speaker, emotion: inferEmotion(text) });
          continue;
        }

        // 3f. 普通消息
        items.push({ kind: 'message', speaker, text });
        continue;
      }

      // 非对话行（旁白等）→ 静默跳过
    }
  }

  // 如果没有从人物设定中提取角色，从对话中推断
  if (characters.length === 0 && speakerSet.size > 0) {
    let idx = 0;
    for (const sp of speakerSet) {
      characters.push({
        id: sp,
        name: sp,
        description: '',
        side: idx === 0 ? 'right' : 'left',
      });
      idx++;
    }
  }

  return { title, characters, items };
}

// ================================================================
//  对话体检测
// ================================================================

export function isDialogFormat(filePath: string): boolean {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/);

  let dialogLines = 0;
  let totalNonEmpty = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    totalNonEmpty++;
    if (RE_DIALOG.test(trimmed)) dialogLines++;
  }

  // 对话行占非空行 40% 以上即视为对话体
  return totalNonEmpty > 0 && (dialogLines / totalNonEmpty) > 0.4;
}
