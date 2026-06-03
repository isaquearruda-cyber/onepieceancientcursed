create table if not exists personagens (
	id text primary key,
	nome text not null,
	dados jsonb not null,
	criado_em timestamptz not null default now(),
	atualizado_em timestamptz not null default now()
);

alter table personagens enable row level security;

drop policy if exists "personagens_select_publico" on personagens;
create policy "personagens_select_publico"
on personagens
for select
using (true);

drop policy if exists "personagens_insert_publico" on personagens;
create policy "personagens_insert_publico"
on personagens
for insert
with check (true);

drop policy if exists "personagens_update_publico" on personagens;
create policy "personagens_update_publico"
on personagens
for update
using (true)
with check (true);

drop policy if exists "personagens_delete_publico" on personagens;
create policy "personagens_delete_publico"
on personagens
for delete
using (true);
