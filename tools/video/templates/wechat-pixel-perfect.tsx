/**
 * 微信聊天故事 - 像素级完美复刻版
 *
 * 更吸引人的故事：反转剧情，悬念设置
 * 完整微信 UI：语音消息、表情、红包、时间戳、"正在输入..."
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio
} from 'remotion';

// ============================================================================
// 类型定义
// ============================================================================

interface Message {
  id: number;
  type: 'sent' | 'received';
  contentType: 'text' | 'voice' | 'emoji' | 'typing';
  text?: string;
  voiceDuration?: number;  // 语音时长（秒）
  emoji?: string;
  time?: string;
  startFrame: number;
  typingDuration?: number;
}

interface WeChatStoryV2Props {
  storyType?: 'investment' | 'career' | 'relationship';
  primaryColor?: string;
  secondaryColor?: string;
}

// ============================================================================
// 精心设计的故事：投资翻盘记（更有戏剧性）
// ============================================================================

const investmentStory: Message[] = [
  // 第一幕：绝望求助 (0-8秒)
  {
    id: 1,
    type: 'sent',
    contentType: 'text',
    text: '大师，救救我...',
    startFrame: 30,
    typingDuration: 25
  },
  {
    id: 2,
    type: 'sent',
    contentType: 'text',
    text: '我炒股亏了200万，老婆要跟我离婚',
    startFrame: 80,
    typingDuration: 35
  },
  {
    id: 3,
    type: 'sent',
    contentType: 'emoji',
    emoji: '😭😭😭',
    startFrame: 140,
    typingDuration: 15
  },
  {
    id: 4,
    type: 'received',
    contentType: 'text',
    text: '别急，先告诉我你的生辰八字',
    startFrame: 180,
    typingDuration: 30
  },
  {
    id: 5,
    type: 'sent',
    contentType: 'text',
    text: '1985年10月28日，晚上11点',
    startFrame: 230,
    typingDuration: 30
  },

  // 第二幕：分析转折 (8-16秒)
  {
    id: 6,
    type: 'received',
    contentType: 'typing',
    text: '正在为你分析...',
    startFrame: 280,
    typingDuration: 90
  },
  {
    id: 7,
    type: 'received',
    contentType: 'text',
    text: '你的财星被冲，但这次亏损是转运前的必经之路',
    startFrame: 390,
    typingDuration: 45
  },
  {
    id: 8,
    type: 'received',
    contentType: 'text',
    text: '我看到你的命盘中，下周二有一次重大机会',
    startFrame: 460,
    typingDuration: 40
  },
  {
    id: 9,
    type: 'sent',
    contentType: 'text',
    text: '什么机会？我已经不敢再投了',
    startFrame: 520,
    typingDuration: 35
  },
  {
    id: 10,
    type: 'received',
    contentType: 'voice',
    text: '听我说',
    voiceDuration: 15,
    startFrame: 580,
    typingDuration: 20
  },
  {
    id: 11,
    type: 'received',
    contentType: 'text',
    text: '有一只代码尾数为68的股票，下周二开盘买入，周五收盘前卖出',
    startFrame: 620,
    typingDuration: 50
  },
  {
    id: 12,
    type: 'received',
    contentType: 'text',
    text: '能帮你回本，甚至翻倍',
    startFrame: 690,
    typingDuration: 30
  },

  // 第三幕：犹豫挣扎 (16-20秒)
  {
    id: 13,
    type: 'sent',
    contentType: 'text',
    text: '真的吗？可是我已经没钱了',
    startFrame: 740,
    typingDuration: 30
  },
  {
    id: 14,
    type: 'received',
    contentType: 'text',
    text: '富贵险中求，这是你最后的转运机会',
    startFrame: 790,
    typingDuration: 40
  },
  {
    id: 15,
    type: 'sent',
    contentType: 'text',
    text: '好！我相信你，拼了！',
    startFrame: 850,
    typingDuration: 25
  },
  {
    id: 16,
    type: 'sent',
    contentType: 'emoji',
    emoji: '🙏🙏🙏',
    startFrame: 895,
    typingDuration: 15
  }
];

// 结局文案
const ending = {
  timeline: '一周后...',
  result: '按照指引操作，5天赚回300万',
  detail: '不仅回本，还多赚100万',
  emotion: '老婆说我是她的骄傲 ❤️'
};

const defaultProps: WeChatStoryV2Props = {
  storyType: 'investment',
  primaryColor: '#d4af37',
  secondaryColor: '#0f3460'
};

// ============================================================================
// 主组件
// ============================================================================

export const WeChatPixelPerfect: React.FC<WeChatStoryV2Props> = (props) => {
  const mergedProps = { ...defaultProps, ...props };
  const { primaryColor, secondaryColor } = mergedProps;

  return (
    <AbsoluteFill>
      {/* 1. 震撼开场 (0-2秒) */}
      <Sequence from={0} durationInFrames={60} name="Opening">
        <OpeningScene />
      </Sequence>

      {/* 2. 微信聊天场景 (2-32秒) */}
      <Sequence from={60} durationInFrames={900} name="Chat">
        <PixelPerfectChat messages={investmentStory} />
      </Sequence>

      {/* 3. "一周后..." 过渡 (32-34秒) */}
      <Sequence from={960} durationInFrames={60} name="Transition">
        <TransitionScene text={ending.timeline} />
      </Sequence>

      {/* 4. 结果揭晓 (34-38秒) */}
      <Sequence from={1020} durationInFrames={120} name="Result">
        <ResultSceneV2 ending={ending} primaryColor={primaryColor!} />
      </Sequence>

      {/* 5. CTA (38-42秒) */}
      <Sequence from={1140} durationInFrames={120} name="CTA">
        <CTASceneV2 primaryColor={primaryColor!} secondaryColor={secondaryColor!} />
      </Sequence>

      {/* 6. 品牌结尾 (42-45秒) */}
      <Sequence from={1260} durationInFrames={90} name="Ending">
        <EndingSceneV2 primaryColor={primaryColor!} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================================================
// 场景组件
// ============================================================================

// 1. 震撼开场
const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0]);
  const scale = spring({ frame, fps: 30, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          fontSize: 65,
          fontWeight: 'bold',
          color: '#d4af37',
          textAlign: 'center',
          padding: '0 60px',
          lineHeight: 1.5,
          opacity: textOpacity,
          transform: `scale(${scale})`
        }}
      >
        亏损200万
        <br />
        <span style={{ fontSize: 55, color: 'white' }}>一周翻盘赚回300万</span>
      </div>
    </AbsoluteFill>
  );
};

// 2. 像素级完美微信聊天
const PixelPerfectChat: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* 微信背景色 */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#ededed'
        }}
      >
        {/* === 状态栏 (真实的 iOS 状态栏) === */}
        <div
          style={{
            height: 44,
            background: '#f7f7f7',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
            fontSize: 14,
            color: '#000'
          }}
        >
          <div>9:41</div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span>📶</span>
            <span>📡</span>
            <span>🔋</span>
          </div>
        </div>

        {/* === 顶部导航栏 === */}
        <div
          style={{
            height: 88,
            background: '#f7f7f7',
            borderBottom: '0.5px solid #d9d9d9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* 返回按钮 */}
          <div
            style={{
              position: 'absolute',
              left: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: '#576b95',
                fontWeight: 'bold'
              }}
            >
              ‹
            </div>
            <div style={{ fontSize: 17, color: '#576b95' }}>返回</div>
          </div>

          {/* 对方信息 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 6,
                background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 26,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              ☯
            </div>
            <div style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>
              玄学工坊
            </div>
          </div>

          {/* 更多按钮 */}
          <div
            style={{
              position: 'absolute',
              right: 16,
              fontSize: 26,
              color: '#000',
              fontWeight: 'bold'
            }}
          >
            ⋯
          </div>
        </div>

        {/* === 聊天内容区域 === */}
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
            <MessageBubbleV2
              key={message.id}
              message={message}
              currentFrame={frame}
            />
          ))}
        </div>

        {/* === 底部输入栏 === */}
        <div
          style={{
            height: 98,
            background: '#f7f7f7',
            borderTop: '0.5px solid #d9d9d9',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            gap: 8
          }}
        >
          {/* 语音按钮 */}
          <div
            style={{
              width: 48,
              height: 48,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div style={{ fontSize: 28, color: '#000' }}>🎤</div>
          </div>

          {/* 输入框 */}
          <div
            style={{
              flex: 1,
              height: 36,
              background: 'white',
              borderRadius: 6,
              border: '1px solid #d9d9d9'
            }}
          />

          {/* 表情按钮 */}
          <div
            style={{
              width: 48,
              height: 48,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div style={{ fontSize: 28 }}>😊</div>
          </div>

          {/* 更多按钮 */}
          <div
            style={{
              width: 48,
              height: 48,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 4,
                border: '2px solid #000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 20,
                fontWeight: 'bold'
              }}
            >
              +
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 消息气泡组件 V2
const MessageBubbleV2: React.FC<{
  message: Message;
  currentFrame: number;
}> = ({ message, currentFrame }) => {
  const localFrame = currentFrame - message.startFrame;

  if (localFrame < 0) return null;

  const isSent = message.type === 'sent';
  const typingDuration = message.typingDuration || 30;

  // 出现动画
  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const translateX = interpolate(
    localFrame,
    [0, 15],
    [isSent ? 30 : -30, 0],
    { extrapolateRight: 'clamp' }
  );

  // 打字机效果
  const typingProgress = Math.min(localFrame / typingDuration, 1);
  const visibleText = message.text
    ? message.text.slice(0, Math.floor(message.text.length * typingProgress))
    : '';

  // "正在输入..." 特殊处理
  if (message.contentType === 'typing') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          opacity,
          transform: `translateX(${translateX}px)`
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 12px',
            color: '#999',
            fontSize: 14
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 24
            }}
          >
            ☯
          </div>
          <span>正在输入...</span>
          <LoadingDots frame={localFrame} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isSent ? 'flex-end' : 'flex-start',
        gap: 8,
        opacity,
        transform: `translateX(${translateX}px)`
      }}
    >
      {/* 头像 - 接收方在左 */}
      {!isSent && (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 24,
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }}
        >
          ☯
        </div>
      )}

      {/* 消息内容 */}
      {message.contentType === 'voice' ? (
        // 语音消息
        <VoiceMessage
          duration={message.voiceDuration!}
          isSent={isSent}
          frame={localFrame}
        />
      ) : message.contentType === 'emoji' ? (
        // 纯表情消息（无气泡）
        <div style={{ fontSize: 80, lineHeight: 1 }}>{message.emoji}</div>
      ) : (
        // 文字消息气泡
        <div
          style={{
            maxWidth: '70%',
            padding: '12px 16px',
            borderRadius: 8,
            background: isSent ? '#95ec69' : 'white',
            fontSize: 17,
            lineHeight: 1.5,
            color: '#000',
            wordBreak: 'break-word',
            position: 'relative',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          {/* 气泡尖角 */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              [isSent ? 'right' : 'left']: -6,
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              [isSent ? 'borderLeft' : 'borderRight']: `6px solid ${
                isSent ? '#95ec69' : 'white'
              }`
            }}
          />
          {visibleText}
          {/* 打字中光标 */}
          {typingProgress < 1 && message.text && (
            <span
              style={{
                display: 'inline-block',
                width: 2,
                height: 18,
                background: '#000',
                marginLeft: 2,
                verticalAlign: 'middle',
                opacity: Math.sin(localFrame * 0.2) > 0 ? 1 : 0
              }}
            />
          )}
        </div>
      )}

      {/* 头像 - 发送方在右 */}
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
            fontSize: 24,
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }}
        >
          👤
        </div>
      )}
    </div>
  );
};

// 语音消息组件
const VoiceMessage: React.FC<{
  duration: number;
  isSent: boolean;
  frame: number;
}> = ({ duration, isSent, frame }) => {
  const waveOpacity = Math.sin(frame * 0.3) * 0.3 + 0.7;

  return (
    <div
      style={{
        minWidth: 120,
        maxWidth: 200,
        padding: '12px 16px',
        borderRadius: 8,
        background: isSent ? '#95ec69' : 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}
    >
      {/* 气泡尖角 */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          [isSent ? 'right' : 'left']: -6,
          width: 0,
          height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          [isSent ? 'borderLeft' : 'borderRight']: `6px solid ${
            isSent ? '#95ec69' : 'white'
          }`
        }}
      />

      {/* 语音图标（播放中动画） */}
      <div style={{ fontSize: 22 }}>🎙️</div>

      {/* 声波动画 */}
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: 12 + Math.sin(frame * 0.2 + i) * 8,
              background: '#000',
              borderRadius: 2,
              opacity: waveOpacity
            }}
          />
        ))}
      </div>

      {/* 时长 */}
      <div style={{ fontSize: 14, color: '#000', marginLeft: 4 }}>
        {duration}"
      </div>
    </div>
  );
};

// 加载点动画
const LoadingDots: React.FC<{ frame: number }> = ({ frame }) => {
  return (
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
};

// 3. 过渡场景
const TransitionScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0]);
  const scale = spring({ frame, fps: 30, config: { damping: 15 } });

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          fontSize: 70,
          color: '#d4af37',
          fontWeight: 'bold',
          opacity,
          transform: `scale(${scale})`
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// 4. 结果场景 V2
const ResultSceneV2: React.FC<{
  ending: typeof ending;
  primaryColor: string;
}> = ({ ending, primaryColor }) => {
  const frame = useCurrentFrame();

  const line1 = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const line2 = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: 'clamp' });
  const line3 = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: 'clamp' });
  const line4 = interpolate(frame, [75, 100], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60
      }}
    >
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <div
          style={{
            fontSize: 70,
            fontWeight: 'bold',
            color: primaryColor,
            opacity: line1,
            transform: `scale(${line1})`
          }}
        >
          {ending.result}
        </div>

        <div
          style={{
            fontSize: 45,
            color: 'white',
            opacity: line2,
            marginTop: 20
          }}
        >
          {ending.detail}
        </div>

        <div
          style={{
            fontSize: 50,
            opacity: line3,
            marginTop: 20
          }}
        >
          {ending.emotion}
        </div>

        <div
          style={{
            fontSize: 100,
            opacity: line4,
            marginTop: 20,
            transform: `scale(${line4}) rotate(${frame * 3}deg)`
          }}
        >
          🎊
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 5. CTA 场景 V2
const CTASceneV2: React.FC<{
  primaryColor: string;
  secondaryColor: string;
}> = ({ primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const buttonScale = spring({ frame: frame - 40, fps: 30, config: { damping: 10 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${secondaryColor} 0%, #000 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
        gap: 50
      }}
    >
      <div
        style={{
          fontSize: 50,
          color: 'white',
          textAlign: 'center',
          lineHeight: 1.6,
          opacity: textOpacity
        }}
      >
        命运转折点
        <br />
        <span style={{ fontSize: 40, color: primaryColor }}>就在你的选择中</span>
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, #e8c547 100%)`,
          padding: '30px 90px',
          borderRadius: 50,
          fontSize: 45,
          fontWeight: 'bold',
          color: '#000',
          transform: `scale(${buttonScale})`,
          boxShadow: `0 15px 50px rgba(212, 175, 55, 0.6)`
        }}
      >
        立即测算
      </div>

      <div
        style={{
          fontSize: 32,
          color: 'rgba(255, 255, 255, 0.7)',
          opacity: textOpacity
        }}
      >
        前100名免费咨询
      </div>
    </AbsoluteFill>
  );
};

// 6. 品牌结尾 V2
const EndingSceneV2: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const frame = useCurrentFrame();

  const logoScale = spring({ frame, fps: 30, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 35
      }}
    >
      <div
        style={{
          fontSize: 160,
          transform: `scale(${logoScale}) rotate(${frame * 2}deg)`,
          filter: `drop-shadow(0 0 50px ${primaryColor})`
        }}
      >
        ☯
      </div>

      <div
        style={{
          fontSize: 65,
          fontWeight: 'bold',
          color: primaryColor,
          opacity: textOpacity
        }}
      >
        玄学工坊
      </div>

      <div
        style={{
          fontSize: 38,
          color: 'white',
          opacity: textOpacity,
          letterSpacing: 2
        }}
      >
        destinyteller.com
      </div>

      <div
        style={{
          fontSize: 28,
          color: 'rgba(255, 255, 255, 0.6)',
          opacity: textOpacity,
          marginTop: 10
        }}
      >
        探索命运的智慧指引
      </div>
    </AbsoluteFill>
  );
};
