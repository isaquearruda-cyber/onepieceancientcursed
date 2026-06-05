window.RpgMaresDados = (function () {
	function ilha(id, nome, tipo, locais, ordem) {
		var arquivo = encodeURIComponent(nome.replaceAll(" ", "_") + "_Infobox.png");
		return {
			id: id,
			nome: nome,
			tipo: tipo,
			locais: locais,
			ordem: ordem,
			imagem: "url('https://onepiece.fandom.com/wiki/Special:Redirect/file/" + arquivo + "')"
		};
	}

	return [
		{ id: "east", pagina: "mar-east.html", nome: "East Blue", cor: "#36e0ff", aberto: true, desc: "Mar inicial clássico, com vilas pequenas, piratas locais e rotas curtas.", ilhas: [
			ilha("foosha", "Vila Foosha", "Reino de Goa", ["Porto da vila", "Bar da Makino", "Monte Colubo", "Costa dos bandidos"], 1),
			ilha("shells", "Shells Town", "Base da Marinha", ["Quartel 153", "Praça de execução", "Docas militares"], 2),
			ilha("orange", "Orange Town", "Cidade costeira", ["Rua principal", "Pet Shop", "Porto quebrado"], 3),
			ilha("syrup", "Vila Syrup", "Ilha agrícola", ["Mansão Kaya", "Ladeira da vila", "Costa norte"], 4),
			ilha("baratie", "Baratie", "Restaurante marítimo", ["Convés", "Cozinha", "Doca de clientes"], 5),
			ilha("arlong", "Arlong Park", "Base de piratas", ["Parque", "Vila Cocoyasi", "Sala dos mapas"], 6),
			ilha("loguetown", "Loguetown", "Cidade do começo e do fim", ["Praça da execução", "Rua comercial", "Porto final"], 7)
		]},
		{ id: "north", pagina: "mar-north.html", nome: "North Blue", cor: "#8fb7ff", aberto: true, desc: "Mar de reinos frios, tecnologia militar e linhagens perigosas.", ilhas: [
			ilha("flevance", "Flevance", "Cidade Branca", ["Hospital central", "Minas de chumbo âmbar", "Ruínas da fronteira"], 2),
			ilha("lvneel", "Lvneel", "Reino explorador", ["Castelo", "Porto real", "Guilda de exploradores"], 3),
			ilha("spider", "Spider Miles", "Distrito industrial", ["Fábricas", "Mercado negro", "Docas enferrujadas"], 4),
			ilha("minion", "Minion Island", "Ilha criminosa", ["Leilão secreto", "Penhascos", "Baía escondida"], 5)
		]},
		{ id: "south", pagina: "mar-south.html", nome: "South Blue", cor: "#64d6a4", aberto: true, desc: "Mar de ilhas quentes, caçadores, comércio e rotas de contrabando.", ilhas: [
			ilha("baterilla", "Baterilla", "Ilha residencial", ["Vila costeira", "Casa isolada", "Praia oeste"], 2),
			ilha("karate", "Ilha Karate", "Centro marcial", ["Dojo principal", "Arena pública", "Porto dos lutadores"], 3),
			ilha("torino", "Reino Torino", "Ilha medicinal", ["Árvore gigante", "Vila das aves", "Laboratório natural"], 4),
			ilha("briss", "Briss Kingdom", "Reino marítimo", ["Porto real", "Mercado de mapas", "Farol sul"], 5)
		]},
		{ id: "west", pagina: "mar-west.html", nome: "West Blue", cor: "#b989ff", aberto: true, desc: "Mar de máfias, famílias poderosas e ilhas de clima misterioso.", ilhas: [
			ilha("ohara", "Ohara", "Ilha do conhecimento", ["Árvore da Onisciência", "Costa arqueológica", "Ruínas da biblioteca"], 3),
			ilha("ilusia", "Reino Ilusia", "Reino político", ["Palácio", "Praça central", "Porto diplomático"], 4),
			ilha("thriller", "Thriller Bark", "Navio-ilha", ["Mansão", "Cemitério", "Floresta escura"], 7),
			ilha("kano", "País Kano", "Reino de guerreiros", ["Portão real", "Arena", "Docas dos Happo"], 5)
		]},
		{ id: "calm", nome: "Calm Belt", cor: "#a9b0ad", aberto: false, desc: "Bloqueado: exige navio preparado ou habilidade de travessia.", ilhas: [] },
		{ id: "paraiso", nome: "Grand Line: Paraíso", cor: "#ffcf5a", aberto: false, desc: "Bloqueado: precisa registrar entrada pela Reverse Mountain.", ilhas: [] },
		{ id: "skypiea", nome: "Mar do Céu", cor: "#f4f0c8", aberto: false, desc: "Bloqueado: exige rota vertical ou Knock Up Stream.", ilhas: [] },
		{ id: "novo", nome: "Novo Mundo", cor: "#ff7b7b", aberto: false, desc: "Bloqueado: exige passar por Sabaody e Ilha dos Homens-Peixe.", ilhas: [] },
		{ id: "red", nome: "Red Line", cor: "#e24b4b", aberto: false, desc: "Bloqueado: área de risco mundial.", ilhas: [] }
	];
})();