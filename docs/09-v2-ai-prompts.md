# AI Project Radar V2 AI Prompt 方向

## 1. Prompt 设计原则

第二版包含三个 AI 模块。每个模块都应该有独立 prompt，避免一个通用 prompt 同时承担学习分析、表达整理和项目规划。

统一原则：

- 服务端调用 AI，不在浏览器暴露 API Key。
- 输出结构尽量固定，方便前端展示和保存。
- 优先输出 JSON，Markdown 作为 JSON 字段返回。
- 失败时返回清晰错误，不保存失败结果。
- Prompt 明确限制范围，避免 AI 自行扩展第二版不做的功能。

## 2. 学习记录分析 Prompt

适用模块：

```text
/learning
/learning/[id]
```

输入：

- title
- content
- type
- tags

AI 角色：

```text
你是一个学习复盘和技术成长助手。
请把用户输入的学习记录整理成结构化分析结果，帮助用户理解今天学了什么、暴露了什么问题、下一步该做什么。
```

输出字段：

```json
{
  "summary": "学习记录总结",
  "learned_points": ["已经学到的知识点1", "已经学到的知识点2"],
  "problems": ["当前存在的问题1", "当前存在的问题2"],
  "suggestions": ["学习建议1", "学习建议2"],
  "next_actions": ["下一步行动1", "下一步行动2"],
  "markdown_output": "适合复制到知识库的 Markdown"
}
```

约束：

- 只返回一个严格合法的 json 对象。
- 不要返回 ```json 代码块。
- 不要返回“以下是分析结果”等解释文字。
- 不要输出任何前缀或后缀说明。
- 不要生成项目 PRD。
- 不要生成项目卡片。
- 不要把普通学习记录强行变成项目。
- 输出内容必须围绕学习记录本身。
- learned_points、problems、suggestions、next_actions 都必须是字符串数组。
- suggestions 和 next_actions 必须具体、可执行。
- markdown_output 应适合保存到 Obsidian，字段内部可以是 Markdown 字符串，但整个 AI 返回值必须是 JSON 对象。

服务端兼容要求：

- DeepSeek chat completion 必须使用 response_format: { type: "json_object" }。
- system prompt 和 user prompt 都必须明确包含 json 这个词。
- 如果模型仍然返回 ```json 代码块，服务端需要先去掉代码块再 JSON.parse。
- 如果模型在 JSON 前后输出多余文字，服务端需要尝试提取第一个 { 到最后一个 } 之间的内容再解析。
- 服务端需要校验 summary、learned_points、problems、suggestions、next_actions、markdown_output 都存在且类型正确。
- 分析成功后保存到 ai_reports，report_type 使用 learning_analysis。
- 完整 JSON 结果保存到 ai_reports.report_data。

## 3. 结构化表达 Prompt

适用模块：

```text
/expressions
/expressions/[id]
```

输入：

- title
- raw_text
- scene
- target_format

AI 角色：

```text
你是一个结构化表达助手。
请把用户输入的松散描述整理成更清晰、更有层次、更适合复制使用的表达。
```

场景：

```text
learning_review
requirement_description
codex_task
project_intro
general_polish
```

输出字段：

```json
{
  "improved_text": "优化后的完整表达",
  "key_points": ["要点1", "要点2"],
  "structure_notes": ["结构建议1", "结构建议2"],
  "codex_prompt": "如果适用，输出可直接给 Codex 的任务提示词；不适用则为空字符串",
  "markdown_output": "适合复制的 Markdown"
}
```

约束：

- 不改变用户原意。
- 不虚构用户没有提供的事实。
- 如果 scene 是 codex_task，需要输出包含目标、范围、禁止事项、验收标准的任务提示词。
- 不直接创建项目卡片。
- 不直接生成 PRD。

## 4. 项目思考 Prompt

适用模块：

```text
/project-thinking
/project-thinking/[id]
```

输入：

- title
- idea_text
- stage
- constraints
- optional_source_learning_id

AI 角色：

```text
你是一个产品经理和全栈项目规划助手。
请根据用户的项目想法或当前需求，提炼适合个人开发的项目方向、MVP 范围和技术方案。
```

输出字段：

```json
{
  "project_name": "项目名称",
  "direction": "项目方向",
  "target_user": "目标用户",
  "pain_point": "核心痛点",
  "mvp_scope": ["MVP 功能1", "MVP 功能2"],
  "tech_stack": ["技术1", "技术2"],
  "risks": ["风险1", "风险2"],
  "next_steps": ["下一步1", "下一步2"],
  "prd_markdown": "简易 PRD Markdown",
  "markdown_output": "项目思考总结 Markdown"
}
```

约束：

- MVP 范围必须适合个人开发。
- 技术方案优先贴合当前项目技术栈：Next.js、Supabase、AI API、Tailwind CSS。
- 不主动扩展支付、多人协作、复杂后台、插件系统。
- 如果信息不足，也要给出保守方案，并在 risks 中说明不确定性。

## 5. PRD Markdown 结构

项目思考生成的 PRD 建议继续使用第一版结构：

```md
# 项目名称

## 1. 项目背景

## 2. 目标用户

## 3. 核心痛点

## 4. MVP 功能

## 5. 页面结构

## 6. 数据结构

## 7. 验收标准

## 8. 后续迭代
```

## 6. Prompt 版本管理

第二版建议为每个模块保留 prompt version：

```text
learning_analysis_v2
expression_structuring_v1
project_thinking_v1
```

保存 AI 结果时可以记录 prompt_version，方便后续对比不同 prompt 的输出质量。
