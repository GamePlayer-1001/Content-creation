"""
素材管理查看工具
"""
import json
from pathlib import Path
from datetime import datetime


class MaterialsViewer:
    def __init__(self):
        self.materials_dir = Path(__file__).parent.parent

    def show_topics(self):
        """显示话题素材"""
        topics_file = self.materials_dir / 'topics' / 'trending_topics.json'

        if not topics_file.exists():
            print("[错误] 话题素材文件不存在")
            return

        with open(topics_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        print("\n" + "=" * 70)
        print("话题素材库")
        print("=" * 70)
        print(f"最后更新: {data['last_updated']}")
        print(f"话题总数: {len(data['topics'])} 个")
        print(f"说明: {data['description']}")

        # 按热度分组
        super_hot = [t for t in data['topics'] if t['heat'] == '超热']
        recommended = [t for t in data['topics'] if t['heat'] == '推荐']

        print("\n" + "-" * 70)
        print(f"超热话题 ({len(super_hot)} 个)")
        print("-" * 70)
        for topic in super_hot:
            print(f"\n{topic['id']:2d}. {topic['title']}")
            print(f"    分类: {topic['category']}")
            print(f"    关键词: {', '.join(topic['keywords'])}")
            print(f"    最佳时段: {', '.join(topic['best_time_slot'])}")
            print(f"    互动评分: {topic['engagement_score']}")

        print("\n" + "-" * 70)
        print(f"推荐话题 ({len(recommended)} 个)")
        print("-" * 70)
        for topic in recommended:
            print(f"\n{topic['id']:2d}. {topic['title']}")
            print(f"    分类: {topic['category']}")
            print(f"    关键词: {', '.join(topic['keywords'])}")
            print(f"    最佳时段: {', '.join(topic['best_time_slot'])}")
            print(f"    互动评分: {topic['engagement_score']}")

        print("\n" + "=" * 70)

    def show_hashtags(self):
        """显示标签素材"""
        tags_file = self.materials_dir / 'hashtags' / 'primary_tags.json'

        if not tags_file.exists():
            print("[错误] 标签素材文件不存在")
            return

        with open(tags_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        print("\n" + "=" * 70)
        print("标签素材库")
        print("=" * 70)
        print(f"最后更新: {data['last_updated']}")
        print(f"分类总数: {data['total_categories']} 类")
        print(f"标签总数: {data['total_tags']} 个")
        print(f"说明: {data['description']}")

        print("\n" + "-" * 70)
        print("标签分类明细")
        print("-" * 70)

        for category_name, category_data in data['categories'].items():
            print(f"\n[{category_name}] ({len(category_data['tags'])} 个标签)")
            print(f"  使用频率: {category_data['usage_rate']}")
            print(f"  最佳时段: {', '.join(category_data['best_time_slot'])}")
            print(f"  标签: {' '.join(['#' + tag for tag in category_data['tags']])}")

        print("\n" + "-" * 70)
        print("标签组合策略")
        print("-" * 70)

        for time_slot, strategy in data['combination_strategies'].items():
            time_names = {
                'morning': '早间',
                'midday': '午间',
                'evening': '晚间'
            }
            print(f"\n{time_names.get(time_slot, time_slot)}:")
            print(f"  主要分类: {', '.join(strategy['primary'])}")
            print(f"  次要分类: {', '.join(strategy['secondary'])}")

        print("\n" + "=" * 70)

    def show_stats(self):
        """显示统计信息"""
        print("\n" + "=" * 70)
        print("素材库统计")
        print("=" * 70)

        # 话题统计
        topics_file = self.materials_dir / 'topics' / 'trending_topics.json'
        if topics_file.exists():
            with open(topics_file, 'r', encoding='utf-8') as f:
                topics_data = json.load(f)
            print(f"\n[话题素材] {len(topics_data['topics'])} 个")
            print(f"  更新时间: {topics_data['last_updated']}")
        else:
            print("\n[话题素材] 未找到")

        # 标签统计
        tags_file = self.materials_dir / 'hashtags' / 'primary_tags.json'
        if tags_file.exists():
            with open(tags_file, 'r', encoding='utf-8') as f:
                tags_data = json.load(f)
            print(f"\n[标签素材] {tags_data['total_tags']} 个标签，{tags_data['total_categories']} 个分类")
            print(f"  更新时间: {tags_data['last_updated']}")
        else:
            print("\n[标签素材] 未找到")

        # 模板统计
        templates_dir = self.materials_dir / 'templates'
        if templates_dir.exists():
            template_count = sum(1 for _ in templates_dir.rglob('*.json'))
            print(f"\n[内容模板] {template_count} 个")
        else:
            print("\n[内容模板] 未找到")

        # 案例统计
        examples_dir = self.materials_dir / 'examples'
        if examples_dir.exists():
            example_count = sum(1 for _ in examples_dir.rglob('*.json'))
            print(f"\n[优秀案例] {example_count} 个")
        else:
            print("\n[优秀案例] 未找到")

        print("\n" + "=" * 70)

    def show_all(self):
        """显示所有素材"""
        self.show_topics()
        print("\n")
        self.show_hashtags()
        print("\n")
        self.show_stats()


def main():
    viewer = MaterialsViewer()

    print("\n素材管理工具")
    print("=" * 70)
    print("1. 查看话题素材")
    print("2. 查看标签素材")
    print("3. 查看统计信息")
    print("4. 查看全部")
    print("=" * 70)

    choice = input("\n请选择 (1-4): ").strip()

    if choice == '1':
        viewer.show_topics()
    elif choice == '2':
        viewer.show_hashtags()
    elif choice == '3':
        viewer.show_stats()
    elif choice == '4':
        viewer.show_all()
    else:
        print("无效选择")


if __name__ == '__main__':
    main()
