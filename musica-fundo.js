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
			".battle-hud-lobby{position:relative;z-index:1;display:grid;grid-template-columns:minmax(180px,1.2fr) minmax(96px,.7fr);grid-template-areas:'perfil berris' 'xp xp';gap:8px;width:100%;margin:8px 0 12px;pointer-events:auto}",
			".battle-perfil{grid-area:perfil;display:grid;grid-template-columns:40px 1fr;gap:9px;align-items:center;min-height:52px;padding:6px 9px;border:1px solid rgba(144,255,0,.42);border-radius:8px;color:#90ff00;background:linear-gradient(90deg,rgba(4,18,10,.88),rgba(8,28,18,.72));box-shadow:0 0 16px rgba(144,255,0,.12),inset 0 0 18px rgba(0,0,0,.25);cursor:pointer;text-align:left}",
			".battle-avatar{width:38px;height:38px;border-radius:8px;border:1px solid rgba(144,255,0,.45);background:radial-gradient(circle,#eaffd8,#36e0ff 42%,#07100d 72%);box-shadow:0 0 14px rgba(144,255,0,.22);overflow:hidden}",
			".battle-avatar img{width:100%;height:100%;object-fit:cover;display:block}",
			".battle-nome{display:block;color:#90ff00;font-size:.9rem;font-weight:900;line-height:1.05;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".battle-nivel{display:block;margin-top:3px;color:#b8ff55;font-size:.7rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}",
			".battle-berris{grid-area:berris;display:grid;align-content:center;min-width:96px;padding:6px 9px;border:1px solid rgba(144,255,0,.34);border-radius:8px;background:linear-gradient(180deg,rgba(22,48,12,.74),rgba(4,12,13,.78));box-shadow:0 0 14px rgba(144,255,0,.1),inset 0 0 16px rgba(0,0,0,.22)}",
			".battle-berris small,.battle-xp small{color:#90ff00;font-size:.6rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}",
			".battle-berris strong{color:#d8ff9a;font-size:.98rem;line-height:1.05}",
			".battle-xp{grid-area:xp;display:grid;gap:4px;padding:6px 9px;border:1px solid rgba(144,255,0,.28);border-radius:8px;background:rgba(3,12,8,.78);box-shadow:0 0 14px rgba(144,255,0,.08),inset 0 0 16px rgba(0,0,0,.22)}",
			".battle-xp-topo{display:flex;justify-content:space-between;gap:10px;color:#b8ff55;font-size:.7rem;font-weight:900}",
			".battle-xp-barra{height:8px;border-radius:999px;border:1px solid rgba(144,255,0,.18);background:rgba(0,0,0,.58);overflow:hidden}",
			".battle-xp-barra i{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,#90ff00,#d8ff9a);box-shadow:0 0 14px rgba(144,255,0,.5);transition:width .35s ease}",
			".atalho-menu-lobby,.botao-menu-lobby,.botao-lobby{position:relative!important;overflow:hidden!important}",
			".atalho-menu-lobby:hover,.botao-menu-lobby:hover,.botao-lobby:hover{filter:saturate(1.14)!important;box-shadow:0 0 20px rgba(255,226,138,.32),inset 0 0 18px rgba(255,247,223,.08)!important}",
			".grade-menu-lobby{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}",
			".atalho-menu-lobby{min-width:0!important}",
			".atalho-menu-lobby span{overflow-wrap:anywhere!important}",
			".status-personagem.oculto-lobby{display:none!important}",
			".painel-proxima-acao{display:grid;gap:12px;padding:14px;border:1px solid rgba(54,224,255,.24);border-radius:8px;background:radial-gradient(circle at 18% 18%,rgba(54,224,255,.16),transparent 34%),rgba(4,12,13,.58);box-shadow:inset 0 0 20px rgba(0,0,0,.28)}",
			".painel-proxima-acao h2{margin:0;color:#fff7df;font-size:1.35rem;text-transform:uppercase;letter-spacing:.04em}",
			".painel-proxima-acao p{margin:0;color:#d9e8d4;line-height:1.45}",
			".chips-rota{display:flex;flex-wrap:wrap;gap:8px}",
			".chip-rota{padding:7px 9px;border:1px solid rgba(255,226,138,.24);border-radius:999px;background:rgba(255,247,223,.05);color:#ffe28a;font-size:.78rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase}",
			".acoes-rapidas-lobby{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
			".botao-acao-rapida{min-height:54px;border:1px solid rgba(255,226,138,.5);border-radius:8px;color:#fff7df;background:linear-gradient(90deg,rgba(255,247,223,.07),rgba(54,224,255,.08));font-weight:900;text-transform:uppercase;cursor:pointer}",
			".item-imagem{flex:0 0 auto;width:56px;height:56px;border:1px solid rgba(255,226,138,.52);border-radius:8px;overflow:hidden;background:#061011;box-shadow:0 0 18px rgba(255,226,138,.25)}",
			".item-imagem img{width:100%;height:100%;object-fit:cover;display:block}",
			"@media(max-width:1180px) and (hover:none),(max-width:1180px) and (pointer:coarse){body.pagina-formulario{overflow-y:auto!important}.container-lobby{grid-template-columns:1fr!important;width:min(100%,680px)!important;max-width:680px!important;margin:0 auto!important;padding:12px!important;gap:12px!important}.painel-personagem{order:1!important}.painel-comandos{order:2!important}.personagem-palco{order:3!important;min-height:340px!important}.cabecalho-lobby{text-align:center!important}.cabecalho-lobby h1{font-size:clamp(1.75rem,7vw,2.3rem)!important}.battle-hud-lobby{grid-template-columns:1fr minmax(92px,.38fr)!important;grid-template-areas:'perfil berris' 'xp xp'!important}.painel-proxima-acao h2{font-size:1.12rem!important}.botao-lobby,.botao-menu-lobby{grid-template-columns:58px 1fr auto!important;min-height:64px!important;padding:8px 12px!important}.botao-lobby img,.botao-menu-lobby img,.atalho-menu-lobby img{width:52px!important;height:52px!important}.grade-menu-lobby{grid-template-columns:1fr!important}.atalho-menu-lobby{min-height:74px!important;grid-template-columns:56px 1fr!important;justify-items:start!important;text-align:left!important}}",
			"@media(max-width:700px){.battle-hud-lobby{width:100%;margin:8px 0 12px;grid-template-columns:1fr;grid-template-areas:'perfil' 'berris' 'xp'}.battle-berris{min-width:0}.grade-menu-lobby{grid-template-columns:1fr!important;padding:10px!important;gap:10px!important}.atalho-menu-lobby{grid-template-columns:54px 1fr!important;justify-items:start!important;min-height:76px!important;padding:10px 12px!important}.atalho-menu-lobby img{width:46px!important;height:46px!important}.atalho-menu-lobby span{text-align:left!important;font-size:.8rem!important;line-height:1.15!important}}",
			"@media(max-width:960px) and (orientation:landscape){html,body,body.pagina-formulario{width:100%;min-height:100svh;overflow:hidden!important;background:#030809}.video-fundo{display:block!important;filter:brightness(.34) saturate(1.12)}.orientacao-celular{display:none!important}.container-lobby{width:100%!important;height:100svh!important;height:100vh!important;min-height:100vh!important;max-width:none!important;display:grid!important;grid-template-columns:minmax(156px,.72fr) minmax(260px,1.55fr) minmax(178px,.82fr)!important;grid-template-rows:1fr!important;gap:7px!important;padding:6px!important;margin:0!important;align-items:stretch!important;overflow:hidden!important}.painel-lobby,.personagem-palco{min-height:0!important}.painel-personagem,.painel-comandos,.personagem-palco{padding:8px!important;border-color:rgba(144,255,0,.2)!important;background:linear-gradient(180deg,rgba(2,8,10,.66),rgba(2,5,7,.58))!important;box-shadow:0 12px 28px rgba(0,0,0,.32),inset 0 0 24px rgba(54,224,255,.04)!important;backdrop-filter:blur(3px)!important}.painel-personagem{order:1!important;display:grid!important;grid-template-rows:auto auto!important;align-content:start!important;gap:8px!important;overflow:hidden!important}.personagem-palco{order:2!important;padding:4px 10px 8px!important;display:grid!important;place-items:center!important;overflow:hidden!important}.painel-comandos{order:3!important;display:grid!important;grid-template-rows:1fr auto auto!important;gap:8px!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch}.cabecalho-lobby{text-align:left!important;display:grid!important;gap:6px!important}.cabecalho-lobby h1,.cabecalho-lobby .subtitulo-lobby,.status-online{display:none!important}.battle-hud-lobby{margin:0!important;grid-template-columns:1fr!important;grid-template-areas:'perfil' 'berris' 'xp'!important;gap:6px!important}.battle-perfil,.battle-berris,.battle-xp{min-height:0!important;padding:6px 7px!important;border-radius:7px!important}.battle-perfil{grid-template-columns:34px 1fr!important}.battle-avatar{width:32px!important;height:32px!important}.battle-nome{font-size:.82rem!important}.battle-nivel,.battle-xp-topo{font-size:.62rem!important}.battle-berris strong{font-size:.9rem!important}.battle-xp-barra{height:6px!important}.painel-proxima-acao{align-self:start!important;gap:6px!important;padding:9px!important;overflow:hidden!important}.painel-proxima-acao .info-label,.painel-proxima-acao h2,.painel-proxima-acao p,.chips-rota{display:none!important}.acoes-rapidas-lobby{grid-template-columns:1fr 1fr!important;gap:6px!important}.botao-acao-rapida{min-height:34px!important;border-radius:6px!important;font-size:.62rem!important}.palco-identidade{top:8px!important;width:min(68%,260px)!important;padding:7px 10px!important;background:rgba(2,8,10,.56)!important}.palco-identidade span{font-size:.55rem!important}.palco-identidade strong{font-size:clamp(1rem,3vw,1.55rem)!important}.palco-moldura{width:100%!important;min-height:0!important;height:100%!important;padding-top:38px!important}.palco-placeholder{width:min(56%,238px)!important;max-height:calc(100svh - 74px)!important;aspect-ratio:3/4!important;background:radial-gradient(circle at 50% 78%,rgba(247,200,75,.18),transparent 46%)!important}.palco-placeholder.tem-imagem{width:min(64%,270px)!important}.painel-titulo{font-size:.72rem!important;letter-spacing:.14em!important}.acoes-lobby,.grupo-comandos,.menu-lobby-recolhivel{gap:6px!important}.botao-lobby,.botao-menu-lobby,.botao-registros{grid-template-columns:38px 1fr auto!important;min-height:46px!important;padding:5px 8px!important;gap:8px!important;border-radius:7px!important;font-size:.72rem!important}.botao-registros{grid-template-columns:38px 1fr!important}.botao-lobby img,.botao-menu-lobby img,.botao-registros img{width:36px!important;height:36px!important;border-radius:6px!important}.menu-seta{font-size:.95rem!important}.grade-menu-lobby{grid-template-columns:1fr!important;gap:5px!important;padding:6px!important;max-height:44svh!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch}.atalho-menu-lobby{min-height:40px!important;grid-template-columns:34px 1fr!important;justify-items:start!important;text-align:left!important;gap:7px!important;padding:5px 7px!important;border-radius:7px!important}.atalho-menu-lobby img{width:32px!important;height:32px!important;border-radius:6px!important}.atalho-menu-lobby span{font-size:.62rem!important;line-height:1.05!important}.botao-voltar-inicio{min-height:34px!important;font-size:.62rem!important;padding:4px 7px!important}}",
			"@media(max-width:760px) and (orientation:portrait){.orientacao-celular{display:none!important}body.pagina-formulario{overflow-y:auto!important}.container-lobby{grid-template-columns:1fr!important;gap:10px!important;padding:10px!important}.personagem-palco{order:2!important;min-height:360px!important}.painel-personagem{order:1!important}.painel-comandos{order:3!important}.cabecalho-lobby h1{font-size:1.7rem!important}.botao-lobby,.botao-menu-lobby,.botao-registros{min-height:54px!important}}",
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

	function substituirFichaLobby() {
		var status = document.getElementById("status-personagem");
		if (!status || document.getElementById("painel-proxima-acao") || document.querySelector(".painel-proxima-acao")) return;
		status.classList.add("oculto-lobby");
		status.setAttribute("aria-hidden", "true");
		var painel = document.createElement("div");
		painel.id = "painel-proxima-acao";
		painel.className = "painel-proxima-acao";
		painel.innerHTML =
			'<span class="info-label">Central de aventura</span>' +
			"<h2>Escolha sua próxima rota</h2>" +
			"<p>Abra o mapa dos mares, revise sua ficha completa no perfil ou pegue uma missão para ganhar EXP e berris.</p>" +
			'<div class="chips-rota"><span class="chip-rota">4 Blues livres</span><span class="chip-rota">Rotas bloqueadas por campanha</span><span class="chip-rota">Viagem salva</span></div>' +
			'<div class="acoes-rapidas-lobby"><button class="botao-acao-rapida" type="button" data-menu-acao="aventura">Mapa</button><button class="botao-acao-rapida" type="button" data-menu-acao="perfil">Perfil</button><button class="botao-acao-rapida" type="button" data-menu-acao="missoes">Missões</button><button class="botao-acao-rapida" type="button" data-menu-acao="biblioteca">Biblioteca</button></div>';
		status.parentNode.insertBefore(painel, status);
	}

	function criarHudBattle() {
		if (!document.body.classList.contains("pagina-formulario")) return null;
		var painel = document.querySelector(".cabecalho-lobby") || document.querySelector(".container-lobby");
		if (!painel) return null;
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
		var referencia = document.getElementById("exp-lobby");
		if (referencia && referencia.parentNode === painel) painel.insertBefore(hud, referencia);
		else painel.appendChild(hud);
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
		substituirFichaLobby();
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
