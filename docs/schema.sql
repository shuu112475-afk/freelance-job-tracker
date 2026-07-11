-- Supabase SQL Editor で実行する jobs テーブル定義（RLS込み）

create table public.jobs (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,

  title              text not null,
  url                text,
  client_name        text,
  reward_amount      integer,
  memo               text,

  application_status text not null default 'candidate'
    check (application_status in ('candidate','applied','interview','contracted','rejected')),

  progress_status    text not null default 'not_started'
    check (progress_status in ('not_started','in_progress','in_review','done')),

  deadline_date      date,
  delivered_at       date,
  delivery_url       text,

  payment_due_date   date,
  is_paid            boolean not null default false,
  paid_at            date,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index jobs_user_id_idx       on public.jobs (user_id);
create index jobs_user_deadline_idx on public.jobs (user_id, deadline_date);
create index jobs_user_paid_idx     on public.jobs (user_id, is_paid, paid_at);
create index jobs_user_status_idx   on public.jobs (user_id, application_status, progress_status);

create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

create trigger jobs_set_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

alter table public.jobs enable row level security;

create policy "jobs_select_own" on public.jobs for select using (auth.uid() = user_id);
create policy "jobs_insert_own" on public.jobs for insert with check (auth.uid() = user_id);
create policy "jobs_update_own" on public.jobs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "jobs_delete_own" on public.jobs for delete using (auth.uid() = user_id);
