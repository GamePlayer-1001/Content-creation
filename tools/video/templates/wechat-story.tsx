/**
 * 微信聊天故事视频模板
 *
 * 用真实的微信聊天场景讲述用户故事
 * 适合竖版 1080x1920，时长 60 秒左右
 */

import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Sequence
} from 'remotion';

// ============================================================================
// 类型定义
// ============================================================================

export interface Message {
  id: number;
  type: 'sent' | 'received';  // 发送 or 接收
  text: string;
  time?: string;
  startFrame: number;         // 消息出现的帧数
  typingDuration?: number;    // 打字动画时长（帧）
}

export interface ChatStory {
  title: string;              // 故事标题
  contactName: string;        // 对方名称
  contactAvatar?: string;     // 对方头像 emoji
  userAvatar?: string;        // 用户头像 emoji
  messages: Message[];
  endingText?: string;        // 结尾文案
  ctaText?: string;           // CTA 文案
  website?: string;
}

export interface WeChatStoryProps {
  story?: ChatStory;
  primaryColor?: string;
  secondaryColor?: string;
}

// ============================================================================
// 默认故事：职场晋升决策
// ============================================================================

const defaultStory: ChatStory = {
  title: '一个改变命运的决定',
  contactName: '玄学工坊',
  contactAvatar: '☯',
  userAvatar: '👤',
  messages: [
    {
      id: 1,
      type: 'sent',
      text: '你好，我最近遇到了职业选择的困扰',
      startFrame: 30,
      typingDuration: 40
    },
    {
      id: 2,
      type: 'sent',
      text: '有两个offer，不知道该选哪个',
      startFrame: 100,
      typingDuration: 35
    },
    {
      id: 3,
      type: 'received',
      text: '可以告诉我你的生辰八字吗？',
      startFrame: 160,
      typingDuration: 30
    },
    {
      id: 4,
      type: 'sent',
      text: '1990年3月15日，早上8点',
      startFrame: 220,
      typingDuration: 30
    },
    {
      id: 5,
      type: 'received',
      text: '好的，让我为你分析一下...',
      time: '正在输入...',
      startFrame: 280,
      typingDuration: 30
    },
    {
      id: 6,
      type: 'received',
      text: '根据你的八字，今年是你的事业突破年',
      startFrame: 360,
      typingDuration: 40
    },
    {
      id: 7,
      type: 'received',
      text: '第一个offer虽然薪资高，但不利于长期发展',
      startFrame: 430,
      typingDuration: 45
    },
    {
      id: 8,
      type: 'received',
      text: '第二个offer更符合你的命格，建议选择',
      startFrame: 510,
      typingDuration: 45
    },
    {
      id: 9,
      type: 'sent',
      text: '真的吗？我也觉得第二个更适合我',
      startFrame: 590,
      typingDuration: 35
    },
    {
      id: 10,
      type: 'received',
      text: '相信自己的直觉，它往往不会错',
      startFrame: 660,
      typingDuration: 35
    },
    {
      id: 11,
      type: 'sent',
      text: '好的，谢谢你！我决定了',
      startFrame: 730,
      typingDuration: 30
    },
    {
      id: 12,
      type: 'sent',
      text: '💪',
      startFrame: 790,
      typingDuration: 10
    }
  ],
  endingText: '3个月后...',
  ctaText: '你也想找到属于自己的命运密码吗？',
  website: 'destinyteller.com'
};

const defaultProps: WeChatStoryProps = {
  story: defaultStory,
  primaryColor: '#d4af37',
  secondaryColor: '#0f3460'
};

// ============================================================================
// 主组件
// ============================================================================

export const WeChatStory: React.FC<WeChatStoryProps> = (props) => {
  const mergedProps = { ...defaultProps, ...props };
  const { story, primaryColor, secondaryColor } = mergedProps;

  return (
    <AbsoluteFill>
      {/* 1. 标题场景 (0-2秒) */}
      <Sequence from={0} durationInFrames={60} name="Title">
        <TitleScene title={story!.title} primaryColor={primaryColor!} />
      </Sequence>

      {/* 2. 微信聊天场景 (2-27秒) */}
      <Sequence from={60} durationInFrames={750} name="Chat">
        <ChatScene story={story!} />
      </Sequence>

      {/* 3. 结果展示 (27-30秒) */}
      <Sequence from={810} durationInFrames={90} name="Result">
        <ResultScene
          text="入职第3个月，成功晋升为部门主管"
          primaryColor={primaryColor!}
        />
      </Sequence>

      {/* 4. CTA 场景 (30-33秒) */}
      <Sequence from={900} durationInFrames={90} name="CTA">
        <CTAScene
          ctaText={story!.ctaText!}
          website={story!.website!}
          primaryColor={primaryColor!}
          secondaryColor={secondaryColor!}
        />
      </Sequence>

      {/* 5. 结尾 logo (33-35秒) */}
      <Sequence from={990} durationInFrames={60} name="Ending">
        <EndingScene
          website={story!.website!}
          primaryColor={primaryColor!}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================================================
// 场景组件
// ============================================================================

// 1. 标题场景
const TitleScene: React.FC<{ title: string; primaryColor: string }> = ({ title, primaryColor }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20, 40, 60], [0, 1, 1, 0]);
  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 15 }
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          fontSize: 60,
          fontWeight: 'bold',
          color: primaryColor,
          textAlign: 'center',
          padding: '0 60px',
          opacity,
          transform: `scale(${scale})`,
          lineHeight: 1.6
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};

// 2. 微信聊天场景
const ChatScene: React.FC<{ story: ChatStory }> = ({ story }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* 微信背景 */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#ededed'
        }}
      >
        {/* 顶部导航栏 */}
        <div
          style={{
            height: 120,
            background: '#f7f7f7',
            borderBottom: '1px solid #d9d9d9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            paddingTop: 40
          }}
        >
          {/* 返回按钮 */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 55,
              fontSize: 35,
              color: '#000'
            }}
          >
            ‹
          </div>

          {/* 对方信息 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <div style={{ fontSize: 50 }}>{story.contactAvatar}</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#000' }}>
              {story.contactName}
            </div>
          </div>

          {/* 更多按钮 */}
          <div
            style={{
              position: 'absolute',
              right: 30,
              top: 55,
              fontSize: 35,
              color: '#000'
            }}
          >
            ⋯
          </div>
        </div>

        {/* 聊天内容区域 */}
        <div
          style={{
            height: 'calc(100% - 240px)',
            overflowY: 'hidden',
            padding: '30px 25px'
          }}
        >
          {story.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              currentFrame={frame}
              userAvatar={story.userAvatar!}
              contactAvatar={story.contactAvatar!}
            />
          ))}
        </div>

        {/* 底部输入栏 */}
        <div
          style={{
            height: 120,
            background: '#f7f7f7',
            borderTop: '1px solid #d9d9d9',
            display: 'flex',
            alignItems: 'center',
            padding: '0 25px',
            gap: 20
          }}
        >
          <div style={{ fontSize: 45 }}>🎤</div>
          <div
            style={{
              flex: 1,
              height: 65,
              background: 'white',
              borderRadius: 10,
              border: '1px solid #d9d9d9'
            }}
          />
          <div style={{ fontSize: 45 }}>😊</div>
          <div style={{ fontSize: 45 }}>➕</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 消息气泡组件
const MessageBubble: React.FC<{
  message: Message;
  currentFrame: number;
  userAvatar: string;
  contactAvatar: string;
}> = ({ message, currentFrame, userAvatar, contactAvatar }) => {
  const localFrame = currentFrame - message.startFrame;

  // 消息还没到显示时间
  if (localFrame < 0) return null;

  const isSent = message.type === 'sent';
  const typingDuration = message.typingDuration || 30;

  // 打字机效果
  const typingProgress = Math.min(localFrame / typingDuration, 1);
  const visibleText = message.text.slice(0, Math.floor(message.text.length * typingProgress));

  // 气泡出现动画
  const bubbleOpacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const bubbleX = interpolate(
    localFrame,
    [0, 15],
    [isSent ? 50 : -50, 0],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isSent ? 'flex-end' : 'flex-start',
        marginBottom: 25,
        opacity: bubbleOpacity,
        transform: `translateX(${bubbleX}px)`
      }}
    >
      {/* 头像 - 接收方在左 */}
      {!isSent && (
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 10,
            background: '#ccc',
            marginRight: 15,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 40,
            flexShrink: 0
          }}
        >
          {contactAvatar}
        </div>
      )}

      {/* 消息气泡 */}
      <div
        style={{
          maxWidth: '65%',
          padding: '20px 25px',
          borderRadius: 10,
          background: isSent ? '#95ec69' : 'white',
          fontSize: 28,
          lineHeight: 1.5,
          color: '#000',
          wordBreak: 'break-word',
          position: 'relative'
        }}
      >
        {/* 气泡尖角 */}
        <div
          style={{
            position: 'absolute',
            top: 15,
            [isSent ? 'right' : 'left']: -8,
            width: 0,
            height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            [isSent ? 'borderLeft' : 'borderRight']: `10px solid ${isSent ? '#95ec69' : 'white'}`
          }}
        />
        {visibleText}

        {/* 打字中光标 */}
        {typingProgress < 1 && (
          <span
            style={{
              display: 'inline-block',
              width: 3,
              height: 25,
              background: '#000',
              marginLeft: 3,
              animation: 'blink 1s infinite'
            }}
          />
        )}
      </div>

      {/* 头像 - 发送方在右 */}
      {isSent && (
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 10,
            background: '#d4af37',
            marginLeft: 15,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 40,
            flexShrink: 0
          }}
        >
          {userAvatar}
        </div>
      )}
    </div>
  );
};

// 3. 结果展示场景
const ResultScene: React.FC<{ text: string; primaryColor: string }> = ({ text, primaryColor }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 12 }
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60
      }}
    >
      {/* "3个月后..." */}
      <div
        style={{
          fontSize: 40,
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: 40,
          opacity
        }}
      >
        3个月后...
      </div>

      {/* 结果文字 */}
      <div
        style={{
          fontSize: 50,
          fontWeight: 'bold',
          color: primaryColor,
          textAlign: 'center',
          lineHeight: 1.6,
          opacity,
          transform: `scale(${scale})`
        }}
      >
        {text}
      </div>

      {/* 庆祝 emoji */}
      <div
        style={{
          fontSize: 100,
          marginTop: 40,
          opacity,
          transform: `scale(${scale}) rotate(${frame * 2}deg)`
        }}
      >
        🎉
      </div>
    </AbsoluteFill>
  );
};

// 4. CTA 场景
const CTAScene: React.FC<{
  ctaText: string;
  website: string;
  primaryColor: string;
  secondaryColor: string;
}> = ({ ctaText, website, primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const buttonScale = spring({
    frame: frame - 30,
    fps: 30,
    config: { damping: 10 }
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${secondaryColor} 0%, #1a1a2e 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
        gap: 40
      }}
    >
      {/* CTA 文字 */}
      <div
        style={{
          fontSize: 45,
          color: 'white',
          textAlign: 'center',
          lineHeight: 1.6,
          opacity: textOpacity
        }}
      >
        {ctaText}
      </div>

      {/* 按钮 */}
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, #e8c547 100%)`,
          padding: '25px 70px',
          borderRadius: 50,
          fontSize: 40,
          fontWeight: 'bold',
          color: secondaryColor,
          transform: `scale(${buttonScale})`,
          boxShadow: `0 10px 40px rgba(212, 175, 55, 0.5)`
        }}
      >
        立即咨询
      </div>
    </AbsoluteFill>
  );
};

// 5. 结尾 logo
const EndingScene: React.FC<{ website: string; primaryColor: string }> = ({ website, primaryColor }) => {
  const frame = useCurrentFrame();

  const logoScale = spring({
    frame,
    fps: 30,
    config: { damping: 12 }
  });

  const textOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30
      }}
    >
      {/* 太极 logo */}
      <div
        style={{
          fontSize: 150,
          transform: `scale(${logoScale}) rotate(${frame * 3}deg)`,
          filter: `drop-shadow(0 0 40px ${primaryColor})`
        }}
      >
        ☯
      </div>

      {/* 品牌名 */}
      <div
        style={{
          fontSize: 60,
          fontWeight: 'bold',
          color: primaryColor,
          opacity: textOpacity
        }}
      >
        玄学工坊
      </div>

      {/* 网址 */}
      <div
        style={{
          fontSize: 35,
          color: 'white',
          opacity: textOpacity
        }}
      >
        {website}
      </div>
    </AbsoluteFill>
  );
};
