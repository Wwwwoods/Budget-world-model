/**
 * Budget World Model Module: Narrative Dice Check Combat (narrative_dice)
 */
(function () {
  window.RPG_MODULES = window.RPG_MODULES || { combat: {}, systems: {}, registerCombat(id, p) { this.combat[id] = p; }, registerSystem(id, p) { this.systems[id] = p; } };
  window.RPG_MODULES.registerCombat("narrative_dice", {
    name: "跑团叙事掷骰检定 (2d6)",
    start(ctx) {
      const e = Object.assign({}, ctx.enemy);
      let progress = 0;
      const targetProgress = 3;
      ctx.container.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px;"><div style="display:flex;justify-content:space-between;font-size:13px;"><strong>🎲 危机对峙：${e.name}</strong><span id="dice-prog" style="color:#f3c669;">压制进度 0/${targetProgress}</span></div><div style="font-size:12.5px;color:#cbd5e1;">${e.intentHint || "选择策略进行 2d6 检定（≥10 大成功，7–9 代价成功，≤6 失利）。"}</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"><button type="button" class="choice-btn dice-act" data-mode="force">⚔️ 强攻压制</button><button type="button" class="choice-btn dice-act" data-mode="wit">🧠 观察弱点 / 智取</button><button type="button" class="choice-btn" id="dice-talk">🗣️ 自由交涉 (AI P0)</button><button type="button" class="choice-btn" id="dice-flee">🏃 借机脱身</button></div><div id="dice-log" style="font-size:12.5px;padding:10px;border-radius:8px;background:rgba(0,0,0,0.3);min-height:60px;">等待投掷 2d6 检定……</div></div>`;
      const progEl = ctx.container.querySelector("#dice-prog"), logEl = ctx.container.querySelector("#dice-log");
      ctx.container.querySelectorAll(".dice-act").forEach(btn => btn.addEventListener("click", () => {
        const d1 = 1 + Math.floor(Math.random() * 6), d2 = 1 + Math.floor(Math.random() * 6);
        const mod = btn.dataset.mode === "force" ? Math.floor(ctx.stats.atk / 10) : Math.floor((ctx.state.player.level || 1) / 2) + 1;
        const total = d1 + d2 + mod;
        if (total >= 10) { progress += 2; logEl.textContent = `🎲 掷出 [${d1}+${d2}]+${mod} = ${total}（大成功！压制进度 +2）`; }
        else if (total >= 7) { progress += 1; const dmg = Math.max(2, Math.round((e.atk || 12) * 0.45)); ctx.state.player.hp = Math.max(0, ctx.state.player.hp - dmg); logEl.textContent = `🎲 掷出 [${d1}+${d2}]+${mod} = ${total}（代价成功：进度 +1，轻伤 ${dmg}）`; }
        else { const dmg = Math.max(4, Math.round((e.atk || 12) * 0.8)); ctx.state.player.hp = Math.max(0, ctx.state.player.hp - dmg); logEl.textContent = `🎲 掷出 [${d1}+${d2}]+${mod} = ${total}（检定失败！受到 ${dmg} 点伤害）`; }
        progEl.textContent = `压制进度 ${Math.min(progress, targetProgress)}/${targetProgress} · HP ${ctx.state.player.hp}/${ctx.stats.maxHp}`;
        if (ctx.state.player.hp <= 0) ctx.onLose(`检定接连失利，负伤撤离【${e.name}】`);
        else if (progress >= targetProgress) ctx.onWin(`通过叙事掷骰成功化解了【${e.name}】`);
      }));
      ctx.container.querySelector("#dice-talk").addEventListener("click", () => ctx.onAiDiplomacy(e));
      ctx.container.querySelector("#dice-flee").addEventListener("click", () => ctx.onFlee());
    }
  });
})();
