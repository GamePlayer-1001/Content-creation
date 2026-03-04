/**
 * Messenger 聊天风格动画视频
 * 通用模板 - 支持自定义对话内容
 * 默认故事：神秘预测成真（60秒）
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Audio } from 'remotion';
import { BackIcon, PhoneIcon, VideoIcon, PlusIcon, ThumbsUpIcon } from './chat-icons';

interface Message {
  speaker: 'left' | 'right';
  text: string;
  startFrame: number;
}

interface ChatMessengerVideoProps {
  chatName?: string;
  messages?: Message[];
  showEndingCredits?: boolean;
  endingText?: string;
  endingUrl?: string;
  bgmUrl?: string;
  bgmVolume?: number;
  enableMessageSound?: boolean;
}

// 小红书爆款故事：那个暗恋3年的人，终于...（情感悬念型）
const defaultMessages: Message[] = [
  { speaker: 'right', text: '你猜我今天见到谁了💓', startFrame: 0 },
  { speaker: 'left', text: '？？？谁', startFrame: 100 },
  { speaker: 'right', text: '就...学长啊', startFrame: 180 },
  { speaker: 'left', text: '卧槽！你暗恋了3年那个？！', startFrame: 270 },
  { speaker: 'right', text: '对😭在咖啡厅偶遇的', startFrame: 400 },
  { speaker: 'right', text: '他主动过来跟我打招呼', startFrame: 520 },
  { speaker: 'left', text: '然后呢？？', startFrame: 640 },
  { speaker: 'right', text: '然后我就慌了...不知道说啥', startFrame: 730 },
  { speaker: 'right', text: '尬聊了两句就结束了😢', startFrame: 880 },
  { speaker: 'left', text: '天哪！你怎么不抓住机会', startFrame: 1000 },
  { speaker: 'right', text: '我也很后悔...', startFrame: 1120 },
  { speaker: 'right', text: '但我真的不知道自己该说什么', startFrame: 1210 },
  { speaker: 'left', text: '宝！你是不是该先了解下自己', startFrame: 1360 },
  { speaker: 'left', text: '你的性格适合什么样的相处方式', startFrame: 1510 },
  { speaker: 'right', text: '诶？还有这种分析吗', startFrame: 1660 },
  { speaker: 'left', text: '有啊！我之前做过性格分析', startFrame: 1750 },
  { speaker: 'left', text: '才知道我其实更适合慢热型相处', startFrame: 1900 },
  { speaker: 'right', text: '在哪做的？我也想试试', startFrame: 2050 },
  { speaker: 'left', text: 'destiny teller 你搜这个', startFrame: 2140 },
  { speaker: 'left', text: '会告诉你最适合的社交方式', startFrame: 2290 },
  { speaker: 'right', text: '好！下次见到他我要勇敢点🌹', startFrame: 2440 },
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
        marginBottom: 28,
        opacity,
        transform: `scale(${bubbleScale})`,
      }}
    >
      {isLeft && (
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
          flexShrink: 0,
        }} />
      )}

      <div style={{
        background: isLeft ? '#e4e6eb' : 'linear-gradient(135deg, #0084ff 0%, #00c6ff 100%)',
        color: isLeft ? '#050505' : 'white',
        padding: '40px 52px',
        borderRadius: 40,
        maxWidth: '72%',
        fontSize: 48,
        lineHeight: 1.6,
      }}>
        <span>{displayText}</span>
      </div>
    </div>
  );
};

export const ChatMessengerVideo: React.FC<ChatMessengerVideoProps> = ({
  chatName = '闺蜜树洞',
  messages = defaultMessages,
  showEndingCredits = true,
  endingText = '找到最适合你的相处方式',
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
    const baseHeight = 80; // 头像高度
    const bubblePadding = 80;
    const lineHeight = 48 * 1.6;
    const maxWidth = 1080 * 0.72;
    const charWidth = 48;
    const effectiveWidth = maxWidth - 52 * 2;
    const charsPerLine = Math.floor(effectiveWidth / charWidth);
    const lines = Math.ceil(msg.text.length / charsPerLine);
    const actualLines = Math.max(1, lines);
    const bubbleHeight = Math.max(baseHeight, bubblePadding + actualLines * lineHeight);
    return bubbleHeight + 28;
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
    <AbsoluteFill style={{ background: 'white', display: 'flex', flexDirection: 'column' }}>
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
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        borderBottom: '2px solid #e4e6eb',
        zIndex: 10,
      }}>
        <BackIcon size={52} color="#050505" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
          }} />
          <div style={{ fontSize: 40, fontWeight: '600', color: '#050505' }}>{chatName}</div>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <PhoneIcon size={52} color="#0084ff" />
          <VideoIcon size={52} color="#0084ff" />
        </div>
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
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        gap: 20,
        borderTop: '2px solid #e4e6eb',
        zIndex: 10,
      }}>
        <PlusIcon size={56} color="#0084ff" />
        <div style={{
          flex: 1,
          height: 80,
          background: '#f0f2f5',
          borderRadius: 40,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          fontSize: 40,
          color: '#65676b',
        }}>
          Aa
        </div>
        <ThumbsUpIcon size={56} color="#0084ff" />
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
          <div style={{ fontSize: 32, color: '#666', marginBottom: 10 }}>{endingText}</div>
          <div style={{ fontSize: 42, fontWeight: '600', color: '#0084ff', letterSpacing: 2 }}>{endingUrl}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
