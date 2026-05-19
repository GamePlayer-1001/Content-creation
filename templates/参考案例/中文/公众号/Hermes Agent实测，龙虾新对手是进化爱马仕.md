---
title: "Hermes Agent实测，龙虾新对手是进化爱马仕"
source: "https://mp.weixin.qq.com/s/GYd6-F7B4jgNT20Y5XvpXQ"
author:
published:
created: 2026-05-18
description:
tags:
  - "clippings"
---
X今天狂推的OpenClaw的真对手，Hermes（爱马仕）Agent，我也是测上了。  
  
和Openclaw不同，Hermes是针对怎么让Agent自进化来设计的，  
支持Karpathy大神的LLM wiki ✔️  
能在Obsidian围绕各种主题做持续迭代的本地知识库 ✔️  
能用Claude额度✔️（Openclaw不行了！）  
  
用下来它们其实是互补🔄的：  
OpenClaw当执行位，因为Skills的数量和接入平台的数量还是领先。Hermes当指挥位，自带完整对话收录，能记住我偏好设定使用习惯和Skill自迭代。所以我现在尝试在discord里，指挥爱马仕用虾用CC用CLI。  
  
Hermes有意思的设定是当它完成一个复杂任务的时候（调用工具五次以上），会把整个解决的过程做成一个markdown格式的skill。后续在用这个技能的时候发现了更好的路径，还会更新文档。  
  
这解决了我一个超大痛点，比如不同平台的浏览器自动化的时候，我要专门写Rules去规定不同skills的调用顺序。  
  
Hermes做了三层记忆系统，用SQLite+数据库全文检索+大模型自动摘要，把所有历史对话存下来。  
  
跟OpenClaw依赖大模型本身判断能力来规避风险不同，Hermes在框架上拉满了，做了用户授权，危险命令审批，还做了容器隔离和上下文扫描。这样就算是用一般的模型也够安全。  
  
安装方式很简单，还能把OpenClaw带的记忆，技能和设置一键导入进来。用OpenClaw，Codex App，Claude Code运行这段提示语就行：  
  
Prompt  
…  
帮我安装这个项目，  
curl -fsSL  
https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh  
| bash  
  
安装好了，检查我本地OpenClaw，运行hermes claw migrate迁移指令。  
…  
  
不用担心本地电脑会不会没有环境，这个从Python 3.11，Node.js，环境依赖，仓库克隆都装了，还做了全局hermes命令。  
  
先写到这，  
手机就剩1%的电了，  
要是Agent能解决就好了。。。  
我多用一周后开源一把配置文件

卡尔的AI沃茨

向上滑动看下一个