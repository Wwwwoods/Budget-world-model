# 单主会话 + 并行子代理运营规范 (Master GM & Parallel Subagents Protocol)

## 1. 极简架构：1 个主会话 + 并行子代理
- **统一 `[RPG-LOG]` 邮件**：前端定时（每 5 分钟有未同步新行为时）或玩家人为触发（P0 交互）时统一发送 `[RPG-LOG]` 邮件。
- **单主运营会话（Master GM）**：只配 1 条 Gmail 监听（`subject:"[RPG-LOG]"`）。收到后：① 极速交付 P0 并递增 `p0Revision` 立刻存盘；② 异步并行派发 P1 预热子代理与 P2 世界演进子代理（子代理只返回结构化 JSON 补丁，不直接覆写云盘）；③ 主会话重新读取云盘最新 JSON，按字段安全合并补丁并递增 `p2Revision`（严禁覆盖 `player.x/y`、`latestP0Response` 与 `p0Revision`）。
- **防循环**：绝不回复或发送带 `[RPG-LOG]` / `[RPG-P*]` 的邮件。

## 2. 16 项确定性白名单动作指令（均需唯一 `actionId`）
- `MODIFY_HP` / `MODIFY_MP` / `MODIFY_GOLD` / `ADD_EXP`
- `ADD_ITEM` / `REMOVE_ITEM` / `EQUIP_ITEM` / `LEARN_SKILL`
- `START_BATTLE` / `MOVE_NPC` / `UPDATE_AFFAIR`
- `SET_FLAG` / `UPDATE_STAT` / `UPDATE_QUEST` / `ADD_CG` / `ADVANCE_TIME`
