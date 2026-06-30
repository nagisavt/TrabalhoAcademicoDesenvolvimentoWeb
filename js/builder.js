/* ============================================================
   Pokémon Battle — Controlador do montador de time (builder.html)

   Responsável por: detalhe do líder (mega + level validado),
   CRUD dos 6 slots, lista da 3ª geração com busca/filtro e modal
   de edição. Persiste no localStorage só ao Confirmar.
   ============================================================ */
(function (PB) {
  "use strict";

  var SIDE_LEADER = { sableye: 302, salamence: 373 };
  var SIDE_NAME = { sableye: "Sableye", salamence: "Salamence" };

  // ---- Estado em memória (só vai para o storage no Confirmar) ----
  var side = null;
  var leaderId = null;
  var team = [];        // 6 posições; team[0] = líder
  var editingSlot = null;

  // ---- Atalhos de DOM ----
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ============================================================
     Componentes reutilizáveis
     ============================================================ */

  /** Chip de tipo (com ícone e rótulo PT). */
  function typeChip(type, opts) {
    opts = opts || {};
    var chip = el("span", "type-chip" + (opts.mini ? " type-chip--mini" : ""));
    chip.style.background = PB.TYPE_COLORS[type];
    var icon = el("img");
    icon.src = "Auxiliar/icons/" + type + ".svg";
    icon.alt = "";
    chip.appendChild(icon);
    chip.appendChild(document.createTextNode(PB.TYPE_PT[type]));
    if (opts.mult) {
      chip.appendChild(el("span", "mult", " ×" + opts.mult));
    }
    if (opts.suffix) {
      chip.appendChild(el("span", "mult", " " + opts.suffix));
    }
    return chip;
  }

  /** Barras de status calculadas para um conjunto de stats num level. */
  function renderStats(container, baseStats, level) {
    container.innerHTML = "";
    var stats = PB.calcAllStats(baseStats, level);
    PB.STAT_ORDER.forEach(function (key) {
      var row = el("div", "stat-row");
      row.appendChild(el("span", "stat-name", PB.STAT_LABELS[key]));
      row.appendChild(el("span", "stat-val", String(stats[key])));
      var bar = el("div", "stat-bar");
      var fill = el("span");
      // largura proporcional ao status BASE (referência ~180 = topo)
      var pct = Math.min(100, Math.round(baseStats[key] / 180 * 100));
      fill.style.width = pct + "%";
      bar.appendChild(fill);
      row.appendChild(bar);
      container.appendChild(row);
    });
  }

  /* ============================================================
     Painel do líder (slot 0)
     ============================================================ */
  function renderLeader() {
    var member = team[0];
    var form = PB.activeForm(member);
    var sp = PB.getSpecies(member.speciesId);

    // sprite grande (arte oficial dos líderes)
    var img = $("bd-hero-img");
    img.src = PB.spriteOf(member, true);
    img.alt = form.name;
    $("bd-hero-name").textContent = member.nickname ? (member.nickname + " (" + form.name + ")") : form.name;

    // tipos
    var typesBox = $("bd-types");
    typesBox.innerHTML = "";
    form.types.forEach(function (t) { typesBox.appendChild(typeChip(t)); });

    // botão mega
    var megaBtn = $("bd-mega");
    megaBtn.disabled = !sp.mega;
    megaBtn.setAttribute("aria-pressed", String(!!member.megaActive));
    megaBtn.textContent = member.megaActive ? "Mega ativa ✓" : "Mega Evolução";

    // level input reflete o líder
    $("bd-level").value = member.level;

    // status + fraquezas
    renderStats($("bd-stats"), form.baseStats, member.level);
    renderDefense(form.types);
  }

  /** Lista de fraquezas / resistências / imunidades. */
  function renderDefense(types) {
    var prof = PB.defenseProfile(types);
    var weakBox = $("bd-weak-list");
    var resBox = $("bd-resist-list");
    weakBox.innerHTML = "";
    resBox.innerHTML = "";

    if (!prof.weak.length) weakBox.appendChild(el("span", "slot__sub", "Nenhuma fraqueza."));
    prof.weak.forEach(function (w) {
      weakBox.appendChild(typeChip(w.type, { mult: w.mult }));
    });

    prof.resist.forEach(function (r) {
      resBox.appendChild(typeChip(r.type, { mini: true, mult: r.mult }));
    });
    prof.immune.forEach(function (t) {
      resBox.appendChild(typeChip(t, { mini: true, mult: 0 }));
    });
  }

  /* ============================================================
     Validação de level (reutilizada nos dois inputs)
     ============================================================ */
  function validateLevel(input, errorEl) {
    var raw = input.value.trim();
    var n = Number(raw);
    var ok = raw !== "" && Number.isInteger(n) && n >= 1 && n <= 100;
    if (!ok) {
      input.classList.add("invalid");
      errorEl.textContent = "Level inválido: digite um número inteiro entre 1 e 100.";
      errorEl.hidden = false;
      return null;
    }
    input.classList.remove("invalid");
    errorEl.hidden = true;
    return n;
  }

  /* ============================================================
     Slots do time (render + CRUD)
     ============================================================ */
  function renderSlots() {
    var ol = $("bd-slots");
    ol.innerHTML = "";

    for (var i = 0; i < 6; i++) {
      var li = el("li");
      var member = team[i];

      if (!member) {
        var empty = el("div", "slot slot--empty", "+ Adicionar");
        empty.setAttribute("role", "button");
        empty.tabIndex = 0;
        (function (idx) {
          empty.addEventListener("click", function () { focusPickerForSlot(idx); });
          empty.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); focusPickerForSlot(idx); }
          });
        })(i);
        li.appendChild(empty);
        ol.appendChild(li);
        continue;
      }

      var form = PB.activeForm(member);
      var isLeader = (i === 0);
      var slot = el("div", "slot" + (isLeader ? " slot--leader" : ""));

      var img = el("img");
      img.src = PB.spriteOf(member, false);
      img.alt = form.name;
      slot.appendChild(img);

      var body = el("div", "slot__body");
      var nameRow = el("div", "slot__name");
      nameRow.appendChild(document.createTextNode(member.nickname || form.name));
      if (form.isMega) nameRow.appendChild(el("span", "tag-mega", "MEGA"));
      if (isLeader) nameRow.appendChild(el("span", "slot__sub", " · líder"));
      body.appendChild(nameRow);
      body.appendChild(el("div", "slot__sub", "Lv " + member.level + " · " +
        form.types.map(function (t) { return PB.TYPE_PT[t]; }).join("/")));
      slot.appendChild(body);

      var actions = el("div", "slot__actions");
      var editBtn = el("button", "icon-btn", "✎");
      editBtn.title = "Editar";
      (function (idx) { editBtn.addEventListener("click", function () { openModal(idx); }); })(i);
      actions.appendChild(editBtn);

      if (!isLeader) {
        var delBtn = el("button", "icon-btn icon-btn--danger", "🗑");
        delBtn.title = "Remover";
        (function (idx) { delBtn.addEventListener("click", function () { removeSlot(idx); }); })(i);
        actions.appendChild(delBtn);
      }
      slot.appendChild(actions);

      li.appendChild(slot);
      ol.appendChild(li);
    }

    renderTeamMeta();
  }

  /** Adiciona uma espécie ao primeiro slot vazio (create). Slot 0 é sempre o líder. */
  function addSpecies(speciesId) {
    var idx = -1;
    for (var i = 1; i < 6; i++) {
      if (!team[i]) { idx = i; break; }
    }
    if (idx === -1) {
      flash("Time cheio! Remova um Pokémon antes de adicionar outro.");
      return;
    }
    team[idx] = PB.makeMember(speciesId, 50);
    renderSlots();
    flash(PB.getSpecies(speciesId).name + " adicionado ao slot " + (idx + 1) + ".");
  }

  /** Remove um membro (delete) — nunca o líder. */
  function removeSlot(i) {
    if (i === 0) return;
    team[i] = null;
    renderSlots();
  }

  /** Mostra resumo do time (stat total, cobertura, fraquezas compartilhadas). */
  function renderTeamMeta() {
    var box = $("bd-team-meta");
    var s = PB.compare.scoreTeam(team);
    box.innerHTML = "";

    box.appendChild(rowMeta("Pokémon no time", s.size + "/6"));
    box.appendChild(rowMeta("Status base total", String(s.statTotal)));
    box.appendChild(rowMeta("Cobertura ofensiva", s.coverage + " tipos"));
    box.appendChild(rowMeta("Megas ativas", String(s.megaCount)));

    var shared = el("div");
    shared.appendChild(document.createTextNode("Fraquezas compartilhadas (2+): "));
    var b = el("b", null, String(s.sharedWeak));
    shared.appendChild(b);
    box.appendChild(shared);

    if (s.sharedList.length) {
      var chips = el("div", "bd-chips");
      s.sharedList.forEach(function (w) {
        chips.appendChild(typeChip(w.type, { mini: true, suffix: "(" + w.count + " membros)" }));
      });
      box.appendChild(chips);
    }
  }
  function rowMeta(label, value) {
    var d = el("div");
    d.appendChild(document.createTextNode(label + ": "));
    d.appendChild(el("b", null, value));
    return d;
  }

  /* ============================================================
     Lista de seleção (read + busca/filtro)
     ============================================================ */
  function populateTypeFilter() {
    var sel = $("bd-filter-type");
    PB.TYPES.forEach(function (t) {
      var o = el("option", null, PB.TYPE_PT[t]);
      o.value = t;
      sel.appendChild(o);
    });
  }

  function renderList() {
    var q = $("bd-search").value.trim().toLowerCase();
    var typeFilter = $("bd-filter-type").value;
    var ul = $("bd-list");
    ul.innerHTML = "";

    var matches = PB.POKEDEX.filter(function (sp) {
      var byName = !q || sp.name.toLowerCase().indexOf(q) !== -1;
      var byType = !typeFilter || sp.types.indexOf(typeFilter) !== -1 ||
        (sp.mega && sp.mega.types.indexOf(typeFilter) !== -1);
      return byName && byType;
    });

    if (!matches.length) {
      ul.appendChild(el("li", "bd-empty-msg", "Nenhum Pokémon encontrado."));
      return;
    }

    matches.forEach(function (sp) {
      var li = el("li");
      var card = el("div", "poke-card");
      card.setAttribute("role", "button");
      card.tabIndex = 0;

      var img = el("img");
      img.src = PB.listSprite(sp.dexNo);
      img.alt = sp.name;
      card.appendChild(img);

      card.appendChild(el("div", "poke-card__name", sp.name));
      card.appendChild(el("div", "poke-card__dex", "Nº " + sp.dexNo + (sp.mega ? " · ★mega" : "")));

      var types = el("div", "poke-card__types");
      sp.types.forEach(function (t) { types.appendChild(typeChip(t, { mini: true })); });
      card.appendChild(types);

      card.addEventListener("click", function () { addSpecies(sp.id); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); addSpecies(sp.id); }
      });

      li.appendChild(card);
      ul.appendChild(li);
    });
  }

  function focusPickerForSlot() {
    var picker = $("bd-search");
    picker.focus();
    picker.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ============================================================
     Modal de edição (read + update)
     ============================================================ */
  function openModal(i) {
    editingSlot = i;
    var member = team[i];
    var sp = PB.getSpecies(member.speciesId);
    var form = PB.activeForm(member);

    $("bd-modal-title").textContent = "Editar — " + sp.name + (i === 0 ? " (líder)" : "");
    var img = $("bd-modal-img");
    img.src = PB.spriteOf(member, false);
    img.alt = sp.name;

    var typesBox = $("bd-modal-types");
    typesBox.innerHTML = "";
    form.types.forEach(function (t) { typesBox.appendChild(typeChip(t, { mini: true })); });

    $("bd-modal-nick").value = member.nickname || "";
    $("bd-modal-level").value = member.level;

    var megaField = $("bd-modal-mega-field");
    var megaCb = $("bd-modal-mega");
    megaCb.checked = !!member.megaActive;
    megaField.style.display = sp.mega ? "" : "none";

    // selector de slot (mover) — líder fica preso no slot 1
    var slotSel = $("bd-modal-slot");
    slotSel.innerHTML = "";
    for (var s = 0; s < 6; s++) {
      var o = el("option", null, "Slot " + (s + 1) +
        (s === 0 ? " (líder)" : team[s] && s !== i ? " (ocupado)" : team[s] ? "" : " (vazio)"));
      o.value = String(s);
      slotSel.appendChild(o);
    }
    slotSel.value = String(i);
    slotSel.disabled = (i === 0); // não move o líder

    $("bd-modal-error").hidden = true;
    $("bd-modal-level").classList.remove("invalid");
    refreshModalStats();
    $("bd-modal").hidden = false;
  }

  function refreshModalStats() {
    var member = team[editingSlot];
    var megaActive = $("bd-modal-mega").checked;
    var preview = { speciesId: member.speciesId, megaActive: megaActive, level: member.level, nickname: member.nickname };
    var form = PB.activeForm(preview);
    var lvl = Number($("bd-modal-level").value) || member.level;
    renderStats($("bd-modal-stats"), form.baseStats, Math.min(100, Math.max(1, lvl)));
    // atualiza tipos exibidos conforme mega
    var typesBox = $("bd-modal-types");
    typesBox.innerHTML = "";
    form.types.forEach(function (t) { typesBox.appendChild(typeChip(t, { mini: true })); });
  }

  function closeModal() {
    $("bd-modal").hidden = true;
    editingSlot = null;
  }

  function saveModal() {
    var i = editingSlot;
    if (i == null) return;
    var level = validateLevel($("bd-modal-level"), $("bd-modal-error"));
    if (level == null) return;

    var member = team[i];
    member.level = level;
    member.nickname = $("bd-modal-nick").value.trim().slice(0, 16);
    member.megaActive = $("bd-modal-mega").checked;

    // mover de slot (não para o líder em 0; não sobre o líder)
    var dest = Number($("bd-modal-slot").value);
    if (i !== 0 && dest !== i && dest !== 0) {
      var tmp = team[dest];
      team[dest] = member;
      team[i] = tmp || null;
    }

    closeModal();
    renderSlots();
    renderLeader();
  }

  /* ============================================================
     Mensagem efêmera (feedback)
     ============================================================ */
  var flashTimer = null;
  function flash(msg) {
    var box = $("bd-team-meta");
    var note = $("bd-flash") || (function () {
      var n = el("div", "bd-error"); n.id = "bd-flash"; n.style.borderColor = "rgba(58,209,122,.5)";
      n.style.color = "#bff7d4"; n.style.background = "rgba(58,209,122,.15)";
      box.parentNode.insertBefore(n, box);
      return n;
    })();
    note.textContent = msg;
    note.hidden = false;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { note.hidden = true; }, 2600);
  }

  /* ============================================================
     Inicialização
     ============================================================ */
  function getSideParam() {
    var params = new URLSearchParams(window.location.search);
    var s = params.get("side");
    if (s !== "sableye" && s !== "salamence") {
      // fallback: o que estiver na sessão, senão sableye
      s = sessionStorage.getItem("escolhaPokemon");
      if (s !== "sableye" && s !== "salamence") s = "sableye";
    }
    return s;
  }

  function init() {
    side = getSideParam();
    leaderId = SIDE_LEADER[side];

    document.body.setAttribute("data-side", side);
    $("bd-side-name").textContent = SIDE_NAME[side];
    document.title = "Montar time " + SIDE_NAME[side] + " — Pokémon Battle";

    // carrega time salvo ou inicia com o líder
    var saved = PB.storage.loadTeam(side);
    team = saved || [null, null, null, null, null, null];
    if (!team[0] || team[0].speciesId !== leaderId) {
      // garante o líder no slot 0
      team[0] = PB.makeMember(leaderId, team[0] ? team[0].level : 50);
    }

    populateTypeFilter();
    renderLeader();
    renderSlots();
    renderList();

    // ---- Eventos do líder ----
    $("bd-mega").addEventListener("click", function () {
      var sp = PB.getSpecies(team[0].speciesId);
      if (!sp.mega) return;
      team[0].megaActive = !team[0].megaActive;
      renderLeader();
      renderSlots();
    });

    $("bd-level").addEventListener("input", function () {
      var lvl = validateLevel($("bd-level"), $("bd-level-error"));
      if (lvl == null) return;
      team[0].level = lvl;
      renderStats($("bd-stats"), PB.activeForm(team[0]).baseStats, lvl);
      renderSlots();
    });

    // ---- Busca / filtro ----
    $("bd-search").addEventListener("input", renderList);
    $("bd-filter-type").addEventListener("change", renderList);

    // ---- Modal ----
    $("bd-modal-close").addEventListener("click", closeModal);
    $("bd-modal-save").addEventListener("click", saveModal);
    $("bd-modal-remove").addEventListener("click", function () {
      if (editingSlot != null && editingSlot !== 0) { removeSlot(editingSlot); closeModal(); }
      else flash("O líder não pode ser removido do time.");
    });
    $("bd-modal-mega").addEventListener("change", refreshModalStats);
    $("bd-modal-level").addEventListener("input", refreshModalStats);
    $("bd-modal").addEventListener("click", function (e) {
      if (e.target === $("bd-modal")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !$("bd-modal").hidden) closeModal();
    });

    // ---- Confirmar (save) ----
    $("bd-confirm").addEventListener("click", function () {
      // valida o level do líder antes de salvar
      var lvl = validateLevel($("bd-level"), $("bd-level-error"));
      if (lvl == null) { $("bd-level").focus(); return; }
      PB.storage.saveTeam(side, team);
      window.location.href = "index.html";
    });
  }

  document.addEventListener("DOMContentLoaded", init);

})(window.PB = window.PB || {});
