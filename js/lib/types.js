/* ============================================================
   Pokémon Battle — Efetividade de tipos (derivada, nunca armazenada)

   Tudo deriva de PB.TYPE_CHART. Fraquezas do Pokémon e do time são
   sempre CALCULADAS a partir dos tipos, conforme exigido.
   ============================================================ */
(function (PB) {
  "use strict";

  /** Multiplicador de um tipo atacante contra um tipo defensor. */
  function effectiveness(atk, def) {
    var row = PB.TYPE_CHART[atk];
    if (row && row[def] != null) return row[def];
    return 1;
  }

  /** Multiplicador de um tipo atacante contra um defensor de 1 ou 2 tipos. */
  function multiplierAgainst(atk, defTypes) {
    var mult = 1;
    for (var i = 0; i < defTypes.length; i++) {
      mult *= effectiveness(atk, defTypes[i]);
    }
    return mult;
  }

  /**
   * Perfil defensivo de um Pokémon (pelos seus tipos).
   * @returns { weak:[{type,mult}], resist:[{type,mult}], immune:[type] }
   *          weak ordenado do mais perigoso (4x) ao 2x.
   */
  function defenseProfile(defTypes) {
    var weak = [], resist = [], immune = [];
    PB.TYPES.forEach(function (atk) {
      var m = multiplierAgainst(atk, defTypes);
      if (m === 0) immune.push(atk);
      else if (m > 1) weak.push({ type: atk, mult: m });
      else if (m < 1) resist.push({ type: atk, mult: m });
    });
    weak.sort(function (a, b) { return b.mult - a.mult; });
    return { weak: weak, resist: resist, immune: immune };
  }

  /** Lista de membros não-nulos de um time. */
  function members(team) {
    return team.filter(function (m) { return m; });
  }

  /**
   * Quantos membros do time são fracos a cada tipo atacante.
   * @returns { tipo: contagem } (só tipos com >=1 membro fraco)
   */
  function teamWeaknessCounts(team) {
    var counts = {};
    members(team).forEach(function (m) {
      var form = PB.activeForm(m);
      if (!form) return;
      PB.TYPES.forEach(function (atk) {
        if (multiplierAgainst(atk, form.types) > 1) {
          counts[atk] = (counts[atk] || 0) + 1;
        }
      });
    });
    return counts;
  }

  /**
   * Cobertura ofensiva do time: tipos que ALGUM membro acerta de forma
   * super eficaz usando seus próprios tipos (STAB) como ataque.
   * @returns { count, set:[tipos] }
   */
  function offensiveCoverage(team) {
    var covered = {};
    members(team).forEach(function (m) {
      var form = PB.activeForm(m);
      if (!form) return;
      form.types.forEach(function (atk) {
        PB.TYPES.forEach(function (def) {
          if (effectiveness(atk, def) === 2) covered[def] = true;
        });
      });
    });
    var set = Object.keys(covered);
    return { count: set.length, set: set };
  }

  PB.effectiveness = effectiveness;
  PB.multiplierAgainst = multiplierAgainst;
  PB.defenseProfile = defenseProfile;
  PB.teamWeaknessCounts = teamWeaknessCounts;
  PB.offensiveCoverage = offensiveCoverage;

})(window.PB = window.PB || {});
