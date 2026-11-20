/**
 * Budget World Model Module: Classic Turn-Based Combat (turn_based)
 * 默认已内置在 Index.html 中；本文件作为标准回合制模块参考模板，可独立修改数值公式后覆盖注册。
 */
(function () {
  window.RPG_MODULES = window.RPG_MODULES || { combat: {}, systems: {}, registerCombat(id, p) { this.combat[id] = p; }, registerSystem(id, p) { this.systems[id] = p; } };
  window.RPG_MODULES.registerCombat("turn_based", {
    name: "经典回合制战斗",
    useBuiltInTurnBased: true
  });
})();
