# 丐版世界模型 (Budget World Model)

> **穷鬼那基于 Gemini 的重前端 AIRP**
>
> [English Version](./README_EN.md) | [双会话运营与数据协议](./docs/SESSION_RULES.md)

**丐版世界模型（Budget World Model）** 是一套“零自建服务器、零额外 API 费用”的**重前端 AI 驱动 2D RPG 引擎与异步双会话运营架构**。它完全依托 Google 生态（**Google Apps Script + Google Drive + Gmail + 双独立 Gemini 会话**），让你在浏览器独立标签页中获得完整的 RPG Maker 风格 2D 游玩体验，同时享受由大模型持续演进的动态地图、活体 NPC 事务栏与暗线剧情。

## 核心架构亮点

1. **完整重前端 RPG 引擎（v4）**：内置**回合制战斗与 AI 战场交涉（P0）**、**装备/技能/经验升级成长**、**外部立绘/精灵/CG 大图画廊加载与容错回退**、**事务栏驱动 NPC 跨图迁移与 `onTriggerReaction` 打断演出**，以及 **AI 增量 JSON 自动校验修复 + 3 槽位本地快照回滚**。
2. **全局时间轴（`globalTime`）与角色/地图事务栏（`affairs`）**：切换地图、消磨时间或关键互动令 `Time + 1`，驱动重要角色与地图倒计时事务演进及跨图迁移。
3. **统一 `[RPG-LOG]` 邮件通道 + 独立双会话协同（防并发撞车）**：
   - **独立会话 A（P0 + P1，Gmail 监听 `subject:"[RPG-LOG]"`）**：① 优先交付 P0 即时反馈并递增 `p0Revision` 立刻存盘；② 先规划本轮 P1 清单与交棒 P2 事项写入协作留言板占位；③ 再动手执行 P1 预热并存盘。
   - **独立会话 B（P2，定时巡检）**：每 15–30 分钟巡检协作留言板与云盘最新 log，避开会话 A 已认领的 P1，分块推进商店、任务/CG、素材、世界观与人物侧写口癖、事务栏下一阶段预设，每完成一小块即刻存盘并递增 `p2Revision`。
4. **NPC 即时交互白名单动作指令**：前端防重放校验执行 16 项原子白名单指令（HP/MP/金币/经验/物品/装备/技能/战斗/NPC 迁移/事务更新/任务/CG/时间）。
5. **Gmail 自动归档 + 网页静默清理**：配置过滤规则自动归档 `[RPG-LOG]` 邮件，网页端定时自动清理旧同步邮件。

## 目录结构

```text
gaiban-world-model/
├── README.md                  # 中文说明与完整安装部署教程（默认）
├── README_EN.md               # English Documentation & Setup Guide
├── apps-script/
│   ├── Code.gs                # Google Apps Script 后端（云盘读写、统一 [RPG-LOG] 发信、自动清邮件）
│   └── Index.html             # 完整重前端 2D RPG 引擎（v4）
├── data/
│   └── rpg_world_data.json    # 初始世界数据结构（含双地图、战斗、装备技能、事务栏示例）
└── docs/
    └── SESSION_RULES.md       # 双会话（会话 A / 会话 B）运营规范与 JSON 协议
```

## 完整安装与部署教程

### 第 1 步：在 Google 云盘准备两个共享文件
1. 上传 `data/rpg_world_data.json` 到 Google 云盘，复制链接中 `/d/` 与 `/view` 之间的文件 ID 作为 `<YOUR_WORLD_FILE_ID>`。
2. 新建 Google 文档 `RPG_双会话协作留言板`，复制链接中 `/d/` 与 `/edit` 之间的文档 ID 作为 `<YOUR_MESSAGE_BOARD_DOC_ID>`。

### 第 2 步：部署 Google Apps Script 网页端
1. 打开 https://script.google.com/ 新建项目，将 `apps-script/Code.gs` 粘贴进 `Code.gs`，并把顶部的 `WORLD_FILE_ID` 与 `MESSAGE_BOARD_DOC_ID` 替换为第 1 步记下的真实 ID。
2. 新建 HTML 文件并严格命名为 `Index`（首字母大写），粘贴 `apps-script/Index.html` 并保存。
3. 点击 **部署 → 新建部署 → Web 应用**，执行身份选 **我**，谁可以访问选 **仅我自己**，完成首次 Google 授权后收藏生成的 Web 应用网址即可游玩。

### 第 3 步：配置 Gmail 自动归档过滤规则
在 Gmail 中以 `subject:"[RPG-LOG]"` 创建过滤器，勾选 **跳过收件箱（将其归档）** 并打标签 `RPG-BG-Tasks`。

### 第 4 步：分别开启两个独立 Gemini 会话

#### 会话 A（P0 + P1 急件与预热层）启动提示词（打开新对话 1 粘贴）
```text
请作为我的《丐版世界模型（Budget World Model）》双会话架构中的【独立会话 A（P0 + P1 急件与预热层）】长期运行。

请为本对话创建一个 Gmail 邮件触发的后台监听任务：
- 监听条件：主题包含 "[RPG-LOG]"（即 subject:"[RPG-LOG]"）
- 云盘实时世界 JSON 文件 ID：<YOUR_WORLD_FILE_ID>
- 双会话协作留言板 Google Doc ID：<YOUR_MESSAGE_BOARD_DOC_ID>

每次收到 [RPG-LOG] 邮件触发后，请严格按以下顺序执行：
1. 【素材防复用检查 & 极速交付 P0】：读取触发邮件、云盘 JSON 及留言板素材台账；先补齐缺失/不符素材，再优先完成玩家等待的 P0 反馈并写入 latestP0Response / 新地图，递增 p0Revision 立刻写回云盘。
2. 【先规划 P1 并写入留言板占位】：在动手做 P1 之前，先拟定本轮 P1 预热清单与交棒给会话 B 的 P2 事项，写入协作留言板 Google Doc，告知会话 B 这些 P1 已由会话 A 认领。
3. 【再执行 P1 预热】：写完留言板后，再按计划推进 P1 预热并写回云盘（maps / p1Cache）。
4. 【防循环铁律】：绝不回复或发送任何主题带 [RPG-LOG] 或 [RPG-P*] 的邮件。
```

#### 会话 B（P2 长线世界演进层）启动提示词（打开新对话 2 粘贴）
```text
请作为我的《丐版世界模型（Budget World Model）》双会话架构中的【独立会话 B（P2 长线世界演进层）】长期运行。

请为本对话创建一个定时巡检后台任务（不需要监听 Gmail 邮件，避免与会话 A 撞车）：
- 巡检频率：每 20 分钟执行一次（可调整为 15–30 分钟）
- 云盘实时世界 JSON 文件 ID：<YOUR_WORLD_FILE_ID>
- 双会话协作留言板 Google Doc ID：<YOUR_MESSAGE_BOARD_DOC_ID>

每次定时唤醒后，请严格按以下规则执行：
1. 【巡检留言板与最新状态】：先读取协作留言板 Google Doc（查看会话 A 已认领的 P1 清单与交棒的 P2 事项）和云盘 JSON（最新 behaviorLog、globalTime、affairs）。若无新变化则直接结束。
2. 【避开 P1、分块推进 P2 并即时存盘】：避开会话 A 正在做的 P1 范围，按需分块处理商店刷新（shops）、任务线与 CG（quests / lore.cgGallery）、新素材登记、世界观与人物侧写口癖（lore.worldBg / lore.characterProfiles）、以及重要角色/地图事务栏（affairs，务必预写 onTriggerReaction 与 nextAffair）。
3. 【增量存盘与并发保护】：每完成一小块即刻写回云盘 JSON 并递增 p2Revision，在留言板标记已完成项；严禁覆盖 player.x/y、latestP0Response 与 p0Revision。
4. 【防循环铁律】：绝不回复或发送任何主题带 [RPG-LOG] 或 [RPG-P*] 的邮件。
```
