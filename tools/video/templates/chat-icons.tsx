/**
 * 聊天应用通用SVG图标库
 */

import React from 'react';

// ============================================================================
// 底部工具栏图标
// ============================================================================

export const VoiceIcon: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
    <path d="M10 8L15 12L10 16V8Z" fill={color}/>
  </svg>
);

export const MicIcon: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 14C13.1 14 14 13.1 14 12V6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6V12C10 13.1 10.9 14 12 14Z" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M16 12C16 14.2 14.2 16 12 16C9.8 16 8 14.2 8 12" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const SmileIcon: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <circle cx="9" cy="10" r="1" fill={color}/>
    <circle cx="15" cy="10" r="1" fill={color}/>
    <path d="M8 14C8.5 15 10 16 12 16C14 16 15.5 15 16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const PlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <path d="M12 8V16M8 12H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CameraIcon: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12.5" r="3" stroke={color} strokeWidth="1.5"/>
    <path d="M7 6L8.5 3H15.5L17 6" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const AttachIcon: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M21 10L12 19C10.3 20.7 7.7 20.7 6 19C4.3 17.3 4.3 14.7 6 13L15 4C16.1 2.9 17.9 2.9 19 4C20.1 5.1 20.1 6.9 19 8L10.5 16.5C9.9 17.1 8.9 17.1 8.3 16.5C7.7 15.9 7.7 14.9 8.3 14.3L16 6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ThumbsUpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 56, color = '#0084ff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 22V11M2 13V20C2 21.1 2.9 22 4 22H17.4C18.8 22 20 20.9 20.2 19.5L21.9 9.5C22.1 8 20.9 7 19.4 7H15V4C15 2.9 14.1 2 13 2C12.5 2 12 2.2 11.6 2.6L7 7.8V22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ============================================================================
// 导航栏图标
// ============================================================================

export const BackIcon: React.FC<{ size?: number; color?: string }> = ({ size = 52, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MoreIcon: React.FC<{ size?: number; color?: string }> = ({ size = 52, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="6" r="1.5" fill={color}/>
    <circle cx="12" cy="12" r="1.5" fill={color}/>
    <circle cx="12" cy="18" r="1.5" fill={color}/>
  </svg>
);

export const PhoneIcon: React.FC<{ size?: number; color?: string }> = ({ size = 52, color = '#0084ff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92V19.92C22 20.5 21.5 21 20.9 21C10.8 20.5 3.5 13.2 3 3.1C3 2.5 3.5 2 4.1 2H7.1C7.6 2 8.1 2.5 8.2 3C8.3 4.2 8.6 5.4 9 6.5C9.2 7 9 7.6 8.6 7.9L6.9 9.6C8.3 12.4 10.6 14.7 13.4 16.1L15.1 14.4C15.5 14 16.1 13.8 16.5 14C17.6 14.4 18.8 14.7 20 14.8C20.5 14.9 21 15.4 21 15.9V18.9" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const VideoIcon: React.FC<{ size?: number; color?: string }> = ({ size = 52, color = '#0084ff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="14" height="12" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M16 10L22 6V18L16 14V10Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
