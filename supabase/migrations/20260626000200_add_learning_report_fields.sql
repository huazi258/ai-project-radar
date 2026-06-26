alter table public.ai_reports
add column if not exists report_type text not null default 'record_analysis';

alter table public.ai_reports
add column if not exists report_data jsonb not null default '{}'::jsonb;

create index if not exists ai_reports_record_user_type_created_at_idx
on public.ai_reports (record_id, user_id, report_type, created_at desc);
