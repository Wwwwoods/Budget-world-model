# 开局自制题材创世指南

## 零代码自制开局：用「创世会话」捏你自己的专属游戏

其实最好的素材是现成的，这边建议找个旧游戏丢给AI让它拆了做素材。

除此之外就是复制下面提示词改一改前几句世界观要求：

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
