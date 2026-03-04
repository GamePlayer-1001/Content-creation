"""
每日自动化调度器
协调热点抓取、内容生成、图片渲染和自动发布的完整工作流程
"""
import schedule
import time
import asyncio
import json
from pathlib import Path
from datetime import datetime
from typing import Dict
import sys

# 添加项目根目录到 Python 路径
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from tools.utils.logger import setup_logger
from tools.scraper.xhs_trending_scraper import XHSTrendingScraper
from tools.generator.content_pipeline import ContentPipeline
from tools.publish.playwright_publisher import PlaywrightPublisher


class DailyScheduler:
    """每日自动化调度器"""

    def __init__(self):
        """初始化调度器"""
        self.logger = setup_logger('daily_scheduler', 'logs/scheduler')
        self.scraper = XHSTrendingScraper()
        self.pipeline = ContentPipeline()
        self.publisher = PlaywrightPublisher()

        # 创建必要的目录 (基于项目根目录)
        self.drafts_dir = project_root / 'output' / 'drafts'
        self.approved_dir = project_root / 'output' / 'queue'
        self.published_dir = project_root / 'output' / 'published'

        for dir_path in [self.drafts_dir, self.approved_dir, self.published_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)

        self.logger.info("调度器初始化完成")

    def run_trending_scrape(self):
        """抓取小红书热点"""
        self.logger.info("=" * 60)
        self.logger.info("开始抓取小红书热点...")

        try:
            result = asyncio.run(self.scraper.scrape_trending_topics())
            self.logger.info(f"热点抓取成功，共 {len(result.get('trending_topics', []))} 个热点话题")
            self.logger.info(f"关键词数据: {len(result.get('keyword_hashtags', {}))} 个关键词")
            return result

        except Exception as e:
            self.logger.error(f"热点抓取失败: {str(e)}")
            return None

    def generate_content_workflow(self, time_slot: str):
        """生成内容的完整工作流程"""
        self.logger.info("=" * 60)
        self.logger.info(f"开始生成 {time_slot} 时段内容...")

        try:
            # 创建输出目录
            date_str = datetime.now().strftime("%Y-%m-%d")
            output_dir = self.drafts_dir / date_str / time_slot
            output_dir.mkdir(parents=True, exist_ok=True)

            # 生成内容 + 渲染图片
            result = self.pipeline.generate_and_render(
                time_slot=time_slot,
                output_dir=output_dir
            )

            self.logger.info(f"内容生成成功: {result['title']}")
            self.logger.info(f"主题: {result['theme']}")
            self.logger.info(f"标签: {', '.join(result['hashtags'][:5])}")
            self.logger.info(f"图片数: {len(result['images'])}")
            self.logger.info(f"输出目录: {output_dir}")

            return {
                'success': True,
                'time_slot': time_slot,
                'output_dir': str(output_dir),
                'metadata': result
            }

        except Exception as e:
            self.logger.error(f"{time_slot} 内容生成失败: {str(e)}")
            return {
                'success': False,
                'time_slot': time_slot,
                'error': str(e)
            }

    def publish_workflow(self, time_slot: str):
        """发布内容的完整工作流程"""
        self.logger.info("=" * 60)
        self.logger.info(f"开始发布 {time_slot} 时段内容...")

        try:
            # 查找待发布的内容
            date_str = datetime.now().strftime("%Y-%m-%d")
            content_dir = self.drafts_dir / date_str / time_slot

            if not content_dir.exists():
                self.logger.error(f"内容目录不存在: {content_dir}")
                return {'success': False, 'error': 'Content not found'}

            # 读取元数据
            metadata_file = content_dir / 'metadata.json'
            if not metadata_file.exists():
                self.logger.error(f"元数据文件不存在: {metadata_file}")
                return {'success': False, 'error': 'Metadata not found'}

            with open(metadata_file, 'r', encoding='utf-8') as f:
                metadata = json.load(f)

            # 收集图片
            images = sorted(content_dir.glob('*.png'))
            if not images:
                self.logger.error(f"未找到图片文件")
                return {'success': False, 'error': 'Images not found'}

            self.logger.info(f"准备发布: {metadata['title']}")
            self.logger.info(f"图片数量: {len(images)}")

            # 发布到小红书
            result = asyncio.run(self.publisher.publish_to_xiaohongshu(
                title=metadata['title'],
                description=metadata['description'],
                images=[str(img) for img in images],
                hashtags=metadata['hashtags']
            ))

            if result['success']:
                self.logger.info(f"发布成功！笔记 URL: {result.get('note_url', 'N/A')}")

                # 归档内容
                self._archive_content(content_dir, time_slot, result)

                return result
            else:
                self.logger.error(f"发布失败: {result.get('error', 'Unknown error')}")
                return result

        except Exception as e:
            self.logger.error(f"{time_slot} 内容发布失败: {str(e)}")
            return {
                'success': False,
                'time_slot': time_slot,
                'error': str(e)
            }

    def _archive_content(self, content_dir: Path, time_slot: str, publish_result: Dict):
        """归档已发布的内容"""
        try:
            date_str = datetime.now().strftime("%Y-%m-%d")
            archive_dir = self.published_dir / date_str / time_slot
            archive_dir.mkdir(parents=True, exist_ok=True)

            # 复制所有文件到归档目录
            import shutil
            for file in content_dir.iterdir():
                if file.is_file():
                    shutil.copy2(file, archive_dir / file.name)

            # 保存发布结果
            publish_info_file = archive_dir / 'publish_result.json'
            with open(publish_info_file, 'w', encoding='utf-8') as f:
                json.dump(publish_result, f, ensure_ascii=False, indent=2)

            self.logger.info(f"内容已归档到: {archive_dir}")

        except Exception as e:
            self.logger.error(f"归档失败: {str(e)}")

    # === 早间工作流程 ===

    def morning_scrape(self):
        """06:00 - 早间热点抓取"""
        self.logger.info("\n" + "=" * 60)
        self.logger.info("早间热点抓取任务开始")
        self.logger.info("=" * 60)
        self.run_trending_scrape()

    def morning_generate(self):
        """07:00 - 生成早间内容"""
        self.logger.info("\n" + "=" * 60)
        self.logger.info("早间内容生成任务开始")
        self.logger.info("=" * 60)
        self.generate_content_workflow('morning')

    def morning_publish(self):
        """08:00 - 发布早间内容"""
        self.logger.info("\n" + "=" * 60)
        self.logger.info("早间内容发布任务开始")
        self.logger.info("=" * 60)
        self.publish_workflow('morning')

    # === 午间工作流程 ===

    def midday_scrape(self):
        """11:00 - 午间热点抓取"""
        self.logger.info("\n" + "=" * 60)
        self.logger.info("午间热点抓取任务开始")
        self.logger.info("=" * 60)
        self.run_trending_scrape()

    def midday_generate(self):
        """11:30 - 生成午间内容"""
        self.logger.info("\n" + "=" * 60)
        self.logger.info("午间内容生成任务开始")
        self.logger.info("=" * 60)
        self.generate_content_workflow('midday')

    def midday_publish(self):
        """12:30 - 发布午间内容"""
        self.logger.info("\n" + "=" * 60)
        self.logger.info("午间内容发布任务开始")
        self.logger.info("=" * 60)
        self.publish_workflow('midday')

    # === 晚间工作流程 ===

    def evening_scrape(self):
        """17:00 - 晚间热点抓取"""
        self.logger.info("\n" + "=" * 60)
        self.logger.info("晚间热点抓取任务开始")
        self.logger.info("=" * 60)
        self.run_trending_scrape()

    def evening_generate(self):
        """17:30 - 生成晚间内容"""
        self.logger.info("\n" + "=" * 60)
        self.logger.info("晚间内容生成任务开始")
        self.logger.info("=" * 60)
        self.generate_content_workflow('evening')

    def evening_publish(self):
        """19:30 - 发布晚间内容"""
        self.logger.info("\n" + "=" * 60)
        self.logger.info("晚间内容发布任务开始")
        self.logger.info("=" * 60)
        self.publish_workflow('evening')

    def start(self):
        """启动调度器"""
        self.logger.info("\n" + "=" * 60)
        self.logger.info("Destinyteller 小红书自动化调度器启动")
        self.logger.info("=" * 60)

        # 注册早间任务
        schedule.every().day.at("06:00").do(self.morning_scrape)
        schedule.every().day.at("07:00").do(self.morning_generate)
        schedule.every().day.at("08:00").do(self.morning_publish)

        # 注册午间任务
        schedule.every().day.at("11:00").do(self.midday_scrape)
        schedule.every().day.at("11:30").do(self.midday_generate)
        schedule.every().day.at("12:30").do(self.midday_publish)

        # 注册晚间任务
        schedule.every().day.at("17:00").do(self.evening_scrape)
        schedule.every().day.at("17:30").do(self.evening_generate)
        schedule.every().day.at("19:30").do(self.evening_publish)

        self.logger.info("定时任务已注册:")
        self.logger.info("  - 早间: 06:00(抓取) → 07:00(生成) → 08:00(发布)")
        self.logger.info("  - 午间: 11:00(抓取) → 11:30(生成) → 12:30(发布)")
        self.logger.info("  - 晚间: 17:00(抓取) → 17:30(生成) → 19:30(发布)")
        self.logger.info("\n调度器运行中...")

        # 运行调度循环
        while True:
            schedule.run_pending()
            time.sleep(60)  # 每分钟检查一次


def main():
    """主函数"""
    try:
        scheduler = DailyScheduler()
        scheduler.start()
    except KeyboardInterrupt:
        print("\n\n调度器已停止")
    except Exception as e:
        print(f"\n调度器运行出错: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
