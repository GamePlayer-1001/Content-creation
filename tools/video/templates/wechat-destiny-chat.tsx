/**
 * 微信风格对话 - 命运测算话题（竖版视频 1080x1920）
 * 时长：约60秒
 * 主题：通过朋友分享的方式自然推广 destinyteller.com
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence, Audio } from 'remotion';

interface Message {
  type: 'received' | 'sent';
  text: string;
  startFrame: number;
  duration: number;
}

// 对话剧本 - 精心设计的故事线
// 时间轴优化：让消息出现更紧凑，提高节奏感
const messages: Message[] = [
  // 开场：引起好奇 (1-4秒)
  { type: 'received', text: '兄弟，昨天发生了件神奇的事...', startFrame: 20, duration: 70 },
  { type: 'received', text: '你还记得我说想换工作的事吗？', startFrame: 100, duration: 70 },
  { type: 'sent', text: '记得啊，怎么了？', startFrame: 180, duration: 60 },

  // 制造悬念 (5-9秒)
  { type: 'received', text: '我测了个命运解析，说我3月会有重大转机', startFrame: 250, duration: 80 },
  { type: 'received', text: '结果今天真的收到了梦想公司的offer！😱', startFrame: 340, duration: 80 },
  { type: 'sent', text: '这也太准了吧！什么测试？', startFrame: 430, duration: 70 },

  // 高潮：揭示价值 (10-15秒)
  { type: 'received', text: '朋友分享给我的一个AI命运测算', startFrame: 510, duration: 80 },
  { type: 'received', text: '输入生日就能分析你的性格、事业、感情走势', startFrame: 600, duration: 90 },
  { type: 'sent', text: '听起来挺玄乎的，但你这结果...🤔', startFrame: 700, duration: 80 },

  // 转折：增加可信度 (16-21秒)
  { type: 'received', text: '我一开始也不信，但它分析的性格特点完全说中我', startFrame: 790, duration: 90 },
  { type: 'received', text: '而且给的建议特别实用，不是那种模糊的鸡汤', startFrame: 890, duration: 90 },
  { type: 'sent', text: '有点意思，能发我看看吗？', startFrame: 990, duration: 70 },

  // 自然分享 (22-28秒)
  { type: 'received', text: '给你分享个链接，免费测一次', startFrame: 1070, duration: 80 },
  { type: 'received', text: 'destinyteller.com 👈', startFrame: 1160, duration: 80 },
  { type: 'sent', text: '行，我试试！感觉挺准的话也分享给其他人', startFrame: 1250, duration: 90 },

  // 结尾：强化价值 (29-35秒)
  { type: 'received', text: '你测完跟我说说准不准哈哈😄', startFrame: 1350, duration: 80 },
  { type: 'received', text: '我现在每个月都会看一次，感觉对决策很有帮助', startFrame: 1440, duration: 90 },
];

export const WeChatDestinyChat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: '#ededed' }}>
      {/* 顶部栏 */}
      <TopBar />

      {/* 聊天内容区域 */}
      {messages.map((msg, index) => {
        // 为每条消息计算累积的垂直位置
        let yOffset = 100; // 从顶部栏下方开始
        for (let i = 0; i < index; i++) {
          yOffset += 90; // 每条消息约90px高度（包括间距）
        }

        return (
          <MessageBubble
            key={index}
            message={msg}
            currentFrame={frame}
            yPosition={yOffset}
          />
        );
      })}

      {/* 底部输入栏 */}
      <BottomBar />

      {/* 结尾文字提示 */}
      {frame > 1530 && (
        <Sequence from={1530}>
          <EndingOverlay currentFrame={frame - 1530} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

// 顶部栏组件
const TopBar: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      background: '#f7f7f7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '1px solid #d9d9d9',
      zIndex: 100,
    }}>
      <div style={{ fontSize: 28, color: '#000' }}>‹</div>
      <div style={{
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span>好友</span>
      </div>
      <div style={{ fontSize: 28, color: '#000' }}>⋯</div>
    </div>
  );
};

// 消息气泡组件
const MessageBubble: React.FC<{ message: Message; currentFrame: number; yPosition: number }> = ({ message, currentFrame, yPosition }) => {
  const { type, text, startFrame, duration } = message;

  // 计算淡入和滑入动画
  const opacity = interpolate(
    currentFrame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateY = interpolate(
    currentFrame,
    [startFrame, startFrame + 20],
    [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 如果还没到显示时间，不渲染
  if (currentFrame < startFrame) {
    return null;
  }

  const isReceived = type === 'received';

  return (
    <div style={{
      position: 'absolute',
      top: yPosition,
      left: 16,
      right: 16,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      justifyContent: isReceived ? 'flex-start' : 'flex-end',
      opacity,
      transform: `translateY(${translateY}px)`,
    }}>
      {/* 接收消息：左侧头像 */}
      {isReceived && (
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
        }}>
          👤
        </div>
      )}

      {/* 消息气泡 */}
      <div style={{
        background: isReceived ? 'white' : '#95ec69',
        padding: '16px 20px',
        borderRadius: 8,
        maxWidth: '75%',
        fontSize: 20,
        lineHeight: 1.6,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        position: 'relative',
        wordBreak: 'break-word',
      }}>
        {/* 气泡小三角 */}
        {isReceived ? (
          <div style={{
            position: 'absolute',
            left: -8,
            top: 18,
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '8px solid white',
          }} />
        ) : (
          <div style={{
            position: 'absolute',
            right: -8,
            top: 18,
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '8px solid #95ec69',
          }} />
        )}

        {/* 高亮链接 */}
        {text.includes('destinyteller.com') ? (
          <span>
            {text.split('destinyteller.com')[0]}
            <span style={{
              color: '#576b95',
              textDecoration: 'underline',
              fontWeight: '600',
            }}>
              destinyteller.com
            </span>
            {text.split('destinyteller.com')[1]}
          </span>
        ) : (
          text
        )}
      </div>

      {/* 发送消息：右侧头像 */}
      {!isReceived && (
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
        }}>
          😊
        </div>
      )}
    </div>
  );
};

// 底部输入栏
const BottomBar: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
      background: '#f7f7f7',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 12,
      borderTop: '1px solid #d9d9d9',
      zIndex: 100,
    }}>
      <div style={{ fontSize: 32 }}>🎤</div>
      <div style={{
        flex: 1,
        height: 44,
        background: 'white',
        borderRadius: 8,
        border: '1px solid #d9d9d9',
      }} />
      <div style={{ fontSize: 32 }}>😊</div>
      <div style={{ fontSize: 32 }}>➕</div>
    </div>
  );
};

// 结尾浮层
const EndingOverlay: React.FC<{ currentFrame: number }> = ({ currentFrame }) => {
  const opacity = interpolate(
    currentFrame,
    [0, 30, 90, 120],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = interpolate(
    currentFrame,
    [0, 30],
    [0.8, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity,
      zIndex: 200,
    }}>
      <div style={{
        transform: `scale(${scale})`,
        textAlign: 'center',
        color: 'white',
      }}>
        <div style={{
          fontSize: 48,
          fontWeight: 'bold',
          marginBottom: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'brightness(1.5)',
        }}>
          destinyteller.com
        </div>
        <div style={{
          fontSize: 24,
          color: '#ddd',
        }}>
          探索你的命运密码
        </div>
      </div>
    </div>
  );
};
