# tools/video/templates/
> L2 | 父级: /tools/video/CLAUDE.md

成员清单
README.md: 模板开发说明，约束 Remotion 组件输入与扩展方式
audio-utils.ts: 音效生成工具，输出消息声、发送声与背景音轨配置
chat-icons.tsx: 聊天模板图标集，提供语音、相机、返回等矢量图标组件
chat-line-preview.tsx: LINE 聊天预览组件，用于静态样式检查
chat-line-video.tsx: LINE 聊天视频模板，负责渲染 LINE 会话动画
chat-messenger-preview.tsx: Messenger 聊天预览组件，用于静态样式检查
chat-messenger-video.tsx: Messenger 聊天视频模板，负责渲染 Messenger 会话动画
chat-styles-comparison.tsx: 多聊天风格对比页，用于横向比较模板差异
chat-styles-preview-optimized.tsx: 优化版多风格预览页，用于快速选型与调样
chat-wechat-preview.tsx: 微信聊天预览组件，用于静态样式检查
chat-wechat-video.tsx: 微信聊天视频模板，负责渲染微信会话动画
chat-whatsapp-preview.tsx: WhatsApp 聊天预览组件，用于静态样式检查
chat-whatsapp-video.tsx: WhatsApp 聊天视频模板，负责渲染 WhatsApp 会话动画
data-visualization.tsx: 数据可视化模板，输出图表式短视频画面
destiny-extended.tsx: 命理扩展视频模板，承载多段解释与长镜头叙事
destiny-teller-promo.tsx: 命理推广视频模板，负责宣传型镜头与转化文案布局
test-simple.tsx: 最小 Remotion 测试模板，用于验证运行环境
wechat-destiny-chat.tsx: 微信命理聊天模板，以对话体呈现命理结果
wechat-destiny-promo.tsx: 微信命理宣传模板，强化卖点、节奏与转化
wechat-dialog-components.tsx: 微信对话通用子组件，提供气泡、卡片、导航与工具栏
wechat-dialog-video.tsx: 微信对话主模板，消费 pipeline 输出的 RenderItem 序列
wechat-enhanced.tsx: 增强版微信聊天模板，强调视觉细节与镜头层次
wechat-pixel-perfect.tsx: 像素级微信模板，追求界面拟真和布局精度
wechat-pro-icons.tsx: 专业图标版微信模板，强化图标与操作区视觉语言
wechat-realistic.tsx: 写实微信聊天模板，偏真实手机界面观感
wechat-real-mobile.tsx: 移动端写实微信模板，适配手机比例与交互细节
wechat-story.tsx: 微信故事模板，带结构化 story/message 类型定义
wechat-story-investment.tsx: 投资题材微信故事模板，面向金融、投资叙事场景

法则: 一文件一模板或一组共享组件·预览模板与正式渲染模板分开·共享组件变化先回写地图再改消费方

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
