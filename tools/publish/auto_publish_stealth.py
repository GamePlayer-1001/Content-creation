#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
隐秘模式自动化发布到小红书
使用多种反检测技术绕过自动化检测
"""
import asyncio
import json
import random
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright


async def random_delay(min_sec=1, max_sec=3):
    """随机延迟，模拟人类操作"""
    delay = random.uniform(min_sec, max_sec)
    await asyncio.sleep(delay)


async def human_like_type(page, text, element=None):
    """模拟人类打字速度"""
    if element:
        await element.click()
        await random_delay(0.3, 0.8)

    for char in text:
        await page.keyboard.type(char, delay=random.randint(50, 150))
        # 偶尔停顿（模拟思考）
        if random.random() < 0.1:
            await asyncio.sleep(random.uniform(0.3, 1.0))


async def human_like_mouse_move(page, x, y):
    """模拟人类鼠标移动"""
    # 添加随机偏移
    x_offset = random.randint(-5, 5)
    y_offset = random.randint(-5, 5)
    await page.mouse.move(x + x_offset, y + y_offset)
    await random_delay(0.1, 0.3)


async def auto_publish_stealth():
    """隐秘模式自动发布"""

    # 准备内容
    project_root = Path(__file__).parent.parent.parent
    content_dir = project_root / 'output' / 'drafts' / 'test_publish'

    title = "今日运势来啦"
    description = """💫 今日运势

白羊座运势4.5分！适合主动出击
金牛座运势4分，财运不错

✨ 幸运颜色：天蓝色
✨ 幸运数字：7

想了解更多？我平时在 destinyteller.com 上查看~

#今日运势 #星座运程 #塔罗占卜 #每日运势 #命理"""

    images = [
        str((content_dir / 'cover.png').absolute()),
        str((content_dir / 'card_1.png').absolute()),
        str((content_dir / 'card_2.png').absolute())
    ]

    print("\n" + "="*60)
    print("[STEALTH MODE] Anti-detection publishing")
    print("="*60)

    async with async_playwright() as p:
        print("\n[1/7] Launching browser with stealth settings...")

        # 启动浏览器 - 使用隐秘参数
        browser = await p.chromium.launch(
            headless=False,
            channel='chrome',
            args=[
                '--disable-blink-features=AutomationControlled',  # 禁用自动化标识
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ]
        )

        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            locale='zh-CN',
            timezone_id='Asia/Shanghai',
            # 添加真实的浏览器特征
            extra_http_headers={
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        )

        # 加载 Cookie
        cookie_file = project_root / 'config' / 'xhs_cookies.json'
        if cookie_file.exists():
            with open(cookie_file, 'r') as f:
                cookies = json.load(f)
                await context.add_cookies(cookies)

        page = await context.new_page()

        # 注入反检测脚本
        await page.add_init_script("""
        // 移除 webdriver 标识
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
        });

        // 覆盖 Chrome 自动化标识
        window.navigator.chrome = {
            runtime: {},
        };

        // 覆盖 permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );

        // 覆盖 plugins 长度
        Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5]
        });

        // 覆盖 languages
        Object.defineProperty(navigator, 'languages', {
            get: () => ['zh-CN', 'zh', 'en']
        });
        """)

        try:
            # 访问发布页面
            print("\n[2/7] Loading publish page...")
            await page.goto('https://creator.xiaohongshu.com/publish/publish?from=tab_switch', timeout=30000)
            await page.wait_for_load_state('networkidle')

            # 随机等待（模拟人类阅读页面）
            await random_delay(2, 4)

            # 随机移动鼠标（模拟浏览）
            for _ in range(3):
                x = random.randint(200, 800)
                y = random.randint(200, 600)
                await page.mouse.move(x, y)
                await random_delay(0.3, 0.8)

            print("\n[3/7] Page loaded, simulating human behavior...")

            # 截图
            screenshot1 = f'logs/stealth_step1_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot1)
            print(f"  [INFO] Screenshot: {screenshot1}")

            # 上传图片 - 添加随机延迟
            print("\n[4/7] Uploading images with random delays...")
            file_input = page.locator('input[type="file"]').first

            for i, img in enumerate(images):
                print(f"  [{i+1}/{len(images)}] {Path(img).name}")

                # 鼠标移动到上传区域附近
                await human_like_mouse_move(page, 400, 350)

                # 上传
                await file_input.set_input_files(img)

                # 随机等待（每张图片间隔）
                await random_delay(2, 4)

            print("  [OK] All images uploaded")

            # 额外等待图片处理
            await random_delay(3, 5)

            # 截图
            screenshot2 = f'logs/stealth_step2_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot2)
            print(f"  [INFO] Screenshot: {screenshot2}")

            # 填写内容 - 模拟人类打字
            print("\n[5/7] Filling content like a human...")

            # 鼠标移动到编辑区
            await human_like_mouse_move(page, 500, 400)
            await random_delay(0.5, 1.0)

            # 点击编辑器
            await page.mouse.click(500, 400)
            await random_delay(0.8, 1.5)

            # 模拟人类打字
            print("  [INFO] Typing title...")
            await human_like_type(page, title)

            # 停顿（模拟思考）
            await random_delay(1, 2)

            # 按回车换行
            await page.keyboard.press('Enter')
            await random_delay(0.5, 1.0)
            await page.keyboard.press('Enter')

            # 输入描述
            print("  [INFO] Typing description...")

            # 分段输入（更像人类）
            lines = description.split('\n')
            for line in lines:
                if line.strip():
                    await human_like_type(page, line)
                await page.keyboard.press('Enter')
                await random_delay(0.3, 0.8)

            print("  [OK] Content filled")

            # 停顿检查内容
            await random_delay(2, 4)

            # 截图
            screenshot3 = f'logs/stealth_step3_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot3)
            print(f"  [INFO] Screenshot: {screenshot3}")

            # 移动鼠标到发布按钮区域
            print("\n[6/7] Looking for publish button...")
            await random_delay(1, 2)

            # 模拟鼠标寻找按钮的过程
            await page.mouse.move(1300, 700)
            await random_delay(0.3, 0.6)
            await page.mouse.move(1400, 750)
            await random_delay(0.3, 0.6)

            # 查找发布按钮
            publish_clicked = False
            publish_selectors = [
                'button:has-text("发布笔记")',
                'button:has-text("发布")',
                '.css-k3hpw:has-text("发布")',
                'button[type="button"]:has-text("发布")'
            ]

            for selector in publish_selectors:
                try:
                    btn = page.locator(selector).first
                    if await btn.is_visible(timeout=2000):
                        # 获取按钮位置
                        box = await btn.bounding_box()
                        if box:
                            # 移动到按钮
                            await page.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
                            await random_delay(0.3, 0.6)

                            # 点击
                            await btn.click()
                            print(f"  [OK] Clicked: {selector}")
                            publish_clicked = True
                            break
                except:
                    continue

            if not publish_clicked:
                print("  [WARN] Manual publish may be needed")

            # 等待发布完成
            print("\n[7/7] Waiting for publish to complete...")
            await random_delay(5, 8)

            # 检查结果
            current_url = page.url
            screenshot_final = f'logs/stealth_final_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
            await page.screenshot(path=screenshot_final)

            # 判断成功
            success = 'published' in current_url

            print("\n" + "="*60)
            if success:
                print("[SUCCESS] Content published!")
            else:
                print("[INFO] Please verify publish status")
            print("="*60)
            print(f"[INFO] URL: {current_url}")
            print(f"[INFO] Screenshot: {screenshot_final}")

            # 保存日志
            publish_log = {
                'timestamp': datetime.now().isoformat(),
                'title': title,
                'images_count': len(images),
                'success': success,
                'final_url': current_url,
                'screenshot': screenshot_final,
                'mode': 'stealth'
            }

            log_file = Path(f'logs/publish_log_{datetime.now().strftime("%Y%m%d")}.json')
            logs = []
            if log_file.exists():
                with open(log_file, 'r', encoding='utf-8') as f:
                    logs = json.load(f)
            logs.append(publish_log)
            with open(log_file, 'w', encoding='utf-8') as f:
                json.dump(logs, f, ensure_ascii=False, indent=2)

            # 保持页面打开一段时间（更像人类）
            await random_delay(5, 10)

        except Exception as e:
            print(f"\n[ERROR] {str(e)[:100]}")
            import traceback
            traceback.print_exc()

            try:
                error_screenshot = f'logs/stealth_error_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
                await page.screenshot(path=error_screenshot)
                print(f"[INFO] Error screenshot: {error_screenshot}")
            except:
                pass

        finally:
            print("\n[INFO] Closing browser...")
            await browser.close()
            print("[DONE]")


if __name__ == '__main__':
    asyncio.run(auto_publish_stealth())
