/**
 * 微信聊天增强版 - 使用 SVG 图标和更真实的视觉效果
 *
 * 改进点：
 * 1. 使用内联 SVG 图标替代 emoji（更专业）
 * 2. 更接近真实微信的配色和阴影
 * 3. 更流畅的动画效果
 * 4. 时间戳显示
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence
} from 'remotion';

// ============================================================================
// SVG 图标组件
// ============================================================================

const MicrophoneIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#000'
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z"
      fill={color}
    />
    <path
      d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z"
      fill={color}
    />
  </svg>
);

const EmojiIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#000'
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="9" cy="10" r="1.5" fill={color} />
    <circle cx="15" cy="10" r="1.5" fill={color} />
    <path
      d="M8 14C8.5 15.5 10 17 12 17C14 17 15.5 15.5 16 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const PlusIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#000'
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const BackIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#576b95'
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoreIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#000'
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="6" r="1.5" fill={color} />
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <circle cx="12" cy="18" r="1.5" fill={color} />
  </svg>
);

const SignalIcon: React.FC = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="#000">
    <rect x="0" y="8" width="3" height="4" rx="0.5" />
    <rect x="5" y="6" width="3" height="6" rx="0.5" />
    <rect x="10" y="3" width="3" height="9" rx="0.5" />
    <rect x="15" y="0" width="3" height="12" rx="0.5" />
  </svg>
);

const WifiIcon: React.FC = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
    <path
      d="M1 4C3.5 1.5 6.5 0 8 0C9.5 0 12.5 1.5 15 4M3 7C4.5 5.5 6 5 8 5C10 5 11.5 5.5 13 7M8 12C8.55 12 9 11.55 9 11C9 10.45 8.55 10 8 10C7.45 10 7 10.45 7 11C7 11.55 7.45 12 8 12Z"
      stroke="#000"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const BatteryIcon: React.FC = () => (
  <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
    <rect x="1" y="2" width="18" height="8" rx="1.5" stroke="#000" strokeWidth="1.5" fill="none" />
    <rect x="3" y="4" width="14" height="4" rx="0.5" fill="#000" />
    <rect x="20" y="4.5" width="2.5" height="3" rx="0.5" fill="#000" />
  </svg>
);

const VoiceWaveIcon: React.FC<{ frame: number }> = ({ frame }) => {
  const heights = [8, 16, 12, 20, 10, 18, 14];

  return (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
      {heights.map((baseHeight, i) => {
        const height = baseHeight + Math.sin((frame + i * 5) * 0.15) * 6;
        return (
          <rect
            key={i}
            x={i * 9}
            y={(24 - height) / 2}
            width="5"
            height={height}
            rx="2.5"
            fill="#000"
            opacity={0.7}
          />
        );
      })}
    </svg>
  );
};

// ============================================================================
// 类型定义
// ============================================================================

interface Message {
  id: number;
  type: 'sent' | 'received';
  contentType: 'text' | 'voice' | 'emoji' | 'typing';
  text?: string;
  voiceDuration?: number;
  emoji?: string;
  time?: string;
  startFrame: number;
  typingDuration?: number;
}

interface WeChatEnhancedProps {
  primaryColor?: string;
  secondaryColor?: string;
}

// ============================================================================
// 更吸引人的故事：爱情挽回记
// ============================================================================

const loveStory: Message[] = [
  // 第一幕：痛苦求助 (0-6秒)
  {
    id: 1,
    type: 'sent',
    contentType: 'text',
    text: '大师，我女朋友要跟我分手了',
    time: '14:20',
    startFrame: 30,
    typingDuration: 35
  },
  {
    id: 2,
    type: 'sent',
    contentType: 'text',
    text: '我们在一起三年了，我真的很爱她',
    startFrame: 90,
    typingDuration: 35
  },
  {
    id: 3,
    type: 'sent',
    contentType: 'emoji',
    emoji: '💔',
    startFrame: 150,
    typingDuration: 10
  },

  // 第二幕：分析原因 (6-12秒)
  {
    id: 4,
    type: 'received',
    contentType: 'text',
    text: '别着急，先告诉我你和她的生辰',
    time: '14:21',
    startFrame: 180,
    typingDuration: 30
  },
  {
    id: 5,
    type: 'sent',
    contentType: 'text',
    text: '我1995.8.20，她1996.3.15',
    startFrame: 230,
    typingDuration: 30
  },
  {
    id: 6,
    type: 'received',
    contentType: 'typing',
    text: '正在分析你们的姻缘...',
    startFrame: 280,
    typingDuration: 90
  },

  // 第三幕：转机出现 (12-18秒)
  {
    id: 7,
    type: 'received',
    contentType: 'text',
    text: '看了你们的八字，其实你们很般配',
    time: '14:22',
    startFrame: 390,
    typingDuration: 35
  },
  {
    id: 8,
    type: 'received',
    contentType: 'text',
    text: '只是最近她的情感星受冲，容易情绪波动',
    startFrame: 450,
    typingDuration: 40
  },
  {
    id: 9,
    type: 'received',
    contentType: 'voice',
    text: '听我说',
    voiceDuration: 18,
    startFrame: 510,
    typingDuration: 20
  },
  {
    id: 10,
    type: 'received',
    contentType: 'text',
    text: '下周三是你们的幸运日，那天晚上7点，带她去你们第一次约会的地方',
    startFrame: 550,
    typingDuration: 50
  },

  // 第四幕：关键建议 (18-24秒)
  {
    id: 11,
    type: 'received',
    contentType: 'text',
    text: '准备一束白玫瑰，诚恳地告诉她你的心意',
    startFrame: 620,
    typingDuration: 40
  },
  {
    id: 12,
    type: 'sent',
    contentType: 'text',
    text: '真的有用吗？',
    startFrame: 680,
    typingDuration: 20
  },
  {
    id: 13,
    type: 'received',
    contentType: 'text',
    text: '相信我，这是你挽回她的最佳时机',
    startFrame: 720,
    typingDuration: 35
  },
  {
    id: 14,
    type: 'sent',
    contentType: 'text',
    text: '好！我一定会做到的！',
    startFrame: 775,
    typingDuration: 25
  },
  {
    id: 15,
    type: 'sent',
    contentType: 'text',
    text: '谢谢大师 🙏',
    startFrame: 820,
    typingDuration: 20
  }
];

const ending = {
  timeline: '一周后...',
  result: '我们和好了！❤️',
  detail: '她说这是她收到过最感动的告白',
  emotion: '下个月我们就要订婚了！💍'
};

const defaultProps: WeChatEnhancedProps = {
  primaryColor: '#d4af37',
  secondaryColor: '#0f3460'
};

// ============================================================================
// 主组件
// ============================================================================

export const WeChatEnhanced: React.FC<WeChatEnhancedProps> = (props) => {
  const mergedProps = { ...defaultProps, ...props };
  const { primaryColor, secondaryColor } = mergedProps;

  return (
    <AbsoluteFill>
      {/* 1. 开场 (0-2秒) */}
      <Sequence from={0} durationInFrames={60} name="Opening">
        <OpeningScene />
      </Sequence>

      {/* 2. 微信聊天 (2-30秒) */}
      <Sequence from={60} durationInFrames={840} name="Chat">
        <EnhancedChat messages={loveStory} />
      </Sequence>

      {/* 3. 过渡 (30-32秒) */}
      <Sequence from={900} durationInFrames={60} name="Transition">
        <TransitionScene text={ending.timeline} />
      </Sequence>

      {/* 4. 结果 (32-36秒) */}
      <Sequence from={960} durationInFrames={120} name="Result">
        <ResultScene ending={ending} primaryColor={primaryColor!} />
      </Sequence>

      {/* 5. CTA (36-40秒) */}
      <Sequence from={1080} durationInFrames={120} name="CTA">
        <CTAScene primaryColor={primaryColor!} secondaryColor={secondaryColor!} />
      </Sequence>

      {/* 6. 结尾 (40-43秒) */}
      <Sequence from={1200} durationInFrames={90} name="Ending">
        <EndingScene primaryColor={primaryColor!} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================================================
// 场景组件
// ============================================================================

const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0]);
  const scale = spring({ frame, fps: 30, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #ff6b9d 0%, #c44569 100%)',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          fontSize: 65,
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          padding: '0 60px',
          lineHeight: 1.5,
          opacity,
          transform: `scale(${scale})`
        }}
      >
        分手三年的女友
        <br />
        <span style={{ fontSize: 55 }}>一周时间重新在一起</span>
      </div>
    </AbsoluteFill>
  );
};

const EnhancedChat: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <div style={{ width: '100%', height: '100%', background: '#ededed' }}>
        {/* 状态栏 */}
        <div
          style={{
            height: 44,
            background: '#f7f7f7',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
            fontSize: 14,
            fontWeight: '600',
            color: '#000'
          }}
        >
          <div>9:41</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        {/* 导航栏 */}
        <div
          style={{
            height: 88,
            background: '#f7f7f7',
            borderBottom: '0.5px solid #d6d6d6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <BackIcon size={20} />
            <div style={{ fontSize: 17, color: '#576b95' }}>返回</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 6,
                background: 'linear-gradient(135deg, #d4af37 0%, #f0d68a 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
              }}
            >
              ☯
            </div>
            <div style={{ fontSize: 18, fontWeight: '600', color: '#191919' }}>
              玄学工坊
            </div>
          </div>

          <div style={{ position: 'absolute', right: 16 }}>
            <MoreIcon size={24} />
          </div>
        </div>

        {/* 聊天内容 */}
        <div
          style={{
            height: 'calc(100% - 132px - 98px)',
            overflowY: 'hidden',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          {messages.map((message) => (
            <EnhancedMessageBubble
              key={message.id}
              message={message}
              currentFrame={frame}
            />
          ))}
        </div>

        {/* 输入栏 */}
        <div
          style={{
            height: 98,
            background: '#f7f7f7',
            borderTop: '0.5px solid #d6d6d6',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            gap: 8
          }}
        >
          <div style={{ width: 48, height: 48, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MicrophoneIcon size={28} color="#191919" />
          </div>
          <div
            style={{
              flex: 1,
              height: 36,
              background: 'white',
              borderRadius: 6,
              border: '1px solid #d6d6d6'
            }}
          />
          <div style={{ width: 48, height: 48, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <EmojiIcon size={28} color="#191919" />
          </div>
          <div style={{ width: 48, height: 48, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PlusIcon size={28} color="#191919" />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EnhancedMessageBubble: React.FC<{
  message: Message;
  currentFrame: number;
}> = ({ message, currentFrame }) => {
  const localFrame = currentFrame - message.startFrame;
  if (localFrame < 0) return null;

  const isSent = message.type === 'sent';
  const typingDuration = message.typingDuration || 30;

  const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const translateX = interpolate(localFrame, [0, 15], [isSent ? 30 : -30, 0], { extrapolateRight: 'clamp' });

  const typingProgress = Math.min(localFrame / typingDuration, 1);
  const visibleText = message.text
    ? message.text.slice(0, Math.floor(message.text.length * typingProgress))
    : '';

  // 时间戳
  const showTime = message.time && localFrame > 5;

  // "正在输入..."
  if (message.contentType === 'typing') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', opacity, transform: `translateX(${translateX}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #d4af37 0%, #f0d68a 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 22,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            ☯
          </div>
          <span style={{ fontSize: 14, color: '#999' }}>正在输入</span>
          <LoadingDots frame={localFrame} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ opacity, transform: `translateX(${translateX}px)` }}>
      {/* 时间戳 */}
      {showTime && (
        <div
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#999',
            marginBottom: 8
          }}
        >
          {message.time}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start', gap: 8 }}>
        {!isSent && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #d4af37 0%, #f0d68a 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 22,
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            ☯
          </div>
        )}

        {message.contentType === 'voice' ? (
          <VoiceMessageBubble duration={message.voiceDuration!} isSent={isSent} frame={localFrame} />
        ) : message.contentType === 'emoji' ? (
          <div style={{ fontSize: 80, lineHeight: 1 }}>{message.emoji}</div>
        ) : (
          <div
            style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: 8,
              background: isSent ? '#95ec69' : 'white',
              fontSize: 17,
              lineHeight: 1.5,
              color: '#191919',
              wordBreak: 'break-word',
              position: 'relative',
              boxShadow: isSent
                ? '0 1px 2px rgba(149, 236, 105, 0.3)'
                : '0 1px 3px rgba(0,0,0,0.12)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 12,
                [isSent ? 'right' : 'left']: -6,
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                [isSent ? 'borderLeft' : 'borderRight']: `6px solid ${isSent ? '#95ec69' : 'white'}`
              }}
            />
            {visibleText}
            {typingProgress < 1 && message.text && (
              <span
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: 18,
                  background: '#191919',
                  marginLeft: 2,
                  verticalAlign: 'middle',
                  opacity: Math.sin(localFrame * 0.2) > 0 ? 1 : 0
                }}
              />
            )}
          </div>
        )}

        {isSent && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              background: '#576b95',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 22,
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            👤
          </div>
        )}
      </div>
    </div>
  );
};

const VoiceMessageBubble: React.FC<{ duration: number; isSent: boolean; frame: number }> = ({
  duration,
  isSent,
  frame
}) => {
  return (
    <div
      style={{
        minWidth: 140,
        maxWidth: 220,
        padding: '12px 16px',
        borderRadius: 8,
        background: isSent ? '#95ec69' : 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        position: 'relative',
        boxShadow: isSent
          ? '0 1px 2px rgba(149, 236, 105, 0.3)'
          : '0 1px 3px rgba(0,0,0,0.12)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 12,
          [isSent ? 'right' : 'left']: -6,
          width: 0,
          height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          [isSent ? 'borderLeft' : 'borderRight']: `6px solid ${isSent ? '#95ec69' : 'white'}`
        }}
      />
      <MicrophoneIcon size={20} color="#191919" />
      <VoiceWaveIcon frame={frame} />
      <div style={{ fontSize: 14, color: '#191919', fontWeight: '500' }}>
        {duration}"
      </div>
    </div>
  );
};

const LoadingDots: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#999',
          opacity: Math.sin((frame + i * 10) * 0.15) * 0.5 + 0.5
        }}
      />
    ))}
  </div>
);

const TransitionScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 70, color: '#d4af37', fontWeight: 'bold', opacity }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

const ResultScene: React.FC<{ ending: typeof ending; primaryColor: string }> = ({ ending, primaryColor }) => {
  const frame = useCurrentFrame();

  const line1 = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const line2 = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: 'clamp' });
  const line3 = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: 'clamp' });
  const line4 = interpolate(frame, [75, 100], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #ff6b9d 0%, #c44569 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60
      }}
    >
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <div style={{ fontSize: 80, opacity: line1 }}>{ending.result}</div>
        <div style={{ fontSize: 45, color: 'white', opacity: line2 }}>{ending.detail}</div>
        <div style={{ fontSize: 50, opacity: line3, marginTop: 20 }}>{ending.emotion}</div>
        <div style={{ fontSize: 100, opacity: line4, transform: `rotate(${frame * 3}deg)` }}>
          💕
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC<{ primaryColor: string; secondaryColor: string }> = ({ primaryColor }) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const buttonScale = spring({ frame: frame - 40, fps: 30, config: { damping: 10 } });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #c44569 0%, #000 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
        gap: 50
      }}
    >
      <div style={{ fontSize: 50, color: 'white', textAlign: 'center', lineHeight: 1.6, opacity: textOpacity }}>
        真爱值得挽回
        <br />
        <span style={{ fontSize: 40, color: primaryColor }}>让命运为你指引方向</span>
      </div>
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, #f0d68a 100%)`,
          padding: '30px 90px',
          borderRadius: 50,
          fontSize: 45,
          fontWeight: 'bold',
          color: '#000',
          transform: `scale(${buttonScale})`,
          boxShadow: `0 15px 50px rgba(212, 175, 55, 0.6)`
        }}
      >
        立即咨询
      </div>
    </AbsoluteFill>
  );
};

const EndingScene: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const frame = useCurrentFrame();
  const logoScale = spring({ frame, fps: 30, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center', gap: 35 }}>
      <div
        style={{
          fontSize: 160,
          transform: `scale(${logoScale}) rotate(${frame * 2}deg)`,
          filter: `drop-shadow(0 0 50px ${primaryColor})`
        }}
      >
        ☯
      </div>
      <div style={{ fontSize: 65, fontWeight: 'bold', color: primaryColor, opacity: textOpacity }}>
        玄学工坊
      </div>
      <div style={{ fontSize: 38, color: 'white', opacity: textOpacity }}>
        destinyteller.com
      </div>
    </AbsoluteFill>
  );
};
