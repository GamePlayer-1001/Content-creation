/**
 * 音频工具函数
 * 用于生成简单的音效（如提示音）
 */

/**
 * 生成消息提示音的音频数据 URL
 * 使用 Web Audio API 生成简单的"叮"声
 */
export function generateMessageSound(): string {
  // 创建一个简单的正弦波提示音
  const sampleRate = 44100;
  const duration = 0.3; // 300ms
  const frequency = 800; // 800Hz
  const samples = Math.floor(sampleRate * duration);

  const buffer = new Float32Array(samples);

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    // 正弦波 + 衰减包络
    const envelope = Math.exp(-5 * t);
    buffer[i] = Math.sin(2 * Math.PI * frequency * t) * envelope;
  }

  // 转换为 WAV 格式
  const wavBuffer = createWavBuffer(buffer, sampleRate);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

/**
 * 生成发送消息音效
 * 使用更短促的"嗖"声
 */
export function generateSendSound(): string {
  const sampleRate = 44100;
  const duration = 0.2; // 200ms
  const startFreq = 600;
  const endFreq = 400;
  const samples = Math.floor(sampleRate * duration);

  const buffer = new Float32Array(samples);

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const progress = t / duration;
    // 频率从高到低滑动
    const frequency = startFreq + (endFreq - startFreq) * progress;
    const envelope = Math.exp(-8 * t);
    buffer[i] = Math.sin(2 * Math.PI * frequency * t) * envelope;
  }

  const wavBuffer = createWavBuffer(buffer, sampleRate);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

/**
 * 创建 WAV 文件缓冲区
 */
function createWavBuffer(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;

  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // WAV 文件头
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // 写入音频数据
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * 背景音乐列表（使用免费音乐）
 * 这些是 YouTube 音频库中的免费音乐
 */
export const BGM_TRACKS = {
  calm: 'https://cdn.pixabay.com/audio/2022/03/10/audio_d1718372d5.mp3', // 平静轻柔
  hopeful: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3', // 充满希望
  emotional: 'https://cdn.pixabay.com/audio/2022/03/23/audio_c8a4b2be14.mp3', // 情感动人
};
