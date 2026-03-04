#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
完全自动化发布到小红书
使用 Playwright 实现真正的自动化
"""
import asyncio
import json
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright


async def auto_publish():
    """完全自动化发布"""

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
    print("[INFO] Auto-publish to Xiaohongshu")
    print("="*60)
    print(f"[INFO] Title: {title}")
    print(f"[INFO] Images: {len(images)}")

    async with async_playwright() as p:
        # 启动浏览器
        print("\n[1/5] 启动浏览器...")
        browser = await p.chromium.launch(
            headless=False,  # 可见模式，方便调试
            channel='chrome',
            slow_mo=500  # 减慢操作，模拟人类
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
            # 访问图文发布页面
            print("\n[2/5] 访问图文发布页...")
            await page.goto('https://creator.xiaohongshu.com/publish/publish', timeout=30000)
            await page.wait_for_load_state('networkidle')
            await asyncio.sleep(2)

            # 点击"上传图文"标签
            try:
                image_text_tab = page.locator('text=上传图文').first
                await image_text_tab.click()
                print("  [OK] Clicked '上传图文' tab")
                await asyncio.sleep(2)
            except Exception as e:
                print(f"  [WARN] Tab click failed: {str(e)[:50]}")

            # 上传图片
            print("\n[3/5] 上传图片...")
            file_input = page.locator('input[type="file"]').first

            # 逐张上传（更稳定）
            for i, img in enumerate(images):
                print(f"  上传第 {i+1}/{len(images)} 张...")
                await file_input.set_input_files(img)
                await asyncio.sleep(2)

            print(f"[OK] {len(images)} 张图片上传完成")
            await asyncio.sleep(3)

            # 填写内容
            print("\n[4/5] 填写内容...")

            # 尝试多种方式定位编辑器
            editor = None

            # 方式1: 通过标题输入框
            try:
                # 等待标题输入框出现
                title_input = page.locator('input[placeholder*="填写标题"], input[placeholder*="标题"]').first
                await title_input.wait_for(timeout=5000)
                await title_input.click()
                await asyncio.sleep(0.5)
                await title_input.fill(title)
                print("  [OK] Title filled")
                await asyncio.sleep(1)
            except Exception as e:
                print(f"  [WARN] Title input not found: {str(e)[:50]}")

            # 方式2: 通过 contenteditable div
            try:
                # 等待页面稳定
                await asyncio.sleep(2)

                # 尝试找到内容编辑器
                content_editor = page.locator('div[contenteditable="true"], textarea[placeholder*="内容"], div[data-placeholder*="内容"]').first
                try:
                    await content_editor.wait_for(timeout=3000)
                    await content_editor.click()
                    await asyncio.sleep(0.5)
                    await content_editor.fill(description)
                    print("  [OK] Content filled via editor")
                except:
                    # 备选方案: 鼠标点击 + 键盘输入
                    await page.mouse.click(500, 400)
                    await asyncio.sleep(1)
                    await page.keyboard.type(description, delay=50)
                    print("  [OK] Content filled via keyboard")

            except Exception as e:
                print(f"  [ERROR] Auto-fill failed: {str(e)[:50]}")

            await asyncio.sleep(3)

            # 点击发布
            print("\n[5/5] Looking for publish button...")

            # 等待按钮出现
            await asyncio.sleep(2)

            # 尝试多种选择器
            publish_selectors = [
                'button:has-text("发布笔记")',
                'button:has-text("发布")',
                'button:text("发布")',
                'button[class*="publish"]',
                'button[class*="submit"]',
                '.publish-btn',
                '.draftBtn',
                'button.css-k3hpw'
            ]

            published = False
            for selector in publish_selectors:
                try:
                    btn = page.locator(selector).first
                    if await btn.is_visible(timeout=2000):
                        await btn.click()
                        print(f"[OK] Clicked publish: {selector}")
                        published = True
                        break
                except:
                    continue

            if not published:
                print("[WARN] Publish button not found, trying Tab + Enter...")
                await page.keyboard.press('Tab')
                await asyncio.sleep(0.5)
                await page.keyboard.press('Tab')
                await asyncio.sleep(0.5)
                await page.keyboard.press('Enter')

            # 等待发布完成
            print("\n[INFO] Waiting for publish to complete...")
            await asyncio.sleep(5)

            # 检查是否成功
            try:
                # 等待成功提示或 URL 变化
                success_indicators = [
                    page.locator('text=发布成功'),
                    page.locator('text=发布成功'),
                    page.locator('.success')
                ]

                success = False
                for indicator in success_indicators:
                    try:
                        await indicator.wait_for(timeout=3000)
                        success = True
                        break
                    except:
                        continue

                if success or 'published' in page.url:
                    print("\n" + "="*60)
                    print("[SUCCESS] Published to Xiaohongshu!")
                    print("="*60)
                    print(f"[INFO] URL: {page.url}")
                else:
                    print("\n[INFO] Publish may be successful")
                    print(f"[INFO] Current URL: {page.url}")

            except Exception as e:
                print(f"\n[WARN] Could not verify: {str(e)[:50]}")
                print(f"[INFO] Current URL: {page.url}")

            # 截图保存
            screenshot_path = f'logs/publish_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
            await page.screenshot(path=screenshot_path)
            print(f"[INFO] Screenshot saved: {screenshot_path}")

            # 等待几秒后关闭
            await asyncio.sleep(5)

        except Exception as e:
            print(f"\n[ERROR] {str(e)[:100]}")
            import traceback
            traceback.print_exc()

            # 保存错误截图
            try:
                error_screenshot = f'logs/error_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
                await page.screenshot(path=error_screenshot)
                print(f"[INFO] Error screenshot: {error_screenshot}")
            except:
                pass

        finally:
            print("\n[INFO] Closing browser...")
            await browser.close()
            print("[INFO] Done!")


if __name__ == '__main__':
    asyncio.run(auto_publish())
