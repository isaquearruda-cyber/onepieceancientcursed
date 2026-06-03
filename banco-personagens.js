const BancoPersonagens = (() => {
	const nomeBanco = "one-piece-rpg";
	const versao = 1;
	const storePersonagens = "personagens";

	function chavePersonagem(personagem) {
		return String(personagem.nome || "").trim().toLowerCase();
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

	async function obterTodos() {
		try {
			const personagens = await transacao(storePersonagens, "readonly", (store) => store.getAll());
			const limpos = personagens.map(({ id, ...personagem }) => personagem);
			const cache = lerCacheLocal();

			if (limpos.length === 0 && cache.length > 0) {
				await salvarTodos(cache);
				return cache;
			}

			gravarCacheLocal(limpos);
			return limpos;
		} catch (erro) {
			console.warn("Usando cache local porque o IndexedDB falhou:", erro);
			return lerCacheLocal();
		}
	}

	async function salvarTodos(personagens) {
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

	async function salvarPersonagem(personagem) {
		const personagens = await obterTodos();
		const id = chavePersonagem(personagem);
		const indice = personagens.findIndex((item) => chavePersonagem(item) === id);

		if (indice >= 0) {
			personagens[indice] = personagem;
		} else {
			personagens.push(personagem);
		}

		await salvarTodos(personagens);
		localStorage.setItem("ultimoPersonagem", JSON.stringify(personagem));
		return personagem;
	}

	async function buscarPorNome(nome) {
		const id = String(nome || "").trim().toLowerCase();
		const personagens = await obterTodos();
		return personagens.find((personagem) => chavePersonagem(personagem) === id) || null;
	}

	async function removerPorNome(nome) {
		const id = String(nome || "").trim().toLowerCase();
		const personagens = (await obterTodos()).filter((personagem) => chavePersonagem(personagem) !== id);
		await salvarTodos(personagens);
		limparFamiliaSorteadaDoPersonagem(nome);
		return personagens;
	}

	async function restaurarCache() {
		const cache = lerCacheLocal();
		const personagens = await obterTodos();
		if (personagens.length === 0 && cache.length > 0) {
			await salvarTodos(cache);
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
		restaurarCache
	};
})();

window.BancoPersonagens = BancoPersonagens;
