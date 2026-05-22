---
title: "如何获取oracle cloud永久免费的vps(4C/24G)"
source: "https://www.toutiao.com/article/7617372039707509282/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1777632600&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=0eab863e-b88e-47a4-b9ef-71017c6d84e7&source=m_redirect"
author:
  - "[[灵巧光束]]"
published: 2026-03-16
created: 2026-05-18
description: "Oracle免费ARM服务器真能一直用？，说永久免费又悄悄回收，到底卡在哪个时间点？。我上个月终于抢到一台Oracle的4核24G免费ARM服务器，不是云厂商画饼那种，是真能ssh进去、装Docker、跑小网站的那种。"
tags:
  - "clippings"
---
**Oracle免费ARM服务器真能一直用？，说永久免费又悄悄回收，到底卡在哪个时间点？。**

我上个月终于抢到一台Oracle的4核24G免费ARM服务器，不是云厂商画饼那种，是真能ssh进去、装Docker、跑小网站的那种。它不收钱，但也不是放那儿就完事了——第七天早上六点，我收到一封邮件，说实例被停用了。不是故障，是Oracle主动关的。我翻日志发现，前七天里有两天半夜CPU几乎归零，内存只占3%，连curl都懒得发。它没违约，条款里白纸黑字写着“需保持合理活跃度”。

这玩意儿不是传统VPS，更像一个带条件的开发沙盒。注册得填信用卡，但不扣费；选配置时界面不标“Always Free”，得自己算：4核必须配24G内存，多1G都不行，否则系统后台直接走付费流程。我第一次选了32G，创建按钮是灰的，试了三次才反应过来——不是bug，是硬规则。装系统选Ubuntu 22.04官方镜像最稳，CentOS Stream容易卡在cloud-init，别折腾。

![](https://p26-sign.toutiaoimg.com/tos-cn-i-axegupay5k/0915214f417743dca0e349c6bc74595f~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685812&x-signature=TeBCCmuJN%2F0YnRbcQZWDOmHjDtk%3D)

抢实例真得靠工具，不是玄学。我用的是GitHub上一个叫oci-arm-host-capacity的脚本，它不黑系统，就是不停查Oracle接口，看哪个可用域突然有空位。我们测出来，东京区凌晨2点、法兰克福区早上5点释放最多，可能和运维换班、硬件上架有关。脚本每8分钟扫一次，成功那回只花了11秒。别信什么“全自动多账号抢”，Oracle一查IP+密钥指纹就封API权限，我朋友试过，第二天access denied。

保活这事，不能硬刷负载。我见过有人用stress-ng把CPU顶到90%，结果第三天就被回收了。Oracle监控的不是峰值，是“持续低活动”——连续7天里，95%时间CPU低于10%，内存低于10%，网络几乎没包进出，就触发审计。后来我改了策略：装个轻量Nginx，放个index.html，写个脚本每5分钟curl自己一下；再加一行定时任务，往/var/log/keepalive.log里写时间戳；最后让服务器每小时去httpbin.org打个招呼。三项加起来，CPU常年0.7%-2.3%，内存固定82MB，Oracle就没再动它。

![](https://p26-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/c89f982f0efb4551ae7ed04bc2f018be~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685812&x-signature=Ig8WNxDmmmc650vJhSHZ86SPeks%3D)

数据千万别存在系统盘。引导卷（bootVolume）虽然免费，但它绑死实例，一删全没。我把MySQL数据目录、网站文件全挪到单独挂载的200GB块存储上，格式化成ext4，fstab里加noatime参数。实例挂了？重装一台新的，挂上卷，改两行systemctl start mysqld，网站立刻回来。Terraform我只写三段：开实例、创建卷、绑定卷。脚本放在GitHub，每次点一下就行，不用记命令。

账号别贪多。我试过用第二个邮箱再开一个免费实例，结果第二天所有API调用失败，客服回邮件说“检测到关联行为，限制资源创建”。现在我就留一个主账号跑这台4C24G，另外用X86微实例当监控跳板——装个Uptime Kuma，盯住主服务器的心跳，真挂了就手动点一下重启。

磁盘那200GB别全用来存东西。我分了150G给MySQL，30G给备份，剩下20G空着。Oracle监控写入频次，纯只读挂载撑不过四天。每天凌晨2点自动备份一次网站代码到本地，用rsync推过去，日志保留7天自动轮转。

有次忘关测试脚本，半夜跑了个Python爬虫，抓了200个页面。第二天OCI控制台弹告警：“检测到异常出站流量”。我没慌，立马停掉，等一小时再看，监控曲线平了，也没回收。关键不是不能动，是别让系统觉得你“在用，但又没真用”。

现在这台机器跑了23天，跑了三个小工具：一个短链生成器，一个私有RSS抓取器，还有一个本地知识库。它们加起来每天HTTP请求不到200次，内存占用最高110MB，CPU峰值3.1%。不是不能更省，而是Oracle的算法就卡在这个模糊地带——太静，它收；太闹，它疑；刚好，它留。

我截图存了配额页、监控图、回收邮件原文。不是为了显摆，是怕哪天Oracle改规则，我能立刻看懂哪里不对。工具和脚本都开源了，地址在GitHub搜oci-keepalive就行。

就这样。