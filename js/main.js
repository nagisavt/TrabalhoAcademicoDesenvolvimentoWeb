/* ============================================================
   Pokémon Battle — Tela de Versus
   Controla a seleção de personagem e a navegação.
   ============================================================ */
(function () {
  "use strict";

  const arena = document.querySelector(".versus");
  const sides = document.querySelectorAll(".side");

  /**
   * Confirma a escolha: marca o lado, dispara a animação
   * e navega para a tela do personagem após o efeito.
   * @param {HTMLElement} side - botão do lado escolhido
   */
  function choose(side) {
    if (arena.classList.contains("is-leaving")) return; // evita cliques duplos

    const target = side.dataset.target;
    if (!target) return;

    // Guarda a escolha para a próxima tela usar (sessão atual).
    sessionStorage.setItem("escolhaPokemon", side.classList.contains("side--sableye") ? "sableye" : "salamence");

    side.classList.add("is-chosen");
    arena.classList.add("is-leaving");

    // Se o usuário prefere menos movimento, navega na hora.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(function () {
      window.location.href = target;
    }, reduceMotion ? 0 : 650);
  }

  sides.forEach(function (side) {
    // Clique / toque
    side.addEventListener("click", function () {
      choose(side);
    });

    // Acessibilidade: Enter ou Espaço também confirmam
    side.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        choose(side);
      }
    });
  });
})();
