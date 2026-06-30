/* ============================================================
   Pokémon Battle — Helpers de modelo (membro <-> espécie/forma)

   Um "membro" de time é: { speciesId, level, nickname, megaActive }
   Estas funções resolvem o membro para a forma ativa (base ou mega).
   ============================================================ */
(function (PB) {
  "use strict";

  /** Cria um membro novo com valores padrão. */
  PB.makeMember = function (speciesId, level) {
    return {
      speciesId: speciesId,
      level: level || 50,
      nickname: "",
      megaActive: false
    };
  };

  /** A espécie tem mega? */
  PB.hasMega = function (speciesId) {
    var sp = PB.getSpecies(speciesId);
    return !!(sp && sp.mega);
  };

  /**
   * Forma ativa do membro (considera megaActive).
   * Retorna { name, types, baseStats, isMega }.
   */
  PB.activeForm = function (member) {
    var sp = PB.getSpecies(member.speciesId);
    if (!sp) return null;
    if (member.megaActive && sp.mega) {
      return {
        name: sp.mega.name || ("Mega " + sp.name),
        types: sp.mega.types.slice(),
        baseStats: sp.mega.baseStats,
        isMega: true
      };
    }
    return {
      name: sp.name,
      types: sp.types.slice(),
      baseStats: sp.baseStats,
      isMega: false
    };
  };

  /**
   * Sprite a usar para o membro.
   * @param {object} member
   * @param {boolean} big  - se true e for líder, usa a arte oficial grande.
   */
  PB.spriteOf = function (member, big) {
    var sp = PB.getSpecies(member.speciesId);
    if (!sp) return "";
    if (big && sp.art) {
      return member.megaActive && sp.artMega ? sp.artMega : sp.art;
    }
    return PB.listSprite(sp.dexNo);
  };

})(window.PB = window.PB || {});
