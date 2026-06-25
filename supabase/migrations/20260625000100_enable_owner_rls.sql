alter table public.records enable row level security;
alter table public.ai_reports enable row level security;
alter table public.projects enable row level security;

drop policy if exists "records_select_own" on public.records;
drop policy if exists "records_insert_own" on public.records;
drop policy if exists "records_update_own" on public.records;

create policy "records_select_own"
on public.records
for select
to authenticated
using (auth.uid() = user_id);

create policy "records_insert_own"
on public.records
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "records_update_own"
on public.records
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "ai_reports_select_own" on public.ai_reports;
drop policy if exists "ai_reports_insert_own" on public.ai_reports;
drop policy if exists "ai_reports_update_own" on public.ai_reports;

create policy "ai_reports_select_own"
on public.ai_reports
for select
to authenticated
using (auth.uid() = user_id);

create policy "ai_reports_insert_own"
on public.ai_reports
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "ai_reports_update_own"
on public.ai_reports
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;

create policy "projects_select_own"
on public.projects
for select
to authenticated
using (auth.uid() = user_id);

create policy "projects_insert_own"
on public.projects
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "projects_update_own"
on public.projects
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
