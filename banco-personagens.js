const BancoPersonagens = (() => {
	const nomeBanco = "one-piece-rpg";
	const versao = 1;
	const storePersonagens = "personagens";
	const tabelaSupabase = "personagens";

	function chavePersonagem(personagem) {
		return String(personagem?.nome || "").trim().toLowerCase();
	}

	function configuracaoSupabase() {
		const config = window.SUPABASE_CONFIG || {};
		const url = String(config.url || "").replace(/\/$/, "");
		const anonKey = String(config.anonKey || "");

		if (!url || !anonKey || url.includes("SUA_URL") || anonKey.includes("SUA_ANON_KEY")) {
			return null;
		}

		return { url, anonKey };
	}

	function supabaseAtivo() {
		return Boolean(configuracaoSupabase());
	}

	async function chamarSupabase(caminho, opcoes = {}) {
		const config = configuracaoSupabase();
		if (!config) {
			throw new Error("Supabase nao configurado.");
		}

		const resposta = await fetch(`${config.url}/rest/v1/${caminho}`, {
			...opcoes,
			headers: {
				apikey: config.anonKey,
				Authorization: `Bearer ${config.anonKey}`,
				"Content-Type": "application/json",
				...(opcoes.headers || {})
			}
		});

		if (!resposta.ok) {
			const texto = await resposta.text();
			throw new Error(`Erro Supabase ${resposta.status}: ${texto}`);
		}

		if (resposta.status === 204) {
			return null;
		}

		const texto = await resposta.text();
		if (!texto.trim()) {
			return null;
		}

		return JSON.parse(texto);
	}

	function limparFamiliaSorteadaDoPersonagem(nome) {
		const chaveFamilia = "familiaSorteadaBloqueada";
		const sorteio = JSON.parse(localStorage.getItem(chaveFamilia) || "null");
		const nomeBloqueado = String(sorteio?.nomePersonagem || "").trim().toLowerCase();
		const nomeRemovido = String(nome || "").trim().toLowerCase();

		if (nomeBloqueado && nomeBloqueado === nomeRemovido) {
			localStorage.removeItem(chaveFamilia);
		}
	}

	function abrirBanco() {
		return new Promise((resolve, reject) => {
			if (!("indexedDB" in window)) {
				reject(new Error("IndexedDB indisponivel neste navegador."));
				return;
			}

			const requisicao = indexedDB.open(nomeBanco, versao);

			requisicao.onupgradeneeded = () => {
				const banco = requisicao.result;
				if (!banco.objectStoreNames.contains(storePersonagens)) {
					banco.createObjectStore(storePersonagens, { keyPath: "id" });
				}
			};

			requisicao.onsuccess = () => resolve(requisicao.result);
			requisicao.onerror = () => reject(requisicao.error);
		});
	}

	function transacao(store, modo, operacao) {
		return abrirBanco().then((banco) => new Promise((resolve, reject) => {
			const tx = banco.transaction(store, modo);
			const objectStore = tx.objectStore(store);
			const resultado = operacao(objectStore);

			tx.oncomplete = () => {
				banco.close();
				resolve(resultado && "result" in resultado ? resultado.result : resultado);
			};
			tx.onerror = () => {
				banco.close();
				reject(tx.error);
			};
		}));
	}

	function lerCacheLocal() {
		try {
			return JSON.parse(localStorage.getItem("personagensCriados") || "[]");
		} catch (erro) {
			console.warn("Cache local de personagens invalido:", erro);
			return [];
		}
	}

	function gravarCacheLocal(personagens) {
		localStorage.setItem("personagensCriados", JSON.stringify(personagens));
	}

	async function obterTodosLocal() {
		try {
			const personagens = await transacao(storePersonagens, "readonly", (store) => store.getAll());
			const limpos = personagens.map(({ id, ...personagem }) => personagem);
			const cache = lerCacheLocal();

			if (limpos.length === 0 && cache.length > 0) {
				await salvarTodosLocal(cache);
				return cache;
			}

			gravarCacheLocal(limpos);
			return limpos;
		} catch (erro) {
			console.warn("Usando cache local porque o IndexedDB falhou:", erro);
			return lerCacheLocal();
		}
	}

	async function salvarTodosLocal(personagens) {
		gravarCacheLocal(personagens);

		try {
			await transacao(storePersonagens, "readwrite", (store) => {
				store.clear();
				personagens.forEach((personagem) => {
					const id = chavePersonagem(personagem);
					if (id) {
						store.put({ ...personagem, id });
					}
				});
			});
		} catch (erro) {
			console.warn("Personagens ficaram salvos no cache local, mas nao no IndexedDB:", erro);
		}
	}

	async function obterTodosRemoto() {
		const linhas = await chamarSupabase(`${tabelaSupabase}?select=id,dados&order=criado_em.asc`);
		const personagens = linhas.map((linha) => linha.dados).filter(Boolean);
		gravarCacheLocal(personagens);
		await salvarTodosLocal(personagens);
		return personagens;
	}

	async function salvarPersonagemRemoto(personagem) {
		const id = chavePersonagem(personagem);
		if (!id) {
			throw new Error("Personagem sem nome.");
		}

		await chamarSupabase(`${tabelaSupabase}?on_conflict=id`, {
			method: "POST",
			headers: {
				Prefer: "resolution=merge-duplicates,return=minimal"
			},
			body: JSON.stringify({
				id,
				nome: personagem.nome,
				dados: personagem,
				atualizado_em: new Date().toISOString()
			})
		});

		return personagem;
	}

	async function removerPersonagemRemoto(nome) {
		const id = String(nome || "").trim().toLowerCase();
		if (!id) return;

		await chamarSupabase(`${tabelaSupabase}?id=eq.${encodeURIComponent(id)}`, {
			method: "DELETE",
			headers: {
				Prefer: "return=minimal"
			}
		});
	}

	async function obterTodos() {
		if (supabaseAtivo()) {
			try {
				return await obterTodosRemoto();
			} catch (erro) {
				console.warn("Banco online indisponivel; usando cache local:", erro);
			}
		}

		return obterTodosLocal();
	}

	async function salvarTodos(personagens) {
		await salvarTodosLocal(personagens);

		if (supabaseAtivo()) {
			try {
				await Promise.all(personagens.map((personagem) => salvarPersonagemRemoto(personagem)));
			} catch (erro) {
				console.warn("Nao foi possivel sincronizar todos os personagens no banco online:", erro);
			}
		}
	}

	async function salvarPersonagem(personagem) {
		const personagens = await obterTodos();
		const id = chavePersonagem(personagem);
		const indice = personagens.findIndex((item) => chavePersonagem(item) === id);

		if (indice >= 0) {
			personagens[indice] = personagem;
		} else {
			personagens.push(personagem);
		}

		await salvarTodosLocal(personagens);

		if (supabaseAtivo()) {
			await salvarPersonagemRemoto(personagem);
			gravarCacheLocal(personagens);
		}

		localStorage.setItem("ultimoPersonagem", JSON.stringify(personagem));
		return personagem;
	}

	async function buscarPorNome(nome) {
		const id = String(nome || "").trim().toLowerCase();

		if (supabaseAtivo()) {
			try {
				const linhas = await chamarSupabase(`${tabelaSupabase}?id=eq.${encodeURIComponent(id)}&select=dados&limit=1`);
				if (linhas[0]?.dados) {
					return linhas[0].dados;
				}
			} catch (erro) {
				console.warn("Busca online falhou; tentando cache local:", erro);
			}
		}

		const personagens = await obterTodosLocal();
		return personagens.find((personagem) => chavePersonagem(personagem) === id) || null;
	}

	async function removerPorNome(nome) {
		const id = String(nome || "").trim().toLowerCase();
		const personagens = (await obterTodos()).filter((personagem) => chavePersonagem(personagem) !== id);
		await salvarTodosLocal(personagens);

		if (supabaseAtivo()) {
			await removerPersonagemRemoto(nome);
		}

		limparFamiliaSorteadaDoPersonagem(nome);
		return personagens;
	}

	async function restaurarCache() {
		const cache = lerCacheLocal();
		const personagens = await obterTodos();
		if (!supabaseAtivo() && personagens.length === 0 && cache.length > 0) {
			await salvarTodosLocal(cache);
			return cache;
		}
		return personagens;
	}

	return {
		obterTodos,
		salvarTodos,
		salvarPersonagem,
		buscarPorNome,
		removerPorNome,
		restaurarCache,
		supabaseAtivo
	};
})();

window.BancoPersonagens = BancoPersonagens;
