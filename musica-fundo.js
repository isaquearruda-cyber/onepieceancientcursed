(function () {
  "use strict";

  var rotasPaginas = {
    "botao-iniciar": "aventura.html",
    "botao-inventario": "inventario.html",
    "botao-atributos": "atributos.html"
  };

  var rotasMenu = {
    perfil: "perfil.html",
    aventura: "aventura.html",
    correio: "correio.html",
    notificacoes: "notificacoes.html",
    lojas: "loja.html",
    missoes: "missoes.html",
    viagem: "aventura.html",
    treinos: "treinos.html",
    conquistas: "conquistas.html",
    habilidades: "habilidades.html",
    biblioteca: "biblioteca-itens.html",
    amigos: "amigos.html",
    grupo: "bando.html",
    eventos: "eventos.html",
    beta: "beta-recompensas.html"
  };

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function corrigirDownloadNoMenu() {
    var antigo = "Tut" + "orial";
    var antigoLower = antigo.toLowerCase();
    var seletores = [
      "#botao-" + antigoLower,
      "#botao-download-app",
      "[data-i18n='menu." + antigoLower + "']",
      "[data-i18n='menu.download']"
    ].join(",");

    document.querySelectorAll(seletores).forEach(function (botao) {
      botao.id = "botao-download-app";
      botao.removeAttribute("data-i18n");
      botao.textContent = "Dowload";
      if (botao.tagName !== "A") botao.type = "button";
    });

    document.querySelectorAll("button, a").forEach(function (botao) {
      var texto = (botao.textContent || "").trim().toLowerCase();
      if (texto === antigoLower || texto === "download" || texto === "dowload") {
        botao.id = "botao-download-app";
        botao.removeAttribute("data-i18n");
        botao.textContent = "Dowload";
      }
    });
  }

  function irParaDownload(evento) {
    var antigo = "tut" + "orial";
    var alvo = evento.target.closest("#botao-download-app, #botao-" + antigo + ", [data-i18n='menu." + antigo + "'], [data-i18n='menu.download']");
    if (!alvo) return;
    var texto = (alvo.textContent || "").trim().toLowerCase();
    if (alvo.id !== "botao-download-app" && alvo.id !== "botao-" + antigo && texto !== antigo && texto !== "download" && texto !== "dowload") return;
    evento.preventDefault();
    evento.stopImmediatePropagation();
    window.location.href = "download.html";
  }

  function navegar(evento) {
    var botaoPagina = evento.target.closest("#botao-iniciar, #botao-inventario, #botao-atributos");
    var botaoMenu = evento.target.closest("[data-menu-acao]");
    var destino = botaoPagina ? rotasPaginas[botaoPagina.id] : rotasMenu[botaoMenu && botaoMenu.dataset.menuAcao];
    if (!destino) return;
    evento.preventDefault();
    evento.stopImmediatePropagation();
    window.location.href = destino;
  }

  function instalarPwa() {
    if (!document.querySelector('link[rel="manifest"]')) {
      var manifest = document.createElement("link");
      manifest.rel = "manifest";
      manifest.href = "manifest.webmanifest";
      document.head.appendChild(manifest);
    }

    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("service-worker.js").then(function (registro) {
        registro.update();
        if (registro.waiting) registro.waiting.postMessage({ type: "SKIP_WAITING" });
      }).catch(function () {});
    }
  }

  function iniciarAudio() {
    var audio = document.getElementById("musica-fundo");
    if (!audio) return;
    var controleSom = document.getElementById("controle-som");
    var botaoSom = document.getElementById("botao-som");
    var volumeMusica = document.getElementById("volume-musica");
    var chave = "onePieceRpgVolumeMusica";

    function aplicar(valor) {
      var volume = Math.max(0, Math.min(Number(valor) || 0, 100));
      audio.volume = volume / 100;
      audio.muted = volume === 0;
      localStorage.setItem(chave, String(volume));
      if (volumeMusica) volumeMusica.value = String(volume);
    }

    aplicar(localStorage.getItem(chave) === null ? 50 : localStorage.getItem(chave));
    if (botaoSom && controleSom) {
      botaoSom.addEventListener("click", function () {
        var visivel = controleSom.classList.toggle("visivel");
        controleSom.setAttribute("aria-hidden", visivel ? "false" : "true");
        audio.play().catch(function () {});
      });
    }
    if (volumeMusica) volumeMusica.addEventListener("input", function () { aplicar(volumeMusica.value); });
  }

  document.addEventListener("click", irParaDownload, true);
  document.addEventListener("click", navegar, true);

  onReady(function () {
    instalarPwa();
    corrigirDownloadNoMenu();
    iniciarAudio();
    setTimeout(corrigirDownloadNoMenu, 250);
    setTimeout(corrigirDownloadNoMenu, 1200);
  });
})();
