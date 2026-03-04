/**
 * LINE 聊天风格动画视频
 * 通用模板 - 支持自定义对话内容
 * 默认故事：神秘预测成真（60秒）
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Audio } from 'remotion';
import { BackIcon, MoreIcon, PlusIcon, SmileIcon } from './chat-icons';

interface Message {
  speaker: 'left' | 'right';
  text: string;
  startFrame: number;
}

interface ChatLineVideoProps {
  chatName?: string;
  messages?: Message[];
  showEndingCredits?: boolean;
  endingText?: string;
  endingUrl?: string;
  bgmUrl?: string;
  bgmVolume?: number;
  enableMessageSound?: boolean;
}

// 小红书爆款故事：25岁那年我做了最勇敢的决定（逆袭反转型）
const defaultMessages: Message[] = [
  { speaker: 'right', text: '我妈又催我考公了...', startFrame: 0 },
  { speaker: 'left', text: '你不是最讨厌体制内吗', startFrame: 110 },
  { speaker: 'right', text: '是啊😞但她说女孩子要稳定', startFrame: 200 },
  { speaker: 'right', text: '我也不知道自己想要什么了', startFrame: 350 },
  { speaker: 'left', text: '别啊！你不是一直想做设计吗', startFrame: 500 },
  { speaker: 'right', text: '想是想...但我也不知道适不适合', startFrame: 620 },
  { speaker: 'right', text: '万一做不好呢', startFrame: 770 },
  { speaker: 'left', text: '你试过一个性格天赋分析吗', startFrame: 860 },
  { speaker: 'left', text: '可以看你适合什么方向', startFrame: 1010 },
  { speaker: 'right', text: '真的吗？靠谱吗', startFrame: 1130 },
  { speaker: 'left', text: '我表姐就是用这个发现自己适合创业', startFrame: 1220 },
  { speaker: 'left', text: '现在工作室做得挺好的', startFrame: 1400 },
  { speaker: 'right', text: '天哪！我能试试吗', startFrame: 1520 },
  { speaker: 'left', text: 'destiny teller 搜这个就行', startFrame: 1610 },
  { speaker: 'left', text: '会给你很详细的天赋优势报告', startFrame: 1760 },
  { speaker: 'right', text: '好的！我现在就去看', startFrame: 1940 },
  { speaker: 'right', text: '真的不想就这样妥协了🥺', startFrame: 2060 },
  { speaker: 'left', text: '勇敢一次', startFrame: 2210 },
  { speaker: 'left', text: '25岁做选择还来得及💪', startFrame: 2300 },
];

const MessageBubble: React.FC<{ message: Message; index: number; globalFrame: number }> = ({
  message,
  index,
  globalFrame,
}) => {
  const { fps } = useVideoConfig();
  const frame = globalFrame - message.startFrame;

  const bubbleScale = spring({ frame, fps, config: { damping: 15, mass: 0.5, stiffness: 200 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  if (frame < 0) return null;

  const isLeft = message.speaker === 'left';
  const charsToShow = Math.floor(frame * 0.75); // 1.5倍速：从 frame/2 改为 frame*0.75
  const displayText = message.text.slice(0, charsToShow);

  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        marginBottom: 40,
        opacity,
        transform: `scale(${bubbleScale})`,
      }}
    >
      {isLeft && (
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
          flexShrink: 0,
        }} />
      )}

      <div style={{
        background: isLeft ? 'white' : '#00b900',
        color: isLeft ? '#000' : 'white',
        padding: '40px 52px',
        borderRadius: 36,
        maxWidth: '72%',
        fontSize: 48,
        lineHeight: 1.6,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      }}>
        <span>{displayText}</span>
      </div>
    </div>
  );
};

export const ChatLineVideo: React.FC<ChatLineVideoProps> = ({
  chatName = '大学好友',
  messages = defaultMessages,
  showEndingCredits = true,
  endingText = '发现你的天赋优势',
  endingUrl = 'destinyteller.com',
  bgmUrl = '', // 暂时禁用外部BGM
  bgmVolume = 0.15,
  enableMessageSound = false, // 暂时禁用消息音
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const visibleMessages = messages.filter((msg) => frame >= msg.startFrame);

  // 计算每条消息的估算高度
  const calculateMessageHeight = (msg: Message) => {
    const baseHeight = 100; // 头像高度
    const bubblePadding = 80;
    const lineHeight = 48 * 1.6;
    const maxWidth = 1080 * 0.72;
    const charWidth = 48;
    const effectiveWidth = maxWidth - 52 * 2;
    const charsPerLine = Math.floor(effectiveWidth / charWidth);
    const lines = Math.ceil(msg.text.length / charsPerLine);
    const actualLines = Math.max(1, lines);
    const bubbleHeight = Math.max(baseHeight, bubblePadding + actualLines * lineHeight);
    return bubbleHeight + 40;
  };

  const visibleAreaHeight = 1920 - 120 - 120 - 100;

  // 计算所有消息的累计位置
  let accumulatedHeight = 0;
  const messagePositions = messages.map((msg) => {
    const height = calculateMessageHeight(msg);
    const position = accumulatedHeight;
    accumulatedHeight += height;
    return { message: msg, position, height };
  });

  const lastVisibleMessage = visibleMessages.length > 0
    ? visibleMessages[visibleMessages.length - 1]
    : null;

  const lastMessageData = lastVisibleMessage
    ? messagePositions.find(m => m.message === lastVisibleMessage)
    : null;

  let targetScrollY = 0;
  if (lastMessageData) {
    const lastMessageBottom = lastMessageData.position + lastMessageData.height;
    const bottomSafetyMargin = 300; // 增加到300以避免覆盖片尾字幕
    const contentBottom = lastMessageBottom + bottomSafetyMargin;
    if (contentBottom > visibleAreaHeight) {
      targetScrollY = -(contentBottom - visibleAreaHeight);
    }
  }

  const scrollY = spring({
    frame,
    fps,
    from: 0,
    to: targetScrollY,
    config: { damping: 25, stiffness: 60, mass: 1 },
  });

  const endingStartFrame = durationInFrames - 450;

  return (
    <AbsoluteFill style={{ background: '#d4e4f7', display: 'flex', flexDirection: 'column' }}>
      {/* 背景音乐 */}
      {bgmUrl && (
        <Audio
          src={bgmUrl}
          volume={bgmVolume}
          startFrom={0}
        />
      )}

      {/* 消息提示音 */}
      {enableMessageSound && visibleMessages.map((msg, idx) => {
        const isNewMessage = frame >= msg.startFrame && frame < msg.startFrame + 5;
        if (!isNewMessage) return null;

        return (
          <Audio
            key={`sound-${idx}`}
            src="https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3"
            volume={0.3}
            startFrom={msg.startFrame}
          />
        );
      })}

      <div style={{
        height: 120,
        background: 'rgba(255,255,255,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '2px solid #e0e0e0',
        zIndex: 10,
      }}>
        <BackIcon size={52} color="#000" />
        <div style={{ fontSize: 40, fontWeight: '600', color: '#000' }}>{chatName}</div>
        <MoreIcon size={52} color="#000" />
      </div>

      <div style={{ flex: 1, padding: '50px 40px', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          transform: `translateY(${scrollY}px)`,
          willChange: 'transform',
        }}>
          {visibleMessages.map((message, index) => (
            <MessageBubble key={index} message={message} index={index} globalFrame={frame} />
          ))}
        </div>
      </div>

      <div style={{
        height: 120,
        background: 'rgba(255,255,255,0.95)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: 20,
        borderTop: '2px solid #e0e0e0',
        zIndex: 10,
      }}>
        <PlusIcon size={56} color="#000" />
        <div style={{ flex: 1, height: 80, background: 'white', borderRadius: 40, border: '2px solid #ddd' }} />
        <SmileIcon size={56} color="#000" />
      </div>

      {showEndingCredits && frame >= endingStartFrame && (
        <div style={{
          position: 'absolute',
          bottom: 200,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [endingStartFrame, endingStartFrame + 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0]),
        }}>
          <div style={{ fontSize: 32, color: '#555', marginBottom: 10 }}>{endingText}</div>
          <div style={{ fontSize: 42, fontWeight: '600', color: '#d4af37', letterSpacing: 2 }}>{endingUrl}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
