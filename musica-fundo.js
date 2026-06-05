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
		treinos: "treinos.html",
		habilidades: "habilidades.html",
		biblioteca: "biblioteca-itens.html",
		amigos: "amigos.html",
		grupo: "amigos.html#grupo",
		eventos: "eventos.html"
	};
	var icones = {
		atributos: "atributos.webp",
		inventario: "inventario.webp",
		lojas: "lojas.webp",
		eventos: "eventos.webp",
		missoes: "missoes.webp",
		aventura: "viagem.webp",
		correio: "organizacao.webp",
		notificacoes: "eventos.webp",
		treinos: "treinos.webp",
		habilidades: "habilidades.webp",
		biblioteca: "inventario.webp",
		amigos: "amigos.webp",
		grupo: "organizacao.webp",
		ajustes: "ajustes.webp",
		aparencia: "aparencia.webp"
	};

	function onReady(fn) {
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
		else fn();
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

	function obterPersonagem() {
		try {
			var direto = JSON.parse(localStorage.getItem("ultimoPersonagem") || "null");
			if (direto && direto.nome) return direto;
			var lista = JSON.parse(localStorage.getItem("personagensCriados") || "[]");
			return Array.isArray(lista) ? lista[lista.length - 1] || null : null;
		} catch (erro) {
			return null;
		}
	}

	function progressoDo(personagem) {
		if (window.RpgSistemas && typeof window.RpgSistemas.obterProgresso === "function") {
			return window.RpgSistemas.obterProgresso(personagem);
		}
		return personagem && personagem.progressoRpg ? personagem.progressoRpg : {};
	}

	function estadoNivel(progresso) {
		if (window.RpgSistemas && typeof window.RpgSistemas.estadoNivel === "function") {
			return window.RpgSistemas.estadoNivel(progresso);
		}
		return {
			nivel: progresso.nivel || 1,
			expAtual: progresso.expAtual || 0,
			proximo: progresso.proximoNivel || 100,
			percentual: progresso.proximoNivel ? Math.min(100, (Number(progresso.expAtual || 0) / Number(progresso.proximoNivel)) * 100) : 0
		};
	}

	function formatar(valor) {
		return Number(valor || 0).toLocaleString("pt-BR");
	}

	function icone(acao) {
		return "assets/img/menu-game/" + (icones[acao] || icones.habilidades);
	}

	function instalarCss() {
		if (document.getElementById("rpg-hotfix-css")) return;
		var style = document.createElement("style");
		style.id = "rpg-hotfix-css";
		style.textContent = [
			".rpg-pagina-scroll{overflow-y:auto!important;scrollbar-gutter:stable}",
			".battle-hud-lobby{position:fixed;top:14px;left:14px;z-index:1200;display:grid;grid-template-columns:minmax(180px,250px) auto;grid-template-areas:'perfil berris' 'xp xp';gap:8px;width:min(430px,calc(100vw - 28px));pointer-events:auto}",
			".battle-perfil{grid-area:perfil;display:grid;grid-template-columns:46px 1fr;gap:10px;align-items:center;min-height:58px;padding:7px 10px;border:1px solid rgba(255,226,138,.5);border-radius:8px;color:#fff7df;background:linear-gradient(90deg,rgba(4,12,13,.94),rgba(12,24,26,.86));box-shadow:0 12px 26px rgba(0,0,0,.45),0 0 18px rgba(255,226,138,.16);cursor:pointer;text-align:left}",
			".battle-avatar{width:44px;height:44px;border-radius:8px;border:1px solid rgba(255,226,138,.45);background:radial-gradient(circle,#fff7df,#36e0ff 42%,#07100d 72%);box-shadow:0 0 16px rgba(54,224,255,.28);overflow:hidden}",
			".battle-avatar img{width:100%;height:100%;object-fit:cover;display:block}",
			".battle-nome{display:block;color:#fff7df;font-size:.95rem;font-weight:900;line-height:1.05;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".battle-nivel{display:block;margin-top:3px;color:#ffe28a;font-size:.72rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}",
			".battle-berris{grid-area:berris;display:grid;align-content:center;min-width:112px;padding:7px 10px;border:1px solid rgba(255,226,138,.45);border-radius:8px;background:linear-gradient(180deg,rgba(60,42,8,.84),rgba(4,12,13,.84));box-shadow:0 12px 26px rgba(0,0,0,.42)}",
			".battle-berris small,.battle-xp small{color:#ffe28a;font-size:.62rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}",
			".battle-berris strong{color:#fff7df;font-size:1rem;line-height:1.05}",
			".battle-xp{grid-area:xp;display:grid;gap:4px;padding:7px 10px;border:1px solid rgba(54,224,255,.36);border-radius:8px;background:rgba(3,8,10,.86);box-shadow:0 12px 26px rgba(0,0,0,.38)}",
			".battle-xp-topo{display:flex;justify-content:space-between;gap:10px;color:#d9e8d4;font-size:.72rem;font-weight:900}",
			".battle-xp-barra{height:9px;border-radius:999px;border:1px solid rgba(255,247,223,.14);background:rgba(0,0,0,.58);overflow:hidden}",
			".battle-xp-barra i{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,#36e0ff,#ffe28a);box-shadow:0 0 14px rgba(54,224,255,.55);transition:width .35s ease}",
			".atalho-menu-lobby,.botao-menu-lobby,.botao-lobby{position:relative!important;overflow:hidden!important}",
			".atalho-menu-lobby:hover,.botao-menu-lobby:hover,.botao-lobby:hover{filter:saturate(1.14)!important;box-shadow:0 0 20px rgba(255,226,138,.32),inset 0 0 18px rgba(255,247,223,.08)!important}",
			".grade-menu-lobby{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}",
			".atalho-menu-lobby{min-width:0!important}",
			".atalho-menu-lobby span{overflow-wrap:anywhere!important}",
			".item-imagem{flex:0 0 auto;width:56px;height:56px;border:1px solid rgba(255,226,138,.52);border-radius:8px;overflow:hidden;background:#061011;box-shadow:0 0 18px rgba(255,226,138,.25)}",
			".item-imagem img{width:100%;height:100%;object-fit:cover;display:block}",
			"@media(max-width:700px){.battle-hud-lobby{position:relative;top:auto;left:auto;width:100%;margin:0 0 12px;grid-template-columns:1fr;grid-template-areas:'perfil' 'berris' 'xp'}.battle-berris{min-width:0}.grade-menu-lobby{grid-template-columns:1fr!important;padding:10px!important;gap:10px!important}.atalho-menu-lobby{grid-template-columns:54px 1fr!important;justify-items:start!important;min-height:76px!important;padding:10px 12px!important}.atalho-menu-lobby img{width:46px!important;height:46px!important}.atalho-menu-lobby span{text-align:left!important;font-size:.8rem!important;line-height:1.15!important}}",
			"@media (hover:none),(pointer:coarse),(max-width:680px){body{overflow:auto!important}.video-fundo{display:none!important}.skill-stage{overflow-x:auto!important;overflow-y:hidden!important;touch-action:pan-x pan-y!important;-webkit-overflow-scrolling:touch!important;min-height:520px!important}.skill-stage>*{min-width:720px!important}.stage-bg:before,.stage-bg:after,.branch-band{display:none!important}.tree-line,.skill-node,.skill-core{filter:none!important;animation:none!important}}"
		].join("");
		document.head.appendChild(style);
	}

	function carregarRpgSistemas() {
		if (window.RpgSistemas || document.querySelector('script[src^="rpg-sistemas.js"]')) return;
		var script = document.createElement("script");
		script.src = "rpg-sistemas.js";
		script.defer = true;
		document.head.appendChild(script);
	}

	function atualizarIcones() {
		var mapaIds = {
			"botao-atributos": "atributos",
			"botao-inventario": "inventario",
			"botao-menu-lobby": "habilidades",
			"botao-menu-ajustes": "ajustes"
		};
		document.querySelectorAll(".atalho-menu-lobby, .botao-menu-lobby").forEach(function (botao) {
			var acao = botao.dataset.menuAcao || mapaIds[botao.id] || "";
			var texto = botao.textContent || "";
			if (!acao && /aventura|entrar|mar|ilha|viagem/i.test(texto)) acao = "aventura";
			if (!acao && /correio|mensagens?/i.test(texto)) acao = "correio";
			if (!acao && /notifica|avisos?/i.test(texto)) acao = "notificacoes";
			if (!acao && /biblioteca|meito|itens?/i.test(texto)) acao = "biblioteca";
			if (!acao) return;
			var img = botao.querySelector("img");
			if (img) img.src = icone(acao);
		});
	}

	function injetarAtalhos() {
		var grade = document.getElementById("grade-menu-lobby");
		if (!grade || grade.dataset.sistemasRpg === "ok") return;
		grade.dataset.sistemasRpg = "ok";
		[
			["aventura", "Entrar na Aventura"],
			["correio", "Correio"],
			["notificacoes", "Notificações"],
			["treinos", "Treinos"],
			["habilidades", "Árvore de Habilidades"],
			["biblioteca", "Biblioteca de Itens"],
			["amigos", "Adicionar Amigos"],
			["grupo", "Bando / Organização"]
		].forEach(function (item) {
			if (grade.querySelector('[data-menu-acao="' + item[0] + '"]')) return;
			var botao = document.createElement("button");
			botao.className = "atalho-menu-lobby";
			botao.type = "button";
			botao.dataset.menuAcao = item[0];
			botao.innerHTML = '<img src="' + icone(item[0]) + '" alt=""><span>' + item[1] + "</span>";
			grade.appendChild(botao);
		});
	}

	function criarHudBattle() {
		if (!document.body.classList.contains("pagina-formulario")) return null;
		var painel = document.querySelector(".container-lobby") || document.body;
		var hud = document.getElementById("battle-hud-lobby");
		if (hud) return hud;
		hud = document.createElement("div");
		hud.id = "battle-hud-lobby";
		hud.className = "battle-hud-lobby";
		hud.innerHTML =
			'<button class="battle-perfil" type="button" data-menu-acao="perfil">' +
			'<span class="battle-avatar" id="battle-avatar"></span>' +
			'<span><strong class="battle-nome" id="battle-nome">Perfil</strong><span class="battle-nivel" id="battle-nivel">Nv. 1</span></span>' +
			"</button>" +
			'<div class="battle-berris"><small>Berris</small><strong id="battle-berris">0</strong></div>' +
			'<div class="battle-xp"><div class="battle-xp-topo"><small>EXP</small><span id="battle-xp-texto">0 / 0</span></div><div class="battle-xp-barra"><i id="battle-xp-barra"></i></div></div>';
		painel.prepend(hud);
		return hud;
	}

	function atualizarHudBattle() {
		var hud = criarHudBattle();
		if (!hud) return;
		var personagem = obterPersonagem();
		var progresso = progressoDo(personagem);
		var estado = estadoNivel(progresso);
		var avatar = document.getElementById("battle-avatar");
		document.getElementById("battle-nome").textContent = personagem && personagem.nome ? personagem.nome : "Sem personagem";
		document.getElementById("battle-nivel").textContent = "Nv. " + (estado.nivel || progresso.nivel || 1);
		document.getElementById("battle-berris").textContent = formatar(progresso.berris);
		document.getElementById("battle-xp-texto").textContent = formatar(estado.expAtual) + " / " + formatar(estado.proximo);
		document.getElementById("battle-xp-barra").style.width = Math.max(0, Math.min(100, estado.percentual || 0)) + "%";
		if (avatar && personagem && personagem.imagem && avatar.dataset.src !== personagem.imagem) {
			avatar.dataset.src = personagem.imagem;
			avatar.innerHTML = '<img src="' + personagem.imagem + '" alt="">';
		}
	}

	function habilitarScroll() {
		if (document.querySelector(".perfil-app, .biblioteca-app, .app")) {
			document.body.classList.add("rpg-pagina-scroll");
		}
	}

	function imagemWiki(nome) {
		return "https://onepiece.fandom.com/wiki/Special:Redirect/file/" + encodeURIComponent(String(nome || "").replaceAll(" ", "_") + "_Infobox.png");
	}

	function decorarBiblioteca() {
		if (!/biblioteca-itens\.html?$/.test(window.location.pathname)) return;
		document.querySelectorAll(".item-card").forEach(function (card) {
			var titulo = card.querySelector("h2");
			var iconeAtual = card.querySelector(".item-icone");
			if (!titulo || !iconeAtual || iconeAtual.dataset.wikiImagem === "ok") return;
			var nome = titulo.textContent.trim();
			iconeAtual.dataset.wikiImagem = "ok";
			iconeAtual.className = "item-imagem";
			iconeAtual.innerHTML = '<img src="' + imagemWiki(nome) + '" alt="' + nome + '" loading="lazy">';
			iconeAtual.querySelector("img").addEventListener("error", function () {
				iconeAtual.className = "item-icone";
				iconeAtual.innerHTML = "";
			}, { once: true });
		});
	}

	function instalarFeedback() {
		window.RpgFeedback = window.RpgFeedback || {
			recompensa: function () { setTimeout(atualizarHudBattle, 120); },
			aviso: function () {}
		};
	}

	function iniciarAudio() {
		var audio = document.getElementById("musica-fundo");
		if (!audio) return;
		var chave = "onePieceRpgVolumeMusica";
		var controleSom = document.getElementById("controle-som");
		var botaoSom = document.getElementById("botao-som");
		var volumeMusica = document.getElementById("volume-musica");
		function aplicar(valor) {
			var volume = Math.max(0, Math.min(Number(valor) || 0, 100));
			audio.volume = volume / 100;
			audio.muted = volume === 0;
			localStorage.setItem(chave, String(volume));
			if (volumeMusica) volumeMusica.value = String(volume);
		}
		function tocar() {
			audio.play().catch(function () {
				document.addEventListener("pointerdown", tocar, { once: true });
			});
		}
		aplicar(localStorage.getItem(chave) === null ? 50 : localStorage.getItem(chave));
		if (botaoSom && controleSom) {
			botaoSom.addEventListener("click", function () {
				var visivel = controleSom.classList.toggle("visivel");
				controleSom.setAttribute("aria-hidden", visivel ? "false" : "true");
				tocar();
			});
		}
		if (volumeMusica) volumeMusica.addEventListener("input", function () { aplicar(volumeMusica.value); tocar(); });
		tocar();
	}

	function iniciar() {
		instalarCss();
		carregarRpgSistemas();
		injetarAtalhos();
		atualizarIcones();
		habilitarScroll();
		decorarBiblioteca();
		instalarFeedback();
		atualizarHudBattle();
		iniciarAudio();
		setInterval(atualizarHudBattle, 1000);
	}

	document.addEventListener("click", navegar, true);
	onReady(iniciar);
})();