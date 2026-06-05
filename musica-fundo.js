(function () {
	const paginas = {
		"botao-iniciar": "aventura.html",
		"botao-inventario": "inventario.html",
		"botao-atributos": "atributos.html"
	};
	const menu = {
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
	const icones = {
		perfil: "atributos.webp",
		aventura: "viagem.webp",
		correio: "organizacao.webp",
		notificacoes: "eventos.webp",
		atributos: "atributos.webp",
		inventario: "inventario.webp",
		lojas: "lojas.webp",
		eventos: "eventos.webp",
		missoes: "missoes.webp",
		treinos: "treinos.webp",
		habilidades: "habilidades.webp",
		biblioteca: "inventario.webp",
		amigos: "amigos.webp",
		grupo: "organizacao.webp",
		viagem: "viagem.webp",
		ajustes: "ajustes.webp",
		aparencia: "aparencia.webp"
	};
	const atalhos = [
		["perfil", "Perfil / EXP"],
		["aventura", "Entrar na Aventura"],
		["correio", "Correio"],
		["notificacoes", "Notificações"],
		["treinos", "Treinos"],
		["habilidades", "Árvore de Habilidades"],
		["biblioteca", "Biblioteca de Itens"],
		["amigos", "Adicionar Amigos"],
		["grupo", "Bando / Organização"]
	];
	document.addEventListener("click", (evento) => {
		const botaoPagina = evento.target.closest("#botao-iniciar, #botao-inventario, #botao-atributos");
		const botaoMenu = evento.target.closest("[data-menu-acao]");
		const destino = botaoPagina ? paginas[botaoPagina.id] : menu[botaoMenu?.dataset?.menuAcao] || "";
		if (!destino) return;
		evento.preventDefault();
		evento.stopImmediatePropagation();
		window.location.href = destino;
	}, true);
	function icon(acao) { return `assets/img/menu-game/${icones[acao] || icones.habilidades}`; }
	function injetarEstilo() {
		if (document.getElementById("rpg-camada-jogo")) return;
		const estilo = document.createElement("style");
		estilo.id = "rpg-camada-jogo";
		estilo.textContent = `
			.rpg-toast-stack{position:fixed;right:18px;bottom:18px;z-index:9999;display:grid;gap:10px;width:min(340px,calc(100vw - 28px));pointer-events:none}.rpg-toast{position:relative;overflow:hidden;border:1px solid color-mix(in srgb,var(--toast-cor,#ffe28a) 58%,transparent);border-radius:8px;padding:12px 14px;background:linear-gradient(135deg,rgba(4,12,13,.94),rgba(20,16,8,.9));box-shadow:0 18px 38px rgba(0,0,0,.52),0 0 24px color-mix(in srgb,var(--toast-cor,#ffe28a) 24%,transparent);color:#fff7df;animation:rpgToastEntrada .28s ease both}.rpg-toast small{display:block;color:var(--toast-cor,#ffe28a);font-weight:900;letter-spacing:.12em;text-transform:uppercase}.rpg-toast strong{display:block;margin:3px 0 7px}.rpg-toast span{display:inline-block;margin:2px 7px 0 0;color:#d9e8d4;font-size:.84rem;font-weight:800}.rpg-toast:before,.atalho-menu-lobby:after,.botao-menu-lobby:after,.botao-lobby:after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent,rgba(255,247,223,.18),transparent);transform:translateX(-120%);pointer-events:none}.rpg-toast:before{animation:rpgBrilho 1.1s ease .12s}.atalho-menu-lobby,.botao-menu-lobby,.botao-lobby{position:relative!important;overflow:hidden!important}.atalho-menu-lobby:hover:after,.botao-menu-lobby:hover:after,.botao-lobby:hover:after{animation:rpgBrilho .85s ease}.atalho-menu-lobby:hover,.botao-menu-lobby:hover,.botao-lobby:hover{filter:saturate(1.15)!important;box-shadow:0 0 20px rgba(255,226,138,.34),inset 0 0 18px rgba(255,247,223,.08)!important}.grade-menu-lobby{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}.atalho-menu-lobby{min-width:0!important}.atalho-menu-lobby span{overflow-wrap:anywhere!important;word-break:normal!important}.rpg-hud-lobby{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:10px 0 12px}.rpg-hud-card{position:relative;overflow:hidden;min-height:62px;padding:10px;border:1px solid rgba(255,226,138,.28);border-radius:8px;background:linear-gradient(180deg,rgba(255,247,223,.06),rgba(3,8,10,.68));box-shadow:inset 0 0 18px rgba(0,0,0,.24)}.rpg-hud-card small{display:block;color:#ffe28a;font-size:.68rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.rpg-hud-card strong{display:block;margin-top:3px;color:#fff7df;font-size:1.05rem;line-height:1.05;overflow-wrap:anywhere}.item-imagem{flex:0 0 auto;width:56px;height:56px;border:1px solid rgba(255,226,138,.52);border-radius:8px;overflow:hidden;background:#061011;box-shadow:0 0 18px rgba(255,226,138,.25)}.item-imagem img{width:100%;height:100%;object-fit:cover;display:block}@keyframes rpgToastEntrada{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}@keyframes rpgBrilho{to{transform:translateX(120%)}}@media(max-width:700px){.rpg-hud-lobby{grid-template-columns:1fr}.rpg-toast-stack{right:14px;bottom:14px}.grade-menu-lobby{grid-template-columns:1fr!important;padding:10px!important;gap:10px!important}.atalho-menu-lobby{grid-template-columns:54px 1fr!important;justify-items:start!important;min-height:76px!important;padding:10px 12px!important}.atalho-menu-lobby img{width:46px!important;height:46px!important}.atalho-menu-lobby span{text-align:left!important;font-size:.8rem!important;line-height:1.15!important}}@media (hover:none),(pointer:coarse),(max-width:680px){body{overflow:auto!important}.skill-stage{overflow-x:auto!important;overflow-y:hidden!important;touch-action:pan-x pan-y!important;-webkit-overflow-scrolling:touch!important;min-height:520px!important}.skill-stage>*{min-width:720px!important}.stage-bg:before,.stage-bg:after,.branch-band{display:none!important}.tree-line,.tree-line.aberta,.tree-line.disponivel,.tree-line.realce{filter:none!important;animation:none!important}.skill-node,.skill-core,.skill-node.disponivel{animation:none!important;filter:none!important}}
		`;
		document.head.appendChild(estilo);
	}
	function carregarRpg() {
		if (window.RpgSistemas || document.querySelector('script[src^="rpg-sistemas.js"]')) return;
		const script = document.createElement("script");
		script.src = "rpg-sistemas.js";
		script.defer = true;
		document.head.appendChild(script);
	}
	function personagemAtivo() {
		try {
			const direto = JSON.parse(localStorage.getItem("ultimoPersonagem") || "null");
			if (direto?.nome) return direto;
			const lista = JSON.parse(localStorage.getItem("personagensCriados") || "[]");
			return Array.isArray(lista) ? lista[lista.length - 1] || null : null;
		} catch (erro) { return null; }
	}
	function toast(dados) {
		const pilha = document.querySelector(".rpg-toast-stack") || document.body.appendChild(Object.assign(document.createElement("div"), { className: "rpg-toast-stack" }));
		const item = document.createElement("div");
		item.className = "rpg-toast";
		item.style.setProperty("--toast-cor", dados.cor || "#ffe28a");
		item.innerHTML = `<small>${dados.etiqueta || "Sistema"}</small><strong>${dados.titulo || "Aviso"}</strong>${(dados.linhas || []).map((l) => `<span>${l}</span>`).join("")}`;
		pilha.appendChild(item);
		setTimeout(() => item.remove(), 4600);
	}
	window.RpgFeedback = window.RpgFeedback || {
		recompensa(dados) { toast({ etiqueta: `${dados.tipo || "atividade"} rank ${dados.rank || "E"}`, titulo: dados.titulo || "Recompensa recebida", linhas: [`+${Number(dados.recompensas?.exp || 0).toLocaleString("pt-BR")} EXP`, `+${Number(dados.recompensas?.berris || 0).toLocaleString("pt-BR")} berris`], cor: "#ffe28a" }); setTimeout(atualizarHud, 120); },
		aviso(titulo, linhas = []) { toast({ titulo, linhas, cor: "#36e0ff" }); }
	};
	function injetarMenu() {
		const grade = document.getElementById("grade-menu-lobby");
		if (!grade || grade.dataset.sistemasRpg === "ok") return;
		grade.dataset.sistemasRpg = "ok";
		atalhos.forEach(([acao, texto]) => {
			if (grade.querySelector(`[data-menu-acao="${acao}"]`)) return;
			const botao = document.createElement("button");
			botao.className = "atalho-menu-lobby";
			botao.type = "button";
			botao.dataset.menuAcao = acao;
			botao.innerHTML = `<img src="${icon(acao)}" alt=""><span>${texto}</span>`;
			grade.appendChild(botao);
		});
	}
	function atualizarIcones() {
		document.querySelectorAll(".atalho-menu-lobby, .botao-menu-lobby").forEach((botao) => {
			const texto = botao.textContent || "";
			let acao = botao.dataset.menuAcao || "";
			if (!acao && /perfil|xp|status/i.test(texto)) acao = "perfil";
			if (!acao && /aventura|entrar|mar|ilha|viagem/i.test(texto)) acao = "aventura";
			if (!acao && /correio|mensagens?/i.test(texto)) acao = "correio";
			if (!acao && /notifica|avisos?/i.test(texto)) acao = "notificacoes";
			if (!acao && /biblioteca|meito|itens?/i.test(texto)) acao = "biblioteca";
			if (!acao) return;
			const img = botao.querySelector("img");
			if (img) img.src = icon(acao);
		});
	}
	function atualizarHud() {
		const exp = document.getElementById("exp-lobby");
		if (!exp) return;
		const p = personagemAtivo();
		const progresso = window.RpgSistemas?.obterProgresso?.(p) || p?.progressoRpg || {};
		let hud = document.getElementById("rpg-hud-lobby");
		if (!hud) { hud = document.createElement("div"); hud.id = "rpg-hud-lobby"; hud.className = "rpg-hud-lobby"; exp.insertAdjacentElement("afterend", hud); }
		hud.innerHTML = `<div class="rpg-hud-card"><small>EXP livre</small><strong>${Number(progresso.expDisponivel || 0).toLocaleString("pt-BR")}</strong></div><div class="rpg-hud-card"><small>Berris</small><strong>${Number(progresso.berris || 0).toLocaleString("pt-BR")}</strong></div><div class="rpg-hud-card"><small>Pontos missão</small><strong>${Number(progresso.pontosMissao || 0).toLocaleString("pt-BR")}</strong></div>`;
	}
	function imagemWiki(nome) {
		const arquivo = encodeURIComponent(`${String(nome || "").replaceAll(" ", "_")}_Infobox.png`);
		return `https://onepiece.fandom.com/wiki/Special:Redirect/file/${arquivo}`;
	}
	function decorarBiblioteca() {
		if (!/biblioteca-itens\.html?$/.test(location.pathname)) return;
		document.querySelectorAll(".item-card").forEach((card) => {
			const nome = card.querySelector("h2")?.textContent?.trim();
			const icone = card.querySelector(".item-icone");
			if (!nome || !icone || icone.dataset.wikiImagem === "ok") return;
			icone.dataset.wikiImagem = "ok";
			icone.className = "item-imagem";
			icone.innerHTML = `<img src="${imagemWiki(nome)}" alt="${nome}" loading="lazy">`;
			icone.querySelector("img").addEventListener("error", () => { icone.className = "item-icone"; icone.innerHTML = ""; }, { once: true });
		});
	}
	function iniciarAudio() {
		const audio = document.getElementById("musica-fundo");
		if (!audio) return;
		const chave = "onePieceRpgVolumeMusica";
		const volume = Math.max(0, Math.min(Number(localStorage.getItem(chave) ?? 50), 100));
		audio.volume = volume / 100;
		audio.play().catch(() => document.addEventListener("pointerdown", () => audio.play(), { once: true }));
	}
	function iniciar() {
		injetarEstilo(); carregarRpg(); injetarMenu(); atualizarIcones(); atualizarHud(); decorarBiblioteca(); iniciarAudio();
		new MutationObserver(() => { injetarMenu(); atualizarIcones(); atualizarHud(); decorarBiblioteca(); }).observe(document.body, { childList: true, subtree: true });
		setInterval(atualizarHud, 2000);
	}
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
	else iniciar();
})();
