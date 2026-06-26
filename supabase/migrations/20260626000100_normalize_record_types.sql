update public.records
set type = case type
  when 'learning' then 'learning_record'
  when 'project_idea' then 'project_thinking'
  else type
end
where type in ('learning', 'project_idea');
