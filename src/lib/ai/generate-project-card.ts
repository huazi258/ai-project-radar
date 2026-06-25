import { assertDeepSeekApiKey, createDeepSeekClient } from "@/lib/ai/deepseek-client";
import type { AiReport } from "@/types/ai";
import type { ProjectCardInput } from "@/types/project";
import type { RecordDetail } from "@/types/record";

function assertStringArray(value: unknown, fieldName: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`AI 返回内容缺少 ${fieldName} 字符串数组。`);
  }
}

function assertProjectCardShape(value: unknown): asserts value is ProjectCardInput {
  if (!value || typeof value !== "object") {
    throw new Error("AI 返回内容不是有效对象。");
  }

  const result = value as Record<string, unknown>;

  for (const field of ["name", "description", "target_user", "pain_point", "status"]) {
    if (typeof result[field] !== "string") {
      throw new Error(`AI 返回内容缺少 ${field}。`);
    }
  }

  assertStringArray(result.mvp_scope, "mvp_scope");
  assertStringArray(result.tech_stack, "tech_stack");
}

function buildProjectPrompt(record: RecordDetail, report: AiReport) {
  return [
    "请根据学习记录和最近一次 AI 分析结果生成一个适合作为全栈练习项目的项目卡片。",
    "只输出 JSON，不要输出 Markdown 代码块或额外解释。",
    "",
    "JSON 必须包含以下字段：",
    "- name: string，项目名称",
    "- description: string，项目简介",
    "- target_user: string，目标用户",
    "- pain_point: string，核心痛点",
    "- mvp_scope: string[]，第一版 MVP 功能",
    "- tech_stack: string[]，推荐技术栈",
    '- status: string，固定使用 "idea"',
    "",
    "要求：",
    "- 项目必须适合个人开发",
    "- MVP 范围不要过大",
    "- 不要生成 PRD",
    "",
    "学习记录：",
    `标题：${record.title}`,
    `类型：${record.type}`,
    `标签：${record.tags.join(", ") || "无"}`,
    `正文：${record.content}`,
    "",
    "AI 分析结果：",
    `摘要：${report.summary}`,
    `技能：${report.skills.join(", ")}`,
    `问题：${report.problems.join(", ")}`,
    `下一步行动：${report.next_actions.join(", ")}`,
  ].join("\n");
}

export async function generateProjectCard(
  record: RecordDetail,
  report: AiReport,
): Promise<ProjectCardInput> {
  assertDeepSeekApiKey();

  const client = createDeepSeekClient();

  try {
    const completion = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你是一个产品经理和全栈项目规划助手。你必须输出合法 JSON 对象，不要输出任何额外解释、前后缀或 Markdown 代码块。",
        },
        {
          role: "user",
          content: buildProjectPrompt(record, report),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("DeepSeek 没有返回可解析的项目卡片内容。");
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("DeepSeek 返回的项目卡片不是有效 JSON。");
    }

    assertProjectCardShape(parsed);

    return {
      ...parsed,
      status: "idea",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`项目卡片生成失败：${error.message}`);
    }

    throw new Error("项目卡片生成失败：未知错误。");
  }
}
