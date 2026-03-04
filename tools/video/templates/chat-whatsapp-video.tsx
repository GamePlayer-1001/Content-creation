/**
 * WhatsApp 聊天风格动画视频
 * 通用模板 - 支持自定义对话内容
 * 默认故事：神秘预测成真（60秒）
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { BackIcon, MoreIcon, SmileIcon, MicIcon } from './chat-icons';

interface Message {
  speaker: 'left' | 'right';
  text: string;
  startFrame: number;
  time?: string;  // WhatsApp 时间戳
}

interface ChatWhatsAppVideoProps {
  chatName?: string;
  messages?: Message[];
  showEndingCredits?: boolean;
  endingText?: string;
  endingUrl?: string;
}

const defaultMessages: Message[] = [
  { speaker: 'left', text: '哎你还记得上周我说的那个网站吗', startFrame: 0, time: '14:20' },
  { speaker: 'right', text: '哪个？', startFrame: 90, time: '14:21' },
  { speaker: 'left', text: '就那个AI算命的，你不是说都是骗人的吗😅', startFrame: 150, time: '14:21' },
  { speaker: 'right', text: '怎么了？', startFrame: 300, time: '14:22' },
  { speaker: 'left', text: '它预测我这个月会有职场大变动', startFrame: 360, time: '14:22' },
  { speaker: 'left', text: '而且会遇到贵人相助', startFrame: 510, time: '14:23' },
  { speaker: 'right', text: '所以呢？准了？', startFrame: 660, time: '14:24' },
  { speaker: 'left', text: '今天老板突然找我谈话...', startFrame: 750, time: '14:24' },
  { speaker: 'left', text: '说要提拔我做项目经理！🎉', startFrame: 900, time: '14:25' },
  { speaker: 'left', text: '工资直接涨50%', startFrame: 1050, time: '14:25' },
  { speaker: 'right', text: '卧槽？真的假的', startFrame: 1140, time: '14:26' },
  { speaker: 'right', text: '那个网站叫啥来着', startFrame: 1230, time: '14:26' },
  { speaker: 'left', text: 'destinyteller.com', startFrame: 1320, time: '14:27' },
  { speaker: 'left', text: '有免费版可以试试', startFrame: 1440, time: '14:27' },
  { speaker: 'left', text: '我当时也是抱着玩玩的心态😂', startFrame: 1530, time: '14:28' },
  { speaker: 'right', text: '行，我晚上试试', startFrame: 1680, time: '14:29' },
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
        gap: 16,
        alignItems: 'flex-start',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        marginBottom: 36,
        opacity,
        transform: `scale(${bubbleScale})`,
      }}
    >
      <div style={{
        background: isLeft ? 'white' : '#d9fdd3',
        padding: '40px 52px',
        borderRadius: isLeft ? '16px 16px 16px 0' : '16px 16px 0 16px',
        maxWidth: '72%',
        fontSize: 48,
        lineHeight: 1.6,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}>
        <span>{displayText}</span>
        {message.time && (
          <div style={{ fontSize: 32, color: '#667781', marginTop: 16, textAlign: 'right' }}>
            {message.time} {!isLeft && '✓✓'}
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatWhatsAppVideo: React.FC<ChatWhatsAppVideoProps> = ({
  chatName = '玄学工坊',
  messages = defaultMessages,
  showEndingCredits = true,
  endingText = '探索你的命运密码',
  endingUrl = 'destinyteller.com',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const visibleMessages = messages.filter((msg) => frame >= msg.startFrame);

  // 计算每条消息的估算高度
  const calculateMessageHeight = (msg: Message) => {
    const bubblePadding = 80;
    const lineHeight = 48 * 1.6;
    const maxWidth = 1080 * 0.72;
    const charWidth = 48;
    const effectiveWidth = maxWidth - 52 * 2;
    const charsPerLine = Math.floor(effectiveWidth / charWidth);
    const lines = Math.ceil(msg.text.length / charsPerLine);
    const actualLines = Math.max(1, lines);
    const timeHeight = msg.time ? 48 : 0;
    const bubbleHeight = bubblePadding + actualLines * lineHeight + timeHeight;
    return bubbleHeight + 36;
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
    <AbsoluteFill style={{ background: '#e5ddd5', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        height: 120,
        background: '#075e54',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 10,
      }}>
        <BackIcon size={52} color="white" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
          }} />
          <div style={{ fontSize: 40, fontWeight: '600', color: 'white' }}>{chatName}</div>
        </div>
        <MoreIcon size={52} color="white" />
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
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        gap: 20,
        zIndex: 10,
      }}>
        <SmileIcon size={56} color="#54656f" />
        <div style={{
          flex: 1,
          height: 80,
          background: 'white',
          borderRadius: 40,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          fontSize: 40,
          color: '#8696a0',
        }}>
          输入消息
        </div>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#00a884',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <MicIcon size={48} color="white" />
        </div>
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
          <div style={{ fontSize: 32, color: '#444', marginBottom: 10 }}>{endingText}</div>
          <div style={{ fontSize: 42, fontWeight: '600', color: '#075e54', letterSpacing: 2 }}>{endingUrl}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
