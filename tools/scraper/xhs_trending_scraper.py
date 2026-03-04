"""
小红书热点抓取器
使用 Playwright 抓取小红书热点话题和关键词标签
"""
import asyncio
import json
import random
from datetime import datetime
from pathlib import Path
from typing import Dict, List
from playwright.async_api import async_playwright, Page


class XHSTrendingScraper:
    """小红书热点抓取器"""

    def __init__(self):
        """初始化抓取器"""
        project_root = Path(__file__).parent.parent.parent
        self.data_dir = project_root / 'output' / 'scraper'
        self.data_dir.mkdir(parents=True, exist_ok=True)

        # 命理相关关键词
        self.keywords = [
            '塔罗', '占卜', '运势', '星座',
            '生肖', '八字', '紫微斗数', '命理',
            '风水', '水晶', '冥想', '心灵成长'
        ]

        # User-Agent 列表
        self.user_agents = [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
            'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36'
        ]

    async def scrape_trending_topics(self) -> Dict:
        """
        抓取小红书热点话题

        Returns:
            包含热点话题和关键词标签的字典
        """
        async with async_playwright() as p:
            # 启动浏览器（无头模式）
            browser = await p.chromium.launch(headless=True)

            # 创建移动端上下文
            context = await browser.new_context(
                viewport={'width': 375, 'height': 812},
                user_agent=random.choice(self.user_agents)
            )

            page = await context.new_page()

            try:
                # 1. 抓取热搜页
                trending_data = await self._scrape_explore_page(page)

                # 2. 抓取关键词标签
                keyword_data = await self._scrape_keywords(page)

                # 3. 组装结果
                result = {
                    'timestamp': datetime.now().isoformat(),
                    'trending_topics': trending_data,
                    'keyword_hashtags': keyword_data,
                    'keywords': self._extract_keywords(keyword_data)
                }

                # 4. 保存结果
                self._save_result(result)

                return result

            except Exception as e:
                print(f"抓取失败: {str(e)}")
                return {
                    'timestamp': datetime.now().isoformat(),
                    'trending_topics': [],
                    'keyword_hashtags': {},
                    'keywords': [],
                    'error': str(e)
                }

            finally:
                await browser.close()

    async def _scrape_explore_page(self, page: Page) -> List[Dict]:
        """抓取热搜页"""
        try:
            print("正在访问小红书热搜页...")
            await page.goto('https://www.xiaohongshu.com/explore', timeout=30000)
            await page.wait_for_load_state('networkidle', timeout=10000)

            # 随机延迟
            await asyncio.sleep(random.uniform(2, 4))

            # 提取热点话题（尝试多种选择器）
            trending_data = await page.evaluate('''() => {
                const topics = [];

                // 尝试多种选择器
                const selectors = [
                    '.search-trending-item',
                    '.trending-item',
                    '.hot-topic-item',
                    '[class*="trend"]',
                    '[class*="hot"]'
                ];

                for (const selector of selectors) {
                    const items = document.querySelectorAll(selector);
                    if (items.length > 0) {
                        items.forEach((item, index) => {
                            if (index < 20) {  // 只取前20个
                                const title = item.textContent?.trim() || '';
                                if (title) {
                                    topics.push({
                                        title: title,
                                        rank: index + 1
                                    });
                                }
                            }
                        });
                        break;
                    }
                }

                return topics;
            }''')

            print(f"抓取到 {len(trending_data)} 个热点话题")
            return trending_data

        except Exception as e:
            print(f"热搜页抓取失败: {str(e)}")
            return []

    async def _scrape_keywords(self, page: Page) -> Dict[str, List[str]]:
        """抓取关键词标签"""
        keyword_data = {}

        for keyword in self.keywords:
            try:
                print(f"正在搜索关键词: {keyword}")
                await page.goto(
                    f'https://www.xiaohongshu.com/search_result?keyword={keyword}',
                    timeout=30000
                )
                await page.wait_for_timeout(random.randint(2000, 4000))

                # 提取标签
                hashtags = await page.evaluate('''() => {
                    const tags = new Set();
                    const selectors = [
                        '.tag',
                        '.hashtag',
                        '[class*="tag"]',
                        'a[href*="search_result"]'
                    ];

                    for (const selector of selectors) {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(el => {
                            const text = el.textContent?.trim();
                            if (text && text.length > 0 && text.length < 20) {
                                tags.add(text.replace(/^#/, ''));
                            }
                        });

                        if (tags.size >= 10) break;
                    }

                    return Array.from(tags).slice(0, 10);
                }''')

                keyword_data[keyword] = hashtags
                print(f"  找到 {len(hashtags)} 个标签")

                # 防止过于频繁的请求
                await asyncio.sleep(random.uniform(1, 2))

            except Exception as e:
                print(f"关键词 {keyword} 抓取失败: {str(e)}")
                keyword_data[keyword] = []

        return keyword_data

    def _extract_keywords(self, keyword_data: Dict) -> List[str]:
        """从标签数据中提取关键词列表"""
        all_keywords = []
        for tags in keyword_data.values():
            all_keywords.extend(tags)

        # 去重并返回前20个
        return list(set(all_keywords))[:20]

    def _save_result(self, result: Dict):
        """保存抓取结果"""
        date_str = datetime.now().strftime("%Y-%m-%d")
        output_file = self.data_dir / f"{date_str}.json"

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        print(f"结果已保存到: {output_file}")


async def main():
    """主函数"""
    scraper = XHSTrendingScraper()
    result = await scraper.scrape_trending_topics()

    print("\n=== 抓取结果 ===")
    print(f"时间戳: {result['timestamp']}")
    print(f"热点话题数: {len(result['trending_topics'])}")
    print(f"关键词标签: {len(result['keyword_hashtags'])} 个关键词")
    print(f"提取的关键词: {', '.join(result['keywords'][:10])}")


if __name__ == '__main__':
    asyncio.run(main())
