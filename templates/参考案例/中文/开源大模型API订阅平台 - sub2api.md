---
title: "开源大模型API订阅平台 - sub2api"
source: "https://www.toutiao.com/article/7627046688955417098/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1776047573&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=f54d49f6-4c35-4b2f-8259-50033d8c30f6&source=m_redirect"
author:
  - "[[键煮咖啡]]"
published: 2026-04-10
created: 2026-05-18
description: "Sub2API 是一个 AI API 网关平台，用于分发和管理 AI 产品订阅的 API 配额。用户通过平台生成的 API Key 调用上游 AI 服务，平台负责鉴权、计费、负载均衡和请求转发。"
tags:
  - "clippings"
---
Sub2API 是一个 AI API 网关平台，用于分发和管理 AI 产品订阅的 API 配额。用户通过平台生成的 API Key 调用上游 AI 服务，平台负责鉴权、计费、负载均衡和请求转发。

![](https://p3-sign.toutiaoimg.com/tos-cn-i-axegupay5k/df34512b329641fb806f60ee99e41f1a~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685644&x-signature=gaLFdMT3S4r%2BOINlhhLJu8a0Zbc%3D) ![](https://p11-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/818443c17332427e9c5f8475c554788b~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685644&x-signature=XhnD%2FODOv66Fd93WaFR0mLQt8Sg%3D) ![](https://p11-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/0af592b1dbca469fa57aa7dc7b115890~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685644&x-signature=I%2BPRlNJP%2FMUzqxVTVizNp%2FEcbbE%3D)

## 核心功能

- **多账号管理** - 支持多种上游账号类型（OAuth、API Key）
- **API Key 分发** - 为用户生成和管理 API Key
- **精确计费** - Token 级别的用量追踪和成本计算
- **智能调度** - 智能账号选择，支持粘性会话
- **并发控制** - 用户级和账号级并发限制
- **速率限制** - 可配置的请求和 Token 速率限制
- **管理后台** - Web 界面进行监控和管理
- **外部系统集成** - 支持通过 iframe 嵌入外部系统（如支付、工单等），扩展管理后台功能

项目地址：  
https://github.com/Wei-Shaw/sub2api

可使用以下docker-compose文件一键运行。初次配置使用8080端口，配置完后使用80(映射8000端口)端口访问

```yaml
services:
  sub2api:
    container_name: sub2api
    restart: unless-stopped
    image: weishaw/sub2api
    ports:
      - "8080:8080"
      - "8000:80"
    environment:
      - DATABASE_URL=postgres://postgres:postgres@sub2api-db:5432/sub2api?sslmode=disable
      - REDIS_URL=redis://sub2api-redis:6379
    depends_on:
      - sub2api-db
      - sub2api-redis

  sub2api-db:
    container_name: sub2api-db
    restart: unless-stopped
    image: postgres:18
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=sub2api
    volumes:
      - /data/sub2api/postgres_data:/var/lib/postgresql/18/docker

  sub2api-redis:
    container_name: sub2api-redis
    restart: unless-stopped
    image: redis:7
    volumes:
      - /data/sub2api/redis_data:/data
```