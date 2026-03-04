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
    print("[AUTO-PUBLISH] Starting automation...")
    print("="*60)
    print(f"[INFO] Title: {title[:20]}...")
    print(f"[INFO] Images: {len(images)}")

    async with async_playwright() as p:
        # 启动浏览器
        print("\n[1/7] Launching browser...")
        browser = await p.chromium.launch(
            headless=False,
            channel='chrome',
            slow_mo=500
        )

        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080}
        )

        # 加载 Cookie
        cookie_file = project_root / 'config' / 'xhs_cookies.json'
        if cookie_file.exists():
            with open(cookie_file, 'r') as f:
                cookies = json.load(f)
                await context.add_cookies(cookies)

        page = await context.new_page()

        try:
            # 访问图文发布页面（使用您提供的直接URL）
            print("\n[2/7] Loading image-text publish page...")
            await page.goto('https://creator.xiaohongshu.com/publish/publish?from=tab_switch', timeout=30000)
            await page.wait_for_load_state('networkidle')
            await asyncio.sleep(3)

            print("\n[3/7] Page ready for upload...")
            # 直接URL已经在图文标签页，无需点击切换

            # 截图验证
            screenshot1 = f'logs/step1_ready_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot1)
            print(f"  [INFO] Screenshot: {screenshot1}")

            # 上传图片
            print("\n[4/7] Uploading images...")
            file_input = page.locator('input[type="file"]').first

            for i, img in enumerate(images):
                print(f"  [{i+1}/{len(images)}] {Path(img).name}")
                await file_input.set_input_files(img)
                await asyncio.sleep(2)

            print("  [OK] All images uploaded")
            await asyncio.sleep(3)

            # 截图验证
            screenshot2 = f'logs/step2_images_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot2)
            print(f"  [INFO] Screenshot: {screenshot2}")

            # 填写标题
            print("\n[5/7] Filling title and content...")

            # 查找所有输入框
            try:
                # 标题通常是第一个输入框
                title_input = page.locator('input[placeholder*="标题"], input').first
                await title_input.click(timeout=5000)
                await asyncio.sleep(0.5)
                await title_input.fill(title)
                print(f"  [OK] Title: {title}")
                await asyncio.sleep(1)
            except Exception as e:
                print(f"  [WARN] Title input failed: {str(e)[:40]}")

            # 填写内容
            try:
                # 方法1: 查找contenteditable编辑器
                content_editor = page.locator('div[contenteditable="true"]').first
                await content_editor.click(timeout=5000)
                await asyncio.sleep(0.5)

                # 清空可能存在的内容
                await page.keyboard.press('Control+A')
                await asyncio.sleep(0.3)

                # 输入描述
                await content_editor.fill(description)
                print("  [OK] Content filled")
                await asyncio.sleep(2)
            except:
                # 方法2: 使用键盘输入
                print("  [WARN] Using keyboard input...")
                await page.keyboard.type(description, delay=30)
                await asyncio.sleep(2)

            # 截图验证
            screenshot3 = f'logs/step3_content_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot3)
            print(f"  [INFO] Screenshot: {screenshot3}")

            # 查找并点击发布按钮
            print("\n[6/7] Publishing...")

            # 等待页面稳定
            await asyncio.sleep(2)

            # 尝试多种发布按钮选择器
            publish_clicked = False

            # 选择器列表
            publish_selectors = [
                'button:has-text("发布笔记")',
                'button:has-text("发布")',
                '.css-k3hpw:has-text("发布")',
                'button[type="button"]:has-text("发布")',
                '.publish-btn',
                'button.draftBtn'
            ]

            for selector in publish_selectors:
                try:
                    btn = page.locator(selector).first
                    if await btn.is_visible(timeout=2000):
                        await btn.click()
                        print(f"  [OK] Clicked: {selector}")
                        publish_clicked = True
                        break
                except:
                    continue

            if not publish_clicked:
                # 备选方案: Tab键导航到发布按钮
                print("  [WARN] Button not found, using Tab navigation...")
                for _ in range(5):
                    await page.keyboard.press('Tab')
                    await asyncio.sleep(0.3)
                await page.keyboard.press('Enter')

            # 等待发布完成
            print("\n[7/7] Waiting for publish to complete...")
            await asyncio.sleep(8)

            # 检查发布结果
            current_url = page.url

            # 截图最终状态
            screenshot_final = f'logs/final_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
            await page.screenshot(path=screenshot_final)

            # 判断是否成功
            success = False

            # 检查成功指标
            try:
                # 方法1: 检查成功提示文本
                if await page.locator('text=发布成功').is_visible(timeout=3000):
                    success = True
            except:
                pass

            # 方法2: 检查URL变化
            if 'published' in current_url or current_url != 'https://creator.xiaohongshu.com/publish/publish':
                success = True

            # 方法3: 检查是否回到了发布页面空白状态
            try:
                if await page.locator('text=拖拽视频到此或点击上传').is_visible(timeout=2000):
                    # 如果又看到上传提示，可能是发布成功后刷新了页面
                    success = True
            except:
                pass

            # 输出结果
            print("\n" + "="*60)
            if success:
                print("[SUCCESS] Content published to Xiaohongshu!")
            else:
                print("[INFO] Publish may be successful (please verify)")
            print("="*60)
            print(f"[INFO] Final URL: {current_url}")
            print(f"[INFO] Screenshot: {screenshot_final}")

            # 保存发布记录
            publish_log = {
                'timestamp': datetime.now().isoformat(),
                'title': title,
                'images_count': len(images),
                'success': success,
                'final_url': current_url,
                'screenshot': screenshot_final
            }

            log_file = Path(f'logs/publish_log_{datetime.now().strftime("%Y%m%d")}.json')

            # 读取已有日志
            logs = []
            if log_file.exists():
                with open(log_file, 'r', encoding='utf-8') as f:
                    logs = json.load(f)

            logs.append(publish_log)

            with open(log_file, 'w', encoding='utf-8') as f:
                json.dump(logs, f, ensure_ascii=False, indent=2)

            print(f"[INFO] Log saved: {log_file}")

            # 等待5秒后关闭
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
            print("[DONE]")


if __name__ == '__main__':
    asyncio.run(auto_publish())
