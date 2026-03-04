"""
测试内容生成流程
"""
import asyncio
from pathlib import Path
from datetime import datetime
from automation.scrapers.xhs_trending_scraper import XHSTrendingScraper
from automation.generators.content_pipeline import ContentPipeline


async def test_scraping():
    """测试热点抓取"""
    print("=== 测试热点抓取 ===\n")

    scraper = XHSTrendingScraper()
    result = await scraper.scrape_trending_topics()

    print(f"时间戳: {result['timestamp']}")
    print(f"热点话题数: {len(result.get('trending_topics', []))}")
    print(f"关键词数: {len(result.get('keywords', []))}")

    if result.get('keywords'):
        print(f"关键词示例: {', '.join(result['keywords'][:5])}")

    print("\n✓ 热点抓取测试完成\n")


def test_content_generation():
    """测试内容生成"""
    print("=== 测试内容生成 ===\n")

    pipeline = ContentPipeline()

    # 创建测试输出目录
    date_str = datetime.now().strftime("%Y-%m-%d")
    output_dir = Path(f'content/drafts/{date_str}/test_morning')

    try:
        result = pipeline.generate_and_render(
            time_slot='morning',
            output_dir=output_dir
        )

        print(f"标题: {result['title']}")
        print(f"主题: {result['theme']}")
        print(f"标签: {', '.join(result['hashtags'][:5])}")
        print(f"图片数: {len(result['images'])}")
        print(f"输出目录: {output_dir}")

        print("\n✓ 内容生成测试完成\n")

    except Exception as e:
        print(f"✗ 内容生成失败: {str(e)}\n")
        import traceback
        traceback.print_exc()


async def main():
    """主测试函数"""
    print("\n" + "=" * 60)
    print("Destinyteller 小红书自动化系统 - 功能测试")
    print("=" * 60 + "\n")

    # 测试1: 热点抓取（可选，如果不需要可以跳过）
    try_scraping = input("是否测试热点抓取? (y/n, 默认 n): ").strip().lower()
    if try_scraping == 'y':
        await test_scraping()
    else:
        print("跳过热点抓取测试\n")

    # 测试2: 内容生成
    try_generation = input("是否测试内容生成? (y/n, 默认 y): ").strip().lower()
    if try_generation != 'n':
        test_content_generation()

    print("=" * 60)
    print("测试完成！")
    print("=" * 60)


if __name__ == '__main__':
    asyncio.run(main())
