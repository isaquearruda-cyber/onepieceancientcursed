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
		{ id: "reverse", pagina: "mar-reverse.html", nome: "Reverse Mountain", cor: "#ffcf5a", aberto: true, desc: "Rota especial onde as correntes dos quatro Blues sobem a montanha e abrem caminho para a Grand Line.", ilhas: [
			ilha("canal-east", "Canal do East Blue", "Entrada de corrente", ["Farol de aproximação", "Corrente ascendente", "Recifes de impacto"], 1),
			ilha("canal-north", "Canal do North Blue", "Entrada de corrente", ["Portão norte", "Parede vermelha", "Zona de neblina"], 2),
			ilha("canal-south", "Canal do South Blue", "Entrada de corrente", ["Portão sul", "Corrente de subida", "Doca de reparo"], 3),
			ilha("canal-west", "Canal do West Blue", "Entrada de corrente", ["Portão oeste", "Túnel de espuma", "Rochas de navegação"], 4),
			ilha("reverse-mountain", "Reverse Mountain", "Cruzamento mundial", ["Topo das correntes", "Canal central", "Queda para a Grand Line"], 5),
			ilha("twin-cape", "Twin Cape", "Entrada da Grand Line", ["Farol do Crocus", "Ponto de registro", "Rumo ao Paraíso"], 6)
		]},
		{ id: "calm", pagina: "mar-calm.html", nome: "Calm Belt", cor: "#a9b0ad", aberto: true, desc: "Faixa sem ventos, rota extrema com Reis dos Mares e travessias de alto risco.", ilhas: [
			ilha("amazon-lily", "Amazon Lily", "Ilha das Kuja", ["Portão Kuja", "Arena da tribo", "Floresta de cobras"], 1),
			ilha("rusukaina", "Rusukaina", "Ilha selvagem", ["Costa das feras", "Selva central", "Campo de treinamento"], 2),
			ilha("ninho-reis", "Ninho dos Reis dos Mares", "Zona proibida", ["Corrente parada", "Ossada colossal", "Fenda profunda"], 3)
		] },
		{ id: "paraiso", pagina: "mar-paraiso.html", nome: "Grand Line: Paraíso", cor: "#ffcf5a", aberto: true, desc: "Primeira metade da Grand Line, cheia de ilhas estranhas, clima instável e rotas de Log Pose.", ilhas: [
			ilha("whisky-peak", "Whisky Peak", "Cidade de caçadores", ["Entrada festiva", "Cemitério de espadas", "Bar da fronteira"], 1),
			ilha("little-garden", "Little Garden", "Ilha pré-histórica", ["Selva jurássica", "Vulcão central", "Campo dos gigantes"], 2),
			ilha("drum", "Drum Island", "Reino de neve", ["Castelo de Drum", "Vila médica", "Montanha nevada"], 3),
			ilha("alabasta", "Alabasta", "Reino desértico", ["Alubarna", "Yuba", "Rainbase"], 4),
			ilha("jaya", "Jaya", "Ilha de piratas", ["Mock Town", "Floresta sul", "Costa do Knock Up Stream"], 5),
			ilha("water-seven", "Water 7", "Cidade das águas", ["Galley-La", "Blue Station", "Docas de reparo"], 6),
			ilha("enies-lobby", "Enies Lobby", "Ilha judicial", ["Portão principal", "Torre da justiça", "Ponte da hesitação"], 7),
			ilha("thriller-bark-grand", "Thriller Bark", "Navio-ilha fantasma", ["Mansão", "Cemitério", "Floresta escura"], 8),
			ilha("sabaody", "Arquipélago Sabaody", "Manguezais gigantes", ["Grove 1", "Casa de leilão", "Oficina de revestimento"], 9)
		] },
		{ id: "skypiea", pagina: "mar-skypiea.html", nome: "Mar do Céu", cor: "#f4f0c8", aberto: true, desc: "Rotas aéreas sobre nuvens, ilhas celestes e correntes verticais.", ilhas: [
			ilha("angel-island", "Angel Island", "Cidade celeste", ["Portão do Céu", "Lovely Street", "Costa das nuvens"], 1),
			ilha("upper-yard", "Upper Yard", "Terra sagrada", ["Floresta de Vearth", "Ruínas de Shandora", "Altar gigante"], 2),
			ilha("weatheria", "Weatheria", "Ilha meteorológica", ["Laboratório climático", "Doca de balões", "Praça dos sábios"], 3),
			ilha("birka", "Birka", "Ruínas celestes", ["Templo quebrado", "Arquivo antigo", "Campo elétrico"], 4)
		] },
		{ id: "novo", pagina: "mar-novo.html", nome: "Novo Mundo", cor: "#ff7b7b", aberto: true, desc: "Segunda metade da Grand Line, território de Yonkou, alianças e guerras gigantes.", ilhas: [
			ilha("fishman-island", "Ilha dos Homens-Peixe", "Reino submarino", ["Palácio Ryugu", "Distrito dos tritões", "Noah"], 1),
			ilha("punk-hazard", "Punk Hazard", "Ilha experimental", ["Lado fogo", "Lado gelo", "Laboratório central"], 2),
			ilha("dressrosa", "Dressrosa", "Reino coliseu", ["Coliseu Corrida", "Palácio real", "Porto subterrâneo"], 3),
			ilha("zou", "Zou", "Ilha viva", ["Floresta da baleia", "Ducado Mokomo", "Estrada nas costas"], 4),
			ilha("whole-cake", "Whole Cake Island", "Território doce", ["Chateau", "Floresta sedutora", "Porto das tortas"], 5),
			ilha("wano", "Wano", "País fechado", ["Capital das Flores", "Onigashima", "Udon"], 6),
			ilha("egghead", "Egghead", "Ilha do futuro", ["Labophase", "Fabriophase", "Doca dos Pacifistas"], 7),
			ilha("elbaf", "Elbaf", "Terra dos gigantes", ["Vila guerreira", "Árvore colossal", "Costa dos gigantes"], 8)
		] },
		{ id: "red", pagina: "mar-red.html", nome: "Red Line", cor: "#e24b4b", aberto: true, desc: "Cordilheira mundial, pontos sagrados e rotas de travessia entre oceanos.", ilhas: [
			ilha("mariejois", "Mary Geoise", "Terra sagrada", ["Portão dos dragões", "Pátio sagrado", "Elevador da Red Line"], 1),
			ilha("reverse-red", "Cume da Reverse Mountain", "Travessia mundial", ["Corrente central", "Penhascos vermelhos", "Farol alto"], 2),
			ilha("red-port", "Red Port", "Porto da Red Line", ["Bondola", "Praça dos viajantes", "Docas oficiais"], 3)
		] }
	];
})();
