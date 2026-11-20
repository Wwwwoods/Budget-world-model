# 开局模组库 (`starters/`) 与自制题材创世指南

本仓库将**通用 RPG 引擎框架**（`apps-script/` + `data/template_blank_world.json`）与**具体游戏题材开局**（`starters/`）彻底解耦：

| 开局文件 | 题材风格 | 核心特色 |
| :--- | :--- | :--- |
| `fantasy_morningwind.json` | 西幻边境冒险《晨风边境》 | 双地图连通、迷雾影魔遭遇战、游商卡琳跨图迁移事务栏、古遗迹暗火倒计时 |
| `cyberpunk_neon_alley.json` | 赛博朋克侦探《霓虹九区：债屋雨夜》 | 义体医生商店、讨债无人机战斗、EMP/神经超频技能、全街宵禁倒计时 |
| `wuxia_bamboo_inn.json` | 古风武侠悬疑《青竹客栈：风雨夜》 | 客栈大堂、黑衣刺客试探战、内功吐纳与剑意技能、子时封门暗线 |

## 零代码自制开局：用「创世会话」捏你自己的专属游戏

新开一个专门的 Gemini 对话（**创世会话**），复制下面提示词填入你想玩的题材，它会自动生成合规的 v4 开局 JSON 并存进你的云盘，拿到 `FILE_ID` 后交给 Master GM 就能开玩：

```text
请作为《丐版世界模型（Budget World Model v4）》的【创世会话（World Creator）】，帮我量身定制一套全新的 2D RPG 开局世界 JSON，并直接保存到我的 Google 云盘文件夹 `RPG_Live_World` 中。

我想玩的游戏设定如下（请按我的偏好自由发挥细节）：
- 题材与世界观：<例如：克苏鲁民国侦探 / 废土拾荒 / 校园异能 / 蒸汽朋克飞艇>
- 主角身份与初始能力：<例如：失忆的古董店学徒，擅长鉴定与符咒>
- 想要的氛围与核心冲突：<例如：悬疑慢热，7 天后小镇将举行诡异祭典>

技术要求（请严格遵守，确保能被引擎直接加载运行）：
1. 以本仓库 `data/template_blank_world.json` 或 `starters/fantasy_morningwind.json` 的 v4 JSON 结构为模板（`schemaVersion: 4`）。
2. 必须包含：至少 1–2 张可自由探索的二维 `maps`（含可行走 `tiles`、带交互选项的 NPC、商店、宝箱或探索出口）、至少 1 个可直接触发的 `enemies` 回合制敌人、主角 `equipment` 与 3 个特色 `skills`、`shops`、`quests`、`lore`（含 `worldBg`、至少 2 名带专属口癖 `catchphrase` 的 `characterProfiles` 与 1 条初始 `cgGallery`），以及至少 2 条带 `countdown`、`onTriggerReaction` 和 `nextAffair` 的活体 `affairs` 事务栏。
3. 生成完毕后，请将文件保存为 `rpg_world_data_<题材英文名>.json` 到我的 Google 云盘 `RPG_Live_World` 文件夹，并直接把该文件的 **Google 云盘 FILE_ID** 返回给我，方便我填进 Apps Script 和交给 Master GM 运营会话开玩！
```
