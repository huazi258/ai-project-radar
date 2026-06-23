# 数据模型设计

## 1. profiles 用户资料表

用于保存用户基础信息。

字段：


id
user_id
display_name
created_at
updated_at

## 2. records 学习记录表

用于保存用户输入的原始记录。

字段：

id
user_id
title
content
type
tags
created_at
updated_at

type 可选值：

learning
ai_usage
project_idea
tutorial_note
daily_review
## 3. ai_reports AI 分析结果表

用于保存 AI 对记录的分析结果。

字段：

id
user_id
record_id
summary
skills
problems
next_actions
markdown_output
created_at
updated_at

说明：

一个 record 可以有一个或多个 ai_report
第一版默认展示最新的一条分析结果
skills、problems、next_actions 可以按数组保存。
AI 分析失败时，第一版不需要保存失败记录。

## 4. projects 项目卡片表

用于保存从记录生成的项目卡片。

字段：

id
user_id
source_record_id
source_ai_report_id
name
description
target_user
pain_point
mvp_scope
tech_stack
status
prd_markdown
created_at
updated_at

status 可选值：

idea
planning
building
done
paused

说明：

source_record_id 用于记录项目卡片来自哪条学习记录。
source_ai_report_id 用于记录项目卡片基于哪一次 AI 分析生成。
mvp_scope 和 tech_stack 可以按数组保存。
项目卡片 Markdown 第一版可以由项目字段临时拼接生成，不一定单独存字段。
PRD Markdown 保存到 prd_markdown。

## 5. 表关系

用户 user
  └─ records
       ├─ ai_reports
       └─ projects

projects 同时关联 source_record_id 和 source_ai_report_id。

## 6. 数据隔离要求

第一版必须保证：

用户只能查看自己的 records
用户只能查看自己的 ai_reports
用户只能查看自己的 projects
未登录用户不能访问个人数据
