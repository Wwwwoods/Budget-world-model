/**
 * Budget World Model Module: Sanity & Clues System (sanity_investigation)
 */
(function () {
  window.RPG_MODULES = window.RPG_MODULES || { combat: {}, systems: {}, registerCombat(id, p) { this.combat[id] = p; }, registerSystem(id, p) { this.systems[id] = p; } };
  window.RPG_MODULES.registerSystem("sanity_investigation", {
    name: "理智值与线索板",
    init(state) { if (typeof state.player.stats["理智(SAN)"] !== "number") state.player.stats["理智(SAN)"] = 80; },
    modifySanity(state, delta) {
      const cur = Number(state.player.stats["理智(SAN)"] ?? 80);
      const next = Math.max(0, Math.min(100, cur + delta));
      state.player.stats["理智(SAN)"] = next;
      return { sanity: next, panic: next <= 25 };
    }
  });
})();
