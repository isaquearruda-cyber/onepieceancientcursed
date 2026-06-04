(function () {
	document.addEventListener("click", (evento) => {
		const botaoInventario = evento.target.closest("#botao-inventario");
		if (!botaoInventario) return;

		evento.preventDefault();
		evento.stopImmediatePropagation();
		window.location.href = "inventario.html";
	}, true);

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
