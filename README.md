# 丐版世界模型 (Budget World Model)

> **穷鬼那基于 Gemini 的重前端 AIRP**
>
> [English Version](./README_EN.md) | [运营规范与数据协议](./docs/SESSION_RULES.md) | [👶 小白保姆级安装教程](./docs/BEGINNER_SETUP.md) | [🎮 开局模组库与创世指南](./starters/README.md)

**丐版世界模型（Budget World Model）** 是一套“零自建服务器、零额外 API 费用”的**完整重前端 AI 驱动 2D RPG 引擎与单主会话并行子代理运营架构**。它完全依托 Google 生态（**Google Apps Script + Google Drive + Gmail + 单个 Gemini Master GM 会话并行调度子代理**），让你在浏览器独立标签页中体验完整的 2D RPG，同时享受由大模型持续演进的动态地图、活体 NPC 事务栏与暗线剧情。

## 核心架构亮点

1. **完整重前端 RPG 引擎（v4，无需 AI 现场搓 HTML）**
   - 内置 **2D Canvas 瓦片地图 + A\* 点击寻路**、**回合制战斗与 AI 战场交涉（P0）**、**装备/技能/经验升级成长**、**外部立绘/精灵图加载与容错回退**、**AI 增量 JSON 自动校验修复 + 3 槽位本地快照回滚**，以及内置**符文捕手**等待小游戏。
2. **全局时间轴（`globalTime`）与活体事务栏（`affairs`）**
   - 切换地图、消磨时间、战胜敌人或关键互动均令 `Time + 1`。
   - 重要角色与地图均拥有倒计时事务栏：倒计时归零自动演进至 `nextAffair` 并驱动 **NPC 自动跨图迁移**；玩家在事务期间点击 NPC 可直接触发 **`⚡ 打断事务`（`onTriggerReaction`）演出**。
3. **极简“单主会话 + 并行子代理”架构（零第二会话、零留言板 Doc）**
   - **统一 `[RPG-LOG]` 邮件通道**：游戏端定时（每 5 分钟有新未同步行为时）或玩家人为触发（自由对话、战场交涉、进入未生成地图）时，统一发送 `[RPG-LOG]` 邮件。
   - **主会话（Master GM）**：只配 1 条 Gmail 监听。收到 `[RPG-LOG]` 后先**极速交付 P0 并递增 `p0Revision` 存盘**（前端 8s→1s 轮询自动捕获，不打断菜单、战斗与小游戏）；随后在后台**异步并行派发 P1 预热子代理 + P2 世界演进子代理**，子代理只返回结构化 JSON 补丁，由主会话统一按字段安全合并写回云盘（递增 `p2Revision`，前端每 5 分钟静默合并），彻底杜绝写冲突。
4. **16 项确定性白名单动作指令 + 自动邮箱清理**
   - 前端防重放校验执行 16 项原子白名单指令；Gmail 过滤规则自动归档 `[RPG-LOG]` 邮件，网页端每隔 10 分钟自动调用 `cleanupRpgTaskEmails()` 清理旧同步邮件。

## 目录结构

```text
gaiban-world-model/
├── README.md                  # 中文说明与完整安装部署教程（默认）
├── README_EN.md               # English Documentation & Setup Guide
├── apps-script/                  # 【通用引擎框架】
│   ├── Code.gs                # Google Apps Script 后端（云盘读写、统一 [RPG-LOG] 发信、自动清邮件）
│   └── Index.html             # 完整重前端 2D RPG 引擎（v4）
├── data/                        # 【通用数据结构与模板】
│   └── rpg_world_data.json    # 初始世界数据结构（含双地图、回合制敌人、装备技能、事务栏示例）
│   └── template_blank_world.json  # 通用空白世界 JSON 骨架模板（v4）
└── docs/                        # 【教程与运营规范】
│   ├── BEGINNER_SETUP.md         # 小白保姆级安装教程（含可直接复制的 Gemini 提示词）
    └── SESSION_RULES.md       # 单主会话并行子代理运营规范与 16 项白名单协议
└── starters/                      # 【开局模组库（与通用引擎解耦）】
    └── README.md                  # 开局模组目录与「创世会话」自制题材指南（含西幻/赛博/武侠等题材）
```

## 完整安装与部署教程（3 分钟上手）

### 第 1 步：在 Google 云盘上传初始世界 JSON
1. 将本仓库的 `data/rpg_world_data.json` 上传至你的 Google 云盘（建议建一个专属文件夹如 `RPG_Live_World`）。
2. 打开文件分享链接，复制 `/d/` 与 `/view` 之间的文件 ID，记为 `<YOUR_WORLD_FILE_ID>`。

### 第 2 步：部署 Google Apps Script 网页端
1. 打开 https://script.google.com/ 新建项目（可命名为 `Budget World Model`）。
2. 清空默认的 `Code.gs`，粘贴 `apps-script/Code.gs` 全部内容，把顶部的 `WORLD_FILE_ID` 替换为第 1 步的真实 ID。
3. 点击左侧“文件”旁的 **+** → 选择 **HTML**，严格命名为 `Index`（首字母大写，不带 `.html` 后缀），粘贴 `apps-script/Index.html` 全部内容并保存。
4. 点击右上角 **部署 → 新建部署 → Web 应用**，执行身份选 **我**，谁可以访问选 **仅我自己**，完成首次 Google 授权后收藏生成的 Web 应用网址即可游玩。

### 第 3 步：配置 Gmail 自动归档过滤规则
在 Gmail 中以 `subject:"[RPG-LOG]"` 创建过滤器，勾选 **跳过收件箱（将其归档）** 并应用标签 `RPG-BG-Tasks`。

### 第 4 步：开启 1 个独立的 Gemini 主运营会话（复制下方启动提示词）
只需打开 **1 个全新的 Gemini 对话**，将 `<YOUR_WORLD_FILE_ID>` 替换为你的云盘 JSON ID 后粘贴发送：

```text
请作为我的《丐版世界模型（Budget World Model）》的【Master GM 主运营会话】长期运行。

请为本对话创建一个 Gmail 邮件触发的后台监听任务：
- 监听条件：主题包含 "[RPG-LOG]"（即 subject:"[RPG-LOG]"）
- 云盘实时世界 JSON 文件 ID：<YOUR_WORLD_FILE_ID>

每次收到 [RPG-LOG] 邮件触发后，请严格按以下并行流水线执行（如已安装 rpg-game-runtime 技能请同步遵循）：
1. 【主会话极速交付 P0】：读取触发邮件中的最新玩家 log 与意图，以及云盘 JSON。先做素材防复用与剧情匹配检查（缺失则先补素材），随后优先完成玩家等待的 P0 反馈，写入 latestP0Response（含经校验唯一 actionId 的 16 项白名单动作）或新地图 maps / player 坐标，递增 p0Revision 并立刻写回云盘。
2. 【异步并行派发 P1 与 P2 子代理】：交付 P0 后，立即在后台并行派发两个子代理（要求子代理只返回结构化 JSON 补丁，禁止直接覆写云盘防竞态）：
   - P1 预热子代理：为当前地图预热相邻未生成区域底稿、即时 NPC 分支、局部事件钩子与素材（产出 maps 增量与 p1Cache 补丁）。
   - P2 世界演进子代理：推进商店刷新（shops）、任务线与 CG（quests / lore.cgGallery）、新素材（assets）、世界观与人物侧写口癖（lore.worldBg / lore.characterProfiles）、以及重要角色/地图事务栏（affairs，必须预写 onTriggerReaction 与倒计时归零后的 nextAffair）。
3. 【字段级安全合并写回】：子代理返回补丁后，重新读取云盘最新 JSON，仅合并其负责的字段，严禁覆盖 player.x/y、latestP0Response 与 p0Revision，递增 p2Revision 并写回云盘。
4. 【防循环铁律】：绝不回复或发送任何主题带 [RPG-LOG] 或 [RPG-P*] 的邮件。
```
