#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
通用自动化发布脚本 - 支持命令行参数
用法:
  python auto_publish.py                                    # 使用默认测试内容
  python auto_publish.py content/queue/2026-02-07/midday   # 指定内容目录
  python auto_publish.py --time-slot morning               # 使用今日morning内容
"""
import asyncio
import json
import sys
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright


async def auto_publish(content_dir=None):
    """
    完全自动化发布

    Args:
        content_dir: 内容目录路径，默认为 content/drafts/test_publish
    """

    # 默认内容目录
    project_root = Path(__file__).parent.parent.parent
    if content_dir is None:
        content_dir = project_root / 'output' / 'drafts' / 'test_publish'
    else:
        content_dir = Path(content_dir)

    if not content_dir.exists():
        print(f"[ERROR] Content directory not found: {content_dir}")
        return False

    # 读取元数据（如果存在）
    metadata_file = content_dir / 'metadata.json'
    if metadata_file.exists():
        with open(metadata_file, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
            title = metadata.get('title', '今日分享')

        # 读取内容
        content_file = content_dir / 'content.md'
        if content_file.exists():
            with open(content_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # 提取描述（去掉frontmatter）
            lines = content.split('\n')
            description_lines = []
            in_frontmatter = False
            for line in lines:
                if line.strip() == '---':
                    in_frontmatter = not in_frontmatter
                    continue
                if not in_frontmatter and line.strip():
                    description_lines.append(line)

            description = '\n'.join(description_lines)
        else:
            description = "今日分享"
    else:
        # 使用默认内容
        title = "今日运势来啦"
        description = """💫 今日运势

白羊座运势4.5分！适合主动出击
金牛座运势4分，财运不错

✨ 幸运颜色：天蓝色
✨ 幸运数字：7

想了解更多？我平时在 destinyteller.com 上查看~

#今日运势 #星座运程 #塔罗占卜 #每日运势 #命理"""

    # 查找所有图片
    images = []

    # 优先使用 cover.png
    if (content_dir / 'cover.png').exists():
        images.append(str((content_dir / 'cover.png').absolute()))

    # 然后添加卡片图片
    for i in range(1, 20):
        card_file = content_dir / f'card_{i}.png'
        if card_file.exists():
            images.append(str(card_file.absolute()))
        else:
            break

    if not images:
        print(f"[ERROR] No images found in: {content_dir}")
        return False

    print("\n" + "="*60)
    print("[AUTO-PUBLISH] Starting automation...")
    print("="*60)
    print(f"[INFO] Content dir: {content_dir}")
    try:
        print(f"[INFO] Title: {title}")
        print(f"[INFO] Images: {len(images)}")
        desc_preview = description[:100] if len(description) > 100 else description
        print(f"[INFO] Description preview: {desc_preview}...")
    except UnicodeEncodeError:
        # Windows console encoding issue
        print(f"[INFO] Title: [Chinese characters]")
        print(f"[INFO] Images: {len(images)}")
        print(f"[INFO] Description: [Chinese content]")

    async with async_playwright() as p:
        # 启动浏览器
        print("\n[1/7] Launching browser...")
        browser = await p.chromium.launch(
            headless=False,
            channel='chrome',
            slow_mo=500,
            args=['--disable-blink-features=AutomationControlled']
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

        # 注入反检测脚本
        await page.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
        });
        window.navigator.chrome = {
            runtime: {},
        };
        """)

        try:
            # 访问图文发布页面
            print("\n[2/7] Loading image-text publish page...")
            await page.goto('https://creator.xiaohongshu.com/publish/publish?from=tab_switch', timeout=30000)
            await page.wait_for_load_state('networkidle')
            await asyncio.sleep(2)

            # 强制点击"上传图文"标签（使用JavaScript）
            print("\n[3/7] Switching to image-text tab...")
            try:
                # 使用JavaScript直接点击第二个标签
                await page.evaluate("""
                    () => {
                        const tabs = document.querySelectorAll('.tab-item, .tab, [class*="tab"]');
                        // 找到包含"上传图文"文本的标签
                        for (let tab of tabs) {
                            if (tab.textContent.includes('上传图文')) {
                                tab.click();
                                return true;
                            }
                        }
                        // 如果没找到，尝试点击第二个标签（通常是图文）
                        if (tabs.length >= 2) {
                            tabs[1].click();
                            return true;
                        }
                        return false;
                    }
                """)
                await asyncio.sleep(3)
                print("  [OK] Clicked '上传图文' tab via JavaScript")

                # 等待图文上传界面加载
                await page.wait_for_selector('input[type="file"]', timeout=5000)
                print("  [OK] Image-text upload interface loaded")
            except Exception as e:
                print(f"  [WARN] Tab switch may have failed: {str(e)[:100]}")
                # 继续执行，稍后会看到是否成功

            print("\n[4/7] Page ready for upload...")

            # 截图验证
            screenshot1 = f'logs/step1_ready_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot1)
            print(f"  [INFO] Screenshot: {screenshot1}")

            # 上传图片（在切换标签后重新查找file input）
            print(f"\n[5/7] Uploading {len(images)} images...")

            # 重新等待并查找file input元素
            await asyncio.sleep(1)
            file_input = page.locator('input[type="file"]').first

            for i, img in enumerate(images):
                print(f"  [{i+1}/{len(images)}] {Path(img).name}")
                await file_input.set_input_files(img)
                await asyncio.sleep(3)  # 增加等待时间，让图片上传完成

            print("  [OK] All images uploaded")
            await asyncio.sleep(3)

            # 截图验证
            screenshot2 = f'logs/step2_images_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot2)
            print(f"  [INFO] Screenshot: {screenshot2}")

            # 填写内容
            print("\n[6/7] Filling content...")

            # 点击编辑区
            await page.mouse.click(500, 400)
            await asyncio.sleep(1)

            # 输入内容
            await page.keyboard.type(description, delay=30)
            print("  [OK] Content filled")
            await asyncio.sleep(2)

            # 截图验证
            screenshot3 = f'logs/step3_content_{datetime.now().strftime("%H%M%S")}.png'
            await page.screenshot(path=screenshot3)
            print(f"  [INFO] Screenshot: {screenshot3}")

            # 查找并点击发布按钮
            print("\n[7/7] Publishing...")
            await asyncio.sleep(2)

            # 尝试多种发布按钮选择器
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
                        await btn.click()
                        print(f"  [OK] Clicked: {selector}")
                        publish_clicked = True
                        break
                except:
                    continue

            if not publish_clicked:
                print("  [WARN] Button not found, using Tab navigation...")
                for _ in range(5):
                    await page.keyboard.press('Tab')
                    await asyncio.sleep(0.3)
                await page.keyboard.press('Enter')

            # 等待发布完成
            print("\n[8/8] Waiting for publish to complete...")
            await asyncio.sleep(8)

            # 检查发布结果
            current_url = page.url
            screenshot_final = f'logs/final_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
            await page.screenshot(path=screenshot_final)

            # 判断是否成功（多种成功标志）
            success = (
                'published' in current_url or  # URL包含published参数
                'note-manager' in current_url or  # 跳转到笔记管理页面
                'creator/notes' in current_url  # 跳转到笔记列表页面
            )

            print("\n" + "="*60)
            if success:
                print("[SUCCESS] Content published to Xiaohongshu!")
            else:
                print("[INFO] Publish may be successful (please verify)")
            print("="*60)
            print(f"[INFO] Final URL: {current_url}")
            print(f"[INFO] Screenshot: {screenshot_final}")

            # 保存发布日志
            publish_log = {
                'timestamp': datetime.now().isoformat(),
                'content_dir': str(content_dir),
                'title': title,
                'images_count': len(images),
                'success': success,
                'final_url': current_url,
                'screenshot': screenshot_final
            }

            log_file = Path(f'logs/publish_log_{datetime.now().strftime("%Y%m%d")}.json')
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

            return success

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

            return False

        finally:
            print("\n[INFO] Closing browser...")
            await browser.close()
            print("[DONE]")


if __name__ == '__main__':
    # 解析命令行参数
    content_dir = None

    if len(sys.argv) > 1:
        arg = sys.argv[1]

        # 支持 --time-slot 参数
        if arg == '--time-slot' and len(sys.argv) > 2:
            time_slot = sys.argv[2]
            today = datetime.now().strftime('%Y-%m-%d')
            content_dir = f'output/queue/{today}/{time_slot}'
            print(f"[INFO] Using {time_slot} content from {today}")
        else:
            content_dir = arg
            print(f"[INFO] Using content directory: {content_dir}")
    else:
        print("[INFO] Using default test content")

    success = asyncio.run(auto_publish(content_dir))
    sys.exit(0 if success else 1)
