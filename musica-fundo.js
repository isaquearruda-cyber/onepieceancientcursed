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
		const tema = {
			atributos: ["#49d8ff", "M48 13 67 76 48 63 29 76Z M48 23v38 M37 55h22", "ATR"],
			inventario: ["#f7c84b", "M25 42h46v33H25Z M31 42V31c0-18 34-18 34 0v11 M36 54h24", "INV"],
			lojas: ["#b989ff", "M22 38h52l-6-15H28Z M27 38v35h42V38 M36 48h24 M38 57h20", "LOJ"],
			eventos: ["#21e0c2", "M48 17c21 16 19 45 0 62-19-17-21-46 0-62Z M48 29c9 11 9 25 0 36-9-11-9-25 0-36Z", "EVT"],
			missoes: ["#f5d06f", "M29 18h31l9 9v51H29Z M58 18v12h11 M37 42h23 M37 54h23 M37 66h15", "MIS"],
			treinos: ["#ff7a35", "M24 68c8-25 10-39 24-54 14 15 16 29 24 54-16 10-32 10-48 0Z M35 62c9 5 17 5 26 0", "TRN"],
			habilidades: ["#36e0ff", "M48 16v18 M48 62v18 M20 48h18 M58 48h18 M38 38l-13-13 M58 38l13-13 M38 58 25 71 M58 58l13 13 M39 39h18v18H39Z", "SKL"],
			amigos: ["#f5f5f0", "M36 42a12 12 0 1 0 0-24 12 12 0 0 0 0 24Z M60 45a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M18 76c3-18 33-18 36 0 M48 73c4-13 25-13 30 0", "SOC"],
			grupo: ["#dce7dc", "M24 25h34l14 13v33H24Z M58 25v14h14 M33 47h21 M33 58h27", "ORG"],
			viagem: ["#7fdfff", "M19 57 77 23 50 77 45 55Z M45 55l18 13", "NAV"],
			ajustes: ["#bfc8c1", "M48 22l7 7 10-2 4 9-7 7 2 10-9 4-7-7-10 2-4-9 7-7-2-10 9-4 7 7Z M48 39a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z", "CFG"],
			aparencia: ["#ff8f4a", "M48 17c16 0 28 12 28 28 0 20-13 33-28 33S20 65 20 45c0-16 12-28 28-28Z M35 45h26 M39 58c6 5 12 5 18 0", "VIS"]
		};
		const item = tema[acao] || tema.habilidades;
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><radialGradient id="bg" cx="38%" cy="26%" r="78%"><stop offset="0" stop-color="#344247"/><stop offset=".58" stop-color="#071112"/><stop offset="1" stop-color="#020303"/></radialGradient><linearGradient id="g" x1="18%" y1="12%" x2="82%" y2="86%"><stop offset="0" stop-color="#fff7df"/><stop offset=".36" stop-color="${item[0]}"/><stop offset=".72" stop-color="#ffe28a"/><stop offset="1" stop-color="${item[0]}"/></linearGradient><filter id="glow"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${item[0]}"/></filter></defs><rect width="96" height="96" rx="18" fill="url(#bg)"/><circle cx="48" cy="48" r="39" fill="none" stroke="${item[0]}" stroke-width="3" opacity=".88"/><circle cx="48" cy="48" r="29" fill="${item[0]}" opacity=".12"/><path d="${item[1]}" fill="url(#g)" stroke="#050808" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/><text x="48" y="87" text-anchor="middle" fill="#fff7df" font-size="8" font-family="Arial Black,Arial" font-weight="900">${item[2]}</text></svg>`;
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
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
		document.querySelectorAll("#grade-menu-lobby .atalho-menu-lobby, .botao-menu-lobby").forEach((botao) => {
			const acao = botao.dataset.menuAcao || mapa[botao.id]?.[0] || "";
			const texto = botao.querySelector("span")?.textContent?.trim() || mapa[botao.id]?.[1] || acao;
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

	injetarSistemasNoLobby();
	atualizarIconesMenuLobby();
	carregarRpgSistemas();

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
