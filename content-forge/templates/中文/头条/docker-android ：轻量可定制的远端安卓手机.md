---
title: "docker-android ：轻量可定制的远端安卓手机"
source: "https://www.toutiao.com/article/7633560908140233251/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1777864784&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=d99551f7-0596-4848-bb3e-db52e2189075&source=m_redirect"
author:
  - "[[灵活代码工]]"
published: 2026-04-28
created: 2026-05-18
description: "docker-android ：轻量可定制的远端安卓手机docker-android 是一款轻量可定制的 Docker 镜像，内置安卓模拟器、KVM 虚拟化及 ADB 调试工具，可通过 scrcpy 实现远程操控。"
tags:
  - "clippings"
---
![](https://p3-sign.toutiaoimg.com/tos-cn-i-axegupay5k/d3a5ff063850470b87ea221a1dc3043c~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685822&x-signature=d3nF%2Bvjznkyt4G9Pzj9QV4Pv7ks%3D)

## docker-android ：轻量可定制的远端安卓手机

docker-android 是一款轻量可定制的 Docker 镜像，内置安卓模拟器、KVM 虚拟化及 ADB 调试工具，可通过 scrcpy 实现远程操控。执行简单命令即可运行：

$docker run --device /dev/kvm -p 5555:5555。  
该镜像支持定制安卓版本（如 API 33）、集成谷歌应用商店（Play Store），也可将安卓开发工具包（SDK）外置挂载，实现极致轻量化（未集成 SDK 时，压缩包仅 138MB）。  
其核心优势为：能在 CI/CD 流水线中实现快速、一致性的无头安卓测试，大幅节省环境搭建的时间与资源成本。

在很多场景里，你并不是想“在本机打开一个模拟器点点点”，而是想要一个 **可重复、可批量、可远程连接** 的 Android 环境：比如 CI 里跑 UI 测试、在服务器上统一提供模拟器实例、或者让测试机一键起一套固定规格的 Android 版本。

**HQarroum/docker-android** 很直接：  
把 **Android Emulator** 打包进一个 **尽量精简、可定制** 的 Docker 镜像里，让模拟器以“服务”的形式跑起来，并通过网络把 **ADB** 暴露出来，外部机器可以直接连接控制。

## 最小化依赖 + 远程可控的模拟器镜像

README 的描述强调了两点：

1. **体积优化（size-optimized）** ：只装“跑得起来并能远程控制”所需的最少组件。
2. **远程可控** ：容器内自带 ADB server，对外开放端口；你在容器外 adb connect 就能接入模拟器。

它的组成也写得很明确：镜像只包含 **Android emulator、ADB server、以及带 libvirt 支持的 QEMU** （用于虚拟化相关能力）。

## 主要特性一览

README 列的特性很“工程化”，基本都是为 CI/远程跑模拟器服务的：

- 基于 **Alpine** 的精简镜像，支持 **KVM** 加速（需要宿主机提供 /dev/kvm）。
- 内置 **JRE 11** 。
- 构建时可选 **Android API 版本 / 设备类型 / 镜像类型** 。
- 容器网络接口上内置了 **Emulator 与 ADB 的端口转发** （外部可直连）。
- 默认是 **headless 无界面** ，适合 CI farm；并且兼容 **scrcpy** 来远程控制屏幕。
- 还有一个关键行为： **模拟器重启会 wipe（擦除）镜像数据** （更像一次性测试环境）。

## 镜像体积：它为什么强调“可裁剪”

README 给了不同构建变体的体积对比（解压后/压缩后）：

- API 33 + Emulator：5.84 GB / 1.97 GB
- API 32 + Emulator：5.89 GB / 1.93 GB
- API 28 + Emulator：4.29 GB / 1.46 GB
- **不含 SDK 与 emulator 的构建** ：414 MB / 138 MB

这解释了它的设计思路：  
你可以把“沉重的 Android SDK”放到外部共享存储（NFS 等），容器里只保留运行所需的壳子，从而减少构建时间和镜像体积。

## 启动一个可远程连接的模拟器

## docker-compose 启动

README 给了 compose 的启动方式：

```nginx
docker compose up android-emulator
```

如果你要 GPU 加速，也有对应的 compose 服务名示例：

```
docker compose up android-emulator-cuda
# 以及带 playstore 的示例：
docker compose up android-emulator-cuda-store
```

## 纯 docker（KVM 加速）

构建镜像：

```nginx
docker build -t android-emulator .
```

运行（把宿主机 KVM 设备挂进容器，并映射 ADB 端口）：

```
docker run -it --rm --device /dev/kvm -p 5555:5555 android-emulator
```

连接 ADB：

```
adb connect 127.0.0.1:5555
```

如果你想远程“看屏幕并操作”，README 直接推荐 scrcpy：

```
scrcpy
```

## 两个“真实需求”

## 不想每次重启都丢数据

虽然默认重启会 wipe，但 README 提供了持久化 AVD 的办法：把容器里的 /data 挂载出去。

```
docker run -it --rm --device /dev/kvm -p 5555:5555 \
  -v ~/android_avd:/data \
  android-emulator
```

## 要测不同 Android 版本 / 不同镜像类型

构建时可以传参数控制：

- API\_LEVEL：Android 版本对应的 API level
- IMG\_TYPE：镜像类型（比如 Google APIs 或 Play Store）
- ARCHITECTURE：CPU 架构（README 提到主要支持 x86\_64 / x86）

示例（装 API 28 + Play Store，x86）：

```
docker build \
  --build-arg API_LEVEL=28 \
  --build-arg IMG_TYPE=google_apis_playstore \
  --build-arg ARCHITECTURE=x86 \
  --tag android-emulator .
```

## Play Store 镜像的“ADB key”坑点

README 特别提醒：如果你跑 google\_apis\_playstore 镜像， **容器内 emulator 和你本机 adb 客户端需要使用同一套 adbkey** 。它也给了生成方式，并要求放到./keys 目录覆盖。(\[GitHub\]\[1\])

```nginx
adb keygen adbkey
生成 adbkey / adbkey.pub，然后放进 ./keys
```

## 更偏 CI 的配置项

README 暴露了一些运行参数（例如：是否禁动画、内存、CPU 核心数、是否跳过 ADB 认证等），典型用法就是让 CI 更稳定/更快。  
例如它列了：

## 直接拉 Docker Hub 预构建镜像

如果你不想本地构建，README 提到 Docker Hub 有预构建镜像，tag 以 API level / 镜像类型区分。示例：

```
docker pull halimqarroum/docker-android:api-33
```

在Github中搜索docker-android