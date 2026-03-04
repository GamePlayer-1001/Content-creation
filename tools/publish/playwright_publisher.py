"""
Playwright 自动发布器
使用 Playwright 自动发布内容到小红书
"""
import asyncio
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
from playwright.async_api import async_playwright, Page, Browser


class PlaywrightPublisher:
    """Playwright 自动发布器"""

    def __init__(self, cookies_file: str = None):
        """
        初始化发布器

        Args:
            cookies_file: Cookie 存储文件路径
        """
        project_root = Path(__file__).parent.parent.parent
        self.cookies_file = Path(cookies_file) if cookies_file else project_root / 'config' / 'xhs_cookies.json'
        self.cookies_file.parent.mkdir(parents=True, exist_ok=True)

        # 加载选择器配置
        config_file = project_root / 'config' / 'selectors.json'
        if config_file.exists():
            with open(config_file, 'r', encoding='utf-8') as f:
                self.selectors = json.load(f)
        else:
            # 默认选择器
            self.selectors = {
                "publish_page": {
                    "url": "https://creator.xiaohongshu.com/publish/publish",
                    "selectors": {
                        "image_upload_input": "input[type='file']",
                        "title_input": "input[placeholder*='标题']",
                        "description_textarea": "textarea[placeholder*='描述']",
                        "publish_button": "button:has-text('发布')"
                    }
                }
            }

    async def publish_to_xiaohongshu(
        self,
        title: str,
        description: str,
        images: List[str],
        hashtags: List[str]
    ) -> Dict:
        """
        发布内容到小红书

        Args:
            title: 标题
            description: 描述
            images: 图片文件路径列表
            hashtags: 标签列表

        Returns:
            发布结果字典
        """
        async with async_playwright() as p:
            print("\n=== 启动浏览器 ===")

            # 启动浏览器（非无头模式，便于首次登录）
            browser = await p.chromium.launch(
                headless=False,
                channel='chrome',
                args=['--start-maximized']
            )

            try:
                # 创建浏览器上下文
                context = await browser.new_context(
                    viewport={'width': 1920, 'height': 1080}
                )

                # 加载已保存的 Cookie
                if self.cookies_file.exists():
                    print("加载已保存的 Cookie...")
                    with open(self.cookies_file, 'r', encoding='utf-8') as f:
                        cookies = json.load(f)
                        await context.add_cookies(cookies)

                page = await context.new_page()

                # 访问小红书创作中心
                publish_url = self.selectors['publish_page']['url']
                print(f"访问发布页面: {publish_url}")
                await page.goto(publish_url, timeout=30000)
                await page.wait_for_load_state('networkidle', timeout=10000)

                # 检查是否需要登录
                if 'login' in page.url or '登录' in await page.title():
                    print("\n[警告] 需要登录！")
                    print("请在浏览器中手动登录小红书...")
                    print("等待登录完成（最多120秒）...")

                    # 等待用户手动登录（自动检测）
                    try:
                        await page.wait_for_url('**/publish/publish', timeout=120000)
                        print("[OK] 检测到已登录")
                    except:
                        print("[警告] 等待超时，继续尝试...")

                    # 重新访问发布页面
                    await page.goto(publish_url, timeout=30000)
                    await page.wait_for_load_state('networkidle')

                    # 保存 Cookie
                    cookies = await context.cookies()
                    with open(self.cookies_file, 'w', encoding='utf-8') as f:
                        json.dump(cookies, f, indent=2)
                    print("[OK] Cookie 已保存")

                # 上传图片
                print(f"\n=== 上传图片 ({len(images)} 张) ===")
                await self._upload_images(page, images)

                # 填写内容（标题+描述+标签一起填写）
                print(f"\n=== 填写内容 ===")
                await self._fill_content(page, title, description, hashtags)

                # 等待用户确认
                print("\n" + "="*60)
                print("预览内容已填写完成")
                print("="*60)
                print(f"标题: {title}")
                print(f"标签: {', '.join(hashtags[:5])}")
                print(f"图片: {len(images)} 张")
                print("="*60)
                print("\n请在浏览器中检查内容，确认无误后按回车发布...")
                print("（如需修改，请直接在浏览器中编辑）")
                await asyncio.sleep(2)  # 自动等待2秒

                # 点击发布
                print("\n=== 发布中 ===")
                await self._click_publish(page)

                # 等待发布完成
                print("等待发布完成...")
                await asyncio.sleep(3)

                # 获取发布结果
                note_url = page.url
                print(f"\n[OK] 发布成功！")
                print(f"笔记 URL: {note_url}")

                return {
                    'success': True,
                    'note_url': note_url,
                    'timestamp': datetime.now().isoformat()
                }

            except Exception as e:
                print(f"\n[错误] 发布失败: {str(e)}")
                return {
                    'success': False,
                    'error': str(e),
                    'timestamp': datetime.now().isoformat()
                }

            finally:
                # 保持浏览器打开一会儿，方便查看结果
                print("\n浏览器将在 5 秒后关闭...")
                await asyncio.sleep(5)
                await browser.close()

    async def _upload_images(self, page: Page, images: List[str]):
        """上传图片 - 根据网上最佳实践"""
        selectors = self.selectors['publish_page']['selectors']

        try:
            # 查找文件上传输入框（可能隐藏）
            upload_input = await page.locator(selectors['image_upload_input']).element_handle()

            if upload_input:
                # 批量上传所有图片（小红书支持多图）
                print(f"正在上传 {len(images)} 张图片...")
                await upload_input.set_input_files(images)

                # 等待上传完成（每张图2秒）
                await asyncio.sleep(len(images) * 2)
                print("[OK] 图片上传完成")
            else:
                raise Exception("未找到上传输入框")

        except Exception as e:
            print(f"图片上传失败: {str(e)}")
            print("请手动上传图片...")
            await asyncio.sleep(5)  # 给用户时间手动上传

    async def _fill_content(self, page: Page, title: str, description: str, hashtags: List[str]):
        """填写内容 - 使用 contenteditable div"""
        selectors = self.selectors['publish_page']['selectors']

        try:
            # 定位内容编辑器（contenteditable div）
            editor = await page.wait_for_selector(
                selectors['content_editor'],
                timeout=10000
            )

            # 清空现有内容（三击全选）
            await editor.click(click_count=3)
            await page.keyboard.press('Backspace')

            # 构建完整内容：标题 + 描述 + 标签
            tags_text = " ".join(f"#{tag}" for tag in hashtags)
            full_content = f"{title}\n\n{description}\n\n{tags_text}"

            # 输入内容
            await editor.type(full_content, delay=50)  # 模拟人类输入
            await asyncio.sleep(1)

            print(f"[OK] 内容已填写")
            print(f"  标题: {title}")
            print(f"  标签: {', '.join(hashtags[:5])}")

        except Exception as e:
            print(f"填写内容失败: {str(e)}")
            print("请手动填写内容...")
            await asyncio.sleep(5)  # 给用户时间手动填写

    async def _click_publish(self, page: Page):
        """点击发布按钮"""
        selectors = self.selectors['publish_page']['selectors']

        try:
            publish_button = await page.wait_for_selector(
                selectors['publish_button'],
                timeout=10000
            )
            await publish_button.click()
            print("[OK] 已点击发布按钮")

        except Exception as e:
            print(f"点击发布按钮失败: {str(e)}")
            print("请手动点击发布按钮...")

    def _build_description(self, description: str, hashtags: List[str]) -> str:
        """构建完整描述（包含标签）"""
        # 标签部分
        tags_text = " ".join(f"#{tag}" for tag in hashtags)

        # 组合描述和标签
        full_description = f"{description}\n\n{tags_text}"

        return full_description


async def main():
    """测试发布功能"""
    publisher = PlaywrightPublisher()

    # 测试数据
    test_data = {
        'title': '今日运势来啦',
        'description': '白羊座运势4.5分！适合主动出击。想了解更多？我平时在 destinyteller.com 上查看详细解读~',
        'images': [
            'content/drafts/2026-02-06/demo_morning/cover.png',
            'content/drafts/2026-02-06/demo_morning/card_1.png',
            'content/drafts/2026-02-06/demo_morning/card_2.png'
        ],
        'hashtags': ['今日运势', '星座运程', '塔罗占卜', '每日运势', '命理']
    }

    result = await publisher.publish_to_xiaohongshu(**test_data)

    print("\n=== 发布结果 ===")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    asyncio.run(main())
