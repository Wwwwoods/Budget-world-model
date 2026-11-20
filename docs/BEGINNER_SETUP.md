# 小白保姆级安装教程（能交给 Gemini 干的，全都直接复制提示词！）

不需要懂编程、不需要买服务器、不需要配置 API Key。你只需要一个 **Google 账号（带 Gmail 和 Google 云盘）** 和 **Gemini**，跟着下面 4 步复制粘贴，5 分钟就能玩上你自己的 AI 无限演进 2D RPG！

## 第 1 步：让 Gemini 帮你自动配好云盘和 Gmail（直接复制发给 Gemini）

新开一个 Gemini 对话，把下面这段提示词复制发给它：

```text
请帮我初始化《丐版世界模型（Budget World Model）》的 Google 运行环境，按顺序帮我做两件事：

1. 在我的 Google 云盘根目录新建一个文件夹，命名为 `RPG_Live_World`；然后请把我想玩的开局 JSON（你可以先帮我放入经典西幻开局 `fantasy_morningwind.json` 的内容，或等我告诉你我想玩的题材再生成）保存为 `rpg_world_data.json` 放进这个文件夹里。
2. 在我的 Gmail 里帮我创建一条自动过滤规则：
   - 匹配条件：主题包含 `[RPG-LOG]`（即 `subject:"[RPG-LOG]"`）
   - 执行动作：跳过收件箱（自动归档），并打上标签 `RPG-BG-Tasks`（这样游戏同步发出的后台邮件不会弄乱我的收件箱）。

完成后，请把云盘里 `rpg_world_data.json` 的 **文件 ID（FILE_ID）** 直接复制出来发给我！
```

记下 Gemini 返回给你的 **`FILE_ID`**。如果想自己定制专属题材开局，先去 [开局模组库与创世指南](../starters/README.md) 复制「创世会话提示词」，让专门的 Gemini 对话帮你捏好开局 JSON 并拿到它的 `FILE_ID`。

## 第 2 步：花 2 分钟把游戏网页部署到你自己的 Google 私有网址

1. 打开 https://script.google.com/，点左上角 **新建项目**。
2. **放进后端代码**：删掉默认代码，粘贴本仓库 `apps-script/Code.gs` 全部内容，把顶部的 `<YOUR_WORLD_FILE_ID>` 换成第 1 步拿到的真实 `FILE_ID`（保留双引号）。
3. **放进前端游戏引擎**：点左侧“文件”旁的 **`+`** → 选 **HTML**，文件名严格输入 **`Index`**（首字母大写，不要加 `.html`），粘贴 `apps-script/Index.html` 全部内容并保存。
4. **发布为私人 Web 应用**：点右上角 **部署 → 新建部署** → 类型选 **Web 应用** → **执行身份**选 **我**，**谁可以访问**选 **仅我自己** → 点 **部署**，首次弹窗依次点 **授权访问 → 选账号 → 高级 → 转至项目（不安全） → 允许**。
5. 复制弹出来的 **Web 应用网址** 并加入浏览器书签。

## 第 3 步：开启 1 个「运营 AI（Master GM）」会话（复制提示词即完成）

新开 **1 个独立的 Gemini 对话**，把 `<你的FILE_ID>` 换掉后粘贴发送：

```text
请作为我的《丐版世界模型（Budget World Model）》的【Master GM 主运营会话】长期运行。

请立刻为本对话创建一个 Gmail 邮件触发的后台监听任务：
- 监听条件：主题包含 "[RPG-LOG]"（即 subject:"[RPG-LOG]"）
- 我的云盘实时世界 JSON 文件 ID：<你的FILE_ID>

以后每当你收到 [RPG-LOG] 邮件触发时，请严格按以下并行流水线运作（如我已安装 rpg-game-runtime 技能请同步遵循）：
1. 【主会话极速交付 P0】：先读触发邮件里的最新玩家日志与意图，再读云盘 JSON；检查新角色/新场景素材不复用且匹配剧情；优先处理玩家正在等待的 P0 反馈，写入 latestP0Response（可附带唯一 actionId 的白名单动作）或新地图 maps / player 坐标，递增 p0Revision 并立刻写回云盘。
2. 【后台并行派发 P1 与 P2 子代理】：交付 P0 后，立刻并行派发两个后台子代理，要求它们只返回结构化 JSON 补丁、不要直接覆盖云盘：
   - P1 预热子代理：提前画好当前地图相邻未探索区域的底稿、即时 NPC 分支与素材（产出 maps 增量与 p1Cache）。
   - P2 世界演进子代理：刷新商店（shops）、推进任务线与 CG（quests / lore.cgGallery）、补充新素材（assets）、丰富世界观与人物口癖（lore.worldBg / lore.characterProfiles）、更新重要角色/地图事务栏（affairs，务必预写打断反应 onTriggerReaction 与倒计时到期后的 nextAffair）。
3. 【安全合并存盘】：等子代理返回补丁后，重新读取云盘最新 JSON，只合并对应字段，绝不覆盖 player.x/y、latestP0Response 与 p0Revision，递增 p2Revision 并写回云盘。
4. 【防循环铁律】：绝对不要回复或发送任何主题包含 [RPG-LOG] 或 [RPG-P*] 的邮件。
```

## 第 4 步：打开书签，开始游玩！

打开第 2 步收藏的 Web 应用网址即可开始游玩。发起自由交涉、战场交涉或进入未探索区域时，网页会自动唤醒后台 Master GM；等待期间可照常开菜单、逛图鉴或点右上角 **🎮 小游戏**，新剧情到达时不会打断你。
