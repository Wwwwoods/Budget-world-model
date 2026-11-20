/**
 * Budget World Model Module: Rhythm Parry Combat (rhythm_parry)
 */
(function () {
  window.RPG_MODULES = window.RPG_MODULES || { combat: {}, systems: {}, registerCombat(id, p) { this.combat[id] = p; }, registerSystem(id, p) { this.systems[id] = p; } };
  window.RPG_MODULES.registerCombat("rhythm_parry", {
    name: "节拍拼刀 / 音游弹反",
    start(ctx) {
      const e = Object.assign({}, ctx.enemy);
      let eHp = e.maxHp || e.hp || 75, eMax = eHp, pos = 0, dir = 1, combo = 0, finished = false;
      ctx.container.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px;"><div style="display:flex;justify-content:space-between;font-size:13px;"><strong>🎵 ${e.name}（节拍弹反）</strong><span id="rhy-stat" style="color:#f3c669;">HP ${eHp}/${eMax} · 连击 0</span></div><div style="position:relative;height:36px;border-radius:999px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.16);overflow:hidden;"><div style="position:absolute;left:42%;width:16%;top:0;bottom:0;background:rgba(243,198,105,0.38);border-left:2px solid #f3c669;border-right:2px solid #f3c669;"></div><div id="rhy-cursor" style="position:absolute;top:2px;bottom:2px;width:10px;border-radius:6px;background:#38bdf8;left:0%;"></div></div><div style="display:flex;gap:8px;"><button type="button" class="choice-btn" id="rhy-hit" style="flex:1;font-weight:700;">⚡ 精准弹反 / 斩击</button><button type="button" class="choice-btn" id="rhy-talk">🗣️ 交涉 (P0)</button><button type="button" class="choice-btn" id="rhy-flee">🏃 撤退</button></div><div id="rhy-log" style="font-size:12px;color:#9aa7bd;">光标进入中央金色判定区时点击「精准弹反 / 斩击」！</div></div>`;
      const cursorEl = ctx.container.querySelector("#rhy-cursor"), statEl = ctx.container.querySelector("#rhy-stat"), logEl = ctx.container.querySelector("#rhy-log");
      function updateStat() { statEl.textContent = `敌 HP ${eHp}/${eMax} · 我 HP ${ctx.state.player.hp}/${ctx.stats.maxHp} · 连击 ${combo}`; }
      const timer = setInterval(() => { if (finished) return; pos += dir * 3.4; if (pos >= 96) { pos = 96; dir = -1; } if (pos <= 0) { pos = 0; dir = 1; } cursorEl.style.left = `${pos}%`; }, 28);
      function cleanup() { finished = true; clearInterval(timer); }
      ctx.container.querySelector("#rhy-hit").addEventListener("click", () => {
        if (finished) return;
        const dist = Math.abs(pos - 48);
        if (dist <= 9) {
          combo += 1;
          const dmg = Math.max(6, Math.round(ctx.stats.atk * (1.3 + Math.min(1.0, combo * 0.2)) - (e.def || 3) * 0.3));
          eHp = Math.max(0, eHp - dmg);
          logEl.textContent = `✨ PERFECT 弹反！${combo} 连击，造成 ${dmg} 点暴击伤害！`;
          if (eHp <= 0) { cleanup(); ctx.onWin(`以 ${combo} 连击精准弹反击败了【${e.name}】`); return; }
        } else if (dist <= 18) {
          const dmg = Math.max(3, Math.round(ctx.stats.atk * 0.8));
          eHp = Math.max(0, eHp - dmg);
          logEl.textContent = `👍 GOOD 格挡，造成 ${dmg} 点伤害。`;
          if (eHp <= 0) { cleanup(); ctx.onWin(`击败了【${e.name}】`); return; }
        } else {
          combo = 0;
          const dmg = Math.max(3, Math.round((e.atk || 13) - ctx.stats.def * 0.5));
          ctx.state.player.hp = Math.max(0, ctx.state.player.hp - dmg);
          logEl.textContent = `💥 MISS 破防！受到 ${dmg} 点伤害，连击中断。`;
          if (ctx.state.player.hp <= 0) { cleanup(); ctx.onLose(`拼刀失误不敌【${e.name}】`); return; }
        }
        updateStat();
      });
      ctx.container.querySelector("#rhy-talk").addEventListener("click", () => { cleanup(); ctx.onAiDiplomacy(e); });
      ctx.container.querySelector("#rhy-flee").addEventListener("click", () => { cleanup(); ctx.onFlee(); });
      updateStat();
    }
  });
})();
