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
		const destino = botaoPagina ? destinoPaginas[botaoPagina.id] : destinosMenu[botaoMenu?.dataset?.menuAcao] || "";
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

	function iconeMenuSvg(acao, texto) {
		const mapa = {
			atributos: ["#8eeaff", "radar"], inventario: ["#ffd36d", "bag"], lojas: ["#d8a6ff", "coin"],
			eventos: ["#36ffd1", "spiral"], missoes: ["#ffcf72", "map"], treinos: ["#ff7a3d", "fist"],
			habilidades: ["#67f0ff", "tree"], amigos: ["#ffffff", "eye"], grupo: ["#ffffff", "banner"], viagem: ["#7bd3ff", "compass"]
		};
		const [cor, tipo] = mapa[acao] || ["#ffe28a", "star"];
		const formas = {
			radar: '<path d="M48 13 70 83 48 70 26 83Z"/><path d="M48 27v43M32 73l16-46 16 46" fill="none" stroke="#05090b" stroke-width="5" stroke-linecap="round"/>',
			bag: '<path d="M26 34h44l-4 45H30Z"/><path d="M36 34c0-17 24-17 24 0" fill="none" stroke="#05090b" stroke-width="7" stroke-linecap="round"/>',
			coin: '<circle cx="48" cy="48" r="27"/><path d="M48 26v44M34 38c6-8 22-8 28 0M34 58c6 8 22 8 28 0" fill="none" stroke="#05090b" stroke-width="5" stroke-linecap="round"/>',
			spiral: '<path d="M70 48c0 15-13 27-29 22-17-5-18-30 1-34 12-2 22 8 17 19-4 9-18 8-19-2" fill="none" stroke="#05090b" stroke-width="8" stroke-linecap="round"/>',
			map: '<path d="M18 25 37 18l22 8 19-7v52l-19 7-22-8-19 7Z"/><path d="M37 18v52M59 26v52" fill="none" stroke="#05090b" stroke-width="5"/>',
			fist: '<path d="M29 41V25a8 8 0 0 1 15 0v12h2V19a8 8 0 0 1 15 0v18h2V27a8 8 0 0 1 15 0v26c0 23-15 34-32 34-16 0-28-10-28-27V47a7 7 0 0 1 11-6Z"/>',
			tree: '<path d="M48 12 74 36 59 37 76 60 58 59 48 82 38 59 20 60 37 37 22 36Z"/>',
			eye: '<path d="M10 48s15-22 38-22 38 22 38 22-15 22-38 22S10 48 10 48Z"/><circle cx="48" cy="48" r="12" fill="#05090b"/>',
			banner: '<path d="M22 18h39l13 12-13 12H22Z"/><path d="M22 18v62" fill="none" stroke="#05090b" stroke-width="7" stroke-linecap="round"/>',
			compass: '<circle cx="48" cy="48" r="31"/><path d="M58 22 51 51 22 58 45 45Z" fill="#05090b"/>',
			star: '<path d="M48 12 58 37 85 39 64 56 71 83 48 68 25 83 32 56 11 39 38 37Z"/>'
		};
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><radialGradient id="g" cx="45%" cy="35%" r="65%"><stop offset="0" stop-color="#fff7df"/><stop offset=".45" stop-color="${cor}"/><stop offset="1" stop-color="#071011"/></radialGradient><filter id="s"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${cor}"/></filter></defs><rect width="96" height="96" rx="14" fill="#06100d"/><circle cx="48" cy="48" r="39" fill="rgba(255,255,255,.04)" stroke="${cor}" stroke-width="3"/><g fill="url(#g)" filter="url(#s)">${formas[tipo]}</g><text x="48" y="89" text-anchor="middle" fill="#fff7df" font-size="8" font-family="Arial" font-weight="900">${String(texto || acao).slice(0, 3).toUpperCase()}</text></svg>`;
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	}

	function criarAtalhoSistema(acao, texto, imagem) {
		const botao = document.createElement("button");
		botao.className = "atalho-menu-lobby";
		botao.type = "button";
		botao.dataset.menuAcao = acao;
		botao.innerHTML = `<img src="${imagem || iconeMenuSvg(acao, texto)}" alt=""><span>${texto}</span>`;
		return botao;
	}

	function atualizarIconesMenuLobby() {
		const mapa = { "botao-atributos": ["atributos", "Atributos"], "botao-inventario": ["inventario", "Inventário"] };
		document.querySelectorAll("#grade-menu-lobby .atalho-menu-lobby").forEach((botao) => {
			const acao = botao.dataset.menuAcao || mapa[botao.id]?.[0] || "";
			const texto = botao.querySelector("span")?.textContent?.trim() || mapa[botao.id]?.[1] || acao;
			const img = botao.querySelector("img");
			if (img && acao) img.src = iconeMenuSvg(acao, texto);
		});
	}

	function injetarSistemasNoLobby() {
		const grade = document.getElementById("grade-menu-lobby");
		if (!grade || grade.dataset.sistemasRpg === "ok") return;
		grade.dataset.sistemasRpg = "ok";
		[["treinos", "Treinos", ""], ["habilidades", "Árvore de Habilidades", ""], ["amigos", "Adicionar Amigos", ""], ["grupo", "Bando / Organização", ""]].forEach(([acao, texto, imagem]) => {
			if (!grade.querySelector(`[data-menu-acao="${acao}"]`)) grade.appendChild(criarAtalhoSistema(acao, texto, imagem));
		});
	}

	function carregarRpgSistemas() {
		if (window.RpgSistemas || document.querySelector('script[src="rpg-sistemas.js"]')) return;
		const script = document.createElement("script");
		script.src = "rpg-sistemas.js";
		script.defer = true;
		document.head.appendChild(script);
	}

	garantirVideoDeFundo();
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
		if (volumeMusica) volumeMusica.value = String(volume);
	}
	async function tocar() { try { await audio.play(); } catch (erro) { document.addEventListener("pointerdown", tocar, { once: true }); } }
	aplicarVolume(localStorage.getItem(chaveVolume) === null ? 50 : localStorage.getItem(chaveVolume));
	tocar();
	if (botaoSom && controleSom) botaoSom.addEventListener("click", () => { const visivel = controleSom.classList.toggle("visivel"); controleSom.setAttribute("aria-hidden", visivel ? "false" : "true"); tocar(); });
	if (volumeMusica) volumeMusica.addEventListener("input", () => { aplicarVolume(volumeMusica.value); tocar(); });
})();
