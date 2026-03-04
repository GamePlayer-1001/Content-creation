#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
简化的测试发布脚本 - 用于调试选择器
"""
import asyncio
import json
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright


async def test_publish():
    """测试发布流程"""

    # 准备内容
    content_dir = Path('content/drafts/test_publish')

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
    print("[TEST] Xiaohongshu Auto-Publish Test")
    print("="*60)

    async with async_playwright() as p:
        print("\n[1/6] Launching browser...")
        browser = await p.chromium.launch(
            headless=False,
            channel='chrome',
            slow_mo=1000  # 慢动作，便于观察
        )

        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080}
        )

        # 加载 Cookie
        cookie_file = Path('automation/config/xhs_cookies.json')
        if cookie_file.exists():
            with open(cookie_file, 'r') as f:
                cookies = json.load(f)
                await context.add_cookies(cookies)

        page = await context.new_page()

        try:
            # 访问发布页面
            print("\n[2/6] Loading publish page...")
            await page.goto('https://creator.xiaohongshu.com/publish/publish', timeout=30000)
            await page.wait_for_load_state('networkidle')
            await asyncio.sleep(3)

            # 打印页面标题和 URL
            print(f"[INFO] Page title: {await page.title()}")
            print(f"[INFO] Current URL: {page.url}")

            # 检查页面上可见的标签
            print("\n[3/6] Checking visible tabs...")
            try:
                tabs = await page.locator('button, div[role="tab"], a').all()
                print(f"[INFO] Found {len(tabs)} potential tabs")
                for i, tab in enumerate(tabs[:10]):  # 只检查前10个
                    try:
                        text = await tab.inner_text()
                        if text.strip():
                            print(f"  Tab {i}: {text.strip()}")
                    except:
                        pass
            except:
                print("[WARN] Could not enumerate tabs")

            # 尝试点击"上传图文"
            print("\n[4/6] Trying to click image-text tab...")
            tab_clicked = False
            try:
                # 方法1: 精确文本匹配
                tab = page.get_by_text("上传图文", exact=True)
                await tab.click(timeout=5000)
                print("[OK] Clicked via get_by_text")
                tab_clicked = True
            except:
                pass

            if not tab_clicked:
                try:
                    # 方法2: 包含文本
                    tab = page.locator('text="上传图文"').first
                    await tab.click(timeout=5000)
                    print("[OK] Clicked via locator text")
                    tab_clicked = True
                except:
                    pass

            if not tab_clicked:
                print("[WARN] Could not click tab automatically")
                print("[INFO] Please manually click '上传图文' tab in browser")
                await asyncio.sleep(5)

            await asyncio.sleep(2)

            # 截图
            screenshot1 = f'logs/test_step1_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot1)
            print(f"[INFO] Screenshot 1: {screenshot1}")

            # 上传图片
            print("\n[5/6] Uploading images...")
            file_input = page.locator('input[type="file"]').first

            for i, img in enumerate(images):
                print(f"  Uploading {i+1}/{len(images)}: {Path(img).name}")
                await file_input.set_input_files(img)
                await asyncio.sleep(2)

            print("[OK] All images uploaded")
            await asyncio.sleep(3)

            # 截图
            screenshot2 = f'logs/test_step2_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot2)
            print(f"[INFO] Screenshot 2: {screenshot2}")

            # 填写内容
            print("\n[6/6] Filling content...")

            # 尝试找到所有可编辑元素
            try:
                inputs = await page.locator('input, textarea, [contenteditable="true"]').all()
                print(f"[INFO] Found {len(inputs)} editable elements")

                for i, elem in enumerate(inputs[:5]):
                    try:
                        tag = await elem.evaluate('el => el.tagName')
                        placeholder = await elem.get_attribute('placeholder')
                        print(f"  Element {i}: {tag}, placeholder={placeholder}")
                    except:
                        pass
            except:
                print("[WARN] Could not enumerate inputs")

            # 填写标题
            try:
                title_input = page.locator('input[placeholder*="标题"]').first
                await title_input.click()
                await title_input.fill(title)
                print(f"[OK] Title filled: {title}")
            except Exception as e:
                print(f"[WARN] Title fill failed: {str(e)[:50]}")

            await asyncio.sleep(1)

            # 填写描述
            try:
                # 尝试contenteditable div
                content_editor = page.locator('div[contenteditable="true"]').first
                await content_editor.click()
                await content_editor.fill(description)
                print("[OK] Content filled via contenteditable")
            except:
                try:
                    # 尝试textarea
                    textarea = page.locator('textarea').first
                    await textarea.click()
                    await textarea.fill(description)
                    print("[OK] Content filled via textarea")
                except:
                    print("[WARN] Content fill failed, using keyboard")
                    await page.keyboard.type(description, delay=50)

            await asyncio.sleep(2)

            # 最终截图
            screenshot3 = f'logs/test_step3_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot3)
            print(f"[INFO] Screenshot 3: {screenshot3}")

            # 查找发布按钮
            print("\n[INFO] Looking for publish button...")
            try:
                buttons = await page.locator('button').all()
                print(f"[INFO] Found {len(buttons)} buttons on page")
                for i, btn in enumerate(buttons):
                    try:
                        text = await btn.inner_text()
                        if text.strip():
                            print(f"  Button {i}: {text.strip()}")
                    except:
                        pass
            except:
                print("[WARN] Could not enumerate buttons")

            # 等待用户确认
            print("\n" + "="*60)
            print("[INFO] Please check the browser window")
            print("[INFO] Press Ctrl+C to close when done")
            print("="*60)

            await asyncio.sleep(60)

        except Exception as e:
            print(f"\n[ERROR] {str(e)}")
            import traceback
            traceback.print_exc()

            # 错误截图
            try:
                error_screenshot = f'logs/test_error_{datetime.now().strftime("%H%M%S")}.png'
                await page.screenshot(path=error_screenshot)
                print(f"[INFO] Error screenshot: {error_screenshot}")
            except:
                pass

        finally:
            print("\n[INFO] Closing browser...")
            await browser.close()


if __name__ == '__main__':
    asyncio.run(test_publish())
