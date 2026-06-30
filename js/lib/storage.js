/* ============================================================
   Pokémon Battle — Persistência local (localStorage apenas)

   Cada lado guarda um time num array de 6 posições (slot = índice),
   com null nos slots vazios. Membro: {speciesId, level, nickname, megaActive}.
   ============================================================ */
(function (PB) {
  "use strict";

  var SIDES = { sableye: "pb.team.sableye", salamence: "pb.team.salamence" };

  function keyFor(side) {
    return SIDES[side] || null;
  }

  /** Garante array de 6 posições. */
  function normalize(team) {
    var out = [null, null, null, null, null, null];
    if (Array.isArray(team)) {
      for (var i = 0; i < 6; i++) {
        out[i] = team[i] || null;
      }
    }
    return out;
  }

  /**
   * Carrega o time salvo de um lado.
   * @returns {Array|null} array de 6 posições, ou null se nunca foi salvo.
   */
  function loadTeam(side) {
    var key = keyFor(side);
    if (!key) return null;
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      return normalize(parsed);
    } catch (e) {
      // JSON corrompido — trata como inexistente para não quebrar a tela.
      return null;
    }
  }

  /** Salva o time de um lado. */
  function saveTeam(side, team) {
    var key = keyFor(side);
    if (!key) return false;
    localStorage.setItem(key, JSON.stringify(normalize(team)));
    return true;
  }

  /** Remove o time salvo de um lado. */
  function clearTeam(side) {
    var key = keyFor(side);
    if (key) localStorage.removeItem(key);
  }

  PB.storage = {
    loadTeam: loadTeam,
    saveTeam: saveTeam,
    clearTeam: clearTeam,
    normalize: normalize
  };

})(window.PB = window.PB || {});
