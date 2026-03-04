import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const TestSimple: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: '#ededed' }}>
      {/* 顶部栏 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        background: '#f7f7f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ fontSize: 20, fontWeight: '600' }}>测试页面</div>
      </div>

      {/* 简单文字 */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 20,
        fontSize: 24,
        color: '#000',
      }}>
        当前帧: {frame}
      </div>

      {/* 简单消息气泡 */}
      {frame >= 20 && (
        <div style={{
          position: 'absolute',
          top: 150,
          left: 20,
          right: 20,
          background: 'white',
          padding: 20,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          第一条消息（第20帧后显示）
        </div>
      )}

      {frame >= 100 && (
        <div style={{
          position: 'absolute',
          top: 250,
          left: 20,
          right: 20,
          background: 'white',
          padding: 20,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          第二条消息（第100帧后显示）
        </div>
      )}
    </AbsoluteFill>
  );
};
