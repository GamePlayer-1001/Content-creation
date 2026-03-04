"""
图片渲染器
封装 render_xhs_v2.js 脚本，将 Markdown 渲染成图片
"""
import subprocess
from pathlib import Path
from typing import List, Optional


class ImageRenderer:
    """图片渲染器"""

    def __init__(self):
        """初始化渲染器"""
        self.project_root = Path(__file__).parent.parent.parent
        self.render_script = self.project_root / 'tools' / 'card' / 'render_xhs_v2.js'

        if not self.render_script.exists():
            raise FileNotFoundError(f"渲染脚本不存在: {self.render_script}")

    def render(
        self,
        markdown_file: Path,
        output_dir: Path,
        theme: str = 'default',
        width: int = 1080,
        height: int = 1440,
        dpr: int = 2
    ) -> List[Path]:
        """
        渲染 Markdown 文件为图片

        Args:
            markdown_file: Markdown 文件路径
            output_dir: 输出目录
            theme: 视觉主题
            width: 图片宽度
            height: 图片高度
            dpr: 设备像素比

        Returns:
            生成的图片文件路径列表
        """
        # 确保输出目录存在
        output_dir.mkdir(parents=True, exist_ok=True)

        # 构建命令（render_xhs_v2.js 只支持 -s 和 -o 参数）
        cmd = [
            'node',
            str(self.render_script),
            str(markdown_file),
            '-s', theme,
            '-o', str(output_dir)
        ]

        print(f"渲染图片: {markdown_file.name}")
        print(f"  主题: {theme}")
        print(f"  输出目录: {output_dir}")

        try:
            # 执行渲染
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                encoding='utf-8',
                timeout=60
            )

            if result.returncode != 0:
                raise RuntimeError(f"渲染失败: {result.stderr}")

            # 收集生成的图片文件
            images = sorted(output_dir.glob('*.png'))

            print(f"  生成 {len(images)} 张图片")

            return images

        except subprocess.TimeoutExpired:
            raise RuntimeError("渲染超时（60秒）")
        except Exception as e:
            raise RuntimeError(f"渲染出错: {str(e)}")


if __name__ == '__main__':
    # 测试代码
    renderer = ImageRenderer()
    print("图片渲染器初始化成功")
    print(f"渲染脚本: {renderer.render_script}")
