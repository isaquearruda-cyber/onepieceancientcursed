const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
	"Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders });
	}

	if (req.method !== "POST") {
		return new Response(JSON.stringify({ erro: "Metodo nao permitido." }), {
			status: 405,
			headers: { ...corsHeaders, "Content-Type": "application/json" }
		});
	}

	const resendApiKey = Deno.env.get("RESEND_API_KEY");
	const emailOrigem = Deno.env.get("RECOVERY_EMAIL_FROM") || "One Piece RPG <onboarding@resend.dev>";

	if (!resendApiKey) {
		return new Response(JSON.stringify({ erro: "RESEND_API_KEY nao configurada." }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" }
		});
	}

	try {
		const corpo = await req.json();
		const destinatario = String(corpo.to || "").trim().toLowerCase();
		const codigo = String(corpo.code || "").trim();
		const personagem = String(corpo.personagem || "personagem").trim();

		if (!destinatario.endsWith("@gmail.com") || !/^\d{6}$/.test(codigo)) {
			return new Response(JSON.stringify({ erro: "Dados invalidos." }), {
				status: 400,
				headers: { ...corsHeaders, "Content-Type": "application/json" }
			});
		}

		const resposta = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${resendApiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				from: emailOrigem,
				to: destinatario,
				subject: "Codigo de recuperacao de senha - One Piece RPG",
				html: `
					<div style="font-family:Arial,sans-serif;color:#141414">
						<h2>Recuperacao de senha</h2>
						<p>Codigo para redefinir a senha do personagem <strong>${personagem}</strong>:</p>
						<p style="font-size:28px;font-weight:700;letter-spacing:6px">${codigo}</p>
						<p>O codigo expira em 10 minutos. Se voce nao pediu isso, ignore este e-mail.</p>
					</div>
				`
			})
		});

		const dados = await resposta.json().catch(() => ({}));

		if (!resposta.ok) {
			return new Response(JSON.stringify({ erro: "Falha ao enviar e-mail.", detalhes: dados }), {
				status: 502,
				headers: { ...corsHeaders, "Content-Type": "application/json" }
			});
		}

		return new Response(JSON.stringify({ ok: true, id: dados.id || null }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" }
		});
	} catch (erro) {
		return new Response(JSON.stringify({ erro: "Erro inesperado.", detalhes: String(erro) }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" }
		});
	}
});
