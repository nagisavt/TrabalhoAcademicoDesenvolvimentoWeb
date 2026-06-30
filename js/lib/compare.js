/* ============================================================
   Pokémon Battle — Pontuação e comparação de times

   score = statTotal
         + cobertura ofensiva * PESO_COBERTURA
         + megas ativas       * PESO_MEGA
         - fraquezas compartilhadas * PESO_FRAQUEZA

   "Fraqueza compartilhada" = tipo ao qual 2+ membros são fracos.
   Pesos isolados em constantes para ajuste fácil.
   ============================================================ */
(function (PB) {
  "use strict";

  var PESO_COBERTURA = 15;
  var PESO_MEGA = 20;
  var PESO_FRAQUEZA = 10;

  function members(team) {
    return team.filter(function (m) { return m; });
  }

  /** Pontua um time e devolve a quebra dos componentes. */
  function scoreTeam(team) {
    var mem = members(team);

    var statTotal = 0;
    var megaCount = 0;
    mem.forEach(function (m) {
      var form = PB.activeForm(m);
      if (!form) return;
      statTotal += PB.statTotal(form.baseStats);
      if (form.isMega) megaCount++;
    });

    var cov = PB.offensiveCoverage(team);

    var weakCounts = PB.teamWeaknessCounts(team);
    var sharedWeak = 0;
    var sharedList = [];
    Object.keys(weakCounts).forEach(function (t) {
      if (weakCounts[t] >= 2) {
        sharedWeak++;
        sharedList.push({ type: t, count: weakCounts[t] });
      }
    });
    sharedList.sort(function (a, b) { return b.count - a.count; });

    var score = statTotal
      + cov.count * PESO_COBERTURA
      + megaCount * PESO_MEGA
      - sharedWeak * PESO_FRAQUEZA;

    return {
      size: mem.length,
      statTotal: statTotal,
      coverage: cov.count,
      coverageSet: cov.set,
      megaCount: megaCount,
      sharedWeak: sharedWeak,
      sharedList: sharedList,
      score: score
    };
  }

  /**
   * Compara dois times e monta a justificativa textual.
   * @param {Array} teamA  @param {Array} teamB
   * @param {object} labels {a, b} nomes dos lados
   */
  function compareTeams(teamA, teamB, labels) {
    labels = labels || { a: "Lado A", b: "Lado B" };
    var sa = scoreTeam(teamA);
    var sb = scoreTeam(teamB);

    var winner = sa.score > sb.score ? "a" : (sb.score > sa.score ? "b" : "tie");

    var justificativa;
    if (winner === "tie") {
      justificativa = "Empate técnico: os dois times somaram " + sa.score +
        " pontos. Mesma força bruta e mesmo equilíbrio de tipos.";
    } else {
      var winLabel = winner === "a" ? labels.a : labels.b;
      var w = winner === "a" ? sa : sb;
      var l = winner === "a" ? sb : sa;
      var diff = w.score - l.score;

      var motivos = [];
      if (w.statTotal !== l.statTotal) {
        motivos.push((w.statTotal > l.statTotal ? "+" : "") + (w.statTotal - l.statTotal) + " de status base total");
      }
      if (w.coverage !== l.coverage) {
        motivos.push((w.coverage > l.coverage ? "+" : "") + (w.coverage - l.coverage) + " tipos de cobertura ofensiva");
      }
      if (w.sharedWeak !== l.sharedWeak) {
        var d = l.sharedWeak - w.sharedWeak;
        motivos.push((d > 0 ? d + " fraqueza(s) compartilhada(s) a menos" : Math.abs(d) + " fraqueza(s) compartilhada(s) a mais"));
      }
      if (w.megaCount !== l.megaCount) {
        motivos.push((w.megaCount > l.megaCount ? "+" : "") + (w.megaCount - l.megaCount) + " Mega Evolução(ões)");
      }

      justificativa = "Time " + winLabel + " venceu por " + diff + " ponto(s): " +
        (motivos.length ? motivos.join(", ") + "." : "vantagem geral equilibrada.");
    }

    return { a: sa, b: sb, winner: winner, justificativa: justificativa };
  }

  PB.compare = {
    scoreTeam: scoreTeam,
    compareTeams: compareTeams,
    WEIGHTS: { coverage: PESO_COBERTURA, mega: PESO_MEGA, sharedWeak: PESO_FRAQUEZA }
  };

})(window.PB = window.PB || {});
