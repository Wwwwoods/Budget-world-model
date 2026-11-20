/**
 * Budget World Model Module: Hades-Style Action Dodge Combat (action_dodge)
 */
(function () {
  window.RPG_MODULES = window.RPG_MODULES || { combat: {}, systems: {}, registerCombat(id, p) { this.combat[id] = p; }, registerSystem(id, p) { this.systems[id] = p; } };
  window.RPG_MODULES.registerCombat("action_dodge", {
    name: "即时闪避动作战（哈迪斯式）",
    start(ctx) {
      const e = Object.assign({}, ctx.enemy);
      let eHp = e.maxHp || e.hp || 75, eMax = eHp, lane = 1, dangerLane = -1, strikeCd = 0, finished = false;
      ctx.container.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px;"><div style="display:flex;justify-content:space-between;font-size:13px;"><strong>⚔️ ${e.name}（即时动作）</strong><span id="act-ehp" style="color:#fca5a5;">HP ${eHp}/${eMax}</span></div><div id="act-lanes" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;height:110px;">${[0,1,2].map(i=>`<button type="button" class="choice-btn act-lane" data-lane="${i}" style="height:100%;font-size:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;"></button>`).join("")}</div><div style="display:flex;gap:8px;justify-content:space-between;"><button type="button" class="choice-btn" id="act-strike" style="flex:1;">⚡ 冲刺斩击</button><button type="button" class="choice-btn" id="act-talk">🗣️ 交涉 (P0)</button><button type="button" class="choice-btn" id="act-flee">🏃 撤退</button></div><div id="act-log" style="font-size:12px;color:#9aa7bd;">点击三个身位实时闪避红色预警区，找准空隙点击「冲刺斩击」！</div></div>`;
      const laneEls = [...ctx.container.querySelectorAll(".act-lane")], logEl = ctx.container.querySelector("#act-log"), ehpEl = ctx.container.querySelector("#act-ehp");
      function renderLanes() {
        laneEls.forEach((el, i) => {
          const isPlayer = i === lane, isDanger = i === dangerLane;
          el.style.borderColor = isDanger ? "#ef4444" : (isPlayer ? "#f3c669" : "rgba(255,255,255,0.16)");
          el.style.background = isDanger ? "rgba(239,68,68,0.28)" : (isPlayer ? "rgba(243,198,105,0.16)" : "rgba(255,255,255,0.04)");
          el.innerHTML = `${isPlayer ? "🧍" : ""}${isDanger ? "🔥" : ""}<span style="font-size:11px;margin-top:4px;">${["左翼","中路","右翼"][i]}</span>`;
        });
        ehpEl.textContent = `HP ${eHp}/${eMax} · 我方 HP ${ctx.state.player.hp}/${ctx.stats.maxHp}`;
      }
      const timer = setInterval(() => {
        if (finished) return;
        if (strikeCd > 0) strikeCd -= 1;
        if (dangerLane === -1) { dangerLane = Math.floor(Math.random() * 3); logEl.textContent = `⚠️ ${e.name} 锁定了【${["左翼","中路","右翼"][dangerLane]}】，快换位闪避！`; }
        else {
          if (lane === dangerLane) {
            const dmg = Math.max(3, Math.round((e.atk || 13) - ctx.stats.def * 0.5));
            ctx.state.player.hp = Math.max(0, ctx.state.player.hp - dmg);
            logEl.textContent = `💥 未能躲开，受到 ${dmg} 点伤害！`;
            if (ctx.state.player.hp <= 0) { cleanup(); ctx.onLose(`在即时动作战中不敌【${e.name}】`); return; }
          } else { logEl.textContent = `✨ 极限闪避成功！趁现在反击！`; }
          dangerLane = -1;
        }
        renderLanes();
      }, 950);
      function cleanup() { finished = true; clearInterval(timer); }
      laneEls.forEach(el => el.addEventListener("click", () => { if (!finished) { lane = Number(el.dataset.lane); renderLanes(); } }));
      ctx.container.querySelector("#act-strike").addEventListener("click", () => {
        if (finished || strikeCd > 0) return;
        strikeCd = 1;
        const dmg = Math.max(5, Math.round(ctx.stats.atk * 1.15 - (e.def || 3) * 0.4));
        eHp = Math.max(0, eHp - dmg);
        logEl.textContent = `⚔️ 冲刺斩击命中，造成 ${dmg} 点伤害！`;
        renderLanes();
        if (eHp <= 0) { cleanup(); ctx.onWin(`以即时闪避战法击败了【${e.name}】`); }
      });
      ctx.container.querySelector("#act-talk").addEventListener("click", () => { cleanup(); ctx.onAiDiplomacy(e); });
      ctx.container.querySelector("#act-flee").addEventListener("click", () => { cleanup(); ctx.onFlee(); });
      renderLanes();
    }
  });
})();
