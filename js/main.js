/* ============================================================
   Pokémon Battle — Tela versus (home)

   Lê os times salvos no localStorage, mostra o resumo de cada
   lado, navega para o builder ao clicar e, com os dois times
   prontos, calcula o placar e declara o vencedor.
   ============================================================ */
(function (PB) {
  "use strict";

  var SIDE_NAME = { sableye: "Sableye", salamence: "Salamence" };

  var arena = document.querySelector(".versus");
  var sides = document.querySelectorAll(".side");
  var compareBtn = document.getElementById("compare-btn");
  var resetBtn = document.getElementById("reset-btn");
  var hint = document.getElementById("compare-hint");
  var resultEl = document.getElementById("result");

  /* ---------- Navegação para o builder ---------- */
  function choose(side) {
    if (arena.classList.contains("is-leaving")) return;
    var target = side.dataset.target;
    if (!target) return;
    sessionStorage.setItem("escolhaPokemon", side.dataset.side);
    side.classList.add("is-chosen");
    arena.classList.add("is-leaving");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(function () { window.location.href = target; }, reduceMotion ? 0 : 600);
  }

  /* ---------- Resumo de cada lado ---------- */
  function renderSummaries() {
    var bothReady = true;

    sides.forEach(function (side) {
      var key = side.dataset.side;
      var summaryEl = side.querySelector(".side__summary");
      var team = PB.storage.loadTeam(key);

      if (!team) {
        bothReady = false;
        summaryEl.textContent = "Time vazio — clique para montar";
        summaryEl.classList.remove("side__summary--ready");
        return;
      }

      var s = PB.compare.scoreTeam(team);
      summaryEl.classList.add("side__summary--ready");
      summaryEl.textContent = s.size + " Pokémon · " + s.statTotal + " status · " +
        s.coverage + " tipos cobertos" + (s.megaCount ? " · " + s.megaCount + " mega" : "");
    });

    if (bothReady) {
      compareBtn.disabled = false;
      resetBtn.hidden = false;
      hint.textContent = "Tudo pronto! Clique em Comparar para ver o vencedor.";
    } else {
      compareBtn.disabled = true;
      hint.textContent = "Monte e confirme os dois times para liberar a batalha";
    }
  }

  /* ---------- Placar / resultado ---------- */
  function showResult() {
    var teamA = PB.storage.loadTeam("sableye");
    var teamB = PB.storage.loadTeam("salamence");
    if (!teamA || !teamB) return;

    var res = PB.compare.compareTeams(teamA, teamB, { a: SIDE_NAME.sableye, b: SIDE_NAME.salamence });

    // Banner do vencedor
    var winnerEl = document.getElementById("result-winner");
    if (res.winner === "tie") {
      winnerEl.textContent = "Empate!";
      winnerEl.className = "result__winner";
    } else {
      var name = res.winner === "a" ? SIDE_NAME.sableye : SIDE_NAME.salamence;
      winnerEl.textContent = "🏆 Time " + name + " venceu!";
      winnerEl.className = "result__winner result__winner--" + (res.winner === "a" ? "sableye" : "salamence");
    }

    // Tabela de pontuação dos dois lados
    var board = document.getElementById("result-board");
    board.innerHTML = "";
    board.appendChild(scoreColumn(SIDE_NAME.sableye, "sableye", res.a, res.winner === "a"));
    board.appendChild(scoreColumn(SIDE_NAME.salamence, "salamence", res.b, res.winner === "b"));

    document.getElementById("result-why").textContent = res.justificativa;

    resultEl.hidden = false;
  }

  function scoreColumn(name, sideClass, s, isWinner) {
    var col = document.createElement("div");
    col.className = "score-col score-col--" + sideClass + (isWinner ? " score-col--win" : "");

    var h = document.createElement("h3");
    h.textContent = name;
    col.appendChild(h);

    var total = document.createElement("p");
    total.className = "score-col__total";
    total.textContent = s.score + " pts";
    col.appendChild(total);

    col.appendChild(scoreLine("Status base total", s.statTotal));
    col.appendChild(scoreLine("Cobertura ofensiva", s.coverage + " tipos"));
    col.appendChild(scoreLine("Megas ativas", s.megaCount));
    col.appendChild(scoreLine("Fraquezas compartilhadas", s.sharedWeak));
    col.appendChild(scoreLine("Pokémon", s.size + "/6"));
    return col;
  }

  function scoreLine(label, value) {
    var row = document.createElement("div");
    row.className = "score-line";
    var l = document.createElement("span");
    l.textContent = label;
    var v = document.createElement("strong");
    v.textContent = value;
    row.appendChild(l);
    row.appendChild(v);
    return row;
  }

  /* ---------- Eventos ---------- */
  sides.forEach(function (side) {
    side.addEventListener("click", function () { choose(side); });
    side.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(side); }
    });
  });

  compareBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    showResult();
  });

  resetBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (confirm("Limpar os dois times salvos?")) {
      PB.storage.clearTeam("sableye");
      PB.storage.clearTeam("salamence");
      resetBtn.hidden = true;
      renderSummaries();
    }
  });

  document.getElementById("result-close").addEventListener("click", function () {
    resultEl.hidden = true;
  });
  resultEl.addEventListener("click", function (e) {
    if (e.target === resultEl) resultEl.hidden = true;
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !resultEl.hidden) resultEl.hidden = true;
  });

  renderSummaries();

})(window.PB = window.PB || {});
