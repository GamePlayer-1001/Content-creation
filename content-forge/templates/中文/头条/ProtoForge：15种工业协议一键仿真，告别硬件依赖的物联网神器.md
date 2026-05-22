---
title: "ProtoForge：15种工业协议一键仿真，告别硬件依赖的物联网神器"
source: "https://www.toutiao.com/article/7632667393499693611/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1777254864&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=4a8b2d70-de28-4a78-b1d2-f4a03d6d493e&source=m_redirect"
author:
  - "[[硕腾]]"
published: 2026-04-25
created: 2026-05-18
description: "还在为买不到PLC、摄像头、传感器而发愁？还在用真实设备调试协议，被日志逼疯？推荐一款刚挖到的开源神器——ProtoForge，物联网协议仿真与测试平台，装上就能用，点几下就能模拟真实设备，让你的上位机、网关、SCADA 系统在零硬件环境下"
tags:
  - "clippings"
---
作品声明：个人观点、仅供参考

还在为买不到PLC、摄像头、传感器而发愁？还在用真实设备调试协议，被日志逼疯？  
推荐一款刚挖到的开源神器—— **ProtoForge** ，物联网协议仿真与测试平台， **装上就能用，点几下就能模拟真实设备** ，让你的上位机、网关、SCADA 系统在零硬件环境下完成完整通信测试。

## ✅ 核心能力一览：

- **15 种工业协议** ：Modbus TCP/RTU、OPC-UA、MQTT、GB28181、S7、MC、FINS、BACnet……
- **全链路仿真** ：不只是模拟数值，而是完整模拟协议交互（比如 GB28181：SIP注册→目录查询→INVITE→RTP推流→BYE）
- **49 个设备模板** ：PLC、传感器、CNC、摄像头、HVAC，选模板→起名字→一键创建
- **实时调试日志** ：WebSocket 推送协议报文，支持协议/方向/关键词筛选
- **可视化场景编排** ：拖拽式联动规则，模拟复杂工业流程
- **一键测试 + 数据转发** ：InfluxDB / HTTP Webhook / 文件，轻松对接
- **JWT + RBAC + 限流 + bcrypt** ：安全设计到位，生产环境可用

## 快速体验（2分钟）：

bash

复制

下载

```
git clone https://github.com/suoten/ProtoForge.git
cd ProtoForge
pip install -e .
cd web && npm install && npm run build && cd ..
protoforge demo
# 打开 http://localhost:8000，admin / admin
```

## 项目地址

- **GitHub**: https://github.com/suoten/ProtoForge
- **Gitee**: https://gitee.com/suoten/ProtoForge

让物联网开发，像 Web 开发一样敏捷。

> 适合：物联网开发、工业自动化、测试工程师、协议学习、系统集成商