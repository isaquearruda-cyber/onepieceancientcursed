(function () {
	var mares = window.RpgMaresDados || [];
	var mar = mares.find(function (item) { return item.id === window.RPG_MAR_ID; }) || mares[0];
	if (!mar) return;

	var ilhaAtual = mar.ilhas[0];
	var ilhasEl = document.getElementById("ilhas");
	var origemEl = document.getElementById("origem");
	var destinoEl = document.getElementById("destino");
	var resultadoEl = document.getElementById("resultado");
	var barcoEl = document.getElementById("barco-rank");
	var ranksBarco = [
		{ id: "rank-e", nome: "Rank E - Barco simples", desconto: 0, bonus: "Sem desconto" },
		{ id: "rank-d", nome: "Rank D - Veleiro leve", desconto: .08, bonus: "8% menos tempo" },
		{ id: "rank-c", nome: "Rank C - Navio reforçado", desconto: .15, bonus: "15% menos tempo" },
		{ id: "rank-b", nome: "Rank B - Navio de guerra", desconto: .25, bonus: "25% menos tempo e rota mais segura" },
		{ id: "rank-a", nome: "Rank A - Navio lendário", desconto: .35, bonus: "35% menos tempo e prioridade de rota" }
	];

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

	function prepararRankBarco() {
		if (!barcoEl) {
			var grade = document.querySelector(".viagem-grid");
			var botao = document.getElementById("calcular");
			var label = document.createElement("label");
			label.innerHTML = 'Barco<br><select id="barco-rank"></select>';
			grade.insertBefore(label, botao);
			barcoEl = document.getElementById("barco-rank");
		}
		barcoEl.innerHTML = ranksBarco.map(function (rank) {
			return '<option value="' + rank.id + '">' + rank.nome + "</option>";
		}).join("");
		barcoEl.value = localStorage.getItem("rpg_barco_rank") || "rank-e";
		barcoEl.onchange = function () {
			localStorage.setItem("rpg_barco_rank", barcoEl.value);
		};
	}

	function rankSelecionado() {
		return ranksBarco.find(function (rank) { return rank.id === barcoEl.value; }) || ranksBarco[0];
	}

	function calcular() {
		var origem = mar.ilhas.find(function (ilha) { return ilha.id === origemEl.value; });
		var destino = mar.ilhas.find(function (ilha) { return ilha.id === destinoEl.value; });
		var distancia = Math.abs(destino.ordem - origem.ordem) || 1;
		var rank = rankSelecionado();
		var horasBase = distancia * 6 + Math.ceil(distancia / 2) * 3;
		var horas = Math.max(1, Math.ceil(horasBase * (1 - rank.desconto)));
		var custo = distancia * 450;
		var risco = distancia <= 2 ? "Baixo" : distancia <= 5 ? "Médio" : "Alto";
		resultadoEl.innerHTML = "<strong>" + origem.nome + " -> " + destino.nome + "</strong><br>Tempo base: " + horasBase + "h. Barco: " + rank.nome + " (" + rank.bonus + "). Tempo final: " + horas + "h de navegação. Custo sugerido: " + custo.toLocaleString("pt-BR") + " berris. Risco: " + risco + ".";
		localStorage.setItem("rpg_viagem_atual", JSON.stringify({ mar: mar.nome, origem: origem.nome, destino: destino.nome, barco: rank.nome, desconto: rank.desconto, horasBase: horasBase, horas: horas, custo: custo, risco: risco, quando: new Date().toISOString() }));
		if (window.RpgFeedback && window.RpgFeedback.aviso) window.RpgFeedback.aviso("Viagem marcada", [origem.nome + " -> " + destino.nome, horas + "h / " + risco]);
	}

	function renderizar() {
		renderizarIlhas();
		renderizarLocais();
		renderizarSelects();
	}

	document.getElementById("calcular").onclick = calcular;
	prepararRankBarco();
	renderizar();
})();