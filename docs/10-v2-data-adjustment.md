# AI Project Radar V2 数据调整建议

## 1. 调整原则

第二版仍然以第一版已有数据模型为基础，不应一开始大规模重构数据库。

当前已有核心表：

- records
- ai_reports
- projects

第二版建议优先采用渐进式调整：

- 学习记录尽量复用 records 和 ai_reports。
- 结构化表达新增独立表。
- 项目思考新增独立表，必要时再转入 projects。
- projects 继续作为最终项目卡片库。

## 2. 学习记录数据

学习记录模块可以继续使用 records 表。

建议映射：

| 第二版概念 | 第一版字段 |
|---|---|
| 学习标题 | records.title |
| 学习内容 | records.content |
| 学习类型 | records.type |
| 标签 | records.tags |
| 用户归属 | records.user_id |

ai_reports 可以继续保存学习分析结果。

建议后续新增字段：

```text
ai_reports.prompt_version
ai_reports.reflection_questions
```

如果暂时不改数据库，也可以先把 reflection_questions 放进 markdown_output 中展示。

## 3. 结构化表达数据

结构化表达不适合强行放入 records，因为它不是学习记录，也不一定会变成项目。

建议新增 expression_entries 表：

```text
id
user_id
title
raw_text
scene
target_format
improved_text
key_points
structure_notes
codex_prompt
markdown_output
prompt_version
created_at
updated_at
```

字段说明：

- raw_text：用户原始输入。
- scene：表达场景，例如 codex_task、learning_review。
- target_format：用户希望整理成的格式。
- improved_text：AI 优化后的完整表达。
- key_points：AI 拆出的要点数组。
- structure_notes：AI 给出的结构建议数组。
- codex_prompt：适合给 Codex 的任务提示词，可为空。
- markdown_output：可复制 Markdown。

RLS 要求：

```text
select/insert/update 都必须限制 auth.uid() = user_id
```

## 4. 项目思考数据

项目思考是 projects 之前的工作区，不一定每条都会变成正式项目卡片。

建议新增 project_thoughts 表：

```text
id
user_id
source_record_id
title
idea_text
stage
constraints
project_name
direction
target_user
pain_point
mvp_scope
tech_stack
risks
next_steps
prd_markdown
markdown_output
prompt_version
linked_project_id
created_at
updated_at
```

字段说明：

- source_record_id：可选，表示这个项目思考来自哪条学习记录。
- idea_text：用户原始项目想法。
- stage：idea、planning、building、review。
- constraints：用户输入的限制条件。
- linked_project_id：如果用户把项目思考转成正式项目卡片，则关联 projects.id。

RLS 要求：

```text
select/insert/update 都必须限制 auth.uid() = user_id
```

## 5. projects 表调整

projects 继续作为项目卡片库，不建议在第二版直接替换。

建议后续可选新增字段：

```text
source_project_thought_id
```

用途：

- 标记项目卡片来自哪条项目思考。
- 保留从“想法整理”到“正式项目卡片”的来源链路。

如果不想改表，也可以暂时只在 project_thoughts.linked_project_id 中保存关联。

## 6. 数据关系

第二版建议关系：

```text
user
  ├─ records
  │   └─ ai_reports
  ├─ expression_entries
  ├─ project_thoughts
  │   └─ projects
  └─ projects
```

学习记录可以生成项目思考，项目思考可以生成项目卡片，项目卡片可以继续生成 PRD。

## 7. 迁移顺序建议

第二版开发时建议按以下顺序调整数据：

1. 先不改 records 和 ai_reports，复用第一版学习记录能力。
2. 新增 expression_entries 表和 RLS。
3. 新增 project_thoughts 表和 RLS。
4. 在项目思考转项目卡片时，再决定是否给 projects 增加 source_project_thought_id。
5. 最后根据实际展示需要考虑 prompt_version 等补充字段。

## 8. 暂不建议的调整

第二版暂时不建议：

- 把 records、expressions、project_thoughts 合并成一张超大 content 表。
- 一开始就引入向量数据库。
- 一开始就做复杂 AI 运行历史表。
- 一开始就做多模型调用记录。
- 为每个模块建立复杂状态流转。

保持数据模型清楚，比过早抽象更重要。
