---
title: "Codex直出透明背景设计素材"
source: "https://www.toutiao.com/article/7637145295477850665/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1778205547&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=104ea501-ab60-4f9f-9fcd-3e095ad196b4&source=m_redirect"
author:
  - "[[麦总玩AI]]"
published: 2026-05-07
created: 2026-05-18
description: "这下设计师真要被替代了！Codex 直出透明背景设计素材，已开源！以前想往网站里放一个像样的视觉素材，流程其实挺烦。你先要找设计师按场景画一张图。画完之后，如果要放进网页、PPT、App，还得让他再处理成透明背景。如果你想要一点动画，那又是"
tags:
  - "clippings"
---
**这下设计师真要被替代了！Codex 直出透明背景设计素材，已开源！**

以前想往网站里放一个像样的视觉素材，流程其实挺烦。

你先要找设计师按场景画一张图。

画完之后，如果要放进网页、PPT、App，还得让他再处理成透明背景。

如果你想要一点动画，那又是另一轮工作。要么做 GIF，要么做序列帧，要么做矢量动画。中间还会继续改尺寸、改边缘、改导出格式。

对大公司来说，这就是正常流程。

但对副业人、独立开发者、PM、自媒体作者来说，这个流程太重了。

现在这事可以直接交给 Codex。

我开源了一套 Codex 视觉素材 skill，专门解决这个问题。它可以帮你直出透明背景设计素材，也可以继续做 GIF、spritesheet、连续帧动画。

项目地址：

https://github.com/DwDestiny/codex-visual-asset-skills

先看效果。

![](https://p26-sign.toutiaoimg.com/tos-cn-i-axegupay5k/357020a4686143678d7bec21cbc977ba~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685852&x-signature=DaAmqac4REtXBO9ozGDoA3997hA%3D)

这不是一张只能拿来看看的配图。

它可以作为独立素材放进网页，也可以放进 PPT、App 引导页、公众号封面、电商详情页和游戏 UI。

这才是这个工具最有用的地方。

```
这次的重点不是让 AI 随便画一张图，而是让 Codex 把素材做成可以直接交付的文件。
```

**它能做什么**

这个仓库现在保留两个 skill。

第一个叫 \`transparent-visual-assets\`。

它负责生成透明背景设计素材。

比如网页里的小角色、产品插画、贴纸、图标、空状态插画、App 引导图、PPT 装饰元素。

以前这些东西要设计师画，画完还要抠图。现在你把用途、风格、尺寸告诉 Codex，它会先生成一张适合处理的纯色背景图，再自动清理成真正带透明通道的 PNG。

第二个叫 \`sprite-animation-assets\`。

它负责动画素材。

比如一个角色挥手，一组按钮动效，一套小游戏角色动作，产物可以是 GIF，也可以是 spritesheet 或 atlas。

这类角色、道具、背包、卷轴、按钮，都可以先做成一组风格统一的素材。

前端、游戏、小桌宠、网页动效，都可以直接接这种素材。

**怎么跟 Codex 配合**

安装命令：

```cs
npx skills add DwDestiny/codex-visual-asset-skills --skill '*' -g -a codex -y
```

装完之后，你就可以直接在 Codex 里调用。

想做一张透明背景网页素材，可以这样说：

```sql
Use $transparent-visual-assets to create a transparent PNG cartoon character asset for my website.
```

想把这个角色做成挥手 GIF 和 spritesheet，可以这样说：

```sql
Use $sprite-animation-assets to turn this character into a waving GIF and transparent spritesheet.
```

这里真正要说清楚的是用途。

素材准备用在哪？

网页、PPT、App、海报、电商详情页，还是小游戏？

想要什么风格？

可爱、科技、国潮、极简、像素、3D，还是手绘？

是否要动画？

只要你把这些说清楚，Codex 会按 skill 里的流程往下跑。

**可以放到哪些地方**

最直接的是网站。

Landing page 的主视觉、功能区的小插画、空状态图、按钮旁边的小贴纸，都可以直接用。

PPT 也能用。

汇报页、课程页、路演页、数据图旁边，都可以放一些透明素材，不用整页都靠矩形框硬撑。

自媒体和电商也能用。

公众号封面、小红书配图、商品角标、促销贴纸，都可以做成一套统一风格的素材包。

还有游戏和互动 UI。

角色、道具、背包图标、按钮素材、简单动效，都可以做成透明素材或 spritesheet。

**这套工具适合谁**

如果你本来就有设计师，这套东西可以当一个快速出草稿、出素材方向的工具。

如果你是独立开发者、副业人、PM、自媒体作者，那它的价值更直接。

你不用先学 PS，不用自己抠图，也不用每次都去素材站翻半小时。

你只需要告诉 Codex：我要什么素材，用在哪，什么风格，要不要动。

剩下的，让它按流程产出。

这块最牛批。

它不是让 AI 随便画张图，而是让 Codex 把设计素材做成可以交付的文件。

透明 PNG 能放进网页。

GIF 能放进文章和产品页。

spritesheet 能放进前端和游戏。

这就够实用了。

**后面继续做 PPT**

这次开源的是视觉素材 skill。

PPT 相关能力我已经单独拆到了 \`  
codex-visual-ppt-deck-builder\`，后面会继续分享。

那个方向会更适合做课程页、商业汇报、产品方案和知识卡片。

如果你对这类 Codex skill 感兴趣，可以先把这个仓库装上试一下。

后面我会继续拆，怎么把 Codex 从“写代码工具”，变成一条能出图、出素材、出 PPT、出完整产品视觉方案的工作流。