# Budget World Model (丐版世界模型)

> **A Poor Man's Gemini-Powered Heavy-Frontend AIRP** (*穷鬼那基于 Gemini 的重前端 AIRP*)
>
> [中文文档 (Default)](./README.md) | [Dual-Session Operating Rules](./docs/SESSION_RULES.md)

**Budget World Model** is a zero-server, zero-extra-API-cost **heavy-frontend AI-powered 2D RPG engine and asynchronous dual-session runtime** built entirely on Google Workspace (**Google Apps Script + Google Drive + Gmail + Two Independent Gemini Sessions**).

## Key Highlights

1. **Complete Heavy-Frontend RPG Engine (v4)**: Built-in **Turn-Based Combat & AI Battle Diplomacy (P0)**, **Equipment / Skills / EXP Leveling**, **External Portrait / Sprite / Fullscreen CG Lightbox Loader**, **Affairs-Driven NPC Cross-Map Migration & `onTriggerReaction` Interruption**, plus **AI JSON Schema Auto-Repair & 3-Slot Local Snapshot Rollback**.
2. **Unified `[RPG-LOG]` Channel & Conflict-Free Dual Sessions**:
   - **Independent Session A (P0 + P1 — Gmail-Triggered on `subject:"[RPG-LOG]"`)**: (1) Deliver blocking P0 update immediately (`p0Revision++`); (2) Plan P1 prefetch items & P2 handoffs and write them to the shared Message Board Doc first to claim them; (3) Execute P1 prefetch and save to Drive.
   - **Independent Session B (P2 — Scheduled Every 15–30 min)**: Checks the Message Board and Drive logs, avoids Session A's claimed P1 items, and incrementally saves P2 updates (`p2Revision++`, silently merged every 5 minutes by the client).
3. **16 Deterministic Whitelist Actions** & **Automatic Inbox Hygiene** (Gmail archive filter + periodic `cleanupRpgTaskEmails()`).

## Full Setup Guide

1. **Google Drive**: Upload `data/rpg_world_data.json` (`<YOUR_WORLD_FILE_ID>`) and create a shared Google Doc Message Board (`<YOUR_MESSAGE_BOARD_DOC_ID>`).
2. **Google Apps Script**: Open https://script.google.com/, paste `apps-script/Code.gs` (fill in both IDs), add an HTML file named `Index` with `apps-script/Index.html`, and deploy as a Web App (**Execute as: Me**, **Who has access: Only myself**).
3. **Gmail Filter**: Filter `subject:"[RPG-LOG]"` → **Skip the Inbox (Archive it)** + label `RPG-BG-Tasks`.
4. **Two Independent Gemini Sessions**: Open New Chat 1 for Session A (Gmail trigger `subject:"[RPG-LOG]"`) and New Chat 2 for Session B (periodic schedule every 20 minutes), following `docs/SESSION_RULES.md`.
