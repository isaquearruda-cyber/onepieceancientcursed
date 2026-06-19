(function () {
	"use strict";

	var rotasPaginas = {
		"botao-iniciar": "aventura.html",
		"botao-inventario": "inventario.html",
		"botao-atributos": "atributos.html"
	};
	var rotasMenu = {
		perfil: "perfil.html",
		aventura: "aventura.html",
		correio: "correio.html",
		notificacoes: "notificacoes.html",
		lojas: "loja.html",
		missoes: "missoes.html",
		viagem: "aventura.html",
		treinos: "treinos.html",
		conquistas: "conquistas.html",
		habilidades: "habilidades.html",
		biblioteca: "biblioteca-itens.html",
		amigos: "amigos.html",
		grupo: "bando.html",
		eventos: "eventos.html",
		beta: "beta-recompensas.html"
	};
	var icones = {
		atributos: "atributos.webp",
		inventario: "inventario.webp",
		lojas: "lojas.webp",
		eventos: "eventos.webp",
		missoes: "missoes.webp",
		aventura: "viagem.webp",
		correio: "organizacao.webp",
		notificacoes: "eventos.webp",
		treinos: "treinos.webp",
		habilidades: "habilidades.webp",
		biblioteca: "inventario.webp",
		amigos: "amigos.webp",
		grupo: "organizacao.webp",
		ajustes: "ajustes.webp",
		aparencia: "aparencia.webp",
		beta: "eventos.webp"
	};

	function onReady(fn) {
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
		else fn();
	}

	function instalarPwa() {
		var promptInstalacao = null;

		function adicionarLink(rel, href, extra) {
			if (document.querySelector('link[rel="' + rel + '"][href="' + href + '"]')) return;
			var link = document.createElement("link");
			link.rel = rel;
			link.href = href;
			if (extra) {
				Object.keys(extra).forEach(function (chave) {
					link.setAttribute(chave, extra[chave]);
				});
			}
			document.head.appendChild(link);
		}

		function adicionarMeta(name, content) {
			if (document.querySelector('meta[name="' + name + '"]')) return;
			var meta = document.createElement("meta");
			meta.name = name;
			meta.content = content;
			document.head.appendChild(meta);
		}

		adicionarLink("manifest", "manifest.webmanifest");
		adicionarLink("apple-touch-icon", "assets/img/app-logo-192.png");
		adicionarMeta("theme-color", "#f7c84b");
		adicionarMeta("apple-mobile-web-app-capable", "yes");
		adicionarMeta("apple-mobile-web-app-title", "One Piece RPG");

		window.addEventListener("beforeinstallprompt", function (evento) {
			evento.preventDefault();
			promptInstalacao = evento;
			window.dispatchEvent(new CustomEvent("onepiece-app-install-ready"));
		});

		window.addEventListener("appinstalled", function () {
			promptInstalacao = null;
			localStorage.setItem("onePieceRpgAppInstalado", "sim");
		});

		window.OnePieceAppInstall = {
			install: function () {
				if (!promptInstalacao) return Promise.resolve("unavailable");
				return promptInstalacao.prompt()
					.then(function () { return promptInstalacao.userChoice; })
					.then(function (choice) {
						var resultado = choice && choice.outcome ? choice.outcome : "dismissed";
						promptInstalacao = null;
						return resultado;
					})
					.catch(function () {
						return "unavailable";
					});
			},
			canInstall: function () {
				return Boolean(promptInstalacao);
			}
		};

		if ("serviceWorker" in navigator && location.protocol !== "file:") {
			navigator.serviceWorker.register("service-worker.js").then(function (registro) {
				registro.update();
				if (registro.waiting) registro.waiting.postMessage({ type: "SKIP_WAITING" });
				registro.addEventListener("updatefound", function () {
					var novoWorker = registro.installing;
					if (!novoWorker) return;
					novoWorker.addEventListener("statechange", function () {
						if (novoWorker.state === "installed" && navigator.serviceWorker.controller) {
							novoWorker.postMessage({ type: "SKIP_WAITING" });
						}
					});
				});
			}).catch(function (erro) {
				console.info("App instalavel indisponivel neste contexto.", erro);
			});

			navigator.serviceWorker.addEventListener("controllerchange", function () {
				if (sessionStorage.getItem("onePieceRpgSwAtualizado") === "sim") return;
				sessionStorage.setItem("onePieceRpgSwAtualizado", "sim");
				window.location.reload();
			});
		}
	}

	function navegar(evento) {
		var botaoPagina = evento.target.closest("#botao-iniciar, #botao-inventario, #botao-atributos");
		var botaoMenu = evento.target.closest("[data-menu-acao]");
		var destino = botaoPagina ? rotasPaginas[botaoPagina.id] : rotasMenu[botaoMenu && botaoMenu.dataset.menuAcao];
		if (!destino) return;
		evento.preventDefault();
		evento.stopImmediatePropagation();
		tocarUi("confirmar");
		transicionarPagina(destino);
	}

	function obterPersonagem() {
		try {
			var direto = JSON.parse(localStorage.getItem("ultimoPersonagem") || "null");
			if (direto && direto.nome) return direto;
			var lista = JSON.parse(localStorage.getItem("personagensCriados") || "[]");
			return Array.isArray(lista) ? lista[lista.length - 1] || null : null;
		} catch (erro) {
			return null;
		}
	}

	function progressoDo(personagem) {
		if (window.RpgSistemas && typeof window.RpgSistemas.obterProgresso === "function") {
			return window.RpgSistemas.obterProgresso(personagem);
		}
		return personagem && personagem.progressoRpg ? personagem.progressoRpg : {};
	}

	function estadoNivel(progresso) {
		if (window.RpgSistemas && typeof window.RpgSistemas.estadoNivel === "function") {
			return window.RpgSistemas.estadoNivel(progresso);
		}
		return {
			nivel: progresso.nivel || 1,
			expAtual: progresso.expAtual || 0,
			proximo: progresso.proximoNivel || 100,
			percentual: progresso.proximoNivel ? Math.min(100, (Number(progresso.expAtual || 0) / Number(progresso.proximoNivel)) * 100) : 0
		};
	}

	function formatar(valor) {
		return Number(valor || 0).toLocaleString("pt-BR");
	}

	function icone(acao) {
		return "assets/img/menu-game/" + (icones[acao] || icones.habilidades);
	}

	function instalarCss() {
		if (document.getElementById("rpg-hotfix-css")) return;
		var style = document.createElement("style");
		style.id = "rpg-hotfix-css";
		style.textContent = [
			".rpg-pagina-scroll{overflow-y:auto!important;scrollbar-gutter:stable}",
			".rpg-loading{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:18px;background:radial-gradient(circle at 50% 22%,rgba(247,200,75,.18),transparent 34%),linear-gradient(180deg,#020707,#061011);color:#fff7df;transition:opacity .28s ease,visibility .28s ease}",
			".rpg-loading.saindo{opacity:0;visibility:hidden}.rpg-loading-card{width:min(520px,100%);display:grid;gap:14px;text-align:center}.rpg-loading-logo{width:92px;height:92px;margin:auto;border:2px solid rgba(255,226,138,.58);border-radius:18px;background:url('assets/img/app-logo-192.png') center/cover,#061011;box-shadow:0 0 28px rgba(247,200,75,.28);animation:rpgLoadPulse 1.1s ease-in-out infinite}.rpg-loading h2{margin:0;font-family:'Segoe UI Black','Arial Black',Impact,sans-serif;font-size:clamp(1.8rem,8vw,3.3rem);line-height:.92;text-transform:uppercase;text-shadow:0 5px 0 #210b08,0 18px 34px rgba(0,0,0,.72)}",
			".rpg-loading small{color:#ffe28a;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.rpg-loading-barra{height:10px;border:1px solid rgba(255,226,138,.34);border-radius:999px;background:rgba(0,0,0,.46);overflow:hidden}.rpg-loading-barra i{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,#90ff00,#ffe28a);box-shadow:0 0 18px rgba(144,255,0,.46);animation:rpgLoadBar 1.05s ease forwards}.rpg-loading-dica{min-height:38px;color:#d9e8d4;font:800 .92rem/1.35 Arial,sans-serif}",
			".rpg-transicao{position:fixed;inset:0;z-index:99998;display:grid;place-items:center;background:radial-gradient(circle at 50% 50%,rgba(247,200,75,.22),rgba(1,5,6,.94) 56%);color:#ffe28a;font-family:'Segoe UI Black','Arial Black',Impact,sans-serif;text-transform:uppercase;letter-spacing:.08em;animation:rpgTransicaoIn .24s ease both}.rpg-transicao span{padding:12px 16px;border:1px solid rgba(255,226,138,.42);border-radius:8px;background:rgba(3,8,10,.78);box-shadow:0 0 26px rgba(247,200,75,.22)}",
			"@keyframes rpgLoadPulse{50%{transform:translateY(-3px);box-shadow:0 0 38px rgba(247,200,75,.44)}}@keyframes rpgLoadBar{to{width:100%}}@keyframes rpgTransicaoIn{from{opacity:0}to{opacity:1}}",
			".battle-hud-lobby{position:relative;z-index:1;display:grid;grid-template-columns:minmax(180px,1.2fr) minmax(96px,.7fr);grid-template-areas:'perfil berris' 'xp xp';gap:8px;width:100%;margin:8px 0 12px;pointer-events:auto}",
			".battle-perfil{grid-area:perfil;display:grid;grid-template-columns:40px 1fr;gap:9px;align-items:center;min-height:52px;padding:6px 9px;border:1px solid rgba(144,255,0,.42);border-radius:8px;color:#90ff00;background:linear-gradient(90deg,rgba(4,18,10,.88),rgba(8,28,18,.72));box-shadow:0 0 16px rgba(144,255,0,.12),inset 0 0 18px rgba(0,0,0,.25);cursor:pointer;text-align:left}",
			".battle-avatar{width:38px;height:38px;border-radius:8px;border:1px solid rgba(144,255,0,.45);background:radial-gradient(circle,#eaffd8,#36e0ff 42%,#07100d 72%);box-shadow:0 0 14px rgba(144,255,0,.22);overflow:hidden}",
			".battle-avatar img{width:100%;height:100%;object-fit:cover;display:block}",
			".battle-nome{display:block;color:#90ff00;font-size:.9rem;font-weight:900;line-height:1.05;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".battle-nivel{display:block;margin-top:3px;color:#b8ff55;font-size:.7rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}",
			".battle-berris{grid-area:berris;display:grid;align-content:center;min-width:96px;padding:6px 9px;border:1px solid rgba(144,255,0,.34);border-radius:8px;background:linear-gradient(180deg,rgba(22,48,12,.74),rgba(4,12,13,.78));box-shadow:0 0 14px rgba(144,255,0,.1),inset 0 0 16px rgba(0,0,0,.22)}",
			".battle-berris small,.battle-xp small{color:#90ff00;font-size:.6rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}",
			".battle-berris strong{color:#d8ff9a;font-size:.98rem;line-height:1.05}",
			".battle-xp{grid-area:xp;display:grid;gap:4px;padding:6px 9px;border:1px solid rgba(144,255,0,.28);border-radius:8px;background:rgba(3,12,8,.78);box-shadow:0 0 14px rgba(144,255,0,.08),inset 0 0 16px rgba(0,0,0,.22)}",
			".battle-xp-topo{display:flex;justify-content:space-between;gap:10px;color:#b8ff55;font-size:.7rem;font-weight:900}",
			".battle-xp-barra{height:8px;border-radius:999px;border:1px solid rgba(144,255,0,.18);background:rgba(0,0,0,.58);overflow:hidden}",
			".battle-xp-barra i{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,#90ff00,#d8ff9a);box-shadow:0 0 14px rgba(144,255,0,.5);transition:width .35s ease}",
			".atalho-menu-lobby,.botao-menu-lobby,.botao-lobby{position:relative!important;overflow:hidden!important}",
			".atalho-menu-lobby:hover,.botao-menu-lobby:hover,.botao-lobby:hover{filter:saturate(1.14)!important;box-shadow:0 0 20px rgba(255,226,138,.32),inset 0 0 18px rgba(255,247,223,.08)!important}",
			".grade-menu-lobby{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}",
			".atalho-menu-lobby{min-width:0!important}",
			".atalho-menu-lobby span{overflow-wrap:anywhere!important}",
			".status-personagem.oculto-lobby{display:none!important}",
			".painel-proxima-acao{display:grid;gap:12px;padding:14px;border:1px solid rgba(54,224,255,.24);border-radius:8px;background:radial-gradient(circle at 18% 18%,rgba(54,224,255,.16),transparent 34%),rgba(4,12,13,.58);box-shadow:inset 0 0 20px rgba(0,0,0,.28)}",
			".painel-proxima-acao h2{margin:0;color:#fff7df;font-size:1.35rem;text-transform:uppercase;letter-spacing:.04em}",
			".painel-proxima-acao p{margin:0;color:#d9e8d4;line-height:1.45}",
			".chips-rota{display:flex;flex-wrap:wrap;gap:8px}",
			".chip-rota{padding:7px 9px;border:1px solid rgba(255,226,138,.24);border-radius:999px;background:rgba(255,247,223,.05);color:#ffe28a;font-size:.78rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase}",
			".acoes-rapidas-lobby{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
			".botao-acao-rapida{min-height:54px;border:1px solid rgba(255,226,138,.5);border-radius:8px;color:#fff7df;background:linear-gradient(90deg,rgba(255,247,223,.07),rgba(54,224,255,.08));font-weight:900;text-transform:uppercase;cursor:pointer}",
			".item-imagem{flex:0 0 auto;width:56px;height:56px;border:1px solid rgba(255,226,138,.52);border-radius:8px;overflow:hidden;background:#061011;box-shadow:0 0 18px rgba(255,226,138,.25)}",
			".item-imagem img{width:100%;height:100%;object-fit:cover;display:block}",
			".login-beta-overlay{position:fixed;inset:0;z-index:4500;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.66);backdrop-filter:blur(6px)}",
			".login-beta-card{width:min(520px,100%);border:1px solid rgba(255,226,138,.42);border-radius:8px;background:radial-gradient(circle at 18% 14%,rgba(144,255,0,.16),transparent 34%),linear-gradient(180deg,rgba(5,12,14,.98),rgba(1,4,6,.98));box-shadow:0 28px 80px rgba(0,0,0,.68),0 0 32px rgba(144,255,0,.16);color:#fff7df;overflow:hidden}",
			".login-beta-topo{display:flex;justify-content:space-between;gap:12px;align-items:start;padding:16px 18px;border-bottom:1px solid rgba(255,226,138,.18)}",
			".login-beta-topo small{color:#90ff00;font-weight:900;letter-spacing:.12em;text-transform:uppercase}",
			".login-beta-topo h2{margin:4px 0 0;font-family:'Segoe UI Black','Arial Black',Impact,sans-serif;font-size:clamp(1.7rem,5vw,2.7rem);line-height:.92;text-transform:uppercase;text-shadow:0 4px 0 #210b08,0 14px 24px rgba(0,0,0,.72)}",
			".login-beta-fechar{min-width:38px;min-height:38px;border:1px solid rgba(255,226,138,.38);border-radius:8px;color:#fff7df;background:rgba(4,12,13,.72);font-weight:1000;cursor:pointer}",
			".login-beta-premio{--cor:#36e0ff;display:grid;grid-template-columns:86px 1fr;gap:14px;padding:18px;align-items:center}",
			".login-beta-arte{display:grid;place-items:center;width:82px;height:82px;border:1px solid color-mix(in srgb,var(--cor) 52%,transparent);border-radius:18px;background:radial-gradient(circle,color-mix(in srgb,var(--cor) 54%,#fff7df),rgba(3,8,10,.84) 68%);box-shadow:0 0 26px color-mix(in srgb,var(--cor) 34%,transparent);font-size:2.3rem}",
			".login-beta-premio h3{margin:0;color:#fff7df;font-size:1.08rem;line-height:1.08;text-transform:uppercase}",
			".login-beta-premio p{margin:7px 0 0;color:#d9e8d4;line-height:1.35}",
			".login-beta-meta{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}.login-beta-meta span{padding:5px 8px;border:1px solid color-mix(in srgb,var(--cor) 42%,transparent);border-radius:999px;color:#ffe28a;background:rgba(0,0,0,.34);font-size:.68rem;font-weight:900;text-transform:uppercase}",
			".login-beta-acoes{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 18px 18px}.login-beta-acoes button,.login-beta-acoes a{min-height:44px;display:grid;place-items:center;border:1px solid rgba(255,226,138,.46);border-radius:8px;color:#fff7df;background:rgba(4,12,13,.74);font-weight:900;text-transform:uppercase;text-decoration:none;cursor:pointer}.login-beta-acoes .principal{border-color:rgba(144,255,0,.52);background:linear-gradient(90deg,rgba(144,255,0,.28),rgba(255,226,138,.16));color:#eaffd8}",
			".rpg-toast-stack{position:fixed;right:16px;bottom:16px;z-index:5000;display:grid;gap:10px;width:min(360px,calc(100vw - 32px));pointer-events:none}",
			".rpg-toast{--cor:#ffe28a;display:grid;grid-template-columns:42px 1fr;gap:10px;align-items:center;padding:11px;border:1px solid color-mix(in srgb,var(--cor) 48%,transparent);border-radius:8px;background:linear-gradient(180deg,rgba(5,12,14,.96),rgba(1,4,6,.98));box-shadow:0 18px 44px rgba(0,0,0,.5),0 0 22px color-mix(in srgb,var(--cor) 22%,transparent);animation:rpgToastIn .26s ease both;color:#fff7df}",
			".rpg-toast i{display:grid;place-items:center;width:42px;height:42px;border-radius:8px;background:radial-gradient(circle,color-mix(in srgb,var(--cor) 68%,#fff7df),rgba(3,8,10,.86) 70%);font-style:normal;font-weight:1000;color:#11170c}",
			".rpg-toast strong{display:block;color:#fff7df;text-transform:uppercase;letter-spacing:.04em}.rpg-toast span{display:block;color:#d9e8d4;font-size:.82rem;line-height:1.25}",
			".rpg-toast.sumindo{animation:rpgToastOut .22s ease both}@keyframes rpgToastIn{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}@keyframes rpgToastOut{to{opacity:0;transform:translateY(8px) scale(.98)}}",
			".rpg-pulso-premio{animation:rpgPulsoPremio .72s ease}@keyframes rpgPulsoPremio{0%{filter:brightness(1)}35%{filter:brightness(1.35);box-shadow:0 0 34px rgba(144,255,0,.38)}100%{filter:brightness(1)}}",
			".rpg-objetivos{display:grid;gap:9px;margin-top:10px;padding:12px;border:1px solid rgba(255,226,138,.22);border-radius:8px;background:rgba(3,8,10,.64);box-shadow:inset 0 0 18px rgba(0,0,0,.22)}.rpg-objetivos h3{margin:0;color:#ffe28a;font:900 .78rem Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase}.rpg-objetivo{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;color:#d9e8d4;font:800 .82rem Arial,sans-serif}.rpg-objetivo span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rpg-objetivo small{color:#90ff00;font-weight:1000}.rpg-objetivo-barra{grid-column:1/-1;height:7px;border-radius:999px;background:rgba(0,0,0,.46);overflow:hidden;border:1px solid rgba(144,255,0,.18)}.rpg-objetivo-barra i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#36e0ff,#90ff00)}",
			".rpg-save-status{position:fixed;left:14px;bottom:14px;z-index:4300;display:flex;align-items:center;gap:7px;max-width:min(320px,calc(100vw - 92px));padding:8px 10px;border:1px solid rgba(255,226,138,.24);border-radius:8px;background:rgba(3,8,10,.78);color:#d9e8d4;font:900 .72rem Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;backdrop-filter:blur(6px);box-shadow:0 12px 34px rgba(0,0,0,.36);pointer-events:none}.rpg-save-status i{width:8px;height:8px;border-radius:999px;background:#90ff00;box-shadow:0 0 12px rgba(144,255,0,.8)}.rpg-save-status.offline i{background:#ffcf3e}.rpg-save-status.erro i{background:#ff5c5c}",
			".rpg-sistema-botao{position:fixed;right:14px;bottom:14px;z-index:4400;width:48px;height:48px;border:1px solid rgba(255,226,138,.44);border-radius:8px;background:linear-gradient(180deg,rgba(12,28,30,.94),rgba(3,8,10,.96));color:#ffe28a;font:1000 .78rem Arial,sans-serif;letter-spacing:.08em;box-shadow:0 16px 42px rgba(0,0,0,.46),0 0 18px rgba(247,200,75,.15);cursor:pointer}.rpg-sistema-botao:hover{filter:brightness(1.12);box-shadow:0 18px 48px rgba(0,0,0,.52),0 0 24px rgba(247,200,75,.24)}",
			".rpg-modal-sistema{position:fixed;inset:0;z-index:5200;display:grid;place-items:center;padding:16px;background:rgba(0,0,0,.68);backdrop-filter:blur(6px)}.rpg-modal-sistema[hidden]{display:none}.rpg-sistema-card{width:min(760px,100%);max-height:min(760px,calc(100svh - 28px));overflow:auto;border:1px solid rgba(255,226,138,.36);border-radius:8px;background:radial-gradient(circle at 16% 8%,rgba(54,224,255,.16),transparent 34%),linear-gradient(180deg,rgba(6,16,18,.98),rgba(1,4,6,.98));box-shadow:0 28px 90px rgba(0,0,0,.72);color:#fff7df}.rpg-sistema-topo{display:flex;justify-content:space-between;gap:12px;align-items:start;padding:18px;border-bottom:1px solid rgba(255,226,138,.16)}.rpg-sistema-topo small,.rpg-sistema-bloco h3{color:#90ff00;font-weight:1000;letter-spacing:.12em;text-transform:uppercase}.rpg-sistema-topo h2{margin:4px 0 0;font-family:'Segoe UI Black','Arial Black',Impact,sans-serif;font-size:clamp(1.8rem,6vw,3rem);line-height:.92;text-transform:uppercase;text-shadow:0 5px 0 #210b08,0 16px 30px rgba(0,0,0,.65)}.rpg-sistema-fechar{min-width:38px;min-height:38px;border:1px solid rgba(255,226,138,.36);border-radius:8px;background:rgba(3,8,10,.78);color:#fff7df;font-weight:1000;cursor:pointer}",
			".rpg-sistema-corpo{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:16px}.rpg-sistema-bloco{display:grid;gap:10px;padding:14px;border:1px solid rgba(255,226,138,.18);border-radius:8px;background:rgba(4,12,13,.56);box-shadow:inset 0 0 18px rgba(0,0,0,.22)}.rpg-sistema-bloco h3{margin:0;font-size:.78rem}.rpg-sistema-linha{display:flex;justify-content:space-between;gap:12px;align-items:center;color:#d9e8d4;font:800 .88rem Arial,sans-serif}.rpg-sistema-linha strong{color:#fff7df;text-align:right}.rpg-sistema-acoes{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rpg-sistema-acoes button,.rpg-patch-acoes button{min-height:40px;border:1px solid rgba(255,226,138,.42);border-radius:8px;background:rgba(255,247,223,.07);color:#fff7df;font-weight:900;text-transform:uppercase;cursor:pointer}.rpg-sistema-acoes button.principal,.rpg-patch-acoes button.principal{border-color:rgba(144,255,0,.48);background:linear-gradient(90deg,rgba(144,255,0,.26),rgba(54,224,255,.12));color:#eaffd8}.rpg-sistema-range{display:grid;gap:7px}.rpg-sistema-range input{width:100%;accent-color:#90ff00}",
			".rpg-passe-lobby{display:grid;gap:10px;margin-top:10px;padding:12px;border:1px solid rgba(54,224,255,.24);border-radius:8px;background:linear-gradient(180deg,rgba(54,224,255,.08),rgba(3,8,10,.66));box-shadow:inset 0 0 18px rgba(0,0,0,.22)}.rpg-passe-lobby h3{margin:0;color:#36e0ff;font:900 .78rem Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase}.rpg-passe-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.rpg-passe-meta span{padding:8px;border:1px solid rgba(255,226,138,.16);border-radius:8px;background:rgba(0,0,0,.24);color:#d9e8d4;font:800 .76rem Arial,sans-serif}.rpg-passe-meta strong{display:block;color:#ffe28a;font-size:1rem}.rpg-passe-barra{height:8px;border:1px solid rgba(54,224,255,.22);border-radius:999px;background:rgba(0,0,0,.44);overflow:hidden}.rpg-passe-barra i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#36e0ff,#90ff00)}",
			".rpg-patch-notes{position:fixed;inset:0;z-index:5300;display:grid;place-items:center;padding:16px;background:rgba(0,0,0,.7);backdrop-filter:blur(6px)}.rpg-patch-notes[hidden]{display:none}.rpg-patch-card{width:min(680px,100%);border:1px solid rgba(255,226,138,.36);border-radius:8px;background:linear-gradient(180deg,rgba(6,16,18,.98),rgba(1,4,6,.98));box-shadow:0 28px 90px rgba(0,0,0,.72);color:#fff7df;overflow:hidden}.rpg-patch-card header{padding:18px;border-bottom:1px solid rgba(255,226,138,.16)}.rpg-patch-card small{color:#90ff00;font-weight:1000;letter-spacing:.12em;text-transform:uppercase}.rpg-patch-card h2{margin:4px 0 0;font-family:'Segoe UI Black','Arial Black',Impact,sans-serif;font-size:clamp(1.8rem,6vw,3rem);line-height:.92;text-transform:uppercase}.rpg-patch-lista{display:grid;gap:10px;padding:16px}.rpg-patch-item{padding:12px;border:1px solid rgba(255,226,138,.16);border-radius:8px;background:rgba(255,247,223,.05)}.rpg-patch-item strong{display:block;color:#ffe28a;text-transform:uppercase}.rpg-patch-item span{display:block;margin-top:4px;color:#d9e8d4;line-height:1.35}.rpg-patch-acoes{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px 16px}",
			"#nprogress .bar{height:3px!important;background:linear-gradient(90deg,#36e0ff,#90ff00,#ffe28a)!important;box-shadow:0 0 18px rgba(144,255,0,.65)!important}#nprogress .peg{box-shadow:0 0 14px #90ff00,0 0 8px #36e0ff!important}",
			".rpg-ambiente-canvas{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.44;mix-blend-mode:screen}.rpg-comando-overlay{position:fixed;inset:0;z-index:5400;display:grid;place-items:start center;padding:clamp(16px,7vh,74px) 16px 16px;background:rgba(0,0,0,.62);backdrop-filter:blur(8px)}.rpg-comando-overlay[hidden]{display:none}.rpg-comando-card{width:min(760px,100%);border:1px solid rgba(255,226,138,.38);border-radius:8px;background:radial-gradient(circle at 15% 0,rgba(54,224,255,.15),transparent 34%),linear-gradient(180deg,rgba(6,16,18,.98),rgba(1,4,6,.98));box-shadow:0 28px 90px rgba(0,0,0,.72);overflow:hidden;color:#fff7df}.rpg-comando-busca{display:grid;grid-template-columns:42px 1fr 42px;align-items:center;gap:8px;padding:12px;border-bottom:1px solid rgba(255,226,138,.16)}.rpg-comando-busca span{display:grid;place-items:center;color:#90ff00;font-weight:1000}.rpg-comando-busca input{width:100%;min-height:44px;border:0;outline:0;background:transparent;color:#fff7df;font:900 1rem Arial,sans-serif}.rpg-comando-busca button{min-height:38px;border:1px solid rgba(255,226,138,.34);border-radius:8px;background:rgba(255,247,223,.06);color:#fff7df;font-weight:1000;cursor:pointer}.rpg-comando-lista{display:grid;gap:8px;max-height:min(520px,62svh);overflow:auto;padding:12px}.rpg-comando-item{display:grid;grid-template-columns:42px 1fr auto;gap:10px;align-items:center;min-height:58px;padding:8px;border:1px solid rgba(255,226,138,.13);border-radius:8px;background:rgba(255,247,223,.045);color:#fff7df;text-align:left;cursor:pointer}.rpg-comando-item:hover,.rpg-comando-item.ativo{border-color:rgba(144,255,0,.48);background:rgba(144,255,0,.1);box-shadow:0 0 18px rgba(144,255,0,.12)}.rpg-comando-item img{width:40px;height:40px;border-radius:8px;object-fit:cover}.rpg-comando-item strong{display:block;text-transform:uppercase;letter-spacing:.04em}.rpg-comando-item small{color:#d9e8d4;font-weight:800}.rpg-comando-item kbd{padding:4px 7px;border:1px solid rgba(255,226,138,.22);border-radius:6px;background:rgba(0,0,0,.28);color:#ffe28a;font:900 .68rem Arial,sans-serif}.rpg-hotkeys{position:fixed;right:72px;bottom:16px;z-index:4300;display:flex;gap:6px;pointer-events:none}.rpg-hotkeys span{padding:7px 9px;border:1px solid rgba(255,226,138,.2);border-radius:8px;background:rgba(3,8,10,.74);color:#d9e8d4;font:900 .68rem Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;backdrop-filter:blur(6px)}",
			"@media(max-width:740px){.rpg-sistema-corpo{grid-template-columns:1fr}.rpg-sistema-acoes,.rpg-patch-acoes{grid-template-columns:1fr}.rpg-passe-meta{grid-template-columns:1fr}.rpg-save-status{left:10px;bottom:10px}.rpg-sistema-botao{right:10px;bottom:10px}}",
			"@media(max-width:620px){.login-beta-premio{grid-template-columns:1fr;text-align:center}.login-beta-arte{margin:auto}.login-beta-acoes{grid-template-columns:1fr}}",
			"@media(max-width:1180px) and (hover:none),(max-width:1180px) and (pointer:coarse){body.pagina-formulario{overflow-y:auto!important}.container-lobby{grid-template-columns:1fr!important;width:min(100%,680px)!important;max-width:680px!important;margin:0 auto!important;padding:12px!important;gap:12px!important}.painel-personagem{order:1!important}.painel-comandos{order:2!important}.personagem-palco{order:3!important;min-height:340px!important}.cabecalho-lobby{text-align:center!important}.cabecalho-lobby h1{font-size:clamp(1.75rem,7vw,2.3rem)!important}.battle-hud-lobby{grid-template-columns:1fr minmax(92px,.38fr)!important;grid-template-areas:'perfil berris' 'xp xp'!important}.painel-proxima-acao h2{font-size:1.12rem!important}.botao-lobby,.botao-menu-lobby{grid-template-columns:58px 1fr auto!important;min-height:64px!important;padding:8px 12px!important}.botao-lobby img,.botao-menu-lobby img,.atalho-menu-lobby img{width:52px!important;height:52px!important}.grade-menu-lobby{grid-template-columns:1fr!important}.atalho-menu-lobby{min-height:74px!important;grid-template-columns:56px 1fr!important;justify-items:start!important;text-align:left!important}}",
			"@media(max-width:700px){.battle-hud-lobby{width:100%;margin:8px 0 12px;grid-template-columns:1fr;grid-template-areas:'perfil' 'berris' 'xp'}.battle-berris{min-width:0}.grade-menu-lobby{grid-template-columns:1fr!important;padding:10px!important;gap:10px!important}.atalho-menu-lobby{grid-template-columns:54px 1fr!important;justify-items:start!important;min-height:76px!important;padding:10px 12px!important}.atalho-menu-lobby img{width:46px!important;height:46px!important}.atalho-menu-lobby span{text-align:left!important;font-size:.8rem!important;line-height:1.15!important}}",
			"@media(max-width:960px) and (orientation:landscape){body.pagina-formulario{width:100%;min-height:100svh;overflow:hidden!important;background:#030809}.pagina-formulario .video-fundo{display:block!important;filter:brightness(.34) saturate(1.12)}.orientacao-celular{display:none!important}.container-lobby{width:100%!important;height:100svh!important;height:100vh!important;min-height:100vh!important;max-width:none!important;display:grid!important;grid-template-columns:minmax(156px,.72fr) minmax(260px,1.55fr) minmax(178px,.82fr)!important;grid-template-rows:1fr!important;gap:7px!important;padding:6px!important;margin:0!important;align-items:stretch!important;overflow:hidden!important}.painel-lobby,.personagem-palco{min-height:0!important}.painel-personagem,.painel-comandos,.personagem-palco{padding:8px!important;border-color:rgba(144,255,0,.2)!important;background:linear-gradient(180deg,rgba(2,8,10,.66),rgba(2,5,7,.58))!important;box-shadow:0 12px 28px rgba(0,0,0,.32),inset 0 0 24px rgba(54,224,255,.04)!important;backdrop-filter:blur(3px)!important}.painel-personagem{order:1!important;display:grid!important;grid-template-rows:auto auto!important;align-content:start!important;gap:8px!important;overflow:hidden!important}.personagem-palco{order:2!important;padding:4px 10px 8px!important;display:grid!important;place-items:center!important;overflow:hidden!important}.painel-comandos{order:3!important;display:grid!important;grid-template-rows:1fr auto auto!important;gap:8px!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch}.cabecalho-lobby{text-align:left!important;display:grid!important;gap:6px!important}.cabecalho-lobby h1,.cabecalho-lobby .subtitulo-lobby,.status-online{display:none!important}.battle-hud-lobby{margin:0!important;grid-template-columns:1fr!important;grid-template-areas:'perfil' 'berris' 'xp'!important;gap:6px!important}.battle-perfil,.battle-berris,.battle-xp{min-height:0!important;padding:6px 7px!important;border-radius:7px!important}.battle-perfil{grid-template-columns:34px 1fr!important}.battle-avatar{width:32px!important;height:32px!important}.battle-nome{font-size:.82rem!important}.battle-nivel,.battle-xp-topo{font-size:.62rem!important}.battle-berris strong{font-size:.9rem!important}.battle-xp-barra{height:6px!important}.painel-proxima-acao{align-self:start!important;gap:6px!important;padding:9px!important;overflow:hidden!important}.painel-proxima-acao .info-label,.painel-proxima-acao h2,.painel-proxima-acao p,.chips-rota{display:none!important}.acoes-rapidas-lobby{grid-template-columns:1fr 1fr!important;gap:6px!important}.botao-acao-rapida{min-height:34px!important;border-radius:6px!important;font-size:.62rem!important}.palco-identidade{top:8px!important;width:min(68%,260px)!important;padding:7px 10px!important;background:rgba(2,8,10,.56)!important}.palco-identidade span{font-size:.55rem!important}.palco-identidade strong{font-size:clamp(1rem,3vw,1.55rem)!important}.palco-moldura{width:100%!important;min-height:0!important;height:100%!important;padding-top:38px!important}.palco-placeholder{width:min(56%,238px)!important;max-height:calc(100svh - 74px)!important;aspect-ratio:3/4!important;background:radial-gradient(circle at 50% 78%,rgba(247,200,75,.18),transparent 46%)!important}.palco-placeholder.tem-imagem{width:min(64%,270px)!important}.painel-titulo{font-size:.72rem!important;letter-spacing:.14em!important}.acoes-lobby,.grupo-comandos,.menu-lobby-recolhivel{gap:6px!important}.botao-lobby,.botao-menu-lobby,.botao-registros{grid-template-columns:38px 1fr auto!important;min-height:46px!important;padding:5px 8px!important;gap:8px!important;border-radius:7px!important;font-size:.72rem!important}.botao-registros{grid-template-columns:38px 1fr!important}.botao-lobby img,.botao-menu-lobby img,.botao-registros img{width:36px!important;height:36px!important;border-radius:6px!important}.menu-seta{font-size:.95rem!important}.grade-menu-lobby{grid-template-columns:1fr!important;gap:5px!important;padding:6px!important;max-height:44svh!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch}.atalho-menu-lobby{min-height:40px!important;grid-template-columns:34px 1fr!important;justify-items:start!important;text-align:left!important;gap:7px!important;padding:5px 7px!important;border-radius:7px!important}.atalho-menu-lobby img{width:32px!important;height:32px!important;border-radius:6px!important}.atalho-menu-lobby span{font-size:.62rem!important;line-height:1.05!important}.botao-voltar-inicio{min-height:34px!important;font-size:.62rem!important;padding:4px 7px!important}}",
			"@media(max-width:760px) and (orientation:portrait){.orientacao-celular{display:none!important}body.pagina-formulario{overflow-y:auto!important}.container-lobby{grid-template-columns:1fr!important;gap:10px!important;padding:10px!important}.personagem-palco{order:2!important;min-height:360px!important}.painel-personagem{order:1!important}.painel-comandos{order:3!important}.cabecalho-lobby h1{font-size:1.7rem!important}.botao-lobby,.botao-menu-lobby,.botao-registros{min-height:54px!important}}",
			"@media (hover:none),(pointer:coarse),(max-width:680px){body{overflow:auto!important}.video-fundo{display:none!important}.skill-stage{overflow-x:auto!important;overflow-y:hidden!important;touch-action:pan-x pan-y!important;-webkit-overflow-scrolling:touch!important;min-height:520px!important}.skill-stage>*{min-width:720px!important}.stage-bg:before,.stage-bg:after,.branch-band{display:none!important}.tree-line,.skill-node,.skill-core{filter:none!important;animation:none!important}}"
		].join("");
		document.head.appendChild(style);
	}

	function carregarRpgSistemas() {
		if (window.RpgSistemas || document.querySelector('script[src^="rpg-sistemas.js"]')) return;
		var script = document.createElement("script");
		script.src = "rpg-sistemas.js";
		script.defer = true;
		document.head.appendChild(script);
	}

	function atualizarIcones() {
		var mapaIds = {
			"botao-atributos": "atributos",
			"botao-inventario": "inventario",
			"botao-menu-lobby": "habilidades",
			"botao-menu-ajustes": "ajustes"
		};
		document.querySelectorAll(".atalho-menu-lobby, .botao-menu-lobby").forEach(function (botao) {
			var acao = botao.dataset.menuAcao || mapaIds[botao.id] || "";
			var texto = botao.textContent || "";
			if (!acao && /aventura|entrar|mar|ilha|viagem/i.test(texto)) acao = "aventura";
			if (!acao && /correio|mensagens?/i.test(texto)) acao = "correio";
			if (!acao && /notifica|avisos?/i.test(texto)) acao = "notificacoes";
			if (!acao && /biblioteca|meito|itens?/i.test(texto)) acao = "biblioteca";
			if (!acao && /beta|premios?|recompensas?/i.test(texto)) acao = "beta";
			if (!acao) return;
			var img = botao.querySelector("img");
			if (img) img.src = icone(acao);
		});
	}

	function injetarAtalhos() {
		var grade = document.getElementById("grade-menu-lobby");
		if (!grade || grade.dataset.sistemasRpg === "ok") return;
		grade.dataset.sistemasRpg = "ok";
		[
			["aventura", "Entrar na Aventura"],
			["correio", "Correio"],
			["notificacoes", "Notificações"],
			["lojas", "Loja Rotativa"],
			["treinos", "Treinos"],
			["beta", "Prêmios Beta"],
			["conquistas", "Conquistas"],
			["habilidades", "Árvore de Habilidades"],
			["biblioteca", "Biblioteca de Itens"],
			["amigos", "Adicionar Amigos"],
			["grupo", "Bando / Organização"]
		].forEach(function (item) {
			if (grade.querySelector('[data-menu-acao="' + item[0] + '"]')) return;
			var botao = document.createElement("button");
			botao.className = "atalho-menu-lobby";
			botao.type = "button";
			botao.dataset.menuAcao = item[0];
			botao.innerHTML = '<img src="' + icone(item[0]) + '" alt=""><span>' + item[1] + "</span>";
			grade.appendChild(botao);
		});
	}

	function substituirFichaLobby() {
		var status = document.getElementById("status-personagem");
		if (!status || document.getElementById("painel-proxima-acao") || document.querySelector(".painel-proxima-acao")) return;
		status.classList.add("oculto-lobby");
		status.setAttribute("aria-hidden", "true");
		var painel = document.createElement("div");
		painel.id = "painel-proxima-acao";
		painel.className = "painel-proxima-acao";
		painel.innerHTML =
			'<span class="info-label">Central de aventura</span>' +
			"<h2>Escolha sua próxima rota</h2>" +
			"<p>Abra o mapa dos mares, revise sua ficha completa no perfil ou pegue uma missão para ganhar EXP e berris.</p>" +
			'<div class="chips-rota"><span class="chip-rota">4 Blues livres</span><span class="chip-rota">Rotas bloqueadas por campanha</span><span class="chip-rota">Viagem salva</span></div>' +
			'<div class="acoes-rapidas-lobby"><button class="botao-acao-rapida" type="button" data-menu-acao="aventura">Mapa</button><button class="botao-acao-rapida" type="button" data-menu-acao="perfil">Perfil</button><button class="botao-acao-rapida" type="button" data-menu-acao="missoes">Missões</button><button class="botao-acao-rapida" type="button" data-menu-acao="biblioteca">Biblioteca</button></div>';
		status.parentNode.insertBefore(painel, status);
	}

	function criarHudBattle() {
		if (!document.body.classList.contains("pagina-formulario")) return null;
		var painel = document.querySelector(".cabecalho-lobby") || document.querySelector(".container-lobby");
		if (!painel) return null;
		var hud = document.getElementById("battle-hud-lobby");
		if (hud) return hud;
		hud = document.createElement("div");
		hud.id = "battle-hud-lobby";
		hud.className = "battle-hud-lobby";
		hud.innerHTML =
			'<button class="battle-perfil" type="button" data-menu-acao="perfil">' +
			'<span class="battle-avatar" id="battle-avatar"></span>' +
			'<span><strong class="battle-nome" id="battle-nome">Perfil</strong><span class="battle-nivel" id="battle-nivel">Nv. 1</span></span>' +
			"</button>" +
			'<div class="battle-berris"><small>Berris</small><strong id="battle-berris">0</strong></div>' +
			'<div class="battle-xp"><div class="battle-xp-topo"><small>EXP</small><span id="battle-xp-texto">0 / 0</span></div><div class="battle-xp-barra"><i id="battle-xp-barra"></i></div></div>';
		var referencia = document.getElementById("exp-lobby");
		if (referencia && referencia.parentNode === painel) painel.insertBefore(hud, referencia);
		else painel.appendChild(hud);
		return hud;
	}

	function atualizarHudBattle() {
		var hud = criarHudBattle();
		if (!hud) return;
		var personagem = obterPersonagem();
		var progresso = progressoDo(personagem);
		var estado = estadoNivel(progresso);
		var avatar = document.getElementById("battle-avatar");
		document.getElementById("battle-nome").textContent = personagem && personagem.nome ? personagem.nome : "Sem personagem";
		document.getElementById("battle-nivel").textContent = "Nv. " + (estado.nivel || progresso.nivel || 1);
		document.getElementById("battle-berris").textContent = formatar(progresso.berris);
		document.getElementById("battle-xp-texto").textContent = formatar(estado.expAtual) + " / " + formatar(estado.proximo);
		document.getElementById("battle-xp-barra").style.width = Math.max(0, Math.min(100, estado.percentual || 0)) + "%";
		if (avatar && personagem && personagem.imagem && avatar.dataset.src !== personagem.imagem) {
			avatar.dataset.src = personagem.imagem;
			avatar.innerHTML = '<img src="' + personagem.imagem + '" alt="">';
		}
	}

	function habilitarScroll() {
		if (document.querySelector(".perfil-app, .biblioteca-app, .app")) {
			document.body.classList.add("rpg-pagina-scroll");
		}
	}

	function imagemWiki(nome) {
		return "https://onepiece.fandom.com/wiki/Special:Redirect/file/" + encodeURIComponent(String(nome || "").replaceAll(" ", "_") + "_Infobox.png");
	}

	function decorarBiblioteca() {
		if (!/biblioteca-itens\.html?$/.test(window.location.pathname)) return;
		document.querySelectorAll(".item-card").forEach(function (card) {
			var titulo = card.querySelector("h2");
			var iconeAtual = card.querySelector(".item-icone");
			if (!titulo || !iconeAtual || iconeAtual.dataset.wikiImagem === "ok") return;
			var nome = titulo.textContent.trim();
			iconeAtual.dataset.wikiImagem = "ok";
			iconeAtual.className = "item-imagem";
			iconeAtual.innerHTML = '<img src="' + imagemWiki(nome) + '" alt="' + nome + '" loading="lazy">';
			iconeAtual.querySelector("img").addEventListener("error", function () {
				iconeAtual.className = "item-icone";
				iconeAtual.innerHTML = "";
			}, { once: true });
		});
	}

	var recompensasBetaLogin = [
		{ id: "beta-dia-1", dia: 1, nome: "Kit de Navegador Beta", tipo: "navegacao", quantidade: 1, raridade: "Comum", cor: "#49d2ff", icone: "🧭", sprite: [1, 1], descricao: "Bússola, tinta de mapa e marcador de rota para testadores do RPG." },
		{ id: "beta-dia-2", dia: 2, nome: "Ração de Campanha Temperada", tipo: "alimentacao", quantidade: 5, raridade: "Comum", cor: "#ff8a3d", icone: "🍱", sprite: [1, 0], descricao: "Mantimentos especiais para longas sessões de teste e exploração." },
		{ id: "beta-dia-3", dia: 3, nome: "Den Den de Diagnóstico", tipo: "tecnologicos", quantidade: 1, raridade: "Incomum", cor: "#36e0ff", icone: "☎", sprite: [2, 2], descricao: "Pequeno comunicador usado para registrar avisos e falhas do sistema beta." },
		{ id: "beta-dia-4", dia: 4, nome: "Capa do Testador da Aurora", tipo: "vestimentas", quantidade: 1, raridade: "Raro", cor: "#8f7bff", icone: "★", sprite: [4, 0], descricao: "Capa cosmética de beta tester, com brilho discreto em cenas de lobby." },
		{ id: "beta-dia-5", dia: 5, nome: "Caixa de Materiais do Estaleiro", tipo: "materiais", quantidade: 8, raridade: "Raro", cor: "#d79a5a", icone: "▣", sprite: [3, 2], descricao: "Madeira naval, rebites e tecido de vela para futuras melhorias de navio." },
		{ id: "beta-dia-6", dia: 6, nome: "Log Pose de Calibração Azul", tipo: "navegacao", quantidade: 1, raridade: "Épico", cor: "#3aa7ff", icone: "◆", sprite: [1, 1], descricao: "Instrumento experimental que ajuda a calibrar rotas e testes de viagem." },
		{ id: "beta-dia-7", dia: 7, nome: "Núcleo de Vontade do Beta Tester", tipo: "especiais", quantidade: 1, raridade: "Lendário", cor: "#ffcf3e", icone: "✦", sprite: [0, 2], descricao: "Relíquia lendária exclusiva da primeira semana beta. Não é Akuma no Mi e não é Meito." }
	];

	function lerJson(chave, padrao) {
		try { return JSON.parse(localStorage.getItem(chave) || "null") || padrao; } catch (erro) { return padrao; }
	}

	function salvarJson(chave, valor) {
		localStorage.setItem(chave, JSON.stringify(valor));
	}

	function carregarScriptUmaVez(src, id) {
		return new Promise(function (resolve, reject) {
			if (id && document.getElementById(id)) { resolve(); return; }
			var script = document.createElement("script");
			if (id) script.id = id;
			script.src = src;
			script.defer = true;
			script.onload = function () { resolve(); };
			script.onerror = function () { reject(new Error("Falha ao carregar " + src)); };
			document.head.appendChild(script);
		});
	}

	function carregarCssUmaVez(href, id) {
		if (id && document.getElementById(id)) return;
		var link = document.createElement("link");
		if (id) link.id = id;
		link.rel = "stylesheet";
		link.href = href;
		document.head.appendChild(link);
	}

	function carregarBibliotecasPremium() {
		carregarCssUmaVez("assets/vendor/nprogress/nprogress.css", "rpg-nprogress-css");
		carregarScriptUmaVez("assets/vendor/nprogress/nprogress.js", "rpg-nprogress-js").then(function () {
			if (window.NProgress) {
				window.NProgress.configure({ showSpinner: false, trickleSpeed: 90, minimum: 0.12 });
				window.NProgress.start();
				setTimeout(function () { window.NProgress.done(); }, 520);
			}
		}).catch(function (erro) { console.info("NProgress indisponivel.", erro); });
		carregarScriptUmaVez("assets/vendor/canvas-confetti/confetti.browser.js", "rpg-confetti-js").catch(function (erro) {
			console.info("Confetti indisponivel.", erro);
		});
	}

	function soltarConfetti(tipo) {
		if (typeof window.confetti !== "function") return;
		var base = { particleCount: tipo === "conquista" ? 90 : 56, spread: tipo === "conquista" ? 74 : 54, ticks: 150, scalar: 0.9, disableForReducedMotion: true };
		window.confetti({ ...base, origin: { x: 0.18, y: 0.72 }, colors: ["#90ff00", "#36e0ff", "#ffe28a"] });
		if (tipo === "conquista") {
			setTimeout(function () { window.confetti({ ...base, particleCount: 70, origin: { x: 0.82, y: 0.72 }, colors: ["#ffe28a", "#fff7df", "#8f7bff"] }); }, 120);
		}
	}

	function registrarNotificacao(titulo, texto, cor) {
		var lista = lerJson("rpg_notificacoes", []);
		lista.unshift({ titulo: titulo, texto: Array.isArray(texto) ? texto.join(" / ") : String(texto || ""), data: new Date().toLocaleString("pt-BR"), cor: cor || "#ffe28a" });
		salvarJson("rpg_notificacoes", lista.slice(0, 90));
	}

	function mostrarToast(titulo, linhas, cor, iconeTexto) {
		var pilha = document.getElementById("rpg-toast-stack");
		if (!pilha) {
			pilha = document.createElement("div");
			pilha.id = "rpg-toast-stack";
			pilha.className = "rpg-toast-stack";
			document.body.appendChild(pilha);
		}
		var toast = document.createElement("div");
		toast.className = "rpg-toast";
		toast.style.setProperty("--cor", cor || "#ffe28a");
		toast.innerHTML = "<i>" + (iconeTexto || "!") + "</i><span><strong>" + titulo + "</strong><span>" + (Array.isArray(linhas) ? linhas.join("<br>") : String(linhas || "")) + "</span></span>";
		pilha.appendChild(toast);
		setTimeout(function () { toast.classList.add("sumindo"); }, 3600);
		setTimeout(function () { toast.remove(); }, 3920);
	}

	function volumeSfx() {
		var salvo = localStorage.getItem("onePieceRpgVolumeSfx");
		var volume = salvo === null ? 70 : Number(salvo);
		return Math.max(0, Math.min(100, Number.isFinite(volume) ? volume : 70)) / 100;
	}

	var contextoAudioUi = null;
	var audioUiLiberado = false;
	function liberarAudioUi() {
		audioUiLiberado = true;
		if (contextoAudioUi && contextoAudioUi.state === "suspended") contextoAudioUi.resume();
	}

	function tocarUi(tipo) {
		try {
			if (!audioUiLiberado) return;
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			if (!AudioContext) return;
			if (!contextoAudioUi) contextoAudioUi = new AudioContext();
			if (contextoAudioUi.state === "suspended") contextoAudioUi.resume();
			var config = {
				hover: [520, 0.025, 0.025],
				confirmar: [740, 0.045, 0.04],
				recompensa: [880, 0.09, 0.055],
				erro: [180, 0.08, 0.04]
			}[tipo] || [420, 0.035, 0.035];
			var volume = volumeSfx();
			if (volume <= 0) return;
			var osc = contextoAudioUi.createOscillator();
			var ganho = contextoAudioUi.createGain();
			osc.type = tipo === "erro" ? "sawtooth" : "triangle";
			osc.frequency.setValueAtTime(config[0], contextoAudioUi.currentTime);
			if (tipo === "recompensa") osc.frequency.exponentialRampToValueAtTime(config[0] * 1.45, contextoAudioUi.currentTime + config[1]);
			ganho.gain.setValueAtTime(0.0001, contextoAudioUi.currentTime);
			ganho.gain.exponentialRampToValueAtTime(config[2] * volume, contextoAudioUi.currentTime + 0.008);
			ganho.gain.exponentialRampToValueAtTime(0.0001, contextoAudioUi.currentTime + config[1]);
			osc.connect(ganho);
			ganho.connect(contextoAudioUi.destination);
			osc.start();
			osc.stop(contextoAudioUi.currentTime + config[1] + 0.02);
		} catch (erro) {
			console.info("Audio de UI indisponivel.", erro);
		}
	}

	function instalarSonsUi() {
		document.addEventListener("pointerdown", liberarAudioUi, { once: true, capture: true });
		document.addEventListener("pointerover", function (evento) {
			if (!evento.target.closest("button,a,[role='button'],select,input[type='range']")) return;
			tocarUi("hover");
		}, true);
		document.addEventListener("click", function (evento) {
			if (!evento.target.closest("button,a,[role='button']")) return;
			tocarUi("confirmar");
		}, true);
	}

	function instalarLoadingInicial() {
		if (sessionStorage.getItem("rpg_loading_visto") === "sim") return;
		sessionStorage.setItem("rpg_loading_visto", "sim");
		var dicas = [
			"Rotas desbloqueadas aparecem primeiro no mapa dos mares.",
			"Missões e treinos alimentam seu nível, EXP e berris.",
			"Abra o Correio para coletar recompensas enviadas pelo sistema.",
			"Seu inventário registra histórico para evitar perda de itens."
		];
		var overlay = document.createElement("div");
		overlay.className = "rpg-loading";
		overlay.innerHTML =
			'<section class="rpg-loading-card" aria-label="Carregando jogo">' +
				'<div class="rpg-loading-logo" aria-hidden="true"></div>' +
				'<small>Carregando aventura</small>' +
				'<h2>One Piece RPG</h2>' +
				'<div class="rpg-loading-barra"><i></i></div>' +
				'<p class="rpg-loading-dica">' + dicas[Math.floor(Math.random() * dicas.length)] + '</p>' +
			'</section>';
		document.body.appendChild(overlay);
		setTimeout(function () {
			overlay.classList.add("saindo");
			setTimeout(function () { overlay.remove(); }, 320);
		}, 1050);
	}

	function transicionarPagina(destino) {
		if (!destino) return;
		if (window.NProgress) window.NProgress.start();
		var overlay = document.createElement("div");
		overlay.className = "rpg-transicao";
		overlay.innerHTML = "<span>Carregando rota</span>";
		document.body.appendChild(overlay);
		setTimeout(function () { window.location.href = destino; }, 180);
	}

	function verificarConquistas() {
		var personagem = obterPersonagem();
		if (!personagem || !personagem.nome) return;
		var progresso = progressoDo(personagem);
		var inventario = lerJson("inventario_" + personagem.nome, []);
		var correio = lerJson("rpg_correio", []);
		var salvas = lerJson("rpg_conquistas_" + personagem.nome, []);
		var conquistas = [
			{ id: "primeiro-login", ok: true, titulo: "Primeiro Login", texto: "Entrou no lobby do RPG.", cor: "#36e0ff" },
			{ id: "nivel-5", ok: Number(progresso.nivel || 1) >= 5, titulo: "Novato em Ascensao", texto: "Alcancou nivel 5.", cor: "#90ff00" },
			{ id: "primeiro-item", ok: inventario.length > 0, titulo: "Bolsa Aberta", texto: "Recebeu o primeiro item no inventario.", cor: "#ffe28a" },
			{ id: "correio-ativo", ok: correio.length > 0, titulo: "Den Den Ativo", texto: "Recebeu mensagens no correio.", cor: "#8f7bff" }
		];
		conquistas.forEach(function (c) {
			if (!c.ok || salvas.some(function (item) { return item.id === c.id; })) return;
			salvas.unshift({ id: c.id, titulo: c.titulo, texto: c.texto, cor: c.cor, quando: new Date().toLocaleString("pt-BR") });
			registrarNotificacao("Conquista desbloqueada", c.titulo, c.cor);
			mostrarToast("Conquista", [c.titulo, c.texto], c.cor, "◆");
			soltarConfetti("conquista");
		});
		salvarJson("rpg_conquistas_" + personagem.nome, salvas);
	}

	function instalarFeedback() {
		window.RpgFeedback = {
			recompensa: function (dados) {
				setTimeout(atualizarHudBattle, 120);
				var r = dados && dados.recompensas ? dados.recompensas : {};
				tocarUi("recompensa");
				mostrarToast(dados && dados.titulo ? dados.titulo : "Recompensa", ["+" + formatar(r.exp) + " EXP", "+" + formatar(r.berris) + " berris"], "#90ff00", "+");
				soltarConfetti("recompensa");
				registrarNotificacao("Recompensa recebida", dados && dados.titulo ? dados.titulo : "Atividade concluida", "#90ff00");
				document.querySelectorAll(".battle-hud-lobby,.painel-proxima-acao").forEach(function (el) { el.classList.remove("rpg-pulso-premio"); void el.offsetWidth; el.classList.add("rpg-pulso-premio"); });
				setTimeout(verificarConquistas, 220);
			},
			aviso: function (titulo, linhas) {
				tocarUi("confirmar");
				mostrarToast(titulo || "Aviso", linhas || "", "#ffe28a", "!");
				registrarNotificacao(titulo || "Aviso", linhas || "", "#ffe28a");
				setTimeout(verificarConquistas, 220);
			}
		};
	}

	function hojeChave() {
		var agora = new Date();
		return agora.getFullYear() + "-" + String(agora.getMonth() + 1).padStart(2, "0") + "-" + String(agora.getDate()).padStart(2, "0");
	}

	function instalarObjetivosLobby() {
		if (!document.body.classList.contains("pagina-formulario") || !document.querySelector(".container-lobby")) return;
		if (document.getElementById("rpg-objetivos")) return;
		var painel = document.getElementById("painel-proxima-acao") || document.querySelector(".painel-proxima-acao");
		if (!painel) return;
		var personagem = obterPersonagem();
		var progresso = progressoDo(personagem);
		var inventario = personagem?.nome ? lerJson("inventario_" + personagem.nome, []) : [];
		var objetivos = [
			{ nome: "Abrir mapa dos mares", valor: 1, alvo: 1 },
			{ nome: "Guardar 3 itens", valor: Math.min(3, inventario.length), alvo: 3 },
			{ nome: "Juntar 5.000 berris", valor: Math.min(5000, Number(progresso.berris || 0)), alvo: 5000 }
		];
		var bloco = document.createElement("div");
		bloco.id = "rpg-objetivos";
		bloco.className = "rpg-objetivos";
		bloco.innerHTML = "<h3>Objetivos rápidos</h3>" + objetivos.map(function (obj) {
			var pct = Math.max(0, Math.min(100, Math.round((obj.valor / obj.alvo) * 100)));
			return '<div class="rpg-objetivo"><span>' + obj.nome + '</span><small>' + obj.valor.toLocaleString("pt-BR") + "/" + obj.alvo.toLocaleString("pt-BR") + '</small><div class="rpg-objetivo-barra"><i style="width:' + pct + '%"></i></div></div>';
		}).join("");
		painel.appendChild(bloco);
	}

	function recompensaDiariaGame() {
		if (!document.body.classList.contains("pagina-formulario") || !document.querySelector(".container-lobby")) return;
		var personagem = obterPersonagem();
		if (!personagem || !personagem.nome || !window.RpgSistemas?.concluirAtividade) return;
		var chave = "rpg_recompensa_diaria_" + window.RpgSistemas.normalizar(personagem.nome);
		if (localStorage.getItem(chave) === hojeChave()) return;
		atualizarSequenciaDiaria(personagem, true);
		localStorage.setItem(chave, hojeChave());
		window.RpgSistemas.concluirAtividade(personagem, {
			tipo: "login-diario",
			titulo: "Baú diário aberto",
			rank: "E",
			periodo: "diarias",
			recompensas: { exp: 75, berris: 500, pontosAtributo: 1, pontosMissao: 1 }
		}).then(function () {
			registrarNotificacao("Baú diário", "75 EXP / 500 berris / 1 ponto", "#90ff00");
			setTimeout(instalarObjetivosLobby, 180);
		}).catch(function (erro) {
			console.warn("Falha na recompensa diaria:", erro);
		});
	}

	function dataAnterior(chaveData) {
		var partes = String(chaveData || "").split("-").map(Number);
		if (partes.length !== 3 || partes.some(function (n) { return !n; })) return "";
		var data = new Date(partes[0], partes[1] - 1, partes[2]);
		data.setDate(data.getDate() + 1);
		return data.getFullYear() + "-" + String(data.getMonth() + 1).padStart(2, "0") + "-" + String(data.getDate()).padStart(2, "0");
	}

	function chaveSequencia(personagem) {
		var nome = window.RpgSistemas?.normalizar ? window.RpgSistemas.normalizar(personagem && personagem.nome) : String(personagem && personagem.nome || "").toLowerCase();
		return "rpg_streak_" + nome;
	}

	function atualizarSequenciaDiaria(personagem, registrarHoje) {
		if (!personagem || !personagem.nome) return { sequencia: 0, melhor: 0, ultimo: "" };
		var chave = chaveSequencia(personagem);
		var dados = lerJson(chave, { sequencia: 0, melhor: 0, ultimo: "" });
		var hoje = hojeChave();
		if (registrarHoje && dados.ultimo !== hoje) {
			dados.sequencia = dataAnterior(dados.ultimo) === hoje ? Number(dados.sequencia || 0) + 1 : 1;
			dados.melhor = Math.max(Number(dados.melhor || 0), dados.sequencia);
			dados.ultimo = hoje;
			salvarJson(chave, dados);
		}
		return dados;
	}

	function instalarPasseLobby() {
		if (!document.body.classList.contains("pagina-formulario") || !document.querySelector(".container-lobby")) return;
		if (document.getElementById("rpg-passe-lobby")) return;
		var painel = document.getElementById("painel-proxima-acao") || document.querySelector(".painel-proxima-acao");
		if (!painel) return;
		var personagem = obterPersonagem();
		var progresso = progressoDo(personagem);
		var sequencia = atualizarSequenciaDiaria(personagem, false);
		var nivel = Math.max(1, Math.min(20, Math.floor(Number(progresso.expTotal || progresso.exp || progresso.expDisponivel || 0) / 250) + 1));
		var pct = Math.max(0, Math.min(100, Math.round((nivel / 20) * 100)));
		var bloco = document.createElement("div");
		bloco.id = "rpg-passe-lobby";
		bloco.className = "rpg-passe-lobby";
		bloco.innerHTML =
			"<h3>Passe de temporada</h3>" +
			'<div class="rpg-passe-meta">' +
				"<span><strong>" + nivel + "/20</strong>Progresso</span>" +
				"<span><strong>" + formatar(sequencia.sequencia) + " dia(s)</strong>Sequência</span>" +
				"<span><strong>" + formatar(sequencia.melhor) + " dia(s)</strong>Melhor marca</span>" +
			"</div>" +
			'<div class="rpg-passe-barra"><i style="width:' + pct + '%"></i></div>';
		painel.appendChild(bloco);
	}

	function textoSalvamento() {
		var personagem = obterPersonagem();
		var temBackup = Boolean(localStorage.getItem("personagensCriadosBackup"));
		if (!personagem || !personagem.nome) return "Sem personagem ativo";
		if (!navigator.onLine) return "Offline / salvo local";
		return temBackup ? "Online / backup protegido" : "Online / salvo local";
	}

	function instalarStatusSalvamento() {
		if (document.getElementById("rpg-save-status")) return;
		var status = document.createElement("div");
		status.id = "rpg-save-status";
		status.className = "rpg-save-status";
		status.innerHTML = "<i></i><span>Salvamento</span>";
		document.body.appendChild(status);

		function atualizar() {
			status.classList.toggle("offline", !navigator.onLine);
			status.querySelector("span").textContent = textoSalvamento();
		}

		window.addEventListener("online", atualizar);
		window.addEventListener("offline", atualizar);
		window.addEventListener("storage", atualizar);
		setInterval(atualizar, 4000);
		atualizar();
	}

	function instalarPatchNotes(forcar) {
		var versao = "20260619-pro4";
		var chave = "rpg_patch_notes_" + versao;
		if (!forcar && localStorage.getItem(chave) === "visto") return;
		var existente = document.getElementById("rpg-patch-notes");
		if (existente) existente.remove();
		var modal = document.createElement("div");
		modal.id = "rpg-patch-notes";
		modal.className = "rpg-patch-notes";
		modal.innerHTML =
			'<section class="rpg-patch-card" role="dialog" aria-modal="true" aria-label="Novidades da versão">' +
				"<header><small>Atualização instalada</small><h2>Versão Pro</h2></header>" +
				'<div class="rpg-patch-lista">' +
					'<div class="rpg-patch-item"><strong>Launcher profissional</strong><span>Ctrl+K ou / abre comandos rápidos igual jogo online moderno.</span></div>' +
					'<div class="rpg-patch-item"><strong>Efeitos premium</strong><span>Confete em recompensa/conquista, barra NProgress e partículas de atmosfera instaladas localmente.</span></div>' +
					'<div class="rpg-patch-item"><strong>Menu SYS</strong><span>Configurações, tela cheia, instalação do app e atualização manual em qualquer página.</span></div>' +
					'<div class="rpg-patch-item"><strong>Salvamento visível</strong><span>Status online/offline e proteção de backup para personagens cadastrados.</span></div>' +
					'<div class="rpg-patch-item"><strong>Passe e sequência</strong><span>Lobby mostra progresso de temporada e sequência diária para parecer jogo vivo.</span></div>' +
					'<div class="rpg-patch-item"><strong>Polimento de áudio</strong><span>SFX de interface agora tem volume próprio no sistema.</span></div>' +
				"</div>" +
				'<div class="rpg-patch-acoes"><button type="button" data-patch-fechar>Fechar</button><button class="principal" type="button" data-patch-sistema>Abrir SYS</button></div>' +
			"</section>";
		document.body.appendChild(modal);
		localStorage.setItem(chave, "visto");
		modal.querySelector("[data-patch-fechar]").onclick = function () { modal.remove(); };
		modal.querySelector("[data-patch-sistema]").onclick = function () {
			modal.remove();
			abrirMenuSistema();
		};
	}

	function instalarMenuSistema() {
		if (document.getElementById("rpg-sistema-botao")) return;
		var botao = document.createElement("button");
		botao.id = "rpg-sistema-botao";
		botao.className = "rpg-sistema-botao";
		botao.type = "button";
		botao.title = "Sistema";
		botao.textContent = "SYS";
		botao.addEventListener("click", abrirMenuSistema);
		document.body.appendChild(botao);
	}

	function abrirMenuSistema() {
		var modal = document.getElementById("rpg-modal-sistema");
		if (modal) modal.remove();
		var personagem = obterPersonagem();
		var progresso = progressoDo(personagem);
		var sequencia = atualizarSequenciaDiaria(personagem, false);
		var volumeMusica = localStorage.getItem("onePieceRpgVolumeMusica");
		var volumeSons = Math.round(volumeSfx() * 100);
		modal = document.createElement("div");
		modal.id = "rpg-modal-sistema";
		modal.className = "rpg-modal-sistema";
		modal.innerHTML =
			'<section class="rpg-sistema-card" role="dialog" aria-modal="true" aria-label="Sistema do jogo">' +
				'<header class="rpg-sistema-topo"><div><small>Central do jogo</small><h2>Sistema</h2></div><button class="rpg-sistema-fechar" type="button" aria-label="Fechar">x</button></header>' +
				'<div class="rpg-sistema-corpo">' +
					'<section class="rpg-sistema-bloco"><h3>Perfil ativo</h3>' +
						'<div class="rpg-sistema-linha"><span>Personagem</span><strong>' + (personagem?.nome || "Nenhum") + '</strong></div>' +
						'<div class="rpg-sistema-linha"><span>Nível</span><strong>' + formatar(progresso.nivel || 1) + '</strong></div>' +
						'<div class="rpg-sistema-linha"><span>Berris</span><strong>' + formatar(progresso.berris || 0) + '</strong></div>' +
						'<div class="rpg-sistema-linha"><span>Sequência</span><strong>' + formatar(sequencia.sequencia) + ' dia(s)</strong></div>' +
					'</section>' +
					'<section class="rpg-sistema-bloco"><h3>Salvamento</h3>' +
						'<div class="rpg-sistema-linha"><span>Status</span><strong>' + textoSalvamento() + '</strong></div>' +
						'<div class="rpg-sistema-linha"><span>Rede</span><strong>' + (navigator.onLine ? "Online" : "Offline") + '</strong></div>' +
						'<div class="rpg-sistema-linha"><span>Cache</span><strong>v15</strong></div>' +
						'<div class="rpg-sistema-acoes"><button type="button" data-sistema-atualizar>Atualizar app</button><button type="button" data-sistema-notes>Novidades</button></div>' +
					'</section>' +
					'<section class="rpg-sistema-bloco"><h3>Áudio</h3>' +
						'<label class="rpg-sistema-range">Música <input type="range" min="0" max="100" value="' + (volumeMusica === null ? 50 : Number(volumeMusica)) + '" data-sistema-musica></label>' +
						'<label class="rpg-sistema-range">SFX <input type="range" min="0" max="100" value="' + volumeSons + '" data-sistema-sfx></label>' +
					'</section>' +
					'<section class="rpg-sistema-bloco"><h3>Ações rápidas</h3>' +
						'<div class="rpg-sistema-acoes"><button class="principal" type="button" data-sistema-comandos>Comandos</button><button type="button" data-sistema-fullscreen>Tela cheia</button><button type="button" data-sistema-instalar>Instalar app</button><button type="button" data-sistema-lobby>Lobby</button><button type="button" data-sistema-perfil>Perfil</button></div>' +
					'</section>' +
				'</div>' +
			'</section>';
		document.body.appendChild(modal);
		modal.querySelector(".rpg-sistema-fechar").onclick = function () { modal.remove(); };
		modal.addEventListener("click", function (evento) { if (evento.target === modal) modal.remove(); });
		modal.querySelector("[data-sistema-musica]").oninput = function (evento) {
			localStorage.setItem("onePieceRpgVolumeMusica", String(evento.target.value));
			var audio = document.getElementById("musica-fundo");
			if (audio) {
				audio.volume = Number(evento.target.value) / 100;
				audio.muted = Number(evento.target.value) <= 0;
			}
		};
		modal.querySelector("[data-sistema-sfx]").oninput = function (evento) {
			localStorage.setItem("onePieceRpgVolumeSfx", String(evento.target.value));
			tocarUi("confirmar");
		};
		modal.querySelector("[data-sistema-fullscreen]").onclick = function () {
			if (document.fullscreenElement) document.exitFullscreen();
			else document.documentElement.requestFullscreen?.();
		};
		modal.querySelector("[data-sistema-instalar]").onclick = function () {
			if (window.OnePieceAppInstall?.install) window.OnePieceAppInstall.install();
			else mostrarToast("Instalação", "Use o botão de download do app.", "#ffe28a", "!");
		};
		modal.querySelector("[data-sistema-atualizar]").onclick = function () {
			if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistration().then(function (reg) { if (reg) reg.update(); });
			location.reload();
		};
		modal.querySelector("[data-sistema-notes]").onclick = function () { instalarPatchNotes(true); };
		modal.querySelector("[data-sistema-comandos]").onclick = function () { modal.remove(); abrirComandos(); };
		modal.querySelector("[data-sistema-lobby]").onclick = function () { transicionarPagina("lobby.html"); };
		modal.querySelector("[data-sistema-perfil]").onclick = function () { transicionarPagina("perfil.html"); };
	}

	function comandosPremium() {
		return [
			{ id: "lobby", titulo: "Lobby", desc: "Voltar para a central do personagem", destino: "lobby.html", acao: "aventura", tecla: "L" },
			{ id: "aventura", titulo: "Mapa dos mares", desc: "Abrir seleção de rotas e viagem", destino: "aventura.html", acao: "aventura", tecla: "M" },
			{ id: "perfil", titulo: "Perfil completo", desc: "Ver ficha e progresso do jogador", destino: "perfil.html", acao: "perfil", tecla: "P" },
			{ id: "inventario", titulo: "Inventário", desc: "Itens, categorias e histórico", destino: "inventario.html", acao: "inventario", tecla: "I" },
			{ id: "missoes", titulo: "Missões", desc: "Concluir tarefas e receber recompensa", destino: "missoes.html", acao: "missoes", tecla: "Q" },
			{ id: "treinos", titulo: "Treinos", desc: "Evoluir EXP, berris e atributos", destino: "treinos.html", acao: "treinos", tecla: "T" },
			{ id: "habilidades", titulo: "Habilidades", desc: "Abrir árvore de progressão", destino: "habilidades.html", acao: "habilidades", tecla: "H" },
			{ id: "correio", titulo: "Correio", desc: "Coletar mensagens e anexos", destino: "correio.html", acao: "correio", tecla: "C" },
			{ id: "sistema", titulo: "Sistema", desc: "Configurações, áudio e instalação", fn: abrirMenuSistema, acao: "ajustes", tecla: "S" }
		];
	}

	function executarComando(comando) {
		if (!comando) return;
		tocarUi("confirmar");
		if (typeof comando.fn === "function") comando.fn();
		else transicionarPagina(comando.destino);
	}

	function abrirComandos() {
		var modal = document.getElementById("rpg-comando-overlay");
		if (modal) {
			modal.hidden = false;
			var entrada = modal.querySelector("input");
			if (entrada) { entrada.value = ""; entrada.focus(); renderizarComandos(""); }
			return;
		}
		modal = document.createElement("div");
		modal.id = "rpg-comando-overlay";
		modal.className = "rpg-comando-overlay";
		modal.innerHTML =
			'<section class="rpg-comando-card" role="dialog" aria-modal="true" aria-label="Comandos rápidos">' +
				'<div class="rpg-comando-busca"><span>⌘</span><input type="search" placeholder="Buscar ação, página ou sistema..." autocomplete="off"><button type="button" aria-label="Fechar">x</button></div>' +
				'<div class="rpg-comando-lista" id="rpg-comando-lista"></div>' +
			"</section>";
		document.body.appendChild(modal);
		var entrada = modal.querySelector("input");
		var fechar = modal.querySelector("button");
		fechar.onclick = function () { modal.hidden = true; };
		modal.addEventListener("click", function (evento) { if (evento.target === modal) modal.hidden = true; });
		entrada.addEventListener("input", function () { renderizarComandos(entrada.value); });
		entrada.addEventListener("keydown", function (evento) {
			var atual = modal.querySelector(".rpg-comando-item.ativo") || modal.querySelector(".rpg-comando-item");
			if (evento.key === "Enter" && atual) {
				evento.preventDefault();
				var comando = comandosPremium().find(function (item) { return item.id === atual.dataset.comando; });
				modal.hidden = true;
				executarComando(comando);
			}
			if (evento.key === "Escape") modal.hidden = true;
		});
		renderizarComandos("");
		entrada.focus();
	}

	function renderizarComandos(filtro) {
		var lista = document.getElementById("rpg-comando-lista");
		if (!lista) return;
		var termo = String(filtro || "").trim().toLowerCase();
		var comandos = comandosPremium().filter(function (cmd) {
			return !termo || (cmd.titulo + " " + cmd.desc + " " + cmd.tecla).toLowerCase().includes(termo);
		});
		lista.innerHTML = comandos.map(function (cmd, indice) {
			return '<button type="button" class="rpg-comando-item' + (indice === 0 ? " ativo" : "") + '" data-comando="' + cmd.id + '">' +
				'<img src="' + icone(cmd.acao) + '" alt="">' +
				"<span><strong>" + cmd.titulo + "</strong><small>" + cmd.desc + "</small></span>" +
			"<kbd>Alt+" + cmd.tecla + "</kbd>" +
			"</button>";
		}).join("") || '<div class="rpg-comando-item"><span></span><span><strong>Nada encontrado</strong><small>Tente outro termo.</small></span></div>';
		lista.querySelectorAll("[data-comando]").forEach(function (botao) {
			botao.onclick = function () {
				var comando = comandosPremium().find(function (item) { return item.id === botao.dataset.comando; });
				document.getElementById("rpg-comando-overlay").hidden = true;
				executarComando(comando);
			};
		});
	}

	function instalarHotkeys() {
		if (document.getElementById("rpg-hotkeys")) return;
		var dicas = document.createElement("div");
		dicas.id = "rpg-hotkeys";
		dicas.className = "rpg-hotkeys";
		dicas.innerHTML = "<span>Ctrl+K comandos</span><span>Alt+M mapa</span>";
		document.body.appendChild(dicas);
		document.addEventListener("keydown", function (evento) {
			var tag = String(evento.target && evento.target.tagName || "").toLowerCase();
			if (tag === "input" || tag === "textarea" || tag === "select") return;
			if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === "k") {
				evento.preventDefault();
				abrirComandos();
				return;
			}
			if (evento.key === "/") {
				evento.preventDefault();
				abrirComandos();
				return;
			}
			if (evento.altKey && evento.key.toLowerCase() === "f") {
				if (document.fullscreenElement) document.exitFullscreen();
				else document.documentElement.requestFullscreen?.();
			}
			var comando = comandosPremium().find(function (cmd) { return cmd.tecla.toLowerCase() === evento.key.toLowerCase(); });
			if (comando && evento.altKey && !evento.ctrlKey && !evento.metaKey) {
				evento.preventDefault();
				executarComando(comando);
			}
		});
	}

	function instalarAmbientePremium() {
		if (document.getElementById("rpg-ambiente-canvas")) return;
		var canvas = document.createElement("canvas");
		canvas.id = "rpg-ambiente-canvas";
		canvas.className = "rpg-ambiente-canvas";
		document.body.prepend(canvas);
		var ctx = canvas.getContext("2d");
		var particulas = [];
		var reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		function redimensionar() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			particulas = Array.from({ length: Math.min(72, Math.max(24, Math.round(canvas.width / 28))) }, function (_, i) {
				return {
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					r: 0.8 + Math.random() * 2.4,
					v: 0.12 + Math.random() * 0.34,
					c: i % 3 === 0 ? "rgba(144,255,0,.54)" : i % 3 === 1 ? "rgba(54,224,255,.42)" : "rgba(255,226,138,.38)"
				};
			});
		}
		function animar() {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			particulas.forEach(function (p) {
				p.y -= p.v;
				p.x += Math.sin((Date.now() * 0.001) + p.y * 0.01) * 0.08;
				if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
				ctx.beginPath();
				ctx.fillStyle = p.c;
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
			});
			if (!reduzir) requestAnimationFrame(animar);
		}
		window.addEventListener("resize", redimensionar);
		redimensionar();
		animar();
	}

	function premioBetaDisponivel() {
		var umDia = 24 * 60 * 60 * 1000;
		var inicioChave = "rpg_beta_inicio";
		var inicio = Number(localStorage.getItem(inicioChave) || Date.now());
		localStorage.setItem(inicioChave, String(inicio));
		var dia = Math.max(1, Math.min(7, Math.floor((Date.now() - inicio) / umDia) + 1));
		var enviados = lerJson("rpg_beta_enviados_correio", []);
		return recompensasBetaLogin.find(function (premio) {
			return premio.dia <= dia && !enviados.includes(premio.id);
		});
	}

	function enviarPremioBetaParaCorreio(premio) {
		if (!premio) return;
		var enviados = lerJson("rpg_beta_enviados_correio", []);
		if (enviados.includes(premio.id)) return;
		var correio = lerJson("rpg_correio", []);
		var mensagem = {
			id: premio.id + "-" + Date.now(),
			para: "Beta Tester",
			tipo: "Prêmio Beta",
			texto: "Dia " + premio.dia + ": " + premio.nome + ". Abra este anexo para enviar ao inventário.",
			data: new Date().toLocaleString("pt-BR"),
			anexo: {
				origem: "Semana Beta Tester",
				recompensaId: premio.id,
				nome: premio.nome,
				tipo: premio.tipo,
				quantidade: premio.quantidade,
				descricao: premio.descricao + " Raridade: " + premio.raridade + ".",
				sprite: premio.sprite,
				raridade: premio.raridade
			},
			coletado: false
		};
		salvarJson("rpg_correio", [mensagem].concat(correio).slice(0, 80));
		salvarJson("rpg_beta_enviados_correio", enviados.concat(premio.id));
		if (window.RpgFeedback && window.RpgFeedback.aviso) window.RpgFeedback.aviso("Prêmio enviado", [premio.nome, "Abra o Correio para coletar."]);
	}

	function abrirLoginDiarioBeta() {
		if (!document.body.classList.contains("pagina-formulario") || !document.querySelector(".container-lobby")) return;
		if (document.getElementById("login-beta-overlay")) return;
		var premio = premioBetaDisponivel();
		if (!premio) return;
		var overlay = document.createElement("div");
		overlay.id = "login-beta-overlay";
		overlay.className = "login-beta-overlay";
		overlay.innerHTML =
			'<section class="login-beta-card" role="dialog" aria-modal="true" aria-label="Login diário beta">' +
				'<header class="login-beta-topo"><div><small>Login diário</small><h2>Prêmio Beta</h2></div><button class="login-beta-fechar" type="button" aria-label="Fechar">x</button></header>' +
				'<div class="login-beta-premio" style="--cor:' + premio.cor + '">' +
					'<div class="login-beta-arte" aria-hidden="true">' + premio.icone + '</div>' +
					'<div><h3>Dia ' + premio.dia + " - " + premio.nome + '</h3><p>' + premio.descricao + '</p><div class="login-beta-meta"><span>' + premio.raridade + '</span><span>x' + premio.quantidade + '</span><span>Vai para o Correio</span></div></div>' +
				'</div>' +
				'<div class="login-beta-acoes"><button class="principal" type="button" data-beta-resgatar>Enviar ao Correio</button><a href="beta-recompensas.html">Ver 7 dias</a></div>' +
			'</section>';
		document.body.appendChild(overlay);
		overlay.querySelector(".login-beta-fechar").onclick = function () { overlay.remove(); };
		overlay.querySelector("[data-beta-resgatar]").onclick = function () {
			enviarPremioBetaParaCorreio(premio);
			overlay.remove();
		};
	}

	function iniciarAudio() {
		var audio = document.getElementById("musica-fundo");
		if (!audio) return;
		var chave = "onePieceRpgVolumeMusica";
		var controleSom = document.getElementById("controle-som");
		var botaoSom = document.getElementById("botao-som");
		var volumeMusica = document.getElementById("volume-musica");
		function aplicar(valor) {
			var volume = Math.max(0, Math.min(Number(valor) || 0, 100));
			audio.volume = volume / 100;
			audio.muted = volume === 0;
			localStorage.setItem(chave, String(volume));
			if (volumeMusica) volumeMusica.value = String(volume);
		}
		function tocar() {
			audio.play().catch(function () {
				document.addEventListener("pointerdown", tocar, { once: true });
			});
		}
		aplicar(localStorage.getItem(chave) === null ? 50 : localStorage.getItem(chave));
		if (botaoSom && controleSom) {
			botaoSom.addEventListener("click", function () {
				var visivel = controleSom.classList.toggle("visivel");
				controleSom.setAttribute("aria-hidden", visivel ? "false" : "true");
				tocar();
			});
		}
		if (volumeMusica) volumeMusica.addEventListener("input", function () { aplicar(volumeMusica.value); tocar(); });
		tocar();
	}

	function corrigirDownloadNoMenu() {
		var palavraAntiga = "Tut" + "orial";
		var chaveAntiga = "menu." + palavraAntiga.toLowerCase();
		var idAntigo = "botao-" + palavraAntiga.toLowerCase();
		var botoes = document.querySelectorAll("button, a");

		botoes.forEach(function (botao) {
			var texto = (botao.textContent || "").trim();
			var chave = botao.getAttribute("data-i18n") || "";
			if (texto !== palavraAntiga && chave !== chaveAntiga && botao.id !== idAntigo) return;

			botao.id = "botao-download-app";
			botao.removeAttribute("data-i18n");
			botao.textContent = "Download";
			botao.addEventListener("click", function (evento) {
				evento.preventDefault();
				window.location.href = "download.html";
			});
		});
	}

	function iniciar() {
		instalarPwa();
		corrigirDownloadNoMenu();
		instalarCss();
		carregarBibliotecasPremium();
		instalarAmbientePremium();
		instalarLoadingInicial();
		instalarSonsUi();
		carregarRpgSistemas();
		injetarAtalhos();
		substituirFichaLobby();
		instalarObjetivosLobby();
		atualizarIcones();
		habilitarScroll();
		decorarBiblioteca();
		instalarFeedback();
		instalarStatusSalvamento();
		instalarMenuSistema();
		instalarHotkeys();
		atualizarHudBattle();
		setTimeout(recompensaDiariaGame, 650);
		setTimeout(abrirLoginDiarioBeta, 450);
		setTimeout(instalarPasseLobby, 820);
		setTimeout(instalarPatchNotes, 1100);
		iniciarAudio();
		setTimeout(instalarObjetivosLobby, 900);
		setTimeout(corrigirDownloadNoMenu, 300);
		setInterval(atualizarHudBattle, 1000);
	}

	document.addEventListener("click", navegar, true);
	onReady(iniciar);
})();
