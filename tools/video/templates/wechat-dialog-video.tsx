/**
 * [INPUT]: 依赖 remotion; 依赖 ../pipeline/types 的 WeChatDialogVideoProps, RenderItem
 * [INPUT]: 依赖 ./wechat-dialog-components 的所有子组件
 * [OUTPUT]: WeChatDialogVideo 组件
 * [POS]: 从 .md 文案自动生成微信对话视频的主模板，被 Root.tsx 注册
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { WeChatDialogVideoProps, RenderItem } from '../pipeline/types';
import {
  MessageBubble,
  TimeSeparator,
  TransferCard,
  ReceivedCard,
  VoiceCallBanner,
  StickerMessage,
  TopNavBar,
  BottomToolbar,
  AvatarContext,
} from './wechat-dialog-components';

// ================================================================
//  消息高度估算（用于自动滚动）
// ================================================================

function estimateItemHeight(item: RenderItem): number {
  switch (item.kind) {
    case 'message': {
      // 实际文字区宽度: (1080 - 80 padding) * 0.72 maxWidth - 104 bubble padding = 616px
      // charWidth 取 52 (fontSize 48 + 安全余量) → charsPerLine = 11
      const charsPerLine = 11;
      const lines = Math.max(1, Math.ceil(item.text.length / charsPerLine));
      return Math.max(104, 80 + lines * (48 * 1.6)) + 40;
    }
    case 'transfer':  return 240;
    case 'received':  return 220;
    case 'voicecall': return 120;
    case 'timestamp': return 100;
    case 'sticker':   return 560;
  }
}

// ================================================================
//  主组件
// ================================================================

export const WeChatDialogVideo: React.FC<WeChatDialogVideoProps> = ({
  chatName = '对话',
  items = [],
  durationInFrames: _dur,
  episodeLabel,
  leftName = '对方',
  rightName = '我',
  leftAvatar = '',
  rightAvatar = '',
}) => {
  const frame = useCurrentFrame();

  // 只显示已到达 startFrame 的 item
  const visibleItems = items.filter(item => frame >= item.startFrame);

  // ---- 自动滚动计算（直接定位，不用 spring，避免滞后遮挡） ----
  const visibleAreaHeight = 1920 - 120 - 120 - 100; // 顶栏 + 底栏 + padding

  let accHeight = 0;
  const positions = items.map(item => {
    const h = estimateItemHeight(item);
    const pos = accHeight;
    accHeight += h;
    return { item, pos, h };
  });

  const lastVisible = visibleItems.length > 0
    ? positions.find(p => p.item === visibleItems[visibleItems.length - 1])
    : null;

  let scrollY = 0;
  if (lastVisible) {
    const bottom = lastVisible.pos + lastVisible.h + 300;
    if (bottom > visibleAreaHeight) {
      scrollY = -(bottom - visibleAreaHeight);
    }
  }

  // ---- 渲染 ----
  return (
    <AbsoluteFill style={{ background: '#ededed', display: 'flex', flexDirection: 'column' }}>
      <TopNavBar chatName={chatName} episodeLabel={episodeLabel} />

      <AvatarContext.Provider value={{ leftName, rightName, leftAvatar, rightAvatar }}>
        <div style={{
          flex: 1,
          padding: '50px 40px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            transform: `translateY(${scrollY}px)`,
            willChange: 'transform',
          }}>
            {visibleItems.map((item, idx) => (
              <RenderItemView key={idx} item={item} globalFrame={frame} />
            ))}
          </div>
        </div>
      </AvatarContext.Provider>

      <BottomToolbar />
    </AbsoluteFill>
  );
};

// ================================================================
//  RenderItem 分发器 —— switch by kind，穷尽检查
// ================================================================

const RenderItemView: React.FC<{
  item: RenderItem;
  globalFrame: number;
}> = ({ item, globalFrame }) => {
  switch (item.kind) {
    case 'message':
      return <MessageBubble
        side={item.side} text={item.text}
        startFrame={item.startFrame} globalFrame={globalFrame} />;

    case 'timestamp':
      return <TimeSeparator
        label={item.label}
        startFrame={item.startFrame} globalFrame={globalFrame} />;

    case 'transfer':
      return <TransferCard
        side={item.side} amount={item.amount}
        startFrame={item.startFrame} globalFrame={globalFrame} />;

    case 'received':
      return <ReceivedCard
        side={item.side}
        startFrame={item.startFrame} globalFrame={globalFrame} />;

    case 'voicecall':
      return <VoiceCallBanner
        description={item.description}
        startFrame={item.startFrame} globalFrame={globalFrame} />;

    case 'sticker':
      return <StickerMessage
        side={item.side} stickerPath={item.stickerPath}
        startFrame={item.startFrame} globalFrame={globalFrame} />;
  }
};
