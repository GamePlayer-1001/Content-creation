"""
手动测试发布流程
这个脚本需要你在浏览器中手动操作
"""
import asyncio
from pathlib import Path
from automation.publishers.playwright_publisher import PlaywrightPublisher


async def main():
    """测试发布功能"""
    print("\n" + "=" * 60)
    print("测试 Playwright 自动发布功能")
    print("=" * 60)

    # 使用之前生成的演示内容
    content_dir = Path('content/drafts/2026-02-06/demo_morning')

    if not content_dir.exists():
        print(f"\n错误：内容目录不存在: {content_dir}")
        print("请先运行 python generate_content_demo.py 生成演示内容")
        return

    # 检查文件
    images = sorted(content_dir.glob('*.png'))
    if not images:
        print(f"\n错误：未找到图片文件")
        return

    print(f"\n找到 {len(images)} 张图片:")
    for img in images:
        size_kb = img.stat().st_size / 1024
        print(f"  - {img.name} ({size_kb:.1f} KB)")

    # 创建发布器
    publisher = PlaywrightPublisher()

    # 发布数据
    test_data = {
        'title': '今日运势来啦',
        'description': '白羊座运势4.5分！适合主动出击。事业上会有贵人相助，感情方面也有不错的进展。想了解更多？我平时在 destinyteller.com 上查看详细解读~',
        'images': [str(img) for img in images],
        'hashtags': ['今日运势', '星座运程', '塔罗占卜', '每日运势', '命理']
    }

    print("\n准备发布的内容:")
    print(f"  标题: {test_data['title']}")
    print(f"  标签: {', '.join(test_data['hashtags'])}")
    print(f"  图片: {len(test_data['images'])} 张")

    print("\n重要提示:")
    print("1. 浏览器将自动打开")
    print("2. 如果需要登录，请手动登录小红书")
    print("3. 登录后，Cookie 会自动保存")
    print("4. 图片会自动上传，标题和描述会自动填写")
    print("5. 最后会提示你确认，按回车后发布")

    input("\n按回车开始测试...")

    # 发布
    print("\n开始发布...")
    result = await publisher.publish_to_xiaohongshu(**test_data)

    # 输出结果
    print("\n" + "=" * 60)
    print("发布结果")
    print("=" * 60)

    if result['success']:
        print(f"[OK] 发布成功！")
        print(f"笔记 URL: {result.get('note_url', 'N/A')}")
        print(f"时间: {result['timestamp']}")
    else:
        print(f"[错误] 发布失败")
        print(f"错误: {result.get('error', 'Unknown error')}")


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n测试已取消")
    except Exception as e:
        print(f"\n测试出错: {str(e)}")
        import traceback
        traceback.print_exc()
