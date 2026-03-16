# Barbearia Pro (Next.js + Supabase + Vercel)

Sistema de barbearia com:
- Login Google ou e-mail/senha para loja/funcionários e clientes.
- Cadastro de funcionários + dias de trabalho.
- Cadastro de serviços.
- Calendário de funcionamento.
- Visualização de agendas.
- Fluxo de cliente para escolher serviço + funcionário + horário disponível.

## Stack (opções gratuitas)
- **GitHub Free**: repositório do código.
- **Supabase Free**: banco PostgreSQL + autenticação (Google/e-mail).
- **Vercel Hobby (free)**: hospedagem do app Next.js.

## 1) Configurar Supabase
1. Crie um projeto no Supabase.
2. Em **SQL Editor**, execute `sql/schema.sql`.
3. Em **Authentication > Providers**, habilite Google e Email.
4. Em **Authentication > URL Configuration**, adicione:
   - Site URL: URL da Vercel.
   - Redirect URL: `https://SEU_DOMINIO/dashboard`
5. Crie usuário admin/funcionário e ajuste role manualmente em `profiles.role`.

## 2) Rodar local
```bash
npm install
cp .env.example .env.local
# preencher NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## 3) Deploy Vercel
1. Suba para GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente do `.env.example`.
4. Deploy.

## Rotas
- `/login`: autenticação (Google/e-mail).
- `/dashboard`: painel loja/funcionários.
- `/dashboard/funcionarios`: cadastro de funcionários e dias trabalhados.
- `/dashboard/servicos`: cadastro de serviços.
- `/dashboard/calendario`: calendário/horário de funcionamento.
- `/dashboard/agendas`: visualização de agendas.
- `/cliente/agendar`: fluxo de agendamento do cliente.

## Observações
- O cálculo de disponibilidade considera: horário de funcionamento + dias do funcionário + bloqueio por agendamento existente.
- O MVP não inclui pagamentos e notificações (pode ser adicionado depois).
