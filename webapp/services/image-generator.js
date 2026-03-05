/**
 * [INPUT]: 依赖 https (Google Generative AI API)
 * [OUTPUT]: 对外提供 ImageGenerator 类 (generate 方法)
 * [POS]: services/ 的图片生成核心, 封装 Nano Banana Pro API
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class ImageGenerator {
  constructor(apiKey, outputDir) {
    this.apiKey = apiKey;
    this.outputDir = outputDir;
    this.model = 'gemini-3-pro-image-preview';
    this.endpoint = `generativelanguage.googleapis.com`;
    this.basePath = `/v1beta/models/${this.model}:generateContent`;
  }

  // ============================================================
  //  核心生成: prompt → base64 图片
  // ============================================================
  async generate(prompt, options = {}) {
    const { aspectRatio = '1:1' } = options;

    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio },
      },
    });

    const data = await this._request(body);

    // 从响应中提取 base64 图片
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);

    if (!imagePart) {
      throw new Error('API 未返回图片数据');
    }

    return {
      base64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png',
    };
  }

  // ============================================================
  //  生成并保存到磁盘
  // ============================================================
  async generateAndSave(prompt, platform, topic, index = 0, options = {}) {
    const result = await this.generate(prompt, options);

    // 确保输出目录
    const dir = path.join(this.outputDir, '图片', platform);
    fs.mkdirSync(dir, { recursive: true });

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const safeTopic = (topic || 'image').replace(/[<>:"/\\|?*]/g, '_').slice(0, 20);
    const ext = result.mimeType.includes('png') ? 'png' : 'jpg';
    const filename = `${today}-${safeTopic}-${platform}-${index}.${ext}`;

    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, Buffer.from(result.base64, 'base64'));

    return {
      filename,
      path: `图片/${platform}/${filename}`,
      fullPath: filePath,
    };
  }

  // ============================================================
  //  HTTPS 请求封装
  // ============================================================
  _request(body) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.endpoint,
        port: 443,
        path: `${this.basePath}?key=${this.apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      };

      const req = https.request(options, (res) => {
        let chunks = '';
        res.on('data', c => chunks += c);
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`Nano Banana Pro API ${res.statusCode}: ${chunks.slice(0, 300)}`));
            return;
          }
          try {
            resolve(JSON.parse(chunks));
          } catch (e) {
            reject(new Error(`响应解析失败: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(60000, () => {
        req.destroy();
        reject(new Error('图片生成超时 (60s)'));
      });
      req.write(body);
      req.end();
    });
  }
}

module.exports = ImageGenerator;
