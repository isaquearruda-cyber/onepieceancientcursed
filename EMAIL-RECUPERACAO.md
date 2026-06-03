# Envio real do codigo de recuperacao

O site ja chama esta Edge Function:

```txt
https://yornxuikmoqxwabpnmdd.supabase.co/functions/v1/enviar-codigo-recuperacao
```

Enquanto a funcao nao estiver implantada/configurada, o site mostra o codigo na tela em modo teste.

## 1. Criar chave no Resend

1. Acesse https://resend.com
2. Crie uma conta.
3. Va em **API Keys**.
4. Crie uma chave.

## 2. Instalar/entrar no Supabase CLI

No terminal:

```bash
npm install -g supabase
supabase login
```

## 3. Configurar secrets

```bash
supabase secrets set RESEND_API_KEY=SUA_CHAVE_RESEND --project-ref yornxuikmoqxwabpnmdd
```

Opcional, se tiver dominio verificado no Resend:

```bash
supabase secrets set RECOVERY_EMAIL_FROM="One Piece RPG <noreply@seudominio.com>" --project-ref yornxuikmoqxwabpnmdd
```

Sem dominio verificado, a funcao usa `One Piece RPG <onboarding@resend.dev>`.

## 4. Deploy da funcao

Na raiz do projeto:

```bash
supabase functions deploy enviar-codigo-recuperacao --project-ref yornxuikmoqxwabpnmdd --no-verify-jwt
```

Depois disso, a recuperacao de senha envia o codigo por e-mail real.
