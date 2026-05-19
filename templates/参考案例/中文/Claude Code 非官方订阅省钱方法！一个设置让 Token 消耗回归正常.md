---
title: "Claude Code 非官方订阅省钱方法！一个设置让 Token 消耗回归正常"
source: "https://www.toutiao.com/article/7621010758918275638/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1775569403&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=72c2b71b-05c1-41f4-b32b-d4b1f172713e&source=m_redirect"
author:
  - "[[老猿视角]]"
published: 2026-03-25
created: 2026-04-08
description: "最近很多开发者发现，如果不使用官方订阅或 API，Claude Code 的 Token 消耗会远超预期。这背后的关键原因在于 Cache（缓存）无法命中。Claude Code问题出在哪？"
tags:
  - "clippings"
---
作品声明：内容取材于网络

最近很多开发者发现，如果不使用官方订阅或 API，Claude Code 的 Token 消耗会远超预期。这背后的关键原因在于 Cache（缓存）无法命中。

![](https://p26-sign.toutiaoimg.com/tos-cn-i-axegupay5k/0989e0fa1b594814987cd42e40238a79~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1776221878&x-signature=s1Okjh6%2FMEAr%2BzYAzyN0z%2FcJ7eU%3D)

Claude Code

**问题出在哪？**

当你通过非官方渠道使用 Claude Code 时，系统可能无法有效利用 Prompt Caching 功能。这意味着，那些本该被缓存、不计费或低费率的重复上下文（如项目规范、常用文档），每次都会被重新计算，导致费用直线飙升。

**解决方案来了！**

X上一名资深AI开发者分享了一个亲测有效的解决方法，且非常简单，只需修改配置文件，禁用 Attribution Header 即可。

操作步骤：

在你的 Claude Code 配置文件中，加入或修改以下环境变量：

> "CLAUDE\_CODE\_ATTRIBUTION\_HEADER": "0"

这个小小的改动，很可能就是帮你省下大笔 Token 费用的关键！

![](https://p26-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/dbcbf581df3d44678e255013c2751c9e~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1776221878&x-signature=hi%2BNO0HxsOAd%2BS0yo0t1ryj6KfE%3D)

温馨提示：在修改任何配置前，建议先备份原文件，以防万一。

#头条创作训练营# #ClaudeCode#