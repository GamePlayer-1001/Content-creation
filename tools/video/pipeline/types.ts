/**
 * [INPUT]: 无外部依赖
 * [OUTPUT]: Character, DialogItem, ScenarioData, Episode, RenderItem, WeChatDialogVideoProps
 * [POS]: pipeline 的类型基石，被 parser/splitter/frame-calculator/templates 共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ================================================================
//  L1: 解析器层 —— .md 文件解析后的结构化数据
// ================================================================

/** 角色定义 */
export interface Character {
  id: string;                    // 原始标识: 'A' | 'B' | '小鹿' | '先生'
  name: string;                  // 显示名
  description: string;           // 人设描述
  side: 'left' | 'right';       // 气泡方向
}

/** 对话行 —— 可辨识联合类型，消灭下游 if/else */
export type DialogItem =
  | { kind: 'message';   speaker: string; text: string }
  | { kind: 'transfer';  speaker: string; amount: number }
  | { kind: 'received';  speaker: string }
  | { kind: 'voicecall'; description: string }
  | { kind: 'timestamp'; label: string }
  | { kind: 'sticker';   speaker: string; emotion: StickerEmotion };

/** 表情包情绪类型 —— 9 维情绪空间 */
export type StickerEmotion =
  | 'happy'       // 开心/愉快
  | 'excited'     // 激动/期待
  | 'love'        // 心动/害羞
  | 'shock'       // 震惊/惊讶
  | 'sad'         // 难过/委屈
  | 'angry'       // 生气/不满
  | 'confused'    // 困惑/纠结
  | 'nervous'     // 紧张/不安
  | 'speechless'; // 无语/无奈

/** 解析器输出 */
export interface ScenarioData {
  title: string;
  characters: Character[];
  items: DialogItem[];
}

// ================================================================
//  L2: 分集器层
// ================================================================

export interface Episode {
  index: number;
  total: number;
  title: string;
  characters: Character[];
  items: DialogItem[];
}

// ================================================================
//  L3: 帧计算器层 —— Remotion 直接消费的 Props
// ================================================================

export type RenderItem =
  | { kind: 'message';   side: 'left' | 'right'; text: string;
      startFrame: number }
  | { kind: 'transfer';  side: 'left' | 'right'; amount: number;
      startFrame: number }
  | { kind: 'received';  side: 'left' | 'right';
      startFrame: number }
  | { kind: 'voicecall'; description: string;
      startFrame: number }
  | { kind: 'timestamp'; label: string;
      startFrame: number }
  | { kind: 'sticker';   side: 'left' | 'right'; stickerPath: string;
      startFrame: number };

/** Remotion 主模板 Props */
export interface WeChatDialogVideoProps {
  chatName: string;
  items: RenderItem[];
  durationInFrames: number;
  episodeLabel?: string;
  leftName?: string;
  rightName?: string;
  leftAvatar?: string;
  rightAvatar?: string;
}
