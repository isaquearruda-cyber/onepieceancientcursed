(function () {
	var mares = window.RpgMaresDados || [];
	var mar = mares.find(function (item) { return item.id === window.RPG_MAR_ID; }) || mares[0];
	if (!mar) return;

	var ilhaAtual = mar.ilhas[0];
	var ilhasEl = document.getElementById("ilhas");
	var origemEl = document.getElementById("origem");
	var destinoEl = document.getElementById("destino");
	var resultadoEl = document.getElementById("resultado");

	function renderizarIlhas() {
		document.getElementById("mar-nome").textContent = mar.nome;
		document.getElementById("mar-desc").textContent = mar.desc;
		ilhasEl.innerHTML = mar.ilhas.map(function (ilha) {
			return '<button class="ilha ' + (ilha === ilhaAtual ? "ativa" : "") + '" style="--cor:' + mar.cor + ';--img:' + ilha.imagem + '" type="button" data-ilha="' + ilha.id + '"><strong>' + ilha.nome + '</strong><span>' + ilha.tipo + '</span></button>';
		}).join("");
		ilhasEl.querySelectorAll("[data-ilha]").forEach(function (botao) {
			botao.onclick = function () {
				ilhaAtual = mar.ilhas.find(function (ilha) { return ilha.id === botao.dataset.ilha; }) || ilhaAtual;
				renderizar();
			};
		});
	}

	function renderizarLocais() {
		document.getElementById("ilha-nome").textContent = ilhaAtual.nome;
		document.getElementById("locais").innerHTML = ilhaAtual.locais.map(function (local) {
			return '<span class="local">' + local + "</span>";
		}).join("");
	}

	function renderizarSelects() {
		var opcoes = mar.ilhas.map(function (ilha) {
			return '<option value="' + ilha.id + '">' + ilha.nome + "</option>";
		}).join("");
		origemEl.innerHTML = opcoes;
		destinoEl.innerHTML = opcoes;
		origemEl.value = ilhaAtual.id;
		destinoEl.value = (mar.ilhas[Math.min(mar.ilhas.length - 1, mar.ilhas.indexOf(ilhaAtual) + 1)] || ilhaAtual).id;
	}

	function calcular() {
		var origem = mar.ilhas.find(function (ilha) { return ilha.id === origemEl.value; });
		var destino = mar.ilhas.find(function (ilha) { return ilha.id === destinoEl.value; });
		var distancia = Math.abs(destino.ordem - origem.ordem) || 1;
		var horas = distancia * 6 + Math.ceil(distancia / 2) * 3;
		var custo = distancia * 450;
		var risco = distancia <= 2 ? "Baixo" : distancia <= 5 ? "Médio" : "Alto";
		resultadoEl.innerHTML = "<strong>" + origem.nome + " -> " + destino.nome + "</strong><br>Tempo estimado: " + horas + "h de navegação. Custo sugerido: " + custo.toLocaleString("pt-BR") + " berris. Risco: " + risco + ".";
		localStorage.setItem("rpg_viagem_atual", JSON.stringify({ mar: mar.nome, origem: origem.nome, destino: destino.nome, horas: horas, custo: custo, risco: risco, quando: new Date().toISOString() }));
		if (window.RpgFeedback && window.RpgFeedback.aviso) window.RpgFeedback.aviso("Viagem marcada", [origem.nome + " -> " + destino.nome, horas + "h / " + risco]);
	}

	function renderizar() {
		renderizarIlhas();
		renderizarLocais();
		renderizarSelects();
	}

	document.getElementById("calcular").onclick = calcular;
	renderizar();
})();