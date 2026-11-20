# Budget World Model (丐版世界模型)

> **A Poor Man's Gemini-Powered Heavy-Frontend AIRP** (*穷鬼那基于 Gemini 的重前端 AIRP*)
>
> [中文文档 (Default)](./README.md) | [Operating Protocol](./docs/SESSION_RULES.md)

**Budget World Model** is a zero-server, zero-extra-API-cost **complete heavy-frontend AI-powered 2D RPG engine and Single-Master-GM + Parallel-Subagents runtime** built entirely on Google Workspace (**Google Apps Script + Google Drive + Gmail + One Gemini Master GM Session**).

## Key Highlights

1. **Complete Heavy-Frontend RPG Engine (v4)**: Built-in **2D Canvas Tilemap & A\* Pathfinding**, **Turn-Based Combat & AI Battle Diplomacy (P0)**, **Equipment / Skills / EXP Leveling**, **External Portrait / Sprite / Fullscreen CG Lightbox Loader**, **Affairs-Driven NPC Cross-Map Migration & `onTriggerReaction` Interruption**, **AI JSON Schema Auto-Repair & 3-Slot Local Snapshot Rollback**, plus the **Rune Catcher** waiting minigame.
2. **Single Master GM + Parallel Subagents (Zero Second Session, Zero Message Board Doc)**:
   - **Unified `[RPG-LOG]` Channel**: Frontend sends unified `[RPG-LOG]` emails periodically (every 5 min when unsynced logs exist) and on player-triggered P0 actions.
   - **One Master GM Session**: Listens to `subject:"[RPG-LOG]"`. Resolves blocking P0 immediately (`p0Revision++`), then spawns parallel **P1 Prefetch** and **P2 World Evolution** subagents that return JSON patches only; Master merges them safely by field (`p2Revision++`, never overwriting `player.x/y` or `latestP0Response`).
3. **16 Deterministic Whitelist Actions** & **Automatic Inbox Hygiene** (Gmail archive filter + periodic `cleanupRpgTaskEmails()`).

## Full Setup Guide (3 Minutes)

1. **Google Drive**: Upload `data/rpg_world_data.json` and copy its file ID as `<YOUR_WORLD_FILE_ID>`.
2. **Google Apps Script**: Open https://script.google.com/, paste `apps-script/Code.gs` (fill in `WORLD_FILE_ID`), add an HTML file named `Index` with `apps-script/Index.html`, and deploy as a Web App (**Execute as: Me**, **Who has access: Only myself**).
3. **Gmail Filter**: Filter `subject:"[RPG-LOG]"` → **Skip the Inbox (Archive it)** + label `RPG-BG-Tasks`.
4. **One Master GM Session**: Open **1 new Gemini chat**, replace `<YOUR_WORLD_FILE_ID>`, and paste the Master GM startup prompt from `docs/SESSION_RULES.md`.
