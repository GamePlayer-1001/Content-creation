/**
 * [INPUT]: 依赖 ./types 的 Episode, RenderItem, DialogItem, Character
 * [OUTPUT]: calculateFrames()
 * [POS]: pipeline 的帧计算器，将 Episode 转化为带 startFrame 的 RenderItem[]
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { Episode, RenderItem, DialogItem, Character } from './types';
import { pickSticker } from './sticker-pool';

// ================================================================
//  帧间距策略（30fps 基准）
// ================================================================

const GAPS = {
  message_short: 45,        // <10字: 1.5s
  message_medium: 60,       // 10-30字: 2s
  message_long: 80,         // >30字: 2.7s
  message_same_speaker: 30, // 同人连续: 1s
  transfer: 70,             // 转账: 2.3s
  received: 50,             // 收款: 1.7s
  voicecall: 90,            // 通话提示: 3s
  timestamp: 60,            // 时间标记: 2s
  sticker: 55,              // 表情包: 1.8s
};

function getMessageGap(text: string, prevSpeaker: string | null, currSpeaker: string): number {
  if (prevSpeaker === currSpeaker) return GAPS.message_same_speaker;
  if (text.length < 10) return GAPS.message_short;
  if (text.length < 30) return GAPS.message_medium;
  return GAPS.message_long;
}

function getItemGap(item: DialogItem, prevSpeaker: string | null): number {
  switch (item.kind) {
    case 'message':   return getMessageGap(item.text, prevSpeaker, item.speaker);
    case 'transfer':  return GAPS.transfer;
    case 'received':  return GAPS.received;
    case 'voicecall': return GAPS.voicecall;
    case 'timestamp': return GAPS.timestamp;
    case 'sticker':   return GAPS.sticker;
  }
}

function resolveSide(speaker: string, characters: Character[]): 'left' | 'right' {
  const char = characters.find(c => c.id === speaker || c.name === speaker);
  return char?.side ?? 'left';
}

// ================================================================
//  帧计算
// ================================================================

export function calculateFrames(
  episode: Episode,
  stickerBasePath: string,
): { items: RenderItem[]; durationInFrames: number } {
  const result: RenderItem[] = [];
  let currentFrame = 30; // 开头留 1 秒空白
  let prevSpeaker: string | null = null;

  for (const item of episode.items) {
    const gap = getItemGap(item, prevSpeaker);
    currentFrame += gap;

    switch (item.kind) {
      case 'message':
        result.push({
          kind: 'message',
          side: resolveSide(item.speaker, episode.characters),
          text: item.text,
          startFrame: currentFrame,
        });
        prevSpeaker = item.speaker;
        break;

      case 'transfer':
        result.push({
          kind: 'transfer',
          side: resolveSide(item.speaker, episode.characters),
          amount: item.amount,
          startFrame: currentFrame,
        });
        prevSpeaker = item.speaker;
        break;

      case 'received':
        result.push({
          kind: 'received',
          side: resolveSide(item.speaker, episode.characters),
          startFrame: currentFrame,
        });
        prevSpeaker = item.speaker;
        break;

      case 'voicecall':
        result.push({
          kind: 'voicecall',
          description: item.description,
          startFrame: currentFrame,
        });
        prevSpeaker = null;
        break;

      case 'timestamp':
        result.push({
          kind: 'timestamp',
          label: item.label,
          startFrame: currentFrame,
        });
        prevSpeaker = null;
        break;

      case 'sticker':
        result.push({
          kind: 'sticker',
          side: resolveSide(item.speaker, episode.characters),
          stickerPath: pickSticker(item.emotion, stickerBasePath),
          startFrame: currentFrame,
        });
        prevSpeaker = item.speaker;
        break;
    }
  }

  // 结尾留 2 秒
  const durationInFrames = currentFrame + 60;

  return { items: result, durationInFrames };
}
