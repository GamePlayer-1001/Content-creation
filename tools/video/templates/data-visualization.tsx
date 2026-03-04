/**
 * 数据可视化模板
 *
 * 用于创建动画图表和数据展示视频
 * 支持柱状图、折线图、饼图等
 */

import React, { useMemo } from 'remotion';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing
} from 'remotion';

// ============================================================================
// 类型定义
// ============================================================================

export interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface DataVisualizationProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  chartType?: 'bar' | 'line' | 'pie' | 'area';
  animationStyle?: 'smooth' | 'bounce' | 'elastic';
  backgroundColor?: string;
  accentColor?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  animationDuration?: number; // 动画持续帧数
}

// ============================================================================
// 主组件
// ============================================================================

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  title,
  subtitle,
  data,
  chartType = 'bar',
  animationStyle = 'smooth',
  backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  accentColor = '#ffffff',
  showGrid = true,
  showLabels = true,
  animationDuration = 60
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 标题动画：从上方滑入
  const titleY = interpolate(
    frame,
    [0, 30],
    [-100, 0],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic)
    }
  );

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp'
  });

  // 数据动画进度
  const progress = useMemo(() => {
    switch (animationStyle) {
      case 'bounce':
        return spring({
          fps,
          frame,
          config: {
            damping: 15,
            stiffness: 100,
            mass: 1
          }
        });

      case 'elastic':
        return spring({
          fps,
          frame: frame - 10, // 延迟开始
          config: {
            damping: 8,
            stiffness: 80,
            mass: 1
          }
        });

      case 'smooth':
      default:
        return interpolate(
          frame,
          [10, 10 + animationDuration],
          [0, 1],
          {
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.33, 1, 0.68, 1)
          }
        );
    }
  }, [frame, fps, animationStyle, animationDuration]);

  // 数据归一化
  const maxValue = Math.max(...data.map(d => d.value));
  const normalizedData = data.map(d => ({
    ...d,
    normalizedValue: (d.value / maxValue) * progress
  }));

  return (
    <AbsoluteFill
      style={{
        background: backgroundColor,
        fontFamily: 'Inter, Arial, sans-serif',
        color: accentColor
      }}
    >
      {/* 标题区域 */}
      <div
        style={{
          position: 'absolute',
          top: titleY,
          left: 0,
          right: 0,
          opacity: titleOpacity,
          textAlign: 'center',
          paddingTop: 60
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            margin: 0,
            textShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: 32,
              opacity: 0.8,
              marginTop: 10
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* 图表区域 */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 100,
          right: 100,
          bottom: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}
      >
        {chartType === 'bar' && (
          <BarChart
            data={normalizedData}
            showGrid={showGrid}
            showLabels={showLabels}
            accentColor={accentColor}
          />
        )}

        {chartType === 'line' && (
          <LineChart
            data={normalizedData}
            showGrid={showGrid}
            showLabels={showLabels}
            accentColor={accentColor}
          />
        )}

        {chartType === 'pie' && (
          <PieChart
            data={normalizedData}
            showLabels={showLabels}
            accentColor={accentColor}
          />
        )}

        {chartType === 'area' && (
          <AreaChart
            data={normalizedData}
            showGrid={showGrid}
            showLabels={showLabels}
            accentColor={accentColor}
          />
        )}
      </div>

      {/* 水印 */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 30,
          fontSize: 18,
          opacity: 0.5
        }}
      >
        Generated with Remotion
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 柱状图组件
// ============================================================================

interface ChartComponentProps {
  data: Array<DataPoint & { normalizedValue: number }>;
  showGrid: boolean;
  showLabels: boolean;
  accentColor: string;
}

const BarChart: React.FC<ChartComponentProps> = ({
  data,
  showGrid,
  showLabels,
  accentColor
}) => {
  const barWidth = 80;
  const barGap = 40;
  const totalWidth = data.length * (barWidth + barGap);

  return (
    <div
      style={{
        width: totalWidth,
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        gap: barGap,
        position: 'relative'
      }}
    >
      {/* 网格线 */}
      {showGrid && (
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
          {[0, 0.25, 0.5, 0.75, 1].map(y => (
            <div
              key={y}
              style={{
                position: 'absolute',
                bottom: `${y * 100}%`,
                width: '100%',
                height: 1,
                backgroundColor: accentColor,
                opacity: 0.2
              }}
            />
          ))}
        </div>
      )}

      {/* 柱子 */}
      {data.map((item, index) => {
        const height = item.normalizedValue * 100;

        return (
          <div
            key={index}
            style={{
              width: barWidth,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {/* 数值标签 */}
            {showLabels && (
              <div
                style={{
                  position: 'absolute',
                  top: -40,
                  fontSize: 24,
                  fontWeight: 'bold',
                  opacity: item.normalizedValue > 0.1 ? 1 : 0
                }}
              >
                {Math.round(item.value)}
              </div>
            )}

            {/* 柱子 */}
            <div
              style={{
                width: '100%',
                height: `${height}%`,
                backgroundColor: item.color || accentColor,
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                transition: 'height 0.3s ease'
              }}
            />

            {/* 标签 */}
            {showLabels && (
              <div
                style={{
                  marginTop: 15,
                  fontSize: 20,
                  textAlign: 'center',
                  opacity: 0.9
                }}
              >
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// 折线图组件
// ============================================================================

const LineChart: React.FC<ChartComponentProps> = ({
  data,
  showGrid,
  showLabels,
  accentColor
}) => {
  const width = 1200;
  const height = 600;
  const pointGap = width / (data.length - 1);

  const points = data.map((item, index) => ({
    x: index * pointGap,
    y: height - item.normalizedValue * height,
    ...item
  }));

  // 生成 SVG 路径
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div style={{ width, height, position: 'relative' }}>
      {/* 网格 */}
      {showGrid && (
        <svg width={width} height={height} style={{ position: 'absolute' }}>
          {[0, 0.25, 0.5, 0.75, 1].map(y => (
            <line
              key={y}
              x1={0}
              y1={y * height}
              x2={width}
              y2={y * height}
              stroke={accentColor}
              strokeOpacity={0.2}
              strokeWidth={1}
            />
          ))}
        </svg>
      )}

      {/* 折线 */}
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', overflow: 'visible' }}
      >
        <path
          d={linePath}
          fill="none"
          stroke={accentColor}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={8}
            fill={point.color || accentColor}
            stroke="#fff"
            strokeWidth={2}
          />
        ))}
      </svg>

      {/* 标签 */}
      {showLabels && (
        <div style={{ position: 'relative', height }}>
          {points.map((point, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: point.x,
                bottom: -40,
                transform: 'translateX(-50%)',
                fontSize: 18,
                textAlign: 'center',
                opacity: 0.9
              }}
            >
              {point.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 饼图组件
// ============================================================================

const PieChart: React.FC<ChartComponentProps> = ({
  data,
  showLabels,
  accentColor
}) => {
  const size = 600;
  const radius = size / 2 - 50;
  const centerX = size / 2;
  const centerY = size / 2;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // 从顶部开始

  const slices = data.map(item => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    currentAngle += angle * item.normalizedValue;

    return {
      ...item,
      startAngle,
      endAngle: currentAngle,
      percentage
    };
  });

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size}>
        {slices.map((slice, index) => {
          const startRad = (slice.startAngle * Math.PI) / 180;
          const endRad = (slice.endAngle * Math.PI) / 180;

          const x1 = centerX + radius * Math.cos(startRad);
          const y1 = centerY + radius * Math.sin(startRad);
          const x2 = centerX + radius * Math.cos(endRad);
          const y2 = centerY + radius * Math.sin(endRad);

          const largeArc = slice.endAngle - slice.startAngle > 180 ? 1 : 0;

          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={slice.color || accentColor}
              stroke="#fff"
              strokeWidth={3}
              opacity={0.9}
            />
          );
        })}
      </svg>

      {/* 标签 */}
      {showLabels && (
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          {slices.map((slice, index) => {
            const midAngle = (slice.startAngle + slice.endAngle) / 2;
            const labelRadius = radius + 60;
            const x = centerX + labelRadius * Math.cos((midAngle * Math.PI) / 180);
            const y = centerY + labelRadius * Math.sin((midAngle * Math.PI) / 180);

            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  opacity: slice.normalizedValue > 0.1 ? 1 : 0
                }}
              >
                <div>{slice.label}</div>
                <div style={{ fontSize: 16, opacity: 0.8 }}>
                  {Math.round(slice.percentage * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 面积图组件
// ============================================================================

const AreaChart: React.FC<ChartComponentProps> = ({
  data,
  showGrid,
  showLabels,
  accentColor
}) => {
  const width = 1200;
  const height = 600;
  const pointGap = width / (data.length - 1);

  const points = data.map((item, index) => ({
    x: index * pointGap,
    y: height - item.normalizedValue * height,
    ...item
  }));

  // 生成面积路径
  const areaPath = [
    ...points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`),
    `L ${width} ${height}`,
    `L 0 ${height}`,
    'Z'
  ].join(' ');

  return (
    <div style={{ width, height, position: 'relative' }}>
      {/* 网格 */}
      {showGrid && (
        <svg width={width} height={height} style={{ position: 'absolute' }}>
          {[0, 0.25, 0.5, 0.75, 1].map(y => (
            <line
              key={y}
              x1={0}
              y1={y * height}
              x2={width}
              y2={y * height}
              stroke={accentColor}
              strokeOpacity={0.2}
              strokeWidth={1}
            />
          ))}
        </svg>
      )}

      {/* 面积 */}
      <svg width={width} height={height} style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={0.8} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#areaGradient)" />
      </svg>

      {/* 标签 */}
      {showLabels && (
        <div style={{ position: 'relative', height }}>
          {points.map((point, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: point.x,
                bottom: -40,
                transform: 'translateX(-50%)',
                fontSize: 18,
                textAlign: 'center',
                opacity: 0.9
              }}
            >
              {point.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 导出
// ============================================================================

export default DataVisualization;
