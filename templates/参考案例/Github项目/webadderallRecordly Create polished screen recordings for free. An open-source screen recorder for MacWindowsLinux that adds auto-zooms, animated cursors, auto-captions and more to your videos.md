---
title: "webadderall/Recordly: Create polished screen recordings for free. An open-source screen recorder for Mac/Windows/Linux that adds auto-zooms, animated cursors, auto-captions and more to your videos."
source: "https://github.com/webadderall/Recordly"
author:
  - "[[GitHub]]"
published:
created: 2026-04-02
description: "Create polished screen recordings for free. An open-source screen recorder for Mac/Windows/Linux that adds auto-zooms, animated cursors, auto-captions and more to your videos. - webadderall/Recordly"
tags:
  - "clippings"
---
## 记录

语言：EN | [简中](https://github.com/webadderall/Recordly/blob/main/README.zh-CN.md)

[![Recordly 标志](https://camo.githubusercontent.com/67874919a401de6bd131527728b06612b05f170c70485512b508697155f6d1f0/68747470733a2f2f692e706f7374696d672e63632f74526e4c386748702f4672616d652d352e706e67)](https://camo.githubusercontent.com/67874919a401de6bd131527728b06612b05f170c70485512b508697155f6d1f0/68747470733a2f2f692e706f7374696d672e63632f74526e4c386748702f4672616d652d352e706e67)

### 制作精美专业的屏幕录制视频。

[Recordly](https://www.recordly.dev/) 是一款开源的屏幕录制和编辑工具，适用于制作演示视频、产品视频和社交媒体短片。录制屏幕或窗口后，即可直接进入编辑器，导出带有光标特效、缩放、背景、注释、摄像头叠加等功能的精美视频。

[![Recordly演示视频](https://github.com/webadderall/Recordly/raw/main/demo.gif)](https://github.com/webadderall/Recordly/blob/main/demo.gif)

> [!note] Note
> 非常感谢 **tadees** 对本项目的支持。这笔捐款将用于支付 macOS 签名和公证的 Apple 开发者费用。 [**请支持本项目。**](https://ko-fi.com/webadderall/goal?g=0)

---

## Recordly是什么？

Recordly 是一款桌面应用程序，用于录制和编辑屏幕录像，并内置动态演示工具。用户无需将原始素材发送到单独的编辑器中才能添加缩放、光标美化或样式化背景等效果，Recordly 即可在一个应用程序中完成所有工作流程。

Recordly 运行在：

平台说明：

- **macOS** 使用基于 ScreenCaptureKit 的原生截图辅助函数。
- **Windows** 在支持的版本中使用原生 Windows 图形捕获 (WGC) 辅助程序，并具有原生 WASAPI 音频支持。
- **Linux** 通过 Electron 捕获 API 进行录制。目前 Linux 不支持光标隐藏。

---

## 核心功能

## 自动缩放、光标优化和风格化边框

Recordly 可以自动通过缩放建议突出活动，平滑光标移动，添加动态效果，并将最终合成放置在带有壁纸、颜色、渐变、模糊、内边距和阴影的样式框架内。

[![Recordly 光标和缩放演示视频](https://github.com/webadderall/Recordly/raw/main/feature1.gif)](https://github.com/webadderall/Recordly/blob/main/feature1.gif)

## 动态摄像头气泡叠加层

添加网络摄像头画面作为叠加气泡，使用预设或自定义坐标定位，镜像，控制阴影和圆角，还可以选择使其对缩放做出反应，以便在运动过程中保持视觉平衡。

[![Recordly 网络摄像头叠加演示视频](https://github.com/webadderall/Recordly/raw/main/feature2.gif)](https://github.com/webadderall/Recordly/blob/main/feature2.gif)

## 专为演示而设计的时轴编辑

使用拖放式时间线工具进行缩放、修剪、速度区域调整、注释、添加音频区域和裁剪感知编辑。将作品保存为`.recordly` 项目文件，并可随时重新打开。

[![Recordly 时间线编辑器截图](https://github.com/webadderall/Recordly/raw/main/feature3.png)](https://github.com/webadderall/Recordly/blob/main/feature3.png)

---

## 所有功能

### 记录

- 录制整个屏幕或单个应用程序窗口
- 录制完成后直接跳转到编辑器
- 捕获麦克风音频和系统音频
- 在支持的情况下，请使用原生捕获后端。
- `.recordly` 从已保存的项目文件 继续编辑
- 从应用中打开现有录音或现有项目文件。

### 时间线和编辑

- 拖放式时间线编辑
- 修剪掉不需要的部分
- 添加手动缩放区域
- 根据光标活动情况使用自动缩放建议
- 添加加速和减速区域
- 添加文本、图像和图表注释
- 在时间轴上添加额外的音频区域
- 裁剪录制的画面
- 保存并重新打开项目，编辑器状态将保留。

### 光标控制

- 显示或隐藏渲染的光标叠加层
- 光标大小调整
- 光标平滑
- 光标运动模糊
- 光标点击弹跳
- 光标摆动
- 光标循环模式，实现更清晰的循环导出
- 用于渲染叠加层的 macOS 风格光标资源

### 网络摄像头叠加层

- 启用或禁用摄像头画面叠加
- 上传、替换或删除网络摄像头录像
- 镜像网络摄像头画面
- 尺寸控制
- 预设位置和自定义 X/Y 轴放置
- 利润控制
- 圆度控制
- 影子控制
- 可选的缩放响应式摄像头缩放功能

### 边框样式和背景

- 内置壁纸
- 从壁纸目录中发现运行时壁纸
- 自定义上传背景
- 纯色背景
- 渐变背景
- 框架填充
- 圆角
- 背景模糊
- 阴影
- 最终帧的宽高比预设

### 出口

- MP4导出
- GIF导出
- 出口品质甄选
- GIF帧速率选择
- GIF循环切换
- GIF尺寸预设
- 纵横比和输出尺寸控制
- 在系统文件管理器中显示导出的文件

### 工作流程和可用性

- 可自定义键盘快捷键
- 应用内快捷方式参考
- 编辑的反馈和问题链接
- 项目持久性（用于编辑器首选项）
- 导出后更快的预览恢复

---

## 屏幕截图

[![Recordly 编辑器截图](https://camo.githubusercontent.com/87bda3e00f91464996b5cf6234477561a715ea374811707924d0c68f601283c6/68747470733a2f2f692e706f7374696d672e63632f434b786d384452732f53637265656e73686f742d323032362d30332d32302d61742d372d30372d32322d706d2e706e67)](https://camo.githubusercontent.com/87bda3e00f91464996b5cf6234477561a715ea374811707924d0c68f601283c6/68747470733a2f2f692e706f7374696d672e63632f434b786d384452732f53637265656e73686f742d323032362d30332d32302d61742d372d30372d32322d706d2e706e67)

[![Recordly 录制界面截图](https://camo.githubusercontent.com/02ebe780ec33956a3c640d996fc8cfd5917a3712addd9d39911a6b9952580134/68747470733a2f2f692e706f7374696d672e63632f686a7764595279562f53637265656e73686f742d323032362d30332d32302d61742d312d35332d35372d706d2e706e67)](https://camo.githubusercontent.com/02ebe780ec33956a3c640d996fc8cfd5917a3712addd9d39911a6b9952580134/68747470733a2f2f692e706f7374696d672e63632f686a7764595279562f53637265656e73686f742d323032362d30332d32302d61742d312d35332d35372d706d2e706e67)

[![Recordly 时间线截图](https://camo.githubusercontent.com/50a380c41ef515700569d64b44d2373bb35ed9818a35caea3a874ad63e914aa5/68747470733a2f2f692e706f7374696d672e63632f5a6e3956593662672f53637265656e73686f742d323032362d30332d31382d61742d362d33322d35392d706d2e706e67)](https://camo.githubusercontent.com/50a380c41ef515700569d64b44d2373bb35ed9818a35caea3a874ad63e914aa5/68747470733a2f2f692e706f7374696d672e63632f5a6e3956593662672f53637265656e73686f742d323032362d30332d31382d61742d362d33322d35392d706d2e706e67)

---

## 安装

## 下载构建版本

预编译版本可在以下网址获取：

[https://github.com/webadderall/Recordly/releases](https://github.com/webadderall/Recordly/releases)

---

## Arch Linux / Manjaro（耶！）

从 AUR 安装 ( [recordly-bin](https://aur.archlinux.org/packages/recordly-bin) )：

```
yay -S recordly-bin
```

PKGBUILD、桌面入口、版本同步以及可选的 **本地源码** 打包功能都位于 **[recordly-aur](https://github.com/firtoz/recordly-aur)** 中，因此本仓库无需处理 Arch 的发布相关事务。如需联系维护者以及了解软件包的更新方式，请参阅该仓库或 AUR 软件包页面。

---

## 从源代码构建

```
git clone https://github.com/webadderall/Recordly.git recordly
cd recordly
npm install
npm run dev
```

对于打包构建：

```
npm run build
```

此外，还提供针对特定目标的构建命令：

- `npm run build:mac`
- `npm run build:win`
- `npm run build:linux`

---

## macOS：“无法打开应用”

本地构建的应用程序可能会被 macOS 隔离。

移除隔离标记：

```
xattr -rd com.apple.quarantine /Applications/Recordly.app
```

---

## 系统要求

| 平台 | 最低版本 | 笔记 |
| --- | --- | --- |
| **macOS** | macOS 12.3 (Monterey) | 使用 ScreenCaptureKit 进行屏幕截图时需要用到它。 |
| **视窗** | Windows 10 20H1（内部版本 19041，2020 年 5 月） | 需要此组件才能实现 Windows 原生图形捕获 (WGC) 辅助程序和最佳光标隐藏效果。 |
| **Linux** | 任何现代发行版 | 录音通过 Electron Capture 实现。系统音频通常需要 PipeWire。 |

> [!important] Important
> 在 Windows 版本 19041 之前的版本中，录制仍然可以通过备用捕获功能进行，但录制内容中可能仍然会显示真实的操作系统光标。

---

## 用法

## 记录

1. 启动 Recordly。
2. 选择一个屏幕或窗口。
3. 选择麦克风和系统音频选项。
4. 开始录制。
5. 停止录制以打开编辑器。

## 编辑

在编辑器中，您可以：

- 添加剪辑、缩放、速度区域和注释
- 调整光标行为和预览音量
- 使用壁纸、颜色、渐变、模糊、边距和边角来装饰相框
- 添加或调整网络摄像头叠加画面
- 添加额外的音频区域
- 裁剪画面并选择宽高比

随时将您的工作保存为`.recordly` 项目。

## 出口

出口选项包括：

- **MP4** 用于标准视频输出
- **GIF格式** 便于轻量级分享和循环播放

导出前，您可以调整特定格式的设置，例如质量、GIF 帧速率、GIF 循环播放和输出尺寸。

---

## 局限性

### 光标捕获

Recordly 会在录制画面上叠加一个美观的光标遮罩层。平台光标隐藏行为仍取决于操作系统支持。

**macOS**

- ScreenCaptureKit 可以干净利落地排除真实光标。

**视窗**

- 获得最佳效果需要 Windows 10 Build 19041+ 和原生捕获助手。
- 旧版本会回退到 Electron 捕获，因此实际光标可能仍然可见。

**Linux**

- Electron桌面截图目前不支持光标隐藏。
- 如果同时启用渲染光标叠加，导出内容可能会同时显示真实光标和样式化的光标。

### 系统音频

系统音频支持因平台而异。

**视窗**

- 原生 WASAPI 支持

**Linux**

- 通常需要 PipeWire

**macOS**

- 需要 macOS 12.3 或更高版本以及基于 ScreenCaptureKit 的工作流程

---

## 工作原理

Recordly 将平台特定的捕获层与渲染器驱动的编辑器和导出管道相结合。

**捕获**

- 电子坐标记录和应用流程
- macOS 使用原生 ScreenCaptureKit 辅助函数
- Windows 使用原生的 Windows 图形捕获 (WGC) 辅助程序，并在可用时使用原生音频辅助程序。

**编辑**

- 时间线区域定义了缩放、剪辑、速度变化、音频叠加和注释。
- 光标和摄像头样式在编辑器状态下应用

**渲染**

- **场景合成由PixiJS** 处理。

**出口**

- 预览中使用的场景逻辑与导出的 MP4 或 GIF 输出中使用的逻辑相同

**项目**

- `.recordly` 文件存储源媒体路径和编辑器状态，以便稍后可以重新打开工作。

---

## 贡献

欢迎投稿。

以下方面尤其需要帮助：

- Linux 捕获和光标行为
- 出口业绩和稳定性
- UI和UX优化
- 本地化工作
- 新增编辑器工具和工作流程优化

请保持 pull request 的重点在于测试录制/编辑/导出流程，并避免无关的重构。

请参阅 `CONTRIBUTING.md` 相关指南。

---

## 社区

错误报告和功能请求：

[https://github.com/webadderall/Recordly/issues](https://github.com/webadderall/Recordly/issues)

欢迎提交 Pull Request。

---

## 支持者名人堂

---

## 执照

Recordly 采用 **AGPL 3.0** 许可。

---

## 鸣谢

## 致谢

Recordly 最初是优秀 [OpenScreen](https://github.com/siddharthvaddem/openscreen) 项目的一个分支，此后进行了大幅修改。