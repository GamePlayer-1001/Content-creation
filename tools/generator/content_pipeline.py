"""
内容生成管道
协调内容生成和图片渲染流程
"""
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional
import sys

# 添加项目根目录到 Python 路径 (tools/generator/ → 项目根)
PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from tools.generator.claude_content_generator import ClaudeContentGenerator
from tools.card.image_renderer import ImageRenderer
from tools.utils.logger import setup_logger


class ContentPipeline:
    """内容生成管道"""

    def __init__(self):
        """初始化管道"""
        self.generator = ClaudeContentGenerator()
        self.renderer = ImageRenderer()
        self.logger = setup_logger('content_pipeline', 'logs/generation')

        self.data_dir = PROJECT_ROOT / 'output' / 'scraper'

    def generate_and_render(
        self,
        time_slot: str,
        output_dir: Path,
        theme: Optional[str] = None
    ) -> Dict:
        """
        完整流程：生成内容 + 渲染图片

        Args:
            time_slot: 时段 (morning/midday/evening)
            output_dir: 输出目录
            theme: 视觉主题（可选）

        Returns:
            包含元数据的字典
        """
        self.logger.info(f"开始生成 {time_slot} 时段内容")

        try:
            # 1. 加载热点数据
            trending_data = self._load_trending_data()
            self.logger.info(f"加载热点数据: {len(trending_data.get('keywords', []))} 个关键词")

            # 2. 生成内容（当前使用示例内容，后续可接入 Claude API）
            self.logger.info("生成内容...")
            gen_info = self.generator.generate_content(
                time_slot=time_slot,
                trending_data=trending_data,
                theme=theme
            )

            # 使用示例内容进行测试
            markdown = self.generator.create_sample_content(time_slot, gen_info['theme'])
            metadata = self.generator.parse_content(markdown)

            content = {
                'markdown': markdown,
                'title': metadata['title'],
                'description': metadata['description'],
                'hashtags': metadata['hashtags'],
                'theme': gen_info['theme']
            }

            # 3. 保存 Markdown
            output_dir.mkdir(parents=True, exist_ok=True)
            md_file = output_dir / 'content.md'
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(content['markdown'])

            self.logger.info(f"Markdown 已保存: {md_file}")

            # 4. 渲染图片
            self.logger.info("渲染图片...")
            images = self.renderer.render(
                markdown_file=md_file,
                output_dir=output_dir,
                theme=content['theme']
            )

            # 5. 保存元数据
            metadata = {
                'title': content['title'],
                'description': content['description'],
                'hashtags': content['hashtags'],
                'theme': content['theme'],
                'images': [str(img.name) for img in images],
                'generated_at': datetime.now().isoformat(),
                'time_slot': time_slot
            }

            metadata_file = output_dir / 'metadata.json'
            with open(metadata_file, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, ensure_ascii=False, indent=2)

            self.logger.info(f"元数据已保存: {metadata_file}")
            self.logger.info(f"生成完成: 标题={metadata['title']}, 图片={len(images)}张")

            return metadata

        except Exception as e:
            self.logger.error(f"生成失败: {str(e)}", exc_info=True)
            raise

    def _load_trending_data(self) -> Dict:
        """加载最新的热点数据"""
        # 查找最新的数据文件
        data_files = sorted(self.data_dir.glob('*.json'), reverse=True)

        if not data_files:
            self.logger.warning("未找到热点数据文件，使用空数据")
            return {'keywords': []}

        latest_file = data_files[0]
        self.logger.info(f"使用热点数据: {latest_file.name}")

        try:
            with open(latest_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            self.logger.error(f"加载热点数据失败: {str(e)}")
            return {'keywords': []}


def main():
    """主函数 - 用于测试"""
    import argparse

    parser = argparse.ArgumentParser(description='生成小红书内容')
    parser.add_argument(
        '--slot',
        required=True,
        choices=['morning', 'midday', 'evening'],
        help='时段'
    )
    parser.add_argument(
        '--output',
        required=True,
        help='输出目录'
    )
    parser.add_argument(
        '--theme',
        help='视觉主题（可选）'
    )

    args = parser.parse_args()

    # 执行生成
    pipeline = ContentPipeline()
    output_dir = Path(args.output)

    result = pipeline.generate_and_render(
        time_slot=args.slot,
        output_dir=output_dir,
        theme=args.theme
    )

    print("\n=== 生成完成 ===")
    print(f"标题: {result['title']}")
    print(f"主题: {result['theme']}")
    print(f"标签: {', '.join(result['hashtags'])}")
    print(f"图片: {len(result['images'])} 张")
    print(f"输出目录: {output_dir}")


if __name__ == '__main__':
    main()
