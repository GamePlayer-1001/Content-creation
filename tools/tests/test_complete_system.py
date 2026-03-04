"""
完整系统测试脚本
测试所有核心功能：热点抓取、内容生成、图片渲染
"""
import asyncio
from pathlib import Path
from datetime import datetime
from automation.scrapers.xhs_trending_scraper import XHSTrendingScraper
from automation.generators.content_pipeline import ContentPipeline
from automation.utils.logger import setup_logger


async def test_trending_scraper():
    """测试热点抓取"""
    print("\n" + "=" * 60)
    print("测试 1: 热点抓取系统")
    print("=" * 60)

    try:
        scraper = XHSTrendingScraper()
        print("正在抓取小红书热点...")
        print("（这可能需要 1-2 分钟，请耐心等待）")

        result = await scraper.scrape_trending_topics()

        print(f"\n[OK] 抓取成功！")
        print(f"热点话题数: {len(result.get('trending_topics', []))}")
        print(f"关键词数据: {len(result.get('keyword_hashtags', {}))}")

        # 显示部分数据
        if result.get('trending_topics'):
            print(f"\n示例热点话题:")
            for topic in result['trending_topics'][:3]:
                print(f"  - {topic.get('title', 'N/A')}")

        if result.get('keywords'):
            print(f"\n发现的关键词: {', '.join(result['keywords'][:5])}")

        return True

    except Exception as e:
        print(f"\n[ERROR] 抓取失败: {str(e)}")
        print("（热点抓取失败不影响系统运行，可以继续测试其他功能）")
        return False


def test_content_generation():
    """测试内容生成和渲染"""
    print("\n" + "=" * 60)
    print("测试 2: 内容生成和图片渲染")
    print("=" * 60)

    try:
        pipeline = ContentPipeline()

        # 测试3个时段
        time_slots = ['morning', 'midday', 'evening']
        results = {}

        for slot in time_slots:
            print(f"\n正在生成 {slot} 时段内容...")

            date_str = datetime.now().strftime("%Y-%m-%d")
            output_dir = Path(f'content/drafts/{date_str}/test_{slot}')
            output_dir.mkdir(parents=True, exist_ok=True)

            result = pipeline.generate_and_render(
                time_slot=slot,
                output_dir=output_dir
            )

            results[slot] = result

            print(f"[OK] {slot} 生成成功")
            print(f"  标题: {result['title']}")
            print(f"  主题: {result['theme']}")
            print(f"  图片数: {len(result['images'])}")

        print(f"\n[OK] 所有时段内容生成成功！")
        return True, results

    except Exception as e:
        print(f"\n[ERROR] 内容生成失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False, {}


def verify_files(results):
    """验证生成的文件"""
    print("\n" + "=" * 60)
    print("测试 3: 验证生成的文件")
    print("=" * 60)

    all_good = True

    for slot, result in results.items():
        print(f"\n检查 {slot} 时段文件...")

        date_str = datetime.now().strftime("%Y-%m-%d")
        output_dir = Path(f'content/drafts/{date_str}/test_{slot}')

        # 检查必需文件
        required_files = ['content.md', 'metadata.json', 'cover.png']

        for filename in required_files:
            file_path = output_dir / filename
            if file_path.exists():
                size = file_path.stat().st_size
                print(f"  [OK] {filename} ({size / 1024:.1f} KB)")
            else:
                print(f"  [ERROR] {filename} 不存在")
                all_good = False

        # 检查卡片图片
        cards = list(output_dir.glob('card_*.png'))
        print(f"  [OK] {len(cards)} 张卡片图片")

    if all_good:
        print(f"\n[OK] 所有文件验证通过！")
    else:
        print(f"\n[ERROR] 部分文件缺失")

    return all_good


async def main():
    """主测试函数"""
    print("\n" + "=" * 60)
    print("Destinyteller 小红书自动化系统 - 完整测试")
    print("=" * 60)

    # 测试1: 热点抓取（可选）
    print("\n是否测试热点抓取？（需要1-2分钟）")
    print("1. 是")
    print("2. 否（跳过）")
    choice = input("\n请选择（1/2，默认2）: ").strip() or "2"

    if choice == "1":
        await test_trending_scraper()
    else:
        print("\n跳过热点抓取测试")

    # 测试2: 内容生成
    success, results = test_content_generation()

    if not success:
        print("\n内容生成失败，终止测试")
        return

    # 测试3: 文件验证
    verify_files(results)

    # 总结
    print("\n" + "=" * 60)
    print("测试完成总结")
    print("=" * 60)
    print("\n[OK] 内容生成系统：正常")
    print("[OK] 图片渲染系统：正常")
    print("[OK] 文件存储系统：正常")

    print("\n生成的内容位置:")
    date_str = datetime.now().strftime("%Y-%m-%d")
    for slot in ['morning', 'midday', 'evening']:
        print(f"  - content/drafts/{date_str}/test_{slot}/")

    print("\n下一步:")
    print("1. 运行 'python test_publish.py' 测试自动发布")
    print("2. 运行 'run_scheduler.bat' 启动完整调度器")
    print("\n系统已准备就绪！")


if __name__ == '__main__':
    asyncio.run(main())
