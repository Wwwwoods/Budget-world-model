# 可插拔模块库 (`modules/`) — 战斗系统与题材专属游戏系统

不同题材的 RPG 需要完全不同的战斗与核心系统（西幻适合回合制、武侠适合拼刀节拍、赛博/动作适合即时闪避、克苏鲁侦探适合掷骰检定与理智值）。因此本框架将**战斗系统**与**扩展游戏系统**彻底模块化，统一存放在 `modules/` 目录下，按需插拔。

## 内置模块清单

| 模块文件 | 注册 ID (`meta.combatMode` / 系统) | 适用题材 | 核心玩法 |
| :--- | :--- | :--- | :--- |
| `combat_turn_based.js` | `turn_based`（默认内置） | 西幻、JRPG、武侠 | 经典回合制（攻击/技能/防御/道具/AI 战场交涉/撤退） |
| `combat_action_dodge.js` | `action_dodge` | 动作冒险、赛博、高节奏玄幻 | 哈迪斯式实时弹幕预警闪避 + 冷却斩击反击 |
| `combat_rhythm_parry.js` | `rhythm_parry` | 武侠拼刀、音游 RPG、仪式战 | 节拍判定条精准格挡/弹反，连击倍率暴击 |
| `combat_narrative_dice.js` | `narrative_dice` | 克苏鲁、跑团 TRPG、悬疑侦探 | `2d6` 属性检定（大成功/成功/代价成功/失败）+ AI 叙事裁定 |
| `system_sanity_investigation.js` | `sanity_investigation`（扩展系统） | 克苏鲁、赛博精神病、心魔武侠 | 理智/稳定性计量条 + 线索板 + 阈值触发异常状态 |

## 如何接入自定义模块

1. 在开局 JSON 中设置 `meta.combatMode`（例如 `"rhythm_parry"`、`"action_dodge"` 或 `"narrative_dice"`）。
2. 在 Google Apps Script 的 `Index.html` 末尾（`</body>` 前）贴入对应模块 `<script>` 代码，或让「创世会话」直接按 `window.RPG_MODULES.registerCombat(id, { name, start(ctx) })` 接口生成新模块。
