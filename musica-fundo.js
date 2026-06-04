(function () {
	document.addEventListener("click", (evento) => {
		const destinoPaginas = {
			"botao-inventario": "inventario.html",
			"botao-atributos": "atributos.html"
		};
		const destinosMenu = {
			treinos: "treinos.html",
			habilidades: "habilidades.html",
			amigos: "amigos.html",
			grupo: "amigos.html#grupo",
			eventos: "eventos.html"
		};
		const botaoPagina = evento.target.closest("#botao-inventario, #botao-atributos");
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
			treinos: "treinos.webp",
			habilidades: "habilidades.webp",
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
			[/treinos?/i, "treinos"],
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
			["treinos", "Treinos", ""],
			["habilidades", "Árvore de Habilidades", ""],
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
		if (window.RpgSistemas || document.querySelector('script[src="rpg-sistemas.js"]')) return;
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

	injetarSistemasNoLobby();
	atualizarIconesMenuLobby();
	carregarRpgSistemas();
	melhorarArvoreHabilidades();

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