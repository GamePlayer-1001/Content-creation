#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
项目管理工具 - Auto-Redbook-Skills
统一入口管理所有功能
"""
import sys
import subprocess
from pathlib import Path


class ProjectManager:
    def __init__(self):
        self.root = Path(__file__).parent.parent  # 项目根目录

    def show_menu(self):
        """显示主菜单"""
        print("\n" + "=" * 70)
        print("Auto-Redbook-Skills 项目管理工具")
        print("=" * 70)
        print("\n[素材管理]")
        print("  1. 查看素材库")
        print("  2. 更新热点素材")
        print("  3. 素材统计")
        print("\n[内容生成]")
        print("  4. 生成测试内容")
        print("  5. 完整系统测试")
        print("\n[发布管理]")
        print("  6. 测试手动发布")
        print("  7. 启动调度器")
        print("\n[项目工具]")
        print("  8. 查看项目结构")
        print("  9. 查看日志")
        print("  0. 退出")
        print("\n" + "=" * 70)

    def run_command(self, cmd, description=""):
        """执行命令"""
        if description:
            print(f"\n[执行] {description}...")
        try:
            result = subprocess.run(cmd, shell=True, cwd=self.root)
            return result.returncode == 0
        except Exception as e:
            print(f"[错误] {e}")
            return False

    def view_materials(self):
        """查看素材库"""
        self.run_command(
            f"python tools/scraper/xhs_trending_scraper.py",
            "查看素材库"
        )

    def update_materials(self):
        """更新热点素材"""
        print("\n[提示] 热点素材更新功能")
        print("当前使用手动精选素材库（config/topics.json）")
        print("如需自动抓取，可运行：python tools/scraper/xhs_trending_scraper.py")
        input("\n按回车继续...")

    def show_material_stats(self):
        """素材统计"""
        self.run_command(
            f"python materials/scripts/show_materials.py",
            "素材统计"
        )

    def generate_test_content(self):
        """生成测试内容"""
        self.run_command(
            "python generate_content_demo.py",
            "生成测试内容"
        )

    def test_complete_system(self):
        """完整系统测试"""
        self.run_command(
            "python test_complete_system.py",
            "完整系统测试"
        )

    def test_manual_publish(self):
        """测试手动发布"""
        print("\n[提示] 首次运行需要手动登录小红书")
        print("Cookie 会自动保存到 config/xhs_cookies.json")
        input("\n按回车继续...")
        self.run_command(
            "python test_publish_manual.py",
            "测试手动发布"
        )

    def start_scheduler(self):
        """启动调度器"""
        print("\n[警告] 调度器将全天候运行")
        print("按 Ctrl+C 可停止")
        input("\n按回车继续...")
        self.run_command(
            "python tools/scheduler/daily_scheduler.py",
            "启动调度器"
        )

    def show_project_structure(self):
        """查看项目结构"""
        structure_file = self.root / "PROJECT_STRUCTURE.md"
        if structure_file.exists():
            print("\n[项目结构文档]")
            print(f"文件位置: {structure_file}")
            print("\n按回车查看内容...")
            input()
            with open(structure_file, 'r', encoding='utf-8') as f:
                print(f.read())
        else:
            print("\n[错误] PROJECT_STRUCTURE.md 不存在")
        input("\n按回车继续...")

    def show_logs(self):
        """查看日志"""
        logs_dir = self.root / "logs"
        if not logs_dir.exists():
            print("\n[提示] 日志目录不存在")
            input("\n按回车继续...")
            return

        print("\n[日志文件列表]")
        for log_type in ['scheduler', 'scraping', 'generation', 'publishing']:
            type_dir = logs_dir / log_type
            if type_dir.exists():
                files = list(type_dir.glob('*.log'))
                if files:
                    print(f"\n{log_type}/ ({len(files)} 个文件)")
                    for f in sorted(files)[-5:]:  # 只显示最近5个
                        print(f"  - {f.name}")

        input("\n按回车继续...")

    def run(self):
        """运行主循环"""
        while True:
            self.show_menu()
            choice = input("\n请选择 (0-9): ").strip()

            if choice == '1':
                self.view_materials()
            elif choice == '2':
                self.update_materials()
            elif choice == '3':
                self.show_material_stats()
            elif choice == '4':
                self.generate_test_content()
            elif choice == '5':
                self.test_complete_system()
            elif choice == '6':
                self.test_manual_publish()
            elif choice == '7':
                self.start_scheduler()
            elif choice == '8':
                self.show_project_structure()
            elif choice == '9':
                self.show_logs()
            elif choice == '0':
                print("\n再见！")
                break
            else:
                print("\n[错误] 无效选择")


if __name__ == '__main__':
    manager = ProjectManager()
    manager.run()
