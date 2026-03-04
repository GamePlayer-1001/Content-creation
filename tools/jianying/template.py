"""
剪映草稿模板工具

功能:
1. 将现有草稿作为模板（克隆）
2. 替换媒体文件路径
3. 批量生成新草稿
"""

import os
import sys
import json
import shutil
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass


@dataclass
class MediaMapping:
    """媒体文件映射"""
    old_path: str
    new_path: str
    media_type: str  # 'video', 'audio', 'image'


class TemplateExtractor:
    """草稿模板提取器"""

    def __init__(self, template_draft_path: str):
        self.template_path = Path(template_draft_path)

        if not self.template_path.exists():
            raise FileNotFoundError(f"模板草稿不存在: {template_draft_path}")

    def clone_to(self, target_draft_path: str, overwrite: bool = False) -> bool:
        """克隆草稿到新位置

        Args:
            target_draft_path: 目标草稿路径
            overwrite: 是否覆盖已存在的草稿

        Returns:
            是否成功
        """
        target_path = Path(target_draft_path)

        # 检查目标是否存在
        if target_path.exists() and not overwrite:
            raise FileExistsError(f"目标草稿已存在: {target_draft_path}")

        # 复制整个草稿目录
        if target_path.exists():
            shutil.rmtree(target_path)

        shutil.copytree(self.template_path, target_path)

        print(f"[OK] 克隆草稿: {self.template_path.name} -> {target_path.name}")
        return True

    def get_media_list(self) -> List[Dict]:
        """获取模板中的媒体文件列表"""
        agency_config_file = self.template_path / "draft_agency_config.json"

        if not agency_config_file.exists():
            return []

        try:
            with open(agency_config_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('marterials', [])
        except Exception as e:
            print(f"读取媒体列表失败: {e}")
            return []

    def print_info(self):
        """打印模板信息"""
        media_list = self.get_media_list()

        print("\n=== 模板信息 ===")
        print(f"名称: {self.template_path.name}")
        print(f"路径: {self.template_path}")
        print(f"大小: {self._get_folder_size():.2f} MB")
        print(f"\n媒体文件数: {len(media_list)}")

        for i, media in enumerate(media_list, 1):
            print(f"  {i}. {media.get('source_path', 'unknown')}")

    def _get_folder_size(self) -> float:
        """获取文件夹大小（MB）"""
        total_size = 0
        for dirpath, dirnames, filenames in os.walk(self.template_path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                if os.path.exists(fp):
                    total_size += os.path.getsize(fp)
        return total_size / (1024 * 1024)


class DraftEditor:
    """草稿编辑器 - 修改已克隆的草稿"""

    def __init__(self, draft_path: str):
        self.draft_path = Path(draft_path)

        if not self.draft_path.exists():
            raise FileNotFoundError(f"草稿不存在: {draft_path}")

    def update_media_paths(self, media_mappings: List[MediaMapping]) -> bool:
        """更新媒体文件路径

        Args:
            media_mappings: 媒体文件映射列表

        Returns:
            是否成功
        """
        agency_config_file = self.draft_path / "draft_agency_config.json"

        if not agency_config_file.exists():
            print("警告: draft_agency_config.json 不存在")
            return False

        try:
            # 读取配置
            with open(agency_config_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # 更新媒体路径
            materials = data.get('marterials', [])
            updated_count = 0

            for material in materials:
                old_path = material.get('source_path', '')

                # 查找匹配的映射
                for mapping in media_mappings:
                    if mapping.old_path in old_path or os.path.basename(old_path) == os.path.basename(mapping.old_path):
                        material['source_path'] = mapping.new_path
                        updated_count += 1
                        print(f"  更新: {os.path.basename(old_path)} -> {mapping.new_path}")
                        break

            # 保存配置
            with open(agency_config_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            print(f"[OK] 更新了 {updated_count}/{len(materials)} 个媒体路径")
            return True

        except Exception as e:
            print(f"更新媒体路径失败: {e}")
            return False

    def update_key_value(self, media_mappings: List[MediaMapping]) -> bool:
        """更新 key_value.json 中的媒体信息"""
        key_value_file = self.draft_path / "key_value.json"

        if not key_value_file.exists():
            print("警告: key_value.json 不存在")
            return False

        try:
            with open(key_value_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # key_value.json 是一个 {material_id: {info}} 的字典
            # 更新媒体名称
            for material_id, info in data.items():
                material_name = info.get('materialName', '')

                for mapping in media_mappings:
                    old_basename = os.path.basename(mapping.old_path)
                    if old_basename in material_name:
                        new_basename = os.path.basename(mapping.new_path)
                        info['materialName'] = new_basename
                        break

            with open(key_value_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            print(f"[OK] 更新 key_value.json")
            return True

        except Exception as e:
            print(f"更新 key_value.json 失败: {e}")
            return False

    def clear_resources(self):
        """清除 Resources 目录中的旧媒体处理文件"""
        resources_path = self.draft_path / "Resources"

        if not resources_path.exists():
            return

        try:
            # 保留目录结构，但清空内容
            for item in resources_path.rglob('*'):
                if item.is_file():
                    item.unlink()

            print(f"[OK] 清除 Resources 目录")
        except Exception as e:
            print(f"清除 Resources 失败: {e}")


class BatchTemplateApplier:
    """批量模板应用器"""

    def __init__(self, template_draft_path: str, output_directory: str):
        self.extractor = TemplateExtractor(template_draft_path)
        self.output_dir = Path(output_directory)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def apply_to_media_list(
        self,
        media_files: List[str],
        draft_name_prefix: str = "auto_draft"
    ) -> List[str]:
        """对一组媒体文件批量应用模板

        Args:
            media_files: 媒体文件路径列表
            draft_name_prefix: 生成的草稿名称前缀

        Returns:
            生成的草稿路径列表
        """
        created_drafts = []

        for i, media_file in enumerate(media_files, 1):
            draft_name = f"{draft_name_prefix}_{i:03d}"
            output_draft_path = self.output_dir / draft_name

            print(f"\n[{i}/{len(media_files)}] 处理: {os.path.basename(media_file)}")

            try:
                # 1. 克隆模板
                self.extractor.clone_to(str(output_draft_path), overwrite=True)

                # 2. 获取模板的媒体列表
                template_media = self.extractor.get_media_list()

                if not template_media:
                    print("  警告: 模板中没有媒体文件")
                    continue

                # 3. 创建媒体映射（简单策略：第一个媒体替换为新文件）
                mappings = [
                    MediaMapping(
                        old_path=template_media[0].get('source_path', ''),
                        new_path=os.path.abspath(media_file),
                        media_type='video'  # 假设是视频
                    )
                ]

                # 4. 更新草稿
                editor = DraftEditor(str(output_draft_path))
                editor.update_media_paths(mappings)
                editor.update_key_value(mappings)
                editor.clear_resources()

                created_drafts.append(str(output_draft_path))
                print(f"  [OK] 成功创建草稿: {draft_name}")

            except Exception as e:
                print(f"  [FAIL] 失败: {e}")

        print(f"\n=== 批量处理完成 ===")
        print(f"成功: {len(created_drafts)}/{len(media_files)}")
        print(f"输出目录: {self.output_dir}")

        return created_drafts


# 命令行接口

def cli_extract_template(template_path: str):
    """提取并显示模板信息"""
    extractor = TemplateExtractor(template_path)
    extractor.print_info()


def cli_clone_draft(template_path: str, target_path: str, overwrite: bool = False):
    """克隆草稿"""
    extractor = TemplateExtractor(template_path)
    extractor.clone_to(target_path, overwrite=overwrite)


def cli_batch_apply(
    template_path: str,
    media_files: List[str],
    output_dir: str,
    prefix: str = "auto_draft"
):
    """批量应用模板"""
    applier = BatchTemplateApplier(template_path, output_dir)
    applier.apply_to_media_list(media_files, prefix)


if __name__ == "__main__":
    # 测试代码
    template_draft = r"H:\video\JianyingPro Drafts\001"

    if os.path.exists(template_draft):
        print("=== 测试：提取模板信息 ===")
        cli_extract_template(template_draft)

        print("\n=== 测试：克隆草稿 ===")
        test_output = r"H:\Project\videocheck\output\test_clone"
        cli_clone_draft(template_draft, test_output, overwrite=True)

        print("\n=== 测试：查看克隆的草稿 ===")
        cloned = TemplateExtractor(test_output)
        cloned.print_info()
