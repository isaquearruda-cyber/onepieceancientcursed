(function () {
	const limiteNivel = 300;

	function normalizar(texto) {
		return String(texto || "")
			.trim()
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "");
	}

	const bonusRaciais = [
		{ nomes: ["humanos", "humano"], nome: "Humanos", vital: 100, mental: 100, agilidade: 10, resistencia: 13, forca: 13, determinacao: 40, qi: "Acima de 40", bonus: "Adaptavel: escolhe ate 2 estilos/classes, reduz penalidades ambientais em 30% e dobra pontos obtidos ao derrotar jogadores." },
		{ nomes: ["kujas", "kuja"], nome: "Kujas", vital: 100, mental: 100, agilidade: 30, resistencia: 20, forca: 20, determinacao: 40, qi: "Acima de 80", bonus: "Haki nato: conhece os 3 tipos de haki, tem 30% de desconto em treino e recompensa dobrada ao treinar." },
		{ nomes: ["tribo dos bracos longos", "bracos longos", "1///"], nome: "Tribo dos Bracos Longos", vital: 100, mental: 100, agilidade: 30, resistencia: 20, forca: 20, determinacao: 20, qi: "Sorteio", bonus: "Tiro de canhao: bracos com dobro de resistencia e forca, podendo agir como chicotes com dano dobrado." },
		{ nomes: ["tribo das pernas longas", "pernas longas"], nome: "Tribo das Pernas Longas", vital: 100, mental: 100, agilidade: 30, resistencia: 20, forca: 20, determinacao: 20, qi: "Acima de 160", bonus: "Supersonico: pernas com dobro de forca/resistencia e +60% de agilidade." },
		{ nomes: ["tribo do pescoco longo", "pescoco longo"], nome: "Tribo do Pescoco Longo", vital: 100, mental: 100, agilidade: 30, resistencia: 20, forca: 20, determinacao: 20, qi: "Acima de 160", bonus: "Chicote de aco: pescoco com dobro de forca/resistencia e visao periferica de 10 metros." },
		{ nomes: ["tribo dos tres olhos", "tres olhos", "3 olhos"], nome: "Tribo dos Tres Olhos", vital: 100, mental: 100, agilidade: 30, resistencia: 20, forca: 20, determinacao: 30, qi: "Acima de 160", bonus: "Visao aguçada em 3 direcoes e Voz de Todas as Coisas ao despertar o terceiro olho." },
		{ nomes: ["tribo dos minks", "minks", "mink"], nome: "Tribo dos Minks", vital: 100, mental: 100, agilidade: 60, resistencia: 40, forca: 40, determinacao: 40, qi: "Acima de 200", bonus: "Sentidos agucados, Electro, comunicacao animal e forma Sulong dobrando porcentagens na lua cheia." },
		{ nomes: ["tribo dos tonttatas", "tonttatas", "tontatta"], nome: "Tribo dos Tonttatas", vital: 100, mental: 100, agilidade: 60, resistencia: 10, forca: 30, determinacao: 40, qi: "Acima de 200", bonus: "Lendas de Dressrosa: furtividade por 48 horas, ficando indetectavel." },
		{ nomes: ["tribo dos kinkobitos", "kinkobitos", "kinkonitos"], nome: "Tribo dos Kinkobitos", vital: 100, mental: 100, agilidade: 30, resistencia: 60, forca: 30, determinacao: 40, qi: "Acima de 200", bonus: "Envenenamento: expele nuvens de veneno incolor para sono, desmaio ou outros efeitos." },
		{ nomes: ["gigantes", "gigante"], nome: "Gigantes", vital: 200, mental: 200, agilidade: 10, resistencia: 220, forca: 220, determinacao: 60, qi: "Acima de 200", bonus: "Pele de aco: reduz dano de armas pela metade." },
		{ nomes: ["gigante ancestral", "gigantes ancestrais"], nome: "Gigante Ancestral", vital: 300, mental: 300, agilidade: 10, resistencia: 320, forca: 320, determinacao: 60, qi: "Acima de 200", bonus: "Pele de aco: reduz dano de armas pela metade com escala ancestral." },
		{ nomes: ["meio gigante"], nome: "Meio Gigante", vital: 100, mental: 100, agilidade: 30, resistencia: 110, forca: 110, determinacao: 30, qi: "Acima de 200", bonus: "Pele de aco: reduz dano de armas pela metade." },
		{ nomes: ["ciborgues", "ciborgue"], nome: "Ciborgues", vital: 200, mental: 200, agilidade: 40, resistencia: 90, forca: 90, determinacao: 40, qi: "Acima de 400", bonus: "Analise, arma humana e camada de ferro contra projeteis redondos; golpes do ciborgue causam dano dobrado." },
		{ nomes: ["oni"], nome: "Oni", vital: 200, mental: 200, agilidade: 40, resistencia: 130, forca: 130, determinacao: 70, qi: "Acima de 400", bonus: "Bebedeira, pele de tungstenio reduzindo 70% de dano e sadismo que aumenta o proximo golpe." },
		{ nomes: ["bucaneiros", "bucaneiro"], nome: "Bucaneiros", vital: 200, mental: 200, agilidade: 40, resistencia: 130, forca: 130, determinacao: 70, qi: "Acima de 400", bonus: "Vontade de Nika dobra porcentagens em atos dignos de Nika; determinacao inabalavel anula dor/medo." },
		{ nomes: ["skypeans", "skypean"], nome: "Skypeans", vital: 100, mental: 100, agilidade: 10, resistencia: 13, forca: 13, determinacao: 40, qi: "Acima de 40", bonus: "Dial: fabrica e usa qualquer tipo de dial naturalmente." },
		{ nomes: ["shandians", "shandias"], nome: "Shandians", vital: 100, mental: 100, agilidade: 30, resistencia: 20, forca: 20, determinacao: 40, qi: "Acima de 80", bonus: "Dial e imunidade/adaptacao a venenos." },
		{ nomes: ["birka", "birkans"], nome: "Birka", vital: 100, mental: 100, agilidade: 30, resistencia: 20, forca: 20, determinacao: 40, qi: "Acima de 80", bonus: "Dial, imunidade a venenos e Mantra em estagio inicial." },
		{ nomes: ["lunarian", "lunarianos", "lunareano", "lunarianos"], nome: "Lunarian", vital: 200, mental: 200, agilidade: 40, resistencia: 130, forca: 130, determinacao: 70, qi: "Acima de 400", bonus: "Chamas do rei: fogo apagado dobra agilidade/resistencia; fogo aceso dobra forca. Tambem concede voo." },
		{ nomes: ["homens peixe", "homem peixe", "tritoes"], nome: "Homens Peixe", vital: 130, mental: 130, agilidade: 40, resistencia: 43, forca: 93, determinacao: 60, qi: "Acima de 210", bonus: "Nascente: dobro de atributos na agua, comunicacao com peixes e manipulacao de agua pelo karate tritao." },
		{ nomes: ["sereianos", "sereiano"], nome: "Sereianos", vital: 130, mental: 130, agilidade: 40, resistencia: 43, forca: 93, determinacao: 60, qi: "Acima de 210", bonus: "Nascente e sorteio 1d200 para arma Pluton uma vez por temporada." },
		{ nomes: ["wotan"], nome: "Wotan", vital: 100, mental: 100, agilidade: 30, resistencia: 110, forca: 110, determinacao: 30, qi: "Acima de 30", bonus: "Pele de aco e nascente: dobro de atributos na agua, comunicacao com peixes e karate tritao." },
		{ nomes: ["yet ancestral", "yeti ancestral"], nome: "Yeti Ancestral", vital: 180, mental: 90, agilidade: -20, resistencia: 200, forca: 180, determinacao: 70, qi: "30 a 120", bonus: "Bestializacao ancestral: +70% forca, +50% resistencia por 5 turnos, frio parcial, ignora 30% de defesa." },
		{ nomes: ["yet", "yeti"], nome: "Yeti", vital: 140, mental: 90, agilidade: 35, resistencia: 70, forca: 85, determinacao: 50, qi: "50 a 120", bonus: "Instinto de cacador: +50% precisao a distancia, rastreio ate 500m e +25% dano em surpresa." },
		{ nomes: ["numans", "numbers", "nummers"], nome: "Numbers", vital: 100, mental: 30, agilidade: 25, resistencia: 180, forca: 250, determinacao: 15, qi: "Abaixo de 30", bonus: "Pele de Pedra, Colosso Primordial, intimidacao natural e regeneracao parcial." },
		{ nomes: ["stratos shadow"], nome: "Stratos Shadow", vital: 90, mental: 40, agilidade: 40, resistencia: 150, forca: 180, determinacao: 20, qi: "20 a 50", bonus: "Corpo hibrido, sombra ativa, sustentacao de sombra e regeneracao instavel." },
		{ nomes: ["maffeyans", "maffeγans"], nome: "Maffeyans", vital: 100, mental: 50, agilidade: 45, resistencia: 140, forca: 180, determinacao: 30, qi: "40 a 70", bonus: "Folego de energia, chifres/presas com +35% dano, pele resistente e intimidacao natural." }
	];

	const mapaBonusRacial = bonusRaciais.reduce((mapa, raca) => {
		raca.nomes.forEach((nome) => { mapa[normalizar(nome)] = raca; });
		return mapa;
	}, {});

	function obterBonusRacial(raca) {
		const chave = normalizar(raca);
		return mapaBonusRacial[chave] || bonusRaciais.find((item) => item.nomes.some((nome) => {
			const alias = normalizar(nome);
			return chave && (chave.includes(alias) || alias.includes(chave));
		})) || null;
	}

	function chavePersonagem(personagem) {
		return normalizar(personagem?.nome);
	}

	function chaveProgresso(personagem) {
		return `rpg_progresso_${chavePersonagem(personagem)}`;
	}

	function experienciaParaProximoNivel(nivel) {
		if (nivel >= limiteNivel) return 0;
		return 110 + (nivel * 42) + Math.floor(Math.pow(nivel, 1.28) * 7);
	}

	function progressoPadrao() {
		return {
			nivel: 1,
			expAtual: 0,
			expTotal: 0,
			expDisponivel: 0,
			pontosAtributo: 0,
			berris: 0,
			pontosMissao: 0,
			habilidades: ["0"],
			historico: []
		};
	}

	function obterProgresso(personagem) {
		if (!personagem?.nome) return progressoPadrao();
		try {
			return { ...progressoPadrao(), ...(JSON.parse(localStorage.getItem(chaveProgresso(personagem)) || "null") || {}) };
		} catch (erro) {
			console.warn("Progresso invalido:", erro);
			return progressoPadrao();
		}
	}

	function salvarProgresso(personagem, progresso) {
		const ajustado = {
			...progressoPadrao(),
			...progresso,
			nivel: Math.max(1, Math.min(limiteNivel, Number(progresso.nivel || 1))),
			expAtual: Math.max(0, Number(progresso.expAtual || 0)),
			expTotal: Math.max(0, Number(progresso.expTotal || 0)),
			expDisponivel: Math.max(0, Number(progresso.expDisponivel || 0)),
			pontosAtributo: Math.max(0, Number(progresso.pontosAtributo || 0)),
			berris: Math.max(0, Number(progresso.berris || 0)),
			pontosMissao: Math.max(0, Number(progresso.pontosMissao || 0)),
			habilidades: Array.from(new Set(Array.isArray(progresso.habilidades) ? progresso.habilidades.map(String) : ["0"]))
		};
		if (personagem?.nome) {
			localStorage.setItem(chaveProgresso(personagem), JSON.stringify(ajustado));
		}
		return ajustado;
	}

	function recompensasAtividade(tipo, rank = "E", periodo = "diarias") {
		const rankBase = {
			E: { exp: 90, berris: 850, pontos: 1, missao: 2 },
			D: { exp: 160, berris: 1600, pontos: 2, missao: 3 },
			C: { exp: 280, berris: 3200, pontos: 3, missao: 5 },
			B: { exp: 470, berris: 6200, pontos: 5, missao: 8 },
			A: { exp: 780, berris: 12000, pontos: 8, missao: 12 }
		};
		const periodoMultiplicador = { diarias: 1, semanais: 3, mensais: 7, treino: 0.75, evento: 4 };
		const base = rankBase[rank] || rankBase.E;
		const multiplicador = periodoMultiplicador[periodo] || 1;
		const treinoBonus = tipo === "treino" ? 1.15 : 1;
		return {
			exp: Math.round(base.exp * multiplicador * treinoBonus),
			berris: Math.round(base.berris * multiplicador),
			pontosAtributo: Math.max(1, Math.round(base.pontos * multiplicador)),
			pontosMissao: Math.max(1, Math.round(base.missao * multiplicador))
		};
	}

	async function concluirAtividade(personagem, atividade) {
		if (!personagem?.nome) throw new Error("Personagem nao encontrado.");
		const recompensas = atividade.recompensas || recompensasAtividade(atividade.tipo, atividade.rank, atividade.periodo);
		let progresso = obterProgresso(personagem);
		progresso.expTotal += recompensas.exp;
		progresso.expDisponivel += recompensas.exp;
		progresso.expAtual += recompensas.exp;
		progresso.berris += recompensas.berris;
		progresso.pontosAtributo += recompensas.pontosAtributo;
		progresso.pontosMissao += recompensas.pontosMissao;

		while (progresso.nivel < limiteNivel) {
			const precisa = experienciaParaProximoNivel(progresso.nivel);
			if (progresso.expAtual < precisa) break;
			progresso.expAtual -= precisa;
			progresso.nivel += 1;
		}

		if (progresso.nivel >= limiteNivel) {
			progresso.nivel = limiteNivel;
			progresso.expAtual = 0;
		}

		progresso.historico = [
			...(Array.isArray(progresso.historico) ? progresso.historico : []),
			{
				tipo: atividade.tipo || "atividade",
				titulo: atividade.titulo || "Atividade concluida",
				rank: atividade.rank || "E",
				exp: recompensas.exp,
				berris: recompensas.berris,
				pontosAtributo: recompensas.pontosAtributo,
				pontosMissao: recompensas.pontosMissao,
				quando: new Date().toISOString(),
				quandoTexto: new Date().toLocaleString("pt-BR")
			}
		].slice(-80);

		progresso = salvarProgresso(personagem, progresso);
		personagem.progressoRpg = progresso;
		if (window.BancoPersonagens?.salvarPersonagem) {
			try {
				await window.BancoPersonagens.salvarPersonagem(personagem);
			} catch (erro) {
				console.warn("Nao foi possivel salvar progresso no banco; usando cache local.", erro);
				localStorage.setItem("ultimoPersonagem", JSON.stringify(personagem));
			}
		} else {
			localStorage.setItem("ultimoPersonagem", JSON.stringify(personagem));
		}
		if (window.RpgFeedback?.recompensa) {
			window.RpgFeedback.recompensa({
				titulo: atividade.titulo || "Atividade concluida",
				tipo: atividade.tipo || "atividade",
				rank: atividade.rank || "E",
				recompensas,
				progresso
			});
		}
		return { progresso, recompensas };
	}

	function estadoNivel(progresso) {
		const atual = obterProgresso(progresso?.nome ? progresso : null);
		const dados = progresso?.nome ? atual : { ...progressoPadrao(), ...progresso };
		const proximo = experienciaParaProximoNivel(dados.nivel);
		return {
			...dados,
			limiteNivel,
			proximo,
			percentual: dados.nivel >= limiteNivel ? 100 : Math.min(100, Math.round((dados.expAtual / proximo) * 100))
		};
	}

	function aplicarBarraExp(container, personagem) {
		const alvo = typeof container === "string" ? document.querySelector(container) : container;
		if (!alvo || !personagem?.nome) return;
		const estado = estadoNivel(obterProgresso(personagem));
		alvo.innerHTML = `
			<div class="rpg-exp-chip">
				<span>Nv. ${estado.nivel}</span>
				<strong>${personagem.nome}</strong>
			</div>
			<div class="rpg-exp-barra"><i style="width:${estado.percentual}%"></i></div>
			<small>${estado.expAtual.toLocaleString("pt-BR")} / ${estado.proximo.toLocaleString("pt-BR")} EXP</small>
		`;
	}

	function gerarHabilidades(estilo) {
		const base = String(estilo || "Santoryuu").trim() || "Santoryuu";
		const familias = ["Postura", "Impacto", "Defesa", "Movimento", "Instinto", "Supremo"];
		const buffs = [
			"+1% dano do estilo",
			"+1% esquiva",
			"+1% resistencia em combate",
			"+1% velocidade de acao",
			"+1% controle de energia",
			"+1% critico narrativo"
		];
		return Array.from({ length: 300 }, (_, indice) => {
			const linha = Math.floor(indice / 6);
			const coluna = indice % 6;
			const escala = Math.floor(indice / 25) + 1;
			return {
				id: String(indice),
				nome: indice === 0 ? `${base}: Fundamento Inicial` : `${familias[coluna]} ${base} ${indice + 1}`,
				descricao: indice === 0 ? "A primeira leitura do estilo. Ja nasce desbloqueada." : `Avanco ${indice + 1} da arvore ${base}, focado em ${familias[coluna].toLowerCase()}.`,
				buff: indice === 0 ? "+1 base em todas as tecnicas do estilo" : buffs[coluna].replace("1", String(Math.min(18, escala))),
				custo: indice === 0 ? 0 : 120 + indice * 34 + escala * 90,
				requer: indice === 0 ? null : String(indice - 1),
				linha,
				coluna
			};
		});
	}

	function habilidadeDisponivel(habilidade, desbloqueadas) {
		return !habilidade.requer || desbloqueadas.includes(String(habilidade.requer));
	}

	function salvarHabilidade(personagem, habilidade) {
		const progresso = obterProgresso(personagem);
		const desbloqueadas = Array.isArray(progresso.habilidades) ? progresso.habilidades.map(String) : ["0"];
		if (desbloqueadas.includes(String(habilidade.id))) {
			return { ok: false, mensagem: "Habilidade ja desbloqueada." };
		}
		if (!habilidadeDisponivel(habilidade, desbloqueadas)) {
			return { ok: false, mensagem: "Desbloqueie a habilidade anterior primeiro." };
		}
		if (progresso.expDisponivel < habilidade.custo) {
			return { ok: false, mensagem: "EXP disponivel insuficiente." };
		}
		progresso.expDisponivel -= habilidade.custo;
		progresso.habilidades = [...desbloqueadas, String(habilidade.id)];
		salvarProgresso(personagem, progresso);
		return { ok: true, progresso };
	}

	window.RpgSistemas = {
		limiteNivel,
		normalizar,
		obterBonusRacial,
		bonusRaciais,
		obterProgresso,
		salvarProgresso,
		estadoNivel,
		experienciaParaProximoNivel,
		recompensasAtividade,
		concluirAtividade,
		aplicarBarraExp,
		gerarHabilidades,
		habilidadeDisponivel,
		salvarHabilidade
	};
})();
