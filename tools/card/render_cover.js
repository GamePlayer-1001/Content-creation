#!/usr/bin/env node
/**
 * 封面渲染脚本 - 直接渲染HTML为PNG
 * 支持 Lucide Icons
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderCover(htmlPath, outputPath) {
    console.log(`\n🎨 渲染封面: ${htmlPath}`);

    // 启动浏览器
    const browser = await chromium.launch({
        headless: true
    });

    const context = await browser.newContext({
        viewport: { width: 1080, height: 1440 },
        deviceScaleFactor: 2
    });

    const page = await context.newPage();

    try {
        // 读取HTML文件
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // 加载HTML
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle'
        });

        // 等待 Lucide Icons 加载
        await page.waitForTimeout(2000);

        // 截图
        const outputFile = outputPath || htmlPath.replace('.html', '.png');
        await page.screenshot({
            path: outputFile,
            fullPage: false
        });

        console.log(`✅ 封面已生成: ${outputFile}`);

        return outputFile;

    } catch (error) {
        console.error(`❌ 渲染失败: ${error.message}`);
        throw error;
    } finally {
        await browser.close();
    }
}

// 命令行使用
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('用法: node render_cover.js <html文件> [输出路径]');
        console.log('示例: node render_cover.js content/drafts/test_publish/cover_with_icons.html');
        process.exit(1);
    }

    const htmlPath = args[0];
    const outputPath = args[1];

    renderCover(htmlPath, outputPath)
        .then(() => {
            console.log('✨ 完成！');
            process.exit(0);
        })
        .catch(error => {
            console.error('错误:', error);
            process.exit(1);
        });
}

module.exports = { renderCover };
