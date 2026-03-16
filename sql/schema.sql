-- Execute no SQL Editor do Supabase
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'cliente' check (role in ('admin','funcionario','cliente')),
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.funcionarios (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  nome text not null,
  dias_trabalho int[] not null default '{}',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.servicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  duracao_min int not null check (duracao_min > 0),
  preco numeric(10,2) not null check (preco >= 0),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.funcionamento (
  id uuid primary key default gen_random_uuid(),
  dia_semana int unique not null check (dia_semana between 0 and 6),
  abre time not null,
  fecha time not null,
  ativo boolean not null default true
);

create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id),
  funcionario_id uuid not null references public.funcionarios(id),
  servico_id uuid not null references public.servicos(id),
  inicio timestamptz not null,
  fim timestamptz not null,
  status text not null default 'agendado' check (status in ('agendado','cancelado','concluido')),
  observacao text,
  created_at timestamptz not null default now(),
  constraint horario_valido check (fim > inicio)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.funcionarios enable row level security;
alter table public.servicos enable row level security;
alter table public.funcionamento enable row level security;
alter table public.agendamentos enable row level security;

create policy "public_read_funcionarios" on public.funcionarios for select using (true);
create policy "public_read_servicos" on public.servicos for select using (true);
create policy "public_read_funcionamento" on public.funcionamento for select using (true);

create policy "user_read_own_profile" on public.profiles for select using (auth.uid() = id);
create policy "user_update_own_profile" on public.profiles for update using (auth.uid() = id);

create policy "users_can_read_agendamentos" on public.agendamentos
for select using (
  auth.uid() = cliente_id
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin','funcionario')
  )
);

create policy "users_can_create_own_agendamentos" on public.agendamentos
for insert with check (auth.uid() = cliente_id);

create policy "staff_manage_core_tables" on public.funcionarios
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','funcionario'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','funcionario'))
);

create policy "staff_manage_servicos" on public.servicos
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','funcionario'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','funcionario'))
);

create policy "staff_manage_funcionamento" on public.funcionamento
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','funcionario'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','funcionario'))
);
