(function () {
	const limiteNivel = 300;

	function normalizar(texto) {
		return String(texto || "")
			.trim()
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "");
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
			await window.BancoPersonagens.salvarPersonagem(personagem);
		} else {
			localStorage.setItem("ultimoPersonagem", JSON.stringify(personagem));
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
