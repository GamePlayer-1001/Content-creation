"""
RSS 热点抓取器
使用 RSS 订阅源获取命理相关热点话题
"""
import asyncio
import json
import aiohttp
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path
from typing import Dict, List
from automation.utils.logger import setup_logger


class RSSTrendingScraper:
    """RSS 热点抓取器"""

    def __init__(self):
        """初始化抓取器"""
        self.logger = setup_logger('rss_trending_scraper', 'logs/scraping')

        # RSS 订阅源列表
        self.rss_feeds = {
            # 知乎热榜 - 命理相关话题
            'zhihu': [
                'https://www.zhihu.com/rss',  # 知乎热榜
            ],

            # 微博热搜 - 可以通过第三方API
            'weibo': [
                # 需要第三方RSS服务
            ],

            # 豆瓣 - 占卜、塔罗相关小组
            'douban': [
                # 豆瓣RSS
            ],

            # 其他占卜、命理相关RSS源
            'others': []
        }

        # 命理相关关键词
        self.keywords = [
            '塔罗', '占卜', '运势', '星座', '生肖',
            '八字', '紫微斗数', '命理', '风水', '水晶',
            '冥想', '心灵成长', '灵性', '能量', '疗愈'
        ]

    async def scrape_trending_topics(self) -> Dict:
        """
        抓取热点话题

        Returns:
            包含热点话题的字典
        """
        self.logger.info("开始抓取RSS热点...")

        trending_topics = []
        keyword_data = {}

        async with aiohttp.ClientSession() as session:
            # 抓取各个RSS源
            for source, feeds in self.rss_feeds.items():
                for feed_url in feeds:
                    try:
                        topics = await self._fetch_rss_feed(session, feed_url, source)
                        trending_topics.extend(topics)
                    except Exception as e:
                        self.logger.warning(f"抓取 {feed_url} 失败: {str(e)}")

        # 筛选命理相关话题
        filtered_topics = self._filter_by_keywords(trending_topics)

        # 提取关键词数据
        for keyword in self.keywords:
            keyword_data[keyword] = self._extract_keyword_topics(filtered_topics, keyword)

        # 保存结果
        result = {
            'timestamp': datetime.now().isoformat(),
            'trending_topics': filtered_topics[:20],  # 保留前20个热点
            'keyword_hashtags': keyword_data,
            'keywords': list(keyword_data.keys()),
            'source': 'rss'
        }

        # 保存到文件
        self._save_result(result)

        self.logger.info(f"抓取完成，共 {len(filtered_topics)} 个相关话题")

        return result

    async def _fetch_rss_feed(self, session: aiohttp.ClientSession,
                              feed_url: str, source: str) -> List[Dict]:
        """
        抓取单个RSS订阅源

        Args:
            session: aiohttp会话
            feed_url: RSS URL
            source: 来源标识

        Returns:
            话题列表
        """
        try:
            async with session.get(feed_url, timeout=10) as response:
                if response.status == 200:
                    xml_content = await response.text()
                    return self._parse_rss_xml(xml_content, source)
                else:
                    self.logger.warning(f"RSS源 {feed_url} 返回状态码: {response.status}")
                    return []
        except Exception as e:
            self.logger.error(f"获取RSS失败 {feed_url}: {str(e)}")
            return []

    def _parse_rss_xml(self, xml_content: str, source: str) -> List[Dict]:
        """
        解析RSS XML内容

        Args:
            xml_content: XML内容
            source: 来源标识

        Returns:
            解析后的话题列表
        """
        topics = []

        try:
            root = ET.fromstring(xml_content)

            # 尝试解析不同的RSS格式
            # RSS 2.0 格式
            for item in root.findall('.//item'):
                title = item.find('title')
                link = item.find('link')
                pub_date = item.find('pubDate')
                description = item.find('description')

                if title is not None:
                    topics.append({
                        'title': title.text,
                        'link': link.text if link is not None else '',
                        'pub_date': pub_date.text if pub_date is not None else '',
                        'description': description.text if description is not None else '',
                        'source': source
                    })

            # Atom 格式
            for entry in root.findall('.//{http://www.w3.org/2005/Atom}entry'):
                title = entry.find('{http://www.w3.org/2005/Atom}title')
                link = entry.find('{http://www.w3.org/2005/Atom}link')
                published = entry.find('{http://www.w3.org/2005/Atom}published')
                summary = entry.find('{http://www.w3.org/2005/Atom}summary')

                if title is not None:
                    topics.append({
                        'title': title.text,
                        'link': link.attrib.get('href', '') if link is not None else '',
                        'pub_date': published.text if published is not None else '',
                        'description': summary.text if summary is not None else '',
                        'source': source
                    })

        except ET.ParseError as e:
            self.logger.error(f"XML解析失败: {str(e)}")

        return topics

    def _filter_by_keywords(self, topics: List[Dict]) -> List[Dict]:
        """
        根据关键词筛选话题

        Args:
            topics: 所有话题

        Returns:
            筛选后的话题
        """
        filtered = []

        for topic in topics:
            title = topic.get('title', '')
            description = topic.get('description', '')
            content = title + ' ' + description

            # 检查是否包含任何关键词
            for keyword in self.keywords:
                if keyword in content:
                    topic['matched_keyword'] = keyword
                    filtered.append(topic)
                    break

        return filtered

    def _extract_keyword_topics(self, topics: List[Dict], keyword: str) -> List[str]:
        """
        提取特定关键词相关的话题

        Args:
            topics: 话题列表
            keyword: 关键词

        Returns:
            相关话题标题列表
        """
        related_topics = []

        for topic in topics:
            title = topic.get('title', '')
            if keyword in title or keyword == topic.get('matched_keyword'):
                related_topics.append(title)

        return related_topics[:10]  # 最多返回10个

    def _save_result(self, result: Dict):
        """保存结果到JSON文件"""
        output_dir = Path('data/trending_topics')
        output_dir.mkdir(parents=True, exist_ok=True)

        output_file = output_dir / f"{datetime.now().strftime('%Y-%m-%d')}_rss.json"

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        self.logger.info(f"结果已保存到: {output_file}")


# 手动热点数据生成器（备用方案）
class ManualTrendingGenerator:
    """手动生成热点数据（当抓取失败时使用）"""

    @staticmethod
    def generate_default_topics() -> Dict:
        """
        生成默认的热点话题

        基于命理领域的常见话题
        """
        topics = [
            {'title': '2026年星座运势预测', 'heat': '热'},
            {'title': '塔罗占卜每日一抽', 'heat': '新'},
            {'title': '十二生肖本周运势', 'heat': '热'},
            {'title': '水逆期如何应对', 'heat': '热'},
            {'title': '紫微斗数看事业运', 'heat': '新'},
            {'title': '八字命理基础入门', 'heat': '热'},
            {'title': '家居风水布局指南', 'heat': '新'},
            {'title': '水晶能量与疗愈', 'heat': '热'},
            {'title': '梦境解析大全', 'heat': '新'},
            {'title': '心灵成长与冥想', 'heat': '热'}
        ]

        keyword_hashtags = {
            '塔罗': ['塔罗占卜', '每日塔罗', '塔罗牌', '塔罗解读', '塔罗教学'],
            '占卜': ['占卜分享', '占卜日记', '占卜测试', '在线占卜', '占卜咨询'],
            '运势': ['今日运势', '每周运势', '运势预测', '运势分析', '好运来'],
            '星座': ['星座运势', '12星座', '星座配对', '星盘解读', '星座知识'],
            '生肖': ['生肖运势', '十二生肖', '生肖配对', '生肖性格', '属相命理'],
            '八字': ['八字命理', '八字算命', '生辰八字', '八字分析', '命理学习'],
            '紫微斗数': ['紫微命盘', '紫微斗数', '命宫解析', '紫微入门'],
            '命理': ['命理解析', '命理学习', '命理知识', '命理咨询'],
            '风水': ['风水布局', '家居风水', '办公室风水', '风水知识', '招财风水'],
            '水晶': ['水晶疗愈', '水晶能量', '水晶消磁', '水晶选择'],
            '冥想': ['冥想练习', '正念冥想', '冥想入门', '冥想疗愈'],
            '心灵成长': ['心灵疗愈', '内在成长', '自我疗愈', '心理成长']
        }

        return {
            'timestamp': datetime.now().isoformat(),
            'trending_topics': topics,
            'keyword_hashtags': keyword_hashtags,
            'keywords': list(keyword_hashtags.keys()),
            'source': 'manual'
        }


async def main():
    """测试RSS抓取"""
    scraper = RSSTrendingScraper()

    try:
        result = await scraper.scrape_trending_topics()

        print("\n抓取结果:")
        print(f"热点话题数: {len(result['trending_topics'])}")

        if result['trending_topics']:
            print("\n热门话题:")
            for i, topic in enumerate(result['trending_topics'][:5], 1):
                print(f"  {i}. {topic['title']}")
        else:
            print("\nRSS抓取无结果，使用默认热点数据...")
            manual_generator = ManualTrendingGenerator()
            result = manual_generator.generate_default_topics()

            print("\n默认热点话题:")
            for i, topic in enumerate(result['trending_topics'][:5], 1):
                print(f"  {i}. {topic['title']}")

    except Exception as e:
        print(f"\n抓取失败: {str(e)}")
        print("使用默认热点数据...")

        manual_generator = ManualTrendingGenerator()
        result = manual_generator.generate_default_topics()

        # 保存默认数据
        output_dir = Path('data/trending_topics')
        output_dir.mkdir(parents=True, exist_ok=True)

        output_file = output_dir / f"{datetime.now().strftime('%Y-%m-%d')}_manual.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        print(f"默认数据已保存到: {output_file}")


if __name__ == '__main__':
    asyncio.run(main())
