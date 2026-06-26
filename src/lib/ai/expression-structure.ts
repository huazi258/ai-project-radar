import {
  assertDeepSeekApiKey,
  createDeepSeekClient,
} from "@/lib/ai/deepseek-client";
import { createClient } from "@/lib/supabase/server";
import type {
  AiExpressionStructure,
  AiExpressionStructureReport,
} from "@/types/ai";
import type { RecordDetail } from "@/types/record";

type ExpressionStructureReportRow = {
  id: string;
  user_id: string;
  record_id: string;
  report_type: string;
  summary: string;
  markdown_output: string;
  report_data: unknown;
  created_at: string;
};

type LatestExpressionStructureResult = {
  report: AiExpressionStructureReport | null;
  error: string | null;
};

type SaveExpressionStructureInput = {
  userId: string;
  recordId: string;
  analysis: AiExpressionStructure;
};

type SaveExpressionStructureResult = {
  report: AiExpressionStructureReport | null;
  error: string | null;
};

function assertStringArray(value: unknown, fieldName: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`缺少 ${fieldName} 字符串数组。`);
  }
}

function assertExpressionStructureShape(
  value: unknown,
): asserts value is AiExpressionStructure {
  if (!value || typeof value !== "object") {
    throw new Error("不是有效对象。");
  }

  const result = value as Record<string, unknown>;

  for (const fieldName of [
    "core_meaning",
    "structured_version",
    "optimized_prompt",
    "markdown_output",
  ]) {
    if (typeof result[fieldName] !== "string") {
      throw new Error(`缺少 ${fieldName} 字符串。`);
    }
  }

  assertStringArray(result.suggestions, "suggestions");
}

function extractJsonContent(content: string) {
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const withoutFence = fencedMatch?.[1]?.trim() ?? trimmed;
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("没有找到 JSON 对象。");
  }

  return withoutFence.slice(start, end + 1);
}

function parseExpressionJson(rawContent: string): AiExpressionStructure {
  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJsonContent(rawContent));
  } catch (error) {
    const detail = error instanceof Error ? error.message : "未知解析错误。";
    throw new Error(`AI 返回内容格式异常，请重试。${detail}`);
  }

  try {
    assertExpressionStructureShape(parsed);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "字段校验失败。";
    throw new Error(`AI 返回内容格式异常：${detail}`);
  }

  return parsed;
}

function buildExpressionPrompt(record: RecordDetail) {
  return [
    "请把下面这条结构化表达任务整理成更清晰、更可复制的表达，并且只输出一个严格合法的 json 对象。",
    "不要输出 Markdown 代码块，不要输出 ```json，不要输出解释文字，不要输出前缀或后缀说明。",
    "",
    "json 对象必须且只能包含以下字段：",
    "- core_meaning: string，提炼用户原始输入的核心意思",
    "- structured_version: string，结构化后的完整表达",
    "- optimized_prompt: string，如果适合发给 AI，输出优化后的提示词；如果不适合，也要给出可复制表达",
    "- suggestions: string[]，补充建议",
    "- markdown_output: string，适合复制到 Obsidian 或文档的 Markdown 内容",
    "",
    "要求：",
    "- 不改变用户原意。",
    "- 不虚构用户没有提供的事实。",
    "- 不要生成项目卡片。",
    "- 不要生成 PRD。",
    "- markdown_output 字段内部可以是 Markdown 字符串，但整个返回值必须是 json 对象。",
    "",
    `标题：${record.title}`,
    `类型：${record.type}`,
    `标签：${record.tags.length > 0 ? record.tags.join(", ") : "无"}`,
    "原始输入：",
    record.content,
  ].join("\n");
}

function toExpressionStructureReport(
  row: ExpressionStructureReportRow,
): AiExpressionStructureReport {
  const reportData =
    row.report_data && typeof row.report_data === "object"
      ? (row.report_data as Partial<AiExpressionStructure>)
      : {};

  return {
    id: row.id,
    user_id: row.user_id,
    record_id: row.record_id,
    report_type: "expression_structure",
    core_meaning: reportData.core_meaning ?? row.summary,
    structured_version: reportData.structured_version ?? "",
    optimized_prompt: reportData.optimized_prompt ?? "",
    suggestions: Array.isArray(reportData.suggestions)
      ? reportData.suggestions.filter((item) => typeof item === "string")
      : [],
    markdown_output: reportData.markdown_output ?? row.markdown_output,
    created_at: row.created_at,
  };
}

export async function generateExpressionStructure(
  record: RecordDetail,
): Promise<AiExpressionStructure> {
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
            "你是一个结构化表达助手。你必须输出合法 json 对象。禁止输出任何额外解释、前后缀、Markdown 代码块或 ```json 包裹。",
        },
        {
          role: "user",
          content: buildExpressionPrompt(record),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("DeepSeek 没有返回可解析的内容。");
    }

    console.log(
      "[expression-structure] DeepSeek raw content:",
      content.slice(0, 1000),
    );

    return parseExpressionJson(content);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`结构化表达生成失败：${error.message}`);
    }

    throw new Error("结构化表达生成失败：未知错误。");
  }
}

export async function saveExpressionStructureReport({
  userId,
  recordId,
  analysis,
}: SaveExpressionStructureInput): Promise<SaveExpressionStructureResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_reports")
    .insert({
      user_id: userId,
      record_id: recordId,
      report_type: "expression_structure",
      summary: analysis.core_meaning,
      skills: [],
      problems: [],
      next_actions: [],
      markdown_output: analysis.markdown_output,
      report_data: analysis,
    })
    .select(
      "id,user_id,record_id,report_type,summary,markdown_output,report_data,created_at",
    )
    .single();

  if (error) {
    return {
      report: null,
      error: error.message,
    };
  }

  return {
    report: toExpressionStructureReport(data as ExpressionStructureReportRow),
    error: null,
  };
}

export async function getLatestExpressionStructureReport(
  recordId: string,
  userId: string,
): Promise<LatestExpressionStructureResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_reports")
    .select(
      "id,user_id,record_id,report_type,summary,markdown_output,report_data,created_at",
    )
    .eq("record_id", recordId)
    .eq("user_id", userId)
    .eq("report_type", "expression_structure")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      report: null,
      error: error.message,
    };
  }

  return {
    report: data
      ? toExpressionStructureReport(data as ExpressionStructureReportRow)
      : null,
    error: null,
  };
}
