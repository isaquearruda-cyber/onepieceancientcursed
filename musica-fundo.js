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
