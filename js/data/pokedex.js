/* ============================================================
   Pokémon Battle — Pokédex da 3ª geração (cravada localmente)

   Cada espécie:
   {
     id, dexNo, name,
     types: [t1, t2?],                 // tipos da forma base
     baseStats: {hp,atk,def,spa,spd,spe},
     mega: null | {                    // dados da Mega Evolução
       name, types:[...], baseStats:{...}
     },
     art, artMega                       // (opcional) arte grande p/ os líderes
   }

   Sprites:
   - lista/slots: Auxiliar/pokemons/Spr_3e_<dexNo>.png  (todos os Gen 3 locais)
   - líderes (Sableye/Salamence): arte oficial em art/artMega
   Dados de status reais dos jogos.
   ============================================================ */
(function (PB) {
  "use strict";

  PB.POKEDEX = [
    { dexNo: 254, name: "Sceptile", types: ["grass"], baseStats: { hp: 70, atk: 85, def: 65, spa: 105, spd: 85, spe: 120 },
      mega: { name: "Mega Sceptile", types: ["grass", "dragon"], baseStats: { hp: 70, atk: 110, def: 75, spa: 145, spd: 85, spe: 145 } } },

    { dexNo: 257, name: "Blaziken", types: ["fire", "fighting"], baseStats: { hp: 80, atk: 120, def: 70, spa: 110, spd: 70, spe: 80 },
      mega: { name: "Mega Blaziken", types: ["fire", "fighting"], baseStats: { hp: 80, atk: 160, def: 80, spa: 130, spd: 80, spe: 100 } } },

    { dexNo: 260, name: "Swampert", types: ["water", "ground"], baseStats: { hp: 100, atk: 110, def: 90, spa: 85, spd: 90, spe: 60 },
      mega: { name: "Mega Swampert", types: ["water", "ground"], baseStats: { hp: 100, atk: 150, def: 110, spa: 95, spd: 110, spe: 70 } } },

    { dexNo: 262, name: "Mightyena", types: ["dark"], baseStats: { hp: 70, atk: 90, def: 70, spa: 60, spd: 60, spe: 70 }, mega: null },

    { dexNo: 275, name: "Shiftry", types: ["grass", "dark"], baseStats: { hp: 90, atk: 100, def: 60, spa: 90, spd: 60, spe: 80 }, mega: null },

    { dexNo: 282, name: "Gardevoir", types: ["psychic", "fairy"], baseStats: { hp: 68, atk: 65, def: 65, spa: 125, spd: 115, spe: 80 },
      mega: { name: "Mega Gardevoir", types: ["psychic", "fairy"], baseStats: { hp: 68, atk: 85, def: 65, spa: 165, spd: 135, spe: 100 } } },

    { dexNo: 286, name: "Breloom", types: ["grass", "fighting"], baseStats: { hp: 60, atk: 130, def: 80, spa: 60, spd: 60, spe: 70 }, mega: null },

    { dexNo: 289, name: "Slaking", types: ["normal"], baseStats: { hp: 150, atk: 160, def: 100, spa: 95, spd: 65, spe: 100 }, mega: null },

    { dexNo: 302, name: "Sableye", types: ["dark", "ghost"], baseStats: { hp: 50, atk: 75, def: 75, spa: 65, spd: 65, spe: 50 },
      mega: { name: "Mega Sableye", types: ["dark", "ghost"], baseStats: { hp: 50, atk: 85, def: 125, spa: 85, spd: 115, spe: 50 } },
      art: "Sableye/302.png", artMega: "Sableye/302_f2.png" },

    { dexNo: 303, name: "Mawile", types: ["steel", "fairy"], baseStats: { hp: 50, atk: 85, def: 85, spa: 55, spd: 55, spe: 50 },
      mega: { name: "Mega Mawile", types: ["steel", "fairy"], baseStats: { hp: 50, atk: 105, def: 125, spa: 55, spd: 95, spe: 50 } } },

    { dexNo: 306, name: "Aggron", types: ["steel", "rock"], baseStats: { hp: 70, atk: 110, def: 180, spa: 60, spd: 60, spe: 50 },
      mega: { name: "Mega Aggron", types: ["steel"], baseStats: { hp: 70, atk: 140, def: 230, spa: 60, spd: 80, spe: 50 } } },

    { dexNo: 308, name: "Medicham", types: ["fighting", "psychic"], baseStats: { hp: 60, atk: 60, def: 75, spa: 60, spd: 75, spe: 80 },
      mega: { name: "Mega Medicham", types: ["fighting", "psychic"], baseStats: { hp: 60, atk: 100, def: 85, spa: 80, spd: 85, spe: 100 } } },

    { dexNo: 310, name: "Manectric", types: ["electric"], baseStats: { hp: 70, atk: 75, def: 60, spa: 105, spd: 60, spe: 105 },
      mega: { name: "Mega Manectric", types: ["electric"], baseStats: { hp: 70, atk: 75, def: 80, spa: 135, spd: 80, spe: 135 } } },

    { dexNo: 319, name: "Sharpedo", types: ["water", "dark"], baseStats: { hp: 70, atk: 120, def: 40, spa: 95, spd: 40, spe: 95 },
      mega: { name: "Mega Sharpedo", types: ["water", "dark"], baseStats: { hp: 70, atk: 140, def: 70, spa: 110, spd: 65, spe: 105 } } },

    { dexNo: 323, name: "Camerupt", types: ["fire", "ground"], baseStats: { hp: 70, atk: 100, def: 70, spa: 105, spd: 75, spe: 40 },
      mega: { name: "Mega Camerupt", types: ["fire", "ground"], baseStats: { hp: 70, atk: 120, def: 100, spa: 145, spd: 105, spe: 20 } } },

    { dexNo: 324, name: "Torkoal", types: ["fire"], baseStats: { hp: 70, atk: 85, def: 140, spa: 85, spd: 70, spe: 20 }, mega: null },

    { dexNo: 330, name: "Flygon", types: ["ground", "dragon"], baseStats: { hp: 80, atk: 100, def: 80, spa: 80, spd: 80, spe: 100 }, mega: null },

    { dexNo: 334, name: "Altaria", types: ["dragon", "flying"], baseStats: { hp: 75, atk: 70, def: 90, spa: 70, spd: 105, spe: 80 },
      mega: { name: "Mega Altaria", types: ["dragon", "fairy"], baseStats: { hp: 75, atk: 110, def: 110, spa: 110, spd: 105, spe: 80 } } },

    { dexNo: 342, name: "Crawdaunt", types: ["water", "dark"], baseStats: { hp: 63, atk: 120, def: 85, spa: 90, spd: 55, spe: 55 }, mega: null },

    { dexNo: 344, name: "Claydol", types: ["ground", "psychic"], baseStats: { hp: 60, atk: 70, def: 105, spa: 70, spd: 120, spe: 75 }, mega: null },

    { dexNo: 350, name: "Milotic", types: ["water"], baseStats: { hp: 95, atk: 60, def: 79, spa: 100, spd: 125, spe: 81 }, mega: null },

    { dexNo: 354, name: "Banette", types: ["ghost"], baseStats: { hp: 64, atk: 115, def: 65, spa: 83, spd: 63, spe: 65 },
      mega: { name: "Mega Banette", types: ["ghost"], baseStats: { hp: 64, atk: 165, def: 75, spa: 93, spd: 83, spe: 75 } } },

    { dexNo: 359, name: "Absol", types: ["dark"], baseStats: { hp: 65, atk: 130, def: 60, spa: 75, spd: 60, spe: 75 },
      mega: { name: "Mega Absol", types: ["dark"], baseStats: { hp: 65, atk: 150, def: 60, spa: 115, spd: 60, spe: 115 } } },

    { dexNo: 362, name: "Glalie", types: ["ice"], baseStats: { hp: 80, atk: 80, def: 80, spa: 80, spd: 80, spe: 80 },
      mega: { name: "Mega Glalie", types: ["ice"], baseStats: { hp: 80, atk: 120, def: 80, spa: 120, spd: 80, spe: 100 } } },

    { dexNo: 365, name: "Walrein", types: ["ice", "water"], baseStats: { hp: 110, atk: 80, def: 90, spa: 95, spd: 90, spe: 65 }, mega: null },

    { dexNo: 373, name: "Salamence", types: ["dragon", "flying"], baseStats: { hp: 95, atk: 135, def: 80, spa: 110, spd: 80, spe: 100 },
      mega: { name: "Mega Salamence", types: ["dragon", "flying"], baseStats: { hp: 95, atk: 145, def: 130, spa: 120, spd: 90, spe: 120 } },
      art: "Salamence/373.png", artMega: "Salamence/373_f2.png" },

    { dexNo: 376, name: "Metagross", types: ["steel", "psychic"], baseStats: { hp: 80, atk: 135, def: 130, spa: 95, spd: 90, spe: 70 },
      mega: { name: "Mega Metagross", types: ["steel", "psychic"], baseStats: { hp: 80, atk: 145, def: 150, spa: 105, spd: 110, spe: 110 } } },

    { dexNo: 380, name: "Latias", types: ["dragon", "psychic"], baseStats: { hp: 80, atk: 80, def: 90, spa: 110, spd: 130, spe: 110 },
      mega: { name: "Mega Latias", types: ["dragon", "psychic"], baseStats: { hp: 80, atk: 100, def: 120, spa: 140, spd: 150, spe: 110 } } },

    { dexNo: 381, name: "Latios", types: ["dragon", "psychic"], baseStats: { hp: 80, atk: 90, def: 80, spa: 130, spd: 110, spe: 110 },
      mega: { name: "Mega Latios", types: ["dragon", "psychic"], baseStats: { hp: 80, atk: 130, def: 100, spa: 160, spd: 120, spe: 110 } } },

    { dexNo: 384, name: "Rayquaza", types: ["dragon", "flying"], baseStats: { hp: 105, atk: 150, def: 90, spa: 150, spd: 90, spe: 95 },
      mega: { name: "Mega Rayquaza", types: ["dragon", "flying"], baseStats: { hp: 105, atk: 180, def: 100, spa: 180, spd: 100, spe: 115 } } }
  ];

  // id = dexNo (estável e único). Indexado para busca O(1).
  var byId = {};
  PB.POKEDEX.forEach(function (sp) {
    sp.id = sp.dexNo;
    byId[sp.id] = sp;
  });

  /** Retorna a espécie pelo id (dexNo) ou null. */
  PB.getSpecies = function (id) {
    return byId[id] || null;
  };

  /** Caminho do sprite local da forma de lista/slot (Emerald). */
  PB.listSprite = function (dexNo) {
    return "Auxiliar/pokemons/Spr_3e_" + dexNo + ".png";
  };

})(window.PB = window.PB || {});
