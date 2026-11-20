# 双会话运营规范与数据协议 (Dual-Session Operating Rules)

## 1. 统一邮件通道与双会话分工
- **统一 `[RPG-LOG]` 邮件**：前端定时（每 5 分钟有新未同步日志时）或玩家人为触发（P0 交互）时统一发送 `[RPG-LOG]` 邮件，邮件本身不拆分 P0/P1/P2 前缀。
- **独立会话 A（P0 + P1）**：监听 `subject:"[RPG-LOG]"`。严格三步：① 素材防复用检查 & 极速交付 P0（递增 `p0Revision` 立刻存盘）；② 先规划 P1 清单与交棒 P2 事项写入协作留言板占位；③ 再动手执行 P1 预热并存盘。
- **独立会话 B（P2）**：每 15–30 分钟定时巡检协作留言板与云盘最新 log，避开会话 A 已认领的 P1，分块更新 `shops`、`quests`、`lore.cgGallery`、新素材、`lore.worldBg`/`characterProfiles`、`affairs`（含 `onTriggerReaction` 与 `nextAffair`），每完成一小块立刻存盘并递增 `p2Revision`（严禁覆盖 `player.x/y`、`latestP0Response`、`p0Revision`）。
- **防循环**：两个会话均只写云盘 JSON 与留言板 Doc，绝不回复或发送带 `[RPG-LOG]` / `[RPG-P*]` 的邮件。

## 2. 16 项白名单动作指令（均需唯一 `actionId`）
- `MODIFY_HP` / `MODIFY_MP` / `MODIFY_GOLD` / `ADD_EXP`
- `ADD_ITEM` / `REMOVE_ITEM` / `EQUIP_ITEM` / `LEARN_SKILL`
- `START_BATTLE` / `MOVE_NPC` / `UPDATE_AFFAIR`
- `SET_FLAG` / `UPDATE_STAT` / `UPDATE_QUEST` / `ADD_CG` / `ADVANCE_TIME`
