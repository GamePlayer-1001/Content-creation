/**
 * 玄学工坊 (Destiny Teller) 宣传视频模板
 *
 * 核心元素：
 * - 太极旋转动画
 * - 深蓝 → 金色渐变
 * - AI × 传统文化融合
 * - 神秘高端质感
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

export interface DestinyTellerPromoProps {
  // 品牌信息
  brandName?: string;
  tagline?: string;
  subtitle?: string;

  // 特性列表
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  // 联系方式
  website?: string;
  qrCodeUrl?: string;

  // 样式自定义
  primaryColor?: string;      // 主色 (金色)
  secondaryColor?: string;    // 辅色 (深蓝)
  accentColor?: string;       // 强调色

  // 音乐（可选）
  backgroundMusic?: string;
}

// 默认配置
const defaultProps: DestinyTellerPromoProps = {
  brandName: '玄学工坊',
  tagline: 'Destiny Teller',
  subtitle: '探索命运的智慧指引',
  features: [
    {
      icon: '☯',
      title: 'AI 八字分析',
      description: '传统智慧与现代科技的完美融合'
    },
    {
      icon: '🔮',
      title: '梅花易数',
      description: '精准占卜，洞察未来趋势'
    },
    {
      icon: '✨',
      title: '智慧指引',
      description: '专业解读，助您把握人生方向'
    }
  ],
  website: 'destinyteller.com',
  primaryColor: '#d4af37',      // 金色
  secondaryColor: '#0f3460',    // 深蓝
  accentColor: '#e8c547'        // 亮金
};

// ============================================================================
// 主组件
// ============================================================================

export const DestinyTellerPromo: React.FC<DestinyTellerPromoProps> = (props) => {
  const mergedProps = { ...defaultProps, ...props };
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* 场景 1: 开场 - 太极出现 (0-120帧 / 4秒) */}
      <Sequence from={0} durationInFrames={120} name="Intro">
        <IntroScene {...mergedProps} />
      </Sequence>

      {/* 场景 2: 品牌展示 (120-210帧 / 3秒) */}
      <Sequence from={120} durationInFrames={90} name="Brand">
        <BrandScene {...mergedProps} />
      </Sequence>

      {/* 场景 3: 特性展示 (210-390帧 / 6秒) */}
      <Sequence from={210} durationInFrames={180} name="Features">
        <FeaturesScene {...mergedProps} />
      </Sequence>

      {/* 场景 4: CTA 结尾 (390-480帧 / 3秒) */}
      <Sequence from={390} durationInFrames={90} name="CTA">
        <CTAScene {...mergedProps} />
      </Sequence>

      {/* 音频（如果有）*/}
      {mergedProps.backgroundMusic && (
        <Audio src={mergedProps.backgroundMusic} />
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// 场景 1: 开场 - 太极旋转
// ============================================================================

const IntroScene: React.FC<DestinyTellerPromoProps> = ({
  primaryColor,
  secondaryColor
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 太极旋转角度（持续旋转）
  const rotation = (frame * 3) % 360;

  // 太极缩放动画（从小放大）
  const scale = spring({
    fps,
    frame,
    config: {
      damping: 20,
      stiffness: 80,
      mass: 1
    }
  });

  // 光晕脉冲效果
  const glowIntensity = interpolate(
    Math.sin(frame / 15) * 0.5 + 0.5,
    [0, 1],
    [0.3, 1]
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, ${secondaryColor} 0%, #1a1a2e 100%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* 背景粒子效果 */}
      <BackgroundParticles color={primaryColor} />

      {/* 太极图 */}
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          filter: `drop-shadow(0 0 ${30 * glowIntensity}px ${primaryColor})`
        }}
      >
        <TaijiSymbol size={300} color={primaryColor} />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 场景 2: 品牌展示
// ============================================================================

const BrandScene: React.FC<DestinyTellerPromoProps> = ({
  brandName,
  tagline,
  subtitle,
  primaryColor,
  secondaryColor
}) => {
  const frame = useCurrentFrame();

  // 标题从下方滑入
  const titleY = interpolate(
    frame,
    [0, 30],
    [100, 0],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic)
    }
  );

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp'
  });

  // 副标题淡入
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: 'clamp'
  });

  // 英文标语淡入
  const taglineOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${secondaryColor} 0%, #1a1a2e 50%, ${secondaryColor} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '"Noto Serif SC", "STSong", serif'
      }}
    >
      {/* 背景太极（淡化） */}
      <div
        style={{
          position: 'absolute',
          opacity: 0.1,
          transform: 'scale(2) rotate(45deg)'
        }}
      >
        <TaijiSymbol size={600} color={primaryColor} />
      </div>

      {/* 中文品牌名 */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        <h1
          style={{
            fontSize: 120,
            fontWeight: 'bold',
            color: primaryColor,
            margin: 0,
            letterSpacing: '0.1em',
            textShadow: `0 0 20px ${primaryColor}80, 0 0 40px ${primaryColor}40`
          }}
        >
          {brandName}
        </h1>

        {/* 英文标语 */}
        <p
          style={{
            fontSize: 48,
            color: '#ffffff',
            margin: '20px 0 0 0',
            opacity: taglineOpacity,
            letterSpacing: '0.2em',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic'
          }}
        >
          {tagline}
        </p>
      </div>

      {/* 副标题 */}
      <div
        style={{
          marginTop: 60,
          opacity: subtitleOpacity,
          textAlign: 'center'
        }}
      >
        <p
          style={{
            fontSize: 36,
            color: '#ffffff',
            margin: 0,
            opacity: 0.9,
            letterSpacing: '0.15em'
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* 装饰线 */}
      <div
        style={{
          marginTop: 40,
          width: 400,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`,
          opacity: subtitleOpacity
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// 场景 3: 特性展示
// ============================================================================

const FeaturesScene: React.FC<DestinyTellerPromoProps> = ({
  features,
  primaryColor,
  secondaryColor
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at top, #1a1a2e 0%, ${secondaryColor} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 100px',
        fontFamily: '"Noto Sans SC", "STHeiti", sans-serif'
      }}
    >
      {/* 标题 */}
      <h2
        style={{
          fontSize: 64,
          color: primaryColor,
          marginBottom: 80,
          letterSpacing: '0.1em',
          textShadow: `0 0 15px ${primaryColor}60`
        }}
      >
        核心功能
      </h2>

      {/* 特性卡片 */}
      <div
        style={{
          display: 'flex',
          gap: 60,
          justifyContent: 'center',
          alignItems: 'stretch'
        }}
      >
        {features?.map((feature, index) => (
          <FeatureCard
            key={index}
            feature={feature}
            index={index}
            frame={frame}
            primaryColor={primaryColor!}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 特性卡片组件
const FeatureCard: React.FC<{
  feature: { icon: string; title: string; description: string };
  index: number;
  frame: number;
  primaryColor: string;
}> = ({ feature, index, frame, primaryColor }) => {
  const delay = index * 20;

  const opacity = interpolate(
    frame,
    [delay, delay + 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const y = interpolate(
    frame,
    [delay, delay + 30],
    [50, 0],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic)
    }
  );

  // 悬浮动画
  const float = Math.sin((frame - delay) / 30) * 5;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y + float}px)`,
        width: 320,
        padding: 40,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: 20,
        border: `2px solid ${primaryColor}40`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px ${primaryColor}10`,
        textAlign: 'center',
        transition: 'all 0.3s ease'
      }}
    >
      {/* 图标 */}
      <div
        style={{
          fontSize: 72,
          marginBottom: 20,
          filter: `drop-shadow(0 0 10px ${primaryColor})`
        }}
      >
        {feature.icon}
      </div>

      {/* 标题 */}
      <h3
        style={{
          fontSize: 32,
          color: primaryColor,
          margin: '0 0 15px 0',
          letterSpacing: '0.05em'
        }}
      >
        {feature.title}
      </h3>

      {/* 描述 */}
      <p
        style={{
          fontSize: 18,
          color: '#ffffff',
          opacity: 0.8,
          lineHeight: 1.6,
          margin: 0
        }}
      >
        {feature.description}
      </p>
    </div>
  );
};

// ============================================================================
// 场景 4: CTA 结尾
// ============================================================================

const CTAScene: React.FC<DestinyTellerPromoProps> = ({
  website,
  qrCodeUrl,
  primaryColor,
  secondaryColor
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 网站地址淡入
  const websiteOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp'
  });

  // 二维码缩放
  const qrScale = spring({
    fps,
    frame: frame - 10,
    config: {
      damping: 15,
      stiffness: 100
    }
  });

  // 太极旋转（背景）
  const rotation = (frame * 2) % 360;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '"Noto Sans SC", sans-serif'
      }}
    >
      {/* 背景太极旋转 */}
      <div
        style={{
          position: 'absolute',
          opacity: 0.08,
          transform: `scale(3) rotate(${rotation}deg)`
        }}
      >
        <TaijiSymbol size={600} color={primaryColor} />
      </div>

      {/* CTA 文字 */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 60,
          opacity: websiteOpacity
        }}
      >
        <h2
          style={{
            fontSize: 56,
            color: primaryColor,
            margin: '0 0 30px 0',
            letterSpacing: '0.1em',
            textShadow: `0 0 20px ${primaryColor}60`
          }}
        >
          开启您的命运探索之旅
        </h2>

        <p
          style={{
            fontSize: 72,
            color: '#ffffff',
            margin: 0,
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.05em'
          }}
        >
          {website}
        </p>
      </div>

      {/* 二维码（如果提供） */}
      {qrCodeUrl && (
        <div
          style={{
            transform: `scale(${qrScale})`,
            padding: 20,
            background: '#ffffff',
            borderRadius: 20,
            boxShadow: `0 0 40px ${primaryColor}80`
          }}
        >
          <img
            src={qrCodeUrl}
            alt="QR Code"
            style={{
              width: 200,
              height: 200,
              display: 'block'
            }}
          />
        </div>
      )}

      {/* 装饰元素 */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          fontSize: 24,
          color: primaryColor,
          opacity: 0.6,
          letterSpacing: '0.2em'
        }}
      >
        AI × 传统文化 · 智慧指引
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 辅助组件
// ============================================================================

// 太极图组件
const TaijiSymbol: React.FC<{ size: number; color: string }> = ({
  size,
  color
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}
    >
      {/* 外圈 */}
      <circle cx="100" cy="100" r="95" fill="none" stroke={color} strokeWidth="2" />

      {/* 黑色半圆 */}
      <path
        d="M 100 5 A 95 95 0 0 1 100 195 A 47.5 47.5 0 0 1 100 100 A 47.5 47.5 0 0 0 100 5"
        fill={color}
      />

      {/* 白色半圆 */}
      <path
        d="M 100 5 A 95 95 0 0 0 100 195 A 47.5 47.5 0 0 0 100 100 A 47.5 47.5 0 0 1 100 5"
        fill="#ffffff"
      />

      {/* 黑色小圆点 */}
      <circle cx="100" cy="52.5" r="12" fill="#ffffff" />

      {/* 白色小圆点 */}
      <circle cx="100" cy="147.5" r="12" fill={color} />
    </svg>
  );
};

// 背景粒子效果
const BackgroundParticles: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 300 + Math.sin(frame / 20 + i) * 50;
    const x = 960 + Math.cos(angle + frame / 100) * radius;
    const y = 540 + Math.sin(angle + frame / 100) * radius;
    const opacity = (Math.sin(frame / 30 + i) + 1) / 2 * 0.3;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: color,
          opacity,
          boxShadow: `0 0 10px ${color}`
        }}
      />
    );
  });

  return <>{particles}</>;
};

// ============================================================================
// 音频组件（如果需要）
// ============================================================================

import { Audio } from 'remotion';

// ============================================================================
// 导出
// ============================================================================

export default DestinyTellerPromo;

// Composition 预设
export const DestinyTellerCompositions = {
  // 横屏版本 (YouTube, 网站)
  landscape: {
    id: 'destiny-teller-landscape',
    component: DestinyTellerPromo,
    durationInFrames: 480, // 16秒 @ 30fps
    fps: 30,
    width: 1920,
    height: 1080,
    defaultProps
  },

  // 方形版本 (Instagram, 微信朋友圈)
  square: {
    id: 'destiny-teller-square',
    component: DestinyTellerPromo,
    durationInFrames: 450, // 15秒 @ 30fps
    fps: 30,
    width: 1080,
    height: 1080,
    defaultProps
  },

  // 竖屏版本 (抖音, TikTok, Instagram Stories)
  vertical: {
    id: 'destiny-teller-vertical',
    component: DestinyTellerPromo,
    durationInFrames: 450, // 15秒 @ 30fps
    fps: 30,
    width: 1080,
    height: 1920,
    defaultProps
  }
};
