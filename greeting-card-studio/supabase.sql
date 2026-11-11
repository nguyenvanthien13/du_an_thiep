-- Run in Supabase SQL Editor. Share links are bearer links: anyone with the token can view.
create extension if not exists pgcrypto;
create table public.cards (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null default 'Thiệp của tôi',
 design jsonb not null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table public.card_shares (
 id uuid primary key default gen_random_uuid(),
 card_id uuid not null references public.cards(id) on delete cascade,
 token uuid not null unique default gen_random_uuid(),
 created_at timestamptz not null default now(),
 expires_at timestamptz
);
create index on public.cards(owner_id);
create index on public.card_shares(card_id);
alter table public.cards enable row level security;
alter table public.card_shares enable row level security;
create policy "Owners can read cards" on public.cards for select to authenticated using (owner_id = (select auth.uid()));
create policy "Owners can insert cards" on public.cards for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "Owners can update cards" on public.cards for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "Owners can delete cards" on public.cards for delete to authenticated using (owner_id = (select auth.uid()));
create policy "Owners can read shares" on public.card_shares for select to authenticated using (exists(select 1 from public.cards where cards.id=card_id and cards.owner_id=(select auth.uid())));
create policy "Owners can create shares" on public.card_shares for insert to authenticated with check (exists(select 1 from public.cards where cards.id=card_id and cards.owner_id=(select auth.uid())));
create policy "Owners can revoke shares" on public.card_shares for delete to authenticated using (exists(select 1 from public.cards where cards.id=card_id and cards.owner_id=(select auth.uid())));
create or replace function public.get_shared_card(share_token uuid)
returns table(title text, design jsonb)
language sql security definer set search_path = ''
as $$
 select c.title,c.design from public.card_shares s join public.cards c on c.id=s.card_id
 where s.token=share_token and (s.expires_at is null or s.expires_at>now()) limit 1;
$$;
revoke all on function public.get_shared_card(uuid) from public;
grant execute on function public.get_shared_card(uuid) to anon, authenticated;
