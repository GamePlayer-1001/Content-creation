"""
剪映草稿扫描器

功能:
- 扫描指定目录下的所有剪映草稿项目
- 提取项目基本信息（名称、大小、时间线数量等）
- 生成项目特征矩阵
"""

import os
import json
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional
import configparser


@dataclass
class DraftProject:
    """草稿项目数据模型"""
    name: str
    path: str
    size_mb: float
    timeline_count: int
    media_count: int
    resolution: int
    edit_duration_seconds: int
    ai_features: List[str]
    has_digital_human: bool
    has_aigc: bool
    create_time: Optional[int] = None
    last_edit_time: Optional[int] = None


class DraftScanner:
    """剪映草稿扫描器"""

    def __init__(self, drafts_directory: str):
        self.drafts_directory = Path(drafts_directory)
        self.projects: List[DraftProject] = []

    def scan_all(self) -> List[DraftProject]:
        """扫描所有草稿项目"""
        print(f"开始扫描目录: {self.drafts_directory}")

        if not self.drafts_directory.exists():
            raise FileNotFoundError(f"目录不存在: {self.drafts_directory}")

        # 遍历所有子目录
        for item in self.drafts_directory.iterdir():
            if not item.is_dir():
                continue

            # 跳过系统目录
            if item.name.startswith('.') or item.name == '整合':
                print(f"  跳过: {item.name}")
                continue

            print(f"  扫描: {item.name}")
            try:
                project = self._scan_project(item)
                self.projects.append(project)
            except Exception as e:
                print(f"    错误: {e}")

        print(f"\n扫描完成，共找到 {len(self.projects)} 个项目\n")
        return self.projects

    def _scan_project(self, project_path: Path) -> DraftProject:
        """扫描单个草稿项目"""
        # 计算项目大小
        size_bytes = sum(
            f.stat().st_size
            for f in project_path.rglob('*')
            if f.is_file()
        )
        size_mb = round(size_bytes / (1024 * 1024), 2)

        # 解析配置文件
        agency_config = self._parse_agency_config(project_path)
        timeline_config = self._parse_timeline_config(project_path)
        settings_config = self._parse_settings(project_path)

        # 检测 AI 功能
        ai_features = self._detect_ai_features(project_path)

        return DraftProject(
            name=project_path.name,
            path=str(project_path),
            size_mb=size_mb,
            timeline_count=timeline_config.get('timeline_count', 0),
            media_count=agency_config.get('media_count', 0),
            resolution=agency_config.get('resolution', 0),
            edit_duration_seconds=settings_config.get('edit_duration', 0),
            ai_features=ai_features,
            has_digital_human='数字人' in ai_features,
            has_aigc='AIGC' in ai_features,
            create_time=settings_config.get('create_time'),
            last_edit_time=settings_config.get('last_edit_time')
        )

    def _parse_agency_config(self, project_path: Path) -> Dict:
        """解析 draft_agency_config.json"""
        config_file = project_path / "draft_agency_config.json"

        if not config_file.exists():
            return {'media_count': 0, 'resolution': 0}

        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return {
                    'media_count': len(data.get('marterials', [])),
                    'resolution': data.get('video_resolution', 0)
                }
        except Exception:
            return {'media_count': 0, 'resolution': 0}

    def _parse_timeline_config(self, project_path: Path) -> Dict:
        """解析 Timelines/project.json"""
        config_file = project_path / "Timelines" / "project.json"

        if not config_file.exists():
            return {'timeline_count': 0}

        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return {
                    'timeline_count': len(data.get('timelines', []))
                }
        except Exception:
            return {'timeline_count': 0}

    def _parse_settings(self, project_path: Path) -> Dict:
        """解析 draft_settings (INI 格式)"""
        settings_file = project_path / "draft_settings"

        if not settings_file.exists():
            return {}

        try:
            config = configparser.ConfigParser()
            config.read(settings_file, encoding='utf-8')

            if 'General' in config:
                general = config['General']
                return {
                    'create_time': int(general.get('draft_create_time', 0)),
                    'last_edit_time': int(general.get('draft_last_edit_time', 0)),
                    'edit_duration': int(general.get('real_edit_seconds', 0))
                }
        except Exception:
            pass

        return {}

    def _detect_ai_features(self, project_path: Path) -> List[str]:
        """检测使用的 AI 功能"""
        features = []
        resources_path = project_path / "Resources"

        if not resources_path.exists():
            return features

        # 检测数字人
        if (resources_path / "digitalHuman").exists():
            digital_human_path = resources_path / "digitalHuman"
            if any(digital_human_path.iterdir()):
                features.append('数字人')

        # 检测 AIGC
        aigc_path = project_path / "aigc_material"
        if aigc_path.exists() and any(aigc_path.iterdir()):
            features.append('AIGC')

        # 检测音频处理
        audio_alg_path = resources_path / "audioAlg"
        if audio_alg_path.exists():
            audio_files = list(audio_alg_path.glob("*_human.wav"))
            if audio_files:
                features.append('AI配音')

        # 检测视频算法
        video_alg_path = resources_path / "videoAlg"
        if video_alg_path.exists() and any(video_alg_path.iterdir()):
            features.append('视频增强')

        # 检测抠图
        matting_path = project_path / "matting"
        if matting_path.exists() and any(matting_path.iterdir()):
            features.append('智能抠图')

        # 检测智能裁剪
        crop_path = project_path / "smart_crop"
        if crop_path.exists() and any(crop_path.iterdir()):
            features.append('智能裁剪')

        return features

    def export_summary(self, output_file: str, format: str = 'json'):
        """导出项目概览"""
        if format == 'json':
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(
                    [asdict(p) for p in self.projects],
                    f,
                    ensure_ascii=False,
                    indent=2
                )
        elif format == 'csv':
            self._export_csv(output_file)

        print(f"已导出到: {output_file}")

    def _export_csv(self, output_file: str):
        """导出为 CSV 格式"""
        import csv

        if not self.projects:
            return

        with open(output_file, 'w', encoding='utf-8-sig', newline='') as f:
            # 使用第一个项目的字段作为表头
            fieldnames = list(asdict(self.projects[0]).keys())
            writer = csv.DictWriter(f, fieldnames=fieldnames)

            writer.writeheader()
            for project in self.projects:
                row = asdict(project)
                # 将列表转为字符串
                row['ai_features'] = ', '.join(row['ai_features'])
                writer.writerow(row)

    def print_summary(self):
        """打印项目概览"""
        if not self.projects:
            print("没有找到项目")
            return

        print("=" * 100)
        print(f"{'项目名称':<20} {'大小(MB)':<10} {'时间线':<8} {'媒体':<6} {'分辨率':<8} {'AI功能':<30}")
        print("=" * 100)

        for p in self.projects:
            ai_str = ', '.join(p.ai_features) if p.ai_features else '-'
            print(f"{p.name:<20} {p.size_mb:<10.2f} {p.timeline_count:<8} {p.media_count:<6} {p.resolution:<8} {ai_str:<30}")

        print("=" * 100)
        print(f"总计: {len(self.projects)} 个项目")
        print(f"总大小: {sum(p.size_mb for p in self.projects):.2f} MB")
        print(f"使用AI功能的项目: {sum(1 for p in self.projects if p.ai_features)} 个")
        print("=" * 100)


if __name__ == "__main__":
    # 测试代码
    scanner = DraftScanner(r"H:\video\JianyingPro Drafts")
    scanner.scan_all()
    scanner.print_summary()
    scanner.export_summary("draft_summary.json", "json")
    scanner.export_summary("draft_summary.csv", "csv")
