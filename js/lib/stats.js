/* ============================================================
   Pokémon Battle — Cálculo de status (fórmula oficial Gen 3+)

   HP    = floor((2*Base + IV + floor(EV/4)) * Level / 100) + Level + 10
   Demais= floor((floor((2*Base + IV + floor(EV/4)) * Level / 100) + 5) * Nature)

   No MVP: IV=31, EV=0, Nature=1.0 (parametrizáveis para evoluir depois).
   ============================================================ */
(function (PB) {
  "use strict";

  /**
   * Calcula UM status.
   * @param {number} base   - status base da espécie
   * @param {number} level  - 1..100
   * @param {object} [opts] - { iv=31, ev=0, nature=1, isHP=false }
   */
  function calcStat(base, level, opts) {
    opts = opts || {};
    var iv = opts.iv == null ? 31 : opts.iv;
    var ev = opts.ev == null ? 0 : opts.ev;
    var nature = opts.nature == null ? 1 : opts.nature;

    var common = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100);
    if (opts.isHP) {
      return common + level + 10;
    }
    return Math.floor((common + 5) * nature);
  }

  /** Calcula os 6 status para um conjunto baseStats num dado level. */
  function calcAllStats(baseStats, level, opts) {
    opts = opts || {};
    function mk(extra) {
      var o = {};
      for (var k in opts) { o[k] = opts[k]; }
      for (var j in extra) { o[j] = extra[j]; }
      return o;
    }
    return {
      hp:  calcStat(baseStats.hp,  level, mk({ isHP: true })),
      atk: calcStat(baseStats.atk, level, mk({})),
      def: calcStat(baseStats.def, level, mk({})),
      spa: calcStat(baseStats.spa, level, mk({})),
      spd: calcStat(baseStats.spd, level, mk({})),
      spe: calcStat(baseStats.spe, level, mk({}))
    };
  }

  /** Soma dos status base (Base Stat Total). */
  function statTotal(baseStats) {
    return baseStats.hp + baseStats.atk + baseStats.def +
           baseStats.spa + baseStats.spd + baseStats.spe;
  }

  // Rótulos curtos em PT para a UI.
  PB.STAT_LABELS = { hp: "PV", atk: "Ataque", def: "Defesa", spa: "At. Esp.", spd: "Def. Esp.", spe: "Veloc." };
  PB.STAT_ORDER = ["hp", "atk", "def", "spa", "spd", "spe"];

  PB.calcStat = calcStat;
  PB.calcAllStats = calcAllStats;
  PB.statTotal = statTotal;

})(window.PB = window.PB || {});
