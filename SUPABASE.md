# Banco geral dos personagens

Este site ja esta preparado para salvar personagens em um banco online Supabase.

## 1. Criar projeto

Crie um projeto em https://supabase.com.

## 2. Criar tabela

No painel do Supabase, abra **SQL Editor**, cole o conteudo de `supabase-setup.sql` e execute.

## 3. Colocar as chaves no site

No Supabase, abra **Project Settings > API** e copie:

- Project URL
- anon public key

Depois edite `supabase-config.js`:

```js
window.SUPABASE_CONFIG = {
	url: "https://SEU-PROJETO.supabase.co",
	anonKey: "SUA_ANON_PUBLIC_KEY"
};
```

## Observacao

Com essas politicas, qualquer pessoa que abrir o site consegue criar, editar e apagar personagens pela API publica do site. Isso combina com o sistema atual, que ainda nao tem login real no servidor.

Para bloquear edicao indevida de verdade, o proximo passo e criar autenticacao no Supabase e regras por usuario.
