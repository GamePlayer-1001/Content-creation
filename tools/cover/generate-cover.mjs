#!/usr/bin/env node
/**
 * [INPUT]: 依赖 @google/genai (Gemini Nano Banana 图片生成)
 * [OUTPUT]: 生成小红书风格 3:4 竖版封面图片 (PNG) 到指定路径
 * [POS]: tools/ 的核心封面生成器，被 小红书玄学/X玄学 skill 调用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 *
 * 用法:
 *   node tools/generate-cover.mjs --title "标题" --type narrative --output "path/cover.png"
 *   node tools/generate-cover.mjs --title "标题" --type tutorial --output "path/cover.png" --keywords "塔罗 感情"
 *
 * --type: narrative(叙事/聊天记录) | tutorial(教程) | rant(吐槽/反转)
 * --keywords: 可选，空格分隔关键词，定制封面视觉元素
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ================================================================
//  配置
// ================================================================

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBoIGiDMozbyLIsXv_uiRbKlHznO5Rl7zQ';
const MODEL = process.env.GEMINI_MODEL || 'gemini-3-pro-image-preview';

// ================================================================
//  参数解析
// ================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { title: '', type: 'narrative', output: '', keywords: '' };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--title':    result.title = args[++i] || ''; break;
      case '--type':     result.type = args[++i] || 'narrative'; break;
      case '--output':   result.output = args[++i] || ''; break;
      case '--keywords': result.keywords = args[++i] || ''; break;
    }
  }

  if (!result.title || !result.output) {
    console.error('用法: node generate-cover.mjs --title "标题" --type narrative --output "cover.png"');
    console.error('  --type: narrative | tutorial | rant');
    console.error('  --keywords: 可选，空格分隔关键词');
    process.exit(1);
  }

  return result;
}

// ================================================================
//  提示词工程 —— 小红书风格封面，去 AI 味
// ================================================================

const TOPIC_ELEMENTS = {
  塔罗: 'vintage tarot cards fanned out, mysterious arcana symbols',
  星盘: 'star chart on parchment, zodiac wheel, celestial brass instruments',
  合盘: 'two intertwined zodiac charts, romantic constellation map',
  水逆: 'mercury retrograde mood, scattered papers, tangled earphones',
  八字: 'traditional Chinese calligraphy on rice paper, red silk thread',
  紫微: 'Chinese star map on dark indigo background, golden constellations',
  感情: 'rose petals, handwritten love letter, warm candlelight',
  事业: 'golden desk accessories, leather planner, ambition aesthetic',
  财运: 'jade bracelet on silk, golden coins, prosperity arrangement',
  运势: 'crystal ball catching light, swirling incense smoke',
  梅花: 'plum blossom branch, Chinese ink stone, calligraphy brush',
  六爻: 'ancient bronze I Ching coins, bamboo slips, ink brush on stone',
  占卜: 'mystical crystals arrangement, vintage brass pendulum',
  玄学: 'mysterious artifacts, old leather-bound books, amber light',
  测试: 'personality quiz aesthetic, colorful cards spread, playful arrangement',
};

const STYLE_TEMPLATES = {
  narrative: [
    'Editorial lifestyle photography, aesthetic flatlay of {elements} on dark burgundy velvet fabric, golden brass candle holder with warm flickering flame, raw amethyst crystals catching ambient light, dried eucalyptus sprigs, overhead angle, warm amber color grading, moody atmospheric lighting, Kinfolk magazine editorial style',
    'Atmospheric still life photography, {elements} arranged on weathered wooden table surface, soft golden hour light streaming through sheer linen curtains, visible dust particles dancing in light beams, vintage warm color palette, authentic film grain texture, medium format camera aesthetic',
    'Intimate overhead photography, {elements} on crumpled dark indigo linen, thin trail of incense smoke rising, small handmade ceramic dish, warm tungsten lighting casting rich shadows, editorial mood, Japanese wabi-sabi aesthetic, real texture details',
  ],
  tutorial: [
    'Bright minimalist flatlay photography, {elements} on clean white marble surface, open leather-bound journal with fountain pen handwriting visible, ceramic cup of chamomile tea with steam, natural window light from left side, organized and inviting, soft contact shadows, MUJI lifestyle aesthetic',
    'Clean desk arrangement photography, {elements} neatly placed on pale blush pink surface, gold-rimmed Moleskine notebook, dried baby breath flowers in tiny ceramic vase, bright airy atmosphere, pastel color harmony, natural daylight, Pinterest editorial composition',
    'Modern Scandinavian photography, {elements} on light birch wood desk, linen notebook partially open, small potted echeveria succulent, clean geometric lines, soft diffused northern light, hygge cozy feeling, minimal clutter',
  ],
  rant: [
    'Candid lifestyle photography, close-up of manicured hands dramatically gesturing over {elements}, marble cafe table with half-finished oat latte, blurred warm city lights in background, shallow depth of field, genuine frustration energy, street photography documentary style',
    'Expressive still life photography, {elements} on cluttered desk, crumpled receipt papers, phone face-down, half-eaten pastry on plate, frustrated messy energy, warm overhead pendant lighting, authentic lived-in chaos, relatable and real',
    'Moody lifestyle photography, {elements} captured in dramatic side lighting, urban apartment backdrop with warm string lights, cinematic color grading with teal shadows and orange highlights, authentic human moment, editorial documentary feel',
  ],
};

const ANTI_AI_MODIFIERS = [
  'shot on Fujifilm X-T4 with Fujinon 35mm f/1.4 lens',
  'subtle authentic film grain, Kodak Portra 400 color science',
  'natural micro imperfections, slight organic lens vignette',
  'authentic mixed color temperature lighting, not studio-perfect',
  'real photographic bokeh with lens artifacts',
  'editorial photography for independent lifestyle magazine',
  'analog photography warmth, hand-developed film aesthetic',
  'natural skin texture visible, no AI smoothing',
];

function buildPrompt(title, type, keywords) {
  const allText = `${title} ${keywords}`;
  const matched = [];

  for (const [key, value] of Object.entries(TOPIC_ELEMENTS)) {
    if (allText.includes(key)) matched.push(value);
  }

  if (matched.length === 0) {
    matched.push('mystical crystals, dried sage bundle, vintage brass accessories');
  }

  const elements = matched.slice(0, 3).join(', ');

  const templates = STYLE_TEMPLATES[type] || STYLE_TEMPLATES.narrative;
  const template = templates[Math.floor(Math.random() * templates.length)];

  let prompt = template.replace('{elements}', elements);

  const shuffled = [...ANTI_AI_MODIFIERS].sort(() => Math.random() - 0.5);
  prompt += `, ${shuffled.slice(0, 2).join(', ')}`;

  prompt += ', portrait orientation 3:4 vertical composition, absolutely NO text on image, NO watermark, NO logo, NO words, NO letters, NO numbers overlaid';

  return prompt;
}

// ================================================================
//  Gemini API 调用
// ================================================================

async function generateCover(prompt, outputPath) {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  console.log('🎨 生成封面中...');
  console.log(`📐 模型: ${MODEL}`);
  console.log(`🖼️  风格: ${prompt.slice(0, 80)}...`);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  });

  let imageFound = false;

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, 'base64');

      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(outputPath, buffer);
      imageFound = true;

      const sizeKB = (buffer.length / 1024).toFixed(1);
      console.log(`✅ 封面已保存: ${outputPath} (${sizeKB} KB)`);
      break;
    }
  }

  if (!imageFound) {
    for (const part of response.candidates[0].content.parts) {
      if (part.text) console.log('⚠️ API 文本响应:', part.text);
    }
    throw new Error('Gemini API 未返回图片数据，请检查模型是否支持图片生成');
  }
}

// ================================================================
//  主流程
// ================================================================

async function main() {
  const { title, type, output, keywords } = parseArgs();

  console.log('\n📷 小红书封面生成器');
  console.log(`   标题: ${title}`);
  console.log(`   类型: ${type}`);
  console.log(`   输出: ${output}`);
  if (keywords) console.log(`   关键词: ${keywords}`);
  console.log('');

  const prompt = buildPrompt(title, type, keywords);
  await generateCover(prompt, output);
}

main().catch(err => {
  console.error('❌ 封面生成失败:', err.message);
  process.exit(1);
});
