(function () {
	document.addEventListener("click", (evento) => {
		const destinoPaginas = {
			"botao-iniciar": "aventura.html",
			"botao-inventario": "inventario.html",
			"botao-atributos": "atributos.html"
		};
		const destinosMenu = {
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
		const botaoPagina = evento.target.closest("#botao-iniciar, #botao-inventario, #botao-atributos");
		const botaoMenu = evento.target.closest("[data-menu-acao]");
		const destino = botaoPagina
			? destinoPaginas[botaoPagina.id]
			: destinosMenu[botaoMenu?.dataset?.menuAcao] || "";
		if (!destino) return;

		evento.preventDefault();
		evento.stopImmediatePropagation();
		window.location.href = destino;
	}, true);

	function garantirVideoDeFundo() {
		if (!document.body || document.querySelector(".video-fundo")) return;
		if (!document.body.classList.contains("pagina-inventario") && !document.body.classList.contains("pagina-atributos")) return;

		const video = document.createElement("video");
		video.className = "video-fundo";
		video.autoplay = true;
		video.muted = true;
		video.loop = true;
		video.playsInline = true;
		video.setAttribute("aria-hidden", "true");
		video.innerHTML = '<source src="fundo-login.mp4" type="video/mp4">';
		document.body.prepend(video);
		document.body.style.position = "relative";
	}

	garantirVideoDeFundo();

	function iconeMenu(acao) {
		const base = "assets/img/menu-game/";
		const mapa = {
			atributos: "atributos.webp",
			inventario: "inventario.webp",
			lojas: "lojas.webp",
			eventos: "eventos.webp",
			missoes: "missoes.webp",
			perfil: "atributos.webp",
			aventura: "viagem.webp",
			correio: "organizacao.webp",
			notificacoes: "eventos.webp",
			treinos: "treinos.webp",
			habilidades: "habilidades.webp",
			biblioteca: "inventario.webp",
			amigos: "amigos.webp",
			grupo: "organizacao.webp",
			viagem: "viagem.webp",
			ajustes: "ajustes.webp",
			aparencia: "aparencia.webp"
		};
		return base + (mapa[acao] || mapa.habilidades);
	}

	function criarAtalhoSistema(acao, texto, imagem) {
		const botao = document.createElement("button");
		botao.className = "atalho-menu-lobby";
		botao.type = "button";
		botao.dataset.menuAcao = acao;
		botao.innerHTML = `<img src="${imagem || iconeMenu(acao)}" alt=""><span>${texto}</span>`;
		return botao;
	}

	function atualizarIconesMenuLobby() {
		const mapa = {
			"botao-atributos": ["atributos", "Atributos"],
			"botao-inventario": ["inventario", "Inventário"],
			"botao-menu-lobby": ["habilidades", "Menu"],
			"botao-menu-ajustes": ["ajustes", "Ajustes"],
			"botao-atualiza-org-lobby": ["grupo", "Atualizar Organização"],
			"botao-aparencia-lobby": ["aparencia", "Atualizar Aparência"],
			"botao-imagem-personagem": ["aparencia", "Imagem do Personagem"]
		};
		const porTexto = [
			[/atributos/i, "atributos"],
			[/invent[aá]rio/i, "inventario"],
			[/lojas?/i, "lojas"],
			[/eventos?/i, "eventos"],
			[/miss/i, "missoes"],
			[/perfil|xp|status/i, "perfil"],
			[/aventura|entrar|mar|ilha|viagem/i, "aventura"],
			[/correio|mensagens?/i, "correio"],
			[/notifica|avisos?/i, "notificacoes"],
			[/treinos?/i, "treinos"],
			[/biblioteca|meito|itens?/i, "biblioteca"],
			[/[aá]rvore|habilidades?/i, "habilidades"],
			[/amigos?/i, "amigos"],
			[/bando|organiza/i, "grupo"],
			[/viagem|viajar/i, "viagem"],
			[/ajustes?/i, "ajustes"],
			[/apar[eê]ncia|imagem/i, "aparencia"]
		];
		const resolverAcao = (botao, texto) => {
			if (botao.dataset.menuAcao) return botao.dataset.menuAcao;
			if (mapa[botao.id]) return mapa[botao.id][0];
			return porTexto.find(([regex]) => regex.test(texto))?.[1] || "";
		};
		document.querySelectorAll(".atalho-menu-lobby, .botao-menu-lobby").forEach((botao) => {
			const texto = botao.querySelector("span")?.textContent?.trim() || mapa[botao.id]?.[1] || "";
			const acao = resolverAcao(botao, texto);
			const img = botao.querySelector("img");
			if (img && texto) img.alt = texto;
			if (img && acao) img.src = iconeMenu(acao);
		});
	}

	function injetarSistemasNoLobby() {
		const grade = document.getElementById("grade-menu-lobby");
		if (!grade || grade.dataset.sistemasRpg === "ok") return;
		grade.dataset.sistemasRpg = "ok";

		const atalhos = [
			["aventura", "Entrar na Aventura", ""],
			["correio", "Correio", ""],
			["notificacoes", "Notificações", ""],
			["treinos", "Treinos", ""],
			["habilidades", "Árvore de Habilidades", ""],
			["biblioteca", "Biblioteca de Itens", ""],
			["amigos", "Adicionar Amigos", ""],
			["grupo", "Bando / Organização", ""]
		];
		atalhos.forEach(([acao, texto, imagem]) => {
			if (!grade.querySelector(`[data-menu-acao="${acao}"]`)) {
				grade.appendChild(criarAtalhoSistema(acao, texto, imagem));
			}
		});
	}

	function carregarRpgSistemas() {
		if (window.RpgSistemas || document.querySelector('script[src^="rpg-sistemas.js"]')) return;
		const script = document.createElement("script");
		script.src = "rpg-sistemas.js";
		script.defer = true;
		document.head.appendChild(script);
	}

	function melhorarArvoreHabilidades() {
		if (!/habilidades\.html?$/.test(window.location.pathname)) return;
		const estilo = document.createElement("style");
		estilo.textContent = `
			.branch-band{height:13%!important;opacity:.46!important;border-color:color-mix(in srgb,var(--ramo-cor,#36e0ff) 14%,transparent)!important}
			.tree-lane{opacity:.52!important;border-top-color:color-mix(in srgb,var(--ramo-cor,#36e0ff) 14%,transparent)!important}
			.tree-line{stroke:rgba(255,247,223,.09)!important;stroke-width:3.2!important}
			.tree-line.aberta{filter:drop-shadow(0 0 4px var(--line-cor,var(--ramo-cor,#36e0ff)))!important}
			.tree-line.disponivel{filter:drop-shadow(0 0 7px #ffe28a)!important}
			.tree-line.realce{stroke:#fff7df!important;stroke-width:4.6!important;filter:drop-shadow(0 0 12px var(--line-cor,var(--ramo-cor,#ffe28a)))!important}
			.skill-node,.skill-core{transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,filter .18s ease!important}
			.skill-node img,.skill-core img{border-radius:inherit!important;object-fit:cover!important;transition:filter .18s ease,opacity .18s ease,transform .18s ease!important}
			.skill-node:not(.aberta) img{filter:grayscale(1) contrast(1.18) brightness(.88)!important;opacity:.62!important}
			.skill-node.aberta img,.skill-core img{filter:contrast(1.12) saturate(1.18)!important;opacity:1!important}
			.skill-node:hover,.skill-node.realce,.skill-core:hover,.skill-core.realce{z-index:4!important;border-color:#fff7df!important;transform:translate(-50%,-50%) scale(1.14)!important;filter:saturate(1.18)!important;box-shadow:0 0 0 5px color-mix(in srgb,var(--c,#36e0ff) 16%,transparent),0 0 24px color-mix(in srgb,var(--c,#36e0ff) 58%,transparent),0 18px 28px rgba(0,0,0,.44),inset 0 0 18px color-mix(in srgb,var(--c,#36e0ff) 18%,transparent)!important}
			.skill-node:hover img,.skill-node.realce img,.skill-core:hover img,.skill-core.realce img{filter:contrast(1.14) saturate(1.24)!important;opacity:1!important;transform:scale(1.04)!important}
			@media (hover:none),(pointer:coarse),(max-width:680px){
				body{overflow:auto!important}
				.video-fundo{display:none!important}
				.skill-app{min-height:100dvh!important;background:linear-gradient(180deg,rgba(3,8,10,.98),rgba(5,14,16,.96))!important}
				.skill-topo,.ramo-lista,.skill-stage,.skill-detalhe{backdrop-filter:none!important;box-shadow:0 14px 28px rgba(0,0,0,.38)!important}
				.skill-stage{overflow-x:auto!important;overflow-y:hidden!important;touch-action:pan-x pan-y!important;-webkit-overflow-scrolling:touch!important;min-height:520px!important}
				.skill-stage>*{min-width:720px!important}
				.stage-bg::before,.stage-bg::after,.branch-band{display:none!important}
				.tree-line,.tree-line.aberta,.tree-line.disponivel,.tree-line.realce{filter:none!important;animation:none!important}
				.skill-node,.skill-core,.skill-node.disponivel{width:42px!important;height:42px!important;animation:none!important;filter:none!important}
				.skill-core{width:64px!important;height:64px!important}
				.skill-node:hover,.skill-node.realce,.skill-core:hover,.skill-core.realce{transform:translate(-50%,-50%) scale(1.06)!important;box-shadow:0 0 14px color-mix(in srgb,var(--c,#36e0ff) 42%,transparent)!important}
			}
		`;
		document.head.appendChild(estilo);

		const ativar = () => {
			const stage = document.getElementById("skill-stage");
			if (!stage || stage.dataset.realceArvore === "ok") return;
			stage.dataset.realceArvore = "ok";
			const parear = () => {
				const linhas = Array.from(stage.querySelectorAll(".tree-line"));
				Array.from(stage.querySelectorAll(".skill-node")).forEach((node, indice) => {
					node.dataset.realceIndex = String(indice);
					if (linhas[indice]) linhas[indice].dataset.realceIndex = String(indice);
				});
			};
			const limpar = () => stage.querySelectorAll(".realce").forEach((el) => el.classList.remove("realce"));
			stage.addEventListener("mouseover", (evento) => {
				const node = evento.target.closest("[data-skill]");
				if (!node || !stage.contains(node)) return;
				parear();
				limpar();
				node.classList.add("realce");
				stage.querySelector(`.tree-line[data-realce-index="${node.dataset.realceIndex}"]`)?.classList.add("realce");
			});
			stage.addEventListener("mouseout", (evento) => {
				if (!evento.target.closest("[data-skill]")) return;
				limpar();
			});
			new MutationObserver(parear).observe(stage, { childList: true, subtree: true });
			parear();
		};
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ativar);
		else ativar();
	}

	function instalarCamadaJogo() {
		if (document.getElementById("rpg-camada-jogo")) return;
		const estilo = document.createElement("style");
		estilo.id = "rpg-camada-jogo";
		estilo.textContent = `
			:root{--raridade-cor:#d9e8d4}
			.rpg-toast-stack{position:fixed;right:18px;bottom:18px;z-index:9999;display:grid;gap:10px;width:min(340px,calc(100vw - 28px));pointer-events:none}
			.rpg-toast{position:relative;overflow:hidden;border:1px solid color-mix(in srgb,var(--toast-cor,#ffe28a) 58%,transparent);border-radius:8px;padding:12px 14px;background:linear-gradient(135deg,rgba(4,12,13,.94),rgba(20,16,8,.9));box-shadow:0 18px 38px rgba(0,0,0,.52),0 0 24px color-mix(in srgb,var(--toast-cor,#ffe28a) 24%,transparent);color:#fff7df;animation:rpgToastEntrada .28s ease both}
			.rpg-toast::before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent,rgba(255,247,223,.16),transparent);transform:translateX(-120%);animation:rpgBrilho 1.1s ease .12s}
			.rpg-toast small{display:block;color:var(--toast-cor,#ffe28a);font-weight:900;letter-spacing:.12em;text-transform:uppercase}
			.rpg-toast strong{display:block;margin:3px 0 7px;font-size:1rem}
			.rpg-toast span{display:inline-block;margin:2px 7px 0 0;color:#d9e8d4;font-size:.84rem;font-weight:800}
			.rpg-hud-lobby{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:10px 0 12px}
			.rpg-hud-card{position:relative;overflow:hidden;min-height:62px;padding:10px;border:1px solid rgba(255,226,138,.28);border-radius:8px;background:linear-gradient(180deg,rgba(255,247,223,.06),rgba(3,8,10,.68));box-shadow:inset 0 0 18px rgba(0,0,0,.24)}
			.rpg-hud-card small{display:block;color:#ffe28a;font-size:.68rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
			.rpg-hud-card strong{display:block;margin-top:3px;color:#fff7df;font-size:1.05rem;line-height:1.05;overflow-wrap:anywhere}
			.rpg-hud-card::after{content:"";position:absolute;right:-18px;bottom:-20px;width:58px;height:58px;border-radius:50%;background:radial-gradient(circle,rgba(255,226,138,.18),transparent 70%)}
			.battle-hud-lobby{position:fixed;top:14px;left:14px;z-index:1200;display:grid;grid-template-columns:minmax(180px,260px) auto;grid-template-areas:"perfil berris" "xp xp";gap:8px;align-items:stretch;width:min(440px,calc(100vw - 28px));pointer-events:auto}
			.battle-perfil{grid-area:perfil;display:grid;grid-template-columns:46px 1fr;gap:10px;align-items:center;min-height:58px;padding:7px 10px;border:1px solid rgba(255,226,138,.5);border-radius:8px;color:#fff7df;background:linear-gradient(90deg,rgba(4,12,13,.92),rgba(12,24,26,.82));box-shadow:0 12px 26px rgba(0,0,0,.45),0 0 18px rgba(255,226,138,.16);cursor:pointer;text-align:left;text-transform:none}
			.battle-avatar{width:44px;height:44px;border-radius:8px;border:1px solid rgba(255,226,138,.45);background:radial-gradient(circle,#fff7df,#36e0ff 42%,#07100d 72%);box-shadow:0 0 16px rgba(54,224,255,.28);overflow:hidden}
			.battle-avatar img{width:100%;height:100%;object-fit:cover;display:block}
			.battle-nome{display:block;color:#fff7df;font-size:.95rem;font-weight:900;line-height:1.05;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
			.battle-nivel{display:block;margin-top:3px;color:#ffe28a;font-size:.72rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
			.battle-berris{grid-area:berris;display:grid;align-content:center;min-width:112px;padding:7px 10px;border:1px solid rgba(255,226,138,.45);border-radius:8px;background:linear-gradient(180deg,rgba(60,42,8,.84),rgba(4,12,13,.84));box-shadow:0 12px 26px rgba(0,0,0,.42),0 0 18px rgba(255,226,138,.12)}
			.battle-berris small,.battle-xp small{color:#ffe28a;font-size:.62rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
			.battle-berris strong{color:#fff7df;font-size:1rem;line-height:1.05}
			.battle-xp{grid-area:xp;display:grid;gap:4px;padding:7px 10px;border:1px solid rgba(54,224,255,.36);border-radius:8px;background:rgba(3,8,10,.86);box-shadow:0 12px 26px rgba(0,0,0,.38)}
			.battle-xp-topo{display:flex;justify-content:space-between;gap:10px;color:#d9e8d4;font-size:.72rem;font-weight:900}
			.battle-xp-barra{height:9px;border-radius:999px;border:1px solid rgba(255,247,223,.14);background:rgba(0,0,0,.58);overflow:hidden}
			.battle-xp-barra i{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,#36e0ff,#ffe28a);box-shadow:0 0 14px rgba(54,224,255,.55);transition:width .35s ease}
			.rpg-pagina-scroll{overflow-y:auto!important;scrollbar-gutter:stable}
			.rpg-pagina-scroll .app,.rpg-pagina-scroll .perfil-app,.rpg-pagina-scroll .biblioteca-app{min-height:100vh}
			.atalho-menu-lobby,.botao-menu-lobby,.botao-lobby,.inventario-acao,.inventario-voltar,.atributos-voltar,.atributos-distribuir,.botao-voltar{will-change:transform}
			.atalho-menu-lobby:hover,.botao-menu-lobby:hover,.botao-lobby:hover,.inventario-acao:hover,.inventario-voltar:hover,.atributos-voltar:hover,.atributos-distribuir:hover,.botao-voltar:hover{filter:saturate(1.12);text-shadow:0 0 10px rgba(255,226,138,.28)}
			.slot-jogo,.slot-inventario{--raridade-cor:#d9e8d4}
			.slot-jogo.rpg-raridade,.slot-inventario.rpg-raridade{border-color:color-mix(in srgb,var(--raridade-cor) 62%,transparent)!important;box-shadow:0 14px 28px rgba(0,0,0,.38),0 0 18px color-mix(in srgb,var(--raridade-cor) 22%,transparent),inset 0 1px 0 rgba(255,255,255,.07)!important}
			.slot-jogo.rpg-raridade::after,.slot-inventario.rpg-raridade::after{content:attr(data-raridade);position:absolute;top:6px;left:7px;z-index:2;padding:3px 6px;border-radius:999px;color:#07100d;background:var(--raridade-cor);font-size:.58rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 0 12px color-mix(in srgb,var(--raridade-cor) 44%,transparent)}
			.slot-jogo[data-raridade="lendario"],.slot-inventario[data-raridade="lendario"]{--raridade-cor:#ffb347}
			.slot-jogo[data-raridade="epico"],.slot-inventario[data-raridade="epico"]{--raridade-cor:#b989ff}
			.slot-jogo[data-raridade="raro"],.slot-inventario[data-raridade="raro"]{--raridade-cor:#49d8ff}
			.slot-jogo[data-raridade="incomum"],.slot-inventario[data-raridade="incomum"]{--raridade-cor:#64d6a4}
			.detalhe-item[data-raridade],.detalhe-item.rpg-raridade{border-color:color-mix(in srgb,var(--raridade-cor) 56%,transparent)!important;box-shadow:0 0 24px color-mix(in srgb,var(--raridade-cor) 16%,transparent),inset 0 0 22px rgba(0,0,0,.22)}
			@keyframes rpgToastEntrada{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
			@keyframes rpgBrilho{to{transform:translateX(120%)}}
			.grade-menu-lobby{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}
			.atalho-menu-lobby,.botao-menu-lobby{position:relative!important;overflow:hidden!important}
			.atalho-menu-lobby::after,.botao-menu-lobby::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent,rgba(255,247,223,.16),transparent);transform:translateX(-120%);opacity:0;pointer-events:none}
			.atalho-menu-lobby:hover::after,.botao-menu-lobby:hover::after{opacity:1;animation:rpgBrilho .85s ease}
			.atalho-menu-lobby:hover,.botao-menu-lobby:hover{box-shadow:0 0 20px rgba(255,226,138,.32),inset 0 0 18px rgba(255,247,223,.08)!important}
			.atalho-menu-lobby{min-width:0!important}
			.atalho-menu-lobby span{overflow-wrap:anywhere!important;word-break:normal!important}
			@media(max-width:700px){.battle-hud-lobby{position:relative;top:auto;left:auto;z-index:2;width:100%;margin:0 0 12px;grid-template-columns:1fr;grid-template-areas:"perfil" "berris" "xp"}.battle-berris{min-width:0}.rpg-hud-lobby{grid-template-columns:1fr}.rpg-toast-stack{right:14px;bottom:14px}.grade-menu-lobby{grid-template-columns:1fr!important;padding:10px!important;gap:10px!important}.atalho-menu-lobby{grid-template-columns:54px 1fr!important;justify-items:start!important;min-height:76px!important;padding:10px 12px!important}.atalho-menu-lobby img{width:46px!important;height:46px!important}.atalho-menu-lobby span{text-align:left!important;font-size:.8rem!important;line-height:1.15!important}}
		`;
		document.head.appendChild(estilo);
	}

	function obterPersonagemAtivo() {
		try {
			const direto = JSON.parse(localStorage.getItem("ultimoPersonagem") || "null");
			if (direto?.nome) return direto;
			const personagens = JSON.parse(localStorage.getItem("personagensCriados") || "[]");
			return Array.isArray(personagens) ? personagens[personagens.length - 1] || null : null;
		} catch (erro) {
			return null;
		}
	}

	function mostrarToastRpg(dados) {
		const pilha = document.querySelector(".rpg-toast-stack") || document.body.appendChild(Object.assign(document.createElement("div"), { className: "rpg-toast-stack" }));
		const toast = document.createElement("div");
		toast.className = "rpg-toast";
		toast.style.setProperty("--toast-cor", dados.cor || "#ffe28a");
		toast.innerHTML = `
			<small>${dados.etiqueta || "Sistema"}</small>
			<strong>${dados.titulo || "Atualização"}</strong>
			${(dados.linhas || []).map((linha) => `<span>${linha}</span>`).join("")}
		`;
		pilha.appendChild(toast);
		setTimeout(() => {
			toast.style.opacity = "0";
			toast.style.transform = "translateY(8px)";
			setTimeout(() => toast.remove(), 260);
		}, 4200);
	}

	function instalarFeedbackRpg() {
		window.RpgFeedback = {
			recompensa(dados) {
				const recompensas = dados.recompensas || {};
				const linhas = [
					`+${Number(recompensas.exp || 0).toLocaleString("pt-BR")} EXP`,
					`+${Number(recompensas.berris || 0).toLocaleString("pt-BR")} berris`,
					`+${Number(recompensas.pontosAtributo || 0).toLocaleString("pt-BR")} atributo`
				];
				mostrarToastRpg({
					etiqueta: `${dados.tipo || "atividade"} rank ${dados.rank || "E"}`,
					titulo: dados.titulo || "Recompensa recebida",
					linhas,
					cor: dados.progresso?.nivel > 1 ? "#36e0ff" : "#ffe28a"
				});
				setTimeout(atualizarHudLobby, 120);
			},
			aviso(titulo, linhas = []) {
				mostrarToastRpg({ etiqueta: "Sistema", titulo, linhas, cor: "#36e0ff" });
			}
		};
	}

	function atualizarHudLobby() {
		if (!document.body?.classList.contains("pagina-formulario")) return;
		const exp = document.getElementById("exp-lobby");
		if (!exp) return;
		const personagem = obterPersonagemAtivo();
		const progresso = window.RpgSistemas?.obterProgresso?.(personagem) || personagem?.progressoRpg || {
			expDisponivel: 0,
			berris: 0,
			pontosMissao: 0
		};
		if (!personagem || !progresso) return;
		let hud = document.getElementById("rpg-hud-lobby");
		if (!hud) {
			hud = document.createElement("div");
			hud.id = "rpg-hud-lobby";
			hud.className = "rpg-hud-lobby";
			exp.insertAdjacentElement("afterend", hud);
		}
		const conteudo = `
			<div class="rpg-hud-card"><small>EXP livre</small><strong>${Number(progresso.expDisponivel || 0).toLocaleString("pt-BR")}</strong></div>
			<div class="rpg-hud-card"><small>Berris</small><strong>${Number(progresso.berris || 0).toLocaleString("pt-BR")}</strong></div>
			<div class="rpg-hud-card"><small>Pontos missão</small><strong>${Number(progresso.pontosMissao || 0).toLocaleString("pt-BR")}</strong></div>
		`;
		if (hud.innerHTML.trim() !== conteudo.trim()) {
			hud.innerHTML = conteudo;
		}
	}

	function atualizarHudBattleLobby() {
		if (!document.body?.classList.contains("pagina-formulario")) return;
		const painel = document.querySelector(".container-lobby") || document.body;
		let hud = document.getElementById("battle-hud-lobby");
		if (!hud) {
			hud = document.createElement("div");
			hud.id = "battle-hud-lobby";
			hud.className = "battle-hud-lobby";
			hud.innerHTML = `
				<button class="battle-perfil" type="button" data-menu-acao="perfil">
					<span class="battle-avatar" id="battle-avatar"></span>
					<span><strong class="battle-nome" id="battle-nome">Perfil</strong><span class="battle-nivel" id="battle-nivel">Nv. 1</span></span>
				</button>
				<div class="battle-berris"><small>Berris</small><strong id="battle-berris">0</strong></div>
				<div class="battle-xp">
					<div class="battle-xp-topo"><small>EXP</small><span id="battle-xp-texto">0 / 0</span></div>
					<div class="battle-xp-barra"><i id="battle-xp-barra"></i></div>
				</div>
			`;
			painel.prepend(hud);
		}
		const personagem = obterPersonagemAtivo();
		const progresso = window.RpgSistemas?.obterProgresso?.(personagem) || personagem?.progressoRpg || {
			nivel: 1,
			expAtual: 0,
			berris: 0
		};
		const estado = window.RpgSistemas?.estadoNivel?.(progresso) || {
			nivel: progresso.nivel || 1,
			expAtual: progresso.expAtual || 0,
			proximo: 0,
			percentual: 0
		};
		const nome = personagem?.nome || "Sem personagem";
		document.getElementById("battle-nome").textContent = nome;
		document.getElementById("battle-nivel").textContent = `Nv. ${estado.nivel || progresso.nivel || 1}`;
		document.getElementById("battle-berris").textContent = Number(progresso.berris || 0).toLocaleString("pt-BR");
		document.getElementById("battle-xp-texto").textContent = `${Number(estado.expAtual || 0).toLocaleString("pt-BR")} / ${Number(estado.proximo || 0).toLocaleString("pt-BR")}`;
		document.getElementById("battle-xp-barra").style.width = `${Math.max(0, Math.min(100, estado.percentual || 0))}%`;
		const avatar = document.getElementById("battle-avatar");
		if (personagem?.imagem) {
			avatar.innerHTML = `<img src="${personagem.imagem}" alt="">`;
		} else {
			avatar.innerHTML = "";
		}
	}

	function habilitarScrollPaginasNovas() {
		if (document.querySelector(".perfil-app, .biblioteca-app, .app")) {
			document.body.classList.add("rpg-pagina-scroll");
		}
	}

	function detectarRaridade(texto) {
		const valor = String(texto || "").toLowerCase();
		if (/lend[aá]rio|m[ií]tico|ancestral|supremo|divino/.test(valor)) return "lendario";
		if (/[eé]pico|raro superior|obra-prima|amaldi[cç]oad/.test(valor)) return "epico";
		if (/raro|especial|tesouro|ouro|fruta/.test(valor)) return "raro";
		if (/incomum|refor[cç]ado|qualidade/.test(valor)) return "incomum";
		return "";
	}

	function decorarRaridades() {
		document.querySelectorAll(".slot-jogo, .slot-inventario").forEach((slot) => {
			const raridade = detectarRaridade(slot.textContent);
			if (!raridade || slot.dataset.raridade) return;
			slot.dataset.raridade = raridade;
			slot.classList.add("rpg-raridade");
		});
		const detalhe = document.querySelector(".detalhe-item");
		if (detalhe) {
			const raridade = detectarRaridade(detalhe.textContent);
			if (raridade) detalhe.dataset.raridade = raridade;
			else detalhe.removeAttribute("data-raridade");
			detalhe.classList.toggle("rpg-raridade", Boolean(raridade));
		}
	}

	function observarPolimentoJogo() {
		const alvo = document.body;
		if (!alvo || alvo.dataset.polimentoJogo === "ok") return;
		alvo.dataset.polimentoJogo = "ok";
		const observer = new MutationObserver(() => {
			decorarRaridades();
			decorarBibliotecaMeito();
			atualizarHudLobby();
			atualizarHudBattleLobby();
		});
		observer.observe(alvo, { childList: true, subtree: true, characterData: true });
		setTimeout(() => {
			decorarRaridades();
			decorarBibliotecaMeito();
			atualizarHudLobby();
			atualizarHudBattleLobby();
		}, 200);
		let tentativasHud = 0;
		const timerHud = setInterval(() => {
			tentativasHud += 1;
			atualizarHudLobby();
			atualizarHudBattleLobby();
			if (tentativasHud >= 20 || window.RpgSistemas) clearInterval(timerHud);
		}, 250);
	}

	function imagemWiki(nome) {
		const arquivo = encodeURIComponent(`${String(nome || "").replaceAll(" ", "_")}_Infobox.png`);
		return `https://onepiece.fandom.com/wiki/Special:Redirect/file/${arquivo}`;
	}

	function decorarBibliotecaMeito() {
		if (!/biblioteca-itens\.html?$/.test(window.location.pathname)) return;
		document.querySelectorAll(".item-card").forEach((card) => {
			const nome = card.querySelector("h2")?.textContent?.trim();
			const icone = card.querySelector(".item-icone");
			if (!nome || !icone || icone.dataset.wikiImagem === "ok") return;
			icone.dataset.wikiImagem = "ok";
			icone.className = "item-imagem";
			icone.innerHTML = `<img src="${imagemWiki(nome)}" alt="${nome}" loading="lazy">`;
			const img = icone.querySelector("img");
			img.addEventListener("error", () => {
				icone.className = "item-icone";
				icone.innerHTML = "";
			}, { once: true });
		});
	}

	instalarCamadaJogo();
	instalarFeedbackRpg();
	injetarSistemasNoLobby();
	atualizarIconesMenuLobby();
	carregarRpgSistemas();
	melhorarArvoreHabilidades();
	habilitarScrollPaginasNovas();
	atualizarHudBattleLobby();
	observarPolimentoJogo();

	const audio = document.getElementById("musica-fundo");
	if (!audio) return;

	const chaveVolume = "onePieceRpgVolumeMusica";
	const controleSom = document.getElementById("controle-som");
	const botaoSom = document.getElementById("botao-som");
	const volumeMusica = document.getElementById("volume-musica");

	function aplicarVolume(valor) {
		const volume = Math.max(0, Math.min(Number(valor) || 0, 100));
		audio.volume = volume / 100;
		audio.muted = volume === 0;
		localStorage.setItem(chaveVolume, String(volume));

		if (volumeMusica) {
			volumeMusica.value = String(volume);
		}
	}

	async function tocar() {
		try {
			await audio.play();
		} catch (erro) {
			document.addEventListener("pointerdown", tocar, { once: true });
		}
	}

	const volumeSalvo = localStorage.getItem(chaveVolume);
	aplicarVolume(volumeSalvo === null ? 50 : volumeSalvo);
	tocar();

	if (botaoSom && controleSom) {
		botaoSom.addEventListener("click", () => {
			const visivel = controleSom.classList.toggle("visivel");
			controleSom.setAttribute("aria-hidden", visivel ? "false" : "true");
			tocar();
		});
	}

	if (volumeMusica) {
		volumeMusica.addEventListener("input", () => {
			aplicarVolume(volumeMusica.value);
			tocar();
		});
	}
})();