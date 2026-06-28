import {
  assertDeepSeekApiKey,
  createDeepSeekClient,
} from "@/lib/ai/deepseek-client";
import { createClient } from "@/lib/supabase/server";
import type { AiLearningAnalysis, AiLearningAnalysisReport } from "@/types/ai";
import type { RecordDetail } from "@/types/record";

type LearningAnalysisReportRow = {
  id: string;
  user_id: string;
  record_id: string;
  report_type: string;
  summary: string;
  problems: string[] | null;
  next_actions: string[] | null;
  markdown_output: string;
  report_data: unknown;
  created_at: string;
};

type LatestLearningAnalysisResult = {
  report: AiLearningAnalysisReport | null;
  error: string | null;
};

type SaveLearningAnalysisInput = {
  userId: string;
  recordId: string;
  analysis: AiLearningAnalysis;
};

type SaveLearningAnalysisResult = {
  report: AiLearningAnalysisReport | null;
  error: string | null;
};

function assertStringArray(value: unknown, fieldName: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`缺少 ${fieldName} 字符串数组。`);
  }
}

function assertLearningAnalysisShape(
  value: unknown,
): asserts value is AiLearningAnalysis {
  if (!value || typeof value !== "object") {
    throw new Error("不是有效对象。");
  }

  const result = value as Record<string, unknown>;

  if (typeof result.summary !== "string") {
    throw new Error("缺少 summary 字符串。");
  }

  assertStringArray(result.learned_points, "learned_points");
  assertStringArray(result.problems, "problems");
  assertStringArray(result.suggestions, "suggestions");
  assertStringArray(result.next_actions, "next_actions");

  if (typeof result.markdown_output !== "string") {
    throw new Error("缺少 markdown_output 字符串。");
  }
}

function extractJsonContent(content: string) {
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const withoutFence = fencedMatch?.[1]?.trim() ?? trimmed;
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("没有找到 JSON 对象。");
  }

  return withoutFence.slice(start, end + 1);
}

function parseAIJson(rawContent: string): AiLearningAnalysis {
  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJsonContent(rawContent));
  } catch (error) {
    const detail = error instanceof Error ? error.message : "未知解析错误。";
    throw new Error(`AI 返回内容格式异常，请重试。${detail}`);
  }

  try {
    assertLearningAnalysisShape(parsed);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "字段校验失败。";
    throw new Error(`AI 返回内容格式异常：${detail}`);
  }

  return parsed;
}

function buildLearningAnalysisPrompt(record: RecordDetail) {
  return [
    "请分析下面这条学习记录，并且只输出一个严格合法的 json 对象。",
    "不要输出 Markdown 代码块，不要输出 ```json，不要输出解释文字，不要输出前缀或后缀说明。",
    "",
    "json 对象必须且只能包含以下字段：",
    "- summary: string，学习记录总结",
    "- learned_points: string[]，已经学到的知识点",
    "- problems: string[]，当前存在的问题",
    "- suggestions: string[]，学习建议",
    "- next_actions: string[]，下一步行动",
    "- markdown_output: string，适合复制到 Obsidian 的 Markdown 内容",
    "",
    "要求：",
    "- 内容只围绕学习记录本身。",
    "- 不要生成项目卡片。",
    "- 不要生成 PRD。",
    "- markdown_output 字段内部可以是 Markdown 字符串，但整个返回值必须是 json 对象。",
    "- suggestions 和 next_actions 必须具体、可执行。",
    "",
    `标题：${record.title}`,
    `类型：${record.type}`,
    `标签：${record.tags.length > 0 ? record.tags.join(", ") : "无"}`,
    "正文：",
    record.content,
  ].join("\n");
}

function toLearningAnalysisReport(
  row: LearningAnalysisReportRow,
): AiLearningAnalysisReport {
  const reportData =
    row.report_data && typeof row.report_data === "object"
      ? (row.report_data as Partial<AiLearningAnalysis>)
      : {};

  return {
    id: row.id,
    user_id: row.user_id,
    record_id: row.record_id,
    report_type: "learning_analysis",
    summary: row.summary,
    learned_points: Array.isArray(reportData.learned_points)
      ? reportData.learned_points.filter((item) => typeof item === "string")
      : [],
    problems: row.problems ?? [],
    suggestions: Array.isArray(reportData.suggestions)
      ? reportData.suggestions.filter((item) => typeof item === "string")
      : [],
    next_actions: row.next_actions ?? [],
    markdown_output: row.markdown_output,
    created_at: row.created_at,
  };
}

export async function analyzeLearningRecord(
  record: RecordDetail,
): Promise<AiLearningAnalysis> {
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
            "你是一个学习复盘和技术成长助手。你必须输出合法 json 对象。禁止输出任何额外解释、前后缀、Markdown 代码块或 ```json 包裹。",
        },
        {
          role: "user",
          content: buildLearningAnalysisPrompt(record),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("DeepSeek 没有返回可解析的内容。");
    }

    return parseAIJson(content);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`学习建议生成失败：${error.message}`);
    }

    throw new Error("学习建议生成失败：未知错误。");
  }
}

export async function saveLearningAnalysisReport({
  userId,
  recordId,
  analysis,
}: SaveLearningAnalysisInput): Promise<SaveLearningAnalysisResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_reports")
    .insert({
      user_id: userId,
      record_id: recordId,
      report_type: "learning_analysis",
      summary: analysis.summary,
      skills: analysis.learned_points,
      problems: analysis.problems,
      next_actions: analysis.next_actions,
      markdown_output: analysis.markdown_output,
      report_data: analysis,
    })
    .select(
      "id,user_id,record_id,report_type,summary,problems,next_actions,markdown_output,report_data,created_at",
    )
    .single();

  if (error) {
    return {
      report: null,
      error: error.message,
    };
  }

  return {
    report: toLearningAnalysisReport(data as LearningAnalysisReportRow),
    error: null,
  };
}

export async function getLatestLearningAnalysisReport(
  recordId: string,
  userId: string,
): Promise<LatestLearningAnalysisResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_reports")
    .select(
      "id,user_id,record_id,report_type,summary,problems,next_actions,markdown_output,report_data,created_at",
    )
    .eq("record_id", recordId)
    .eq("user_id", userId)
    .eq("report_type", "learning_analysis")
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
      ? toLearningAnalysisReport(data as LearningAnalysisReportRow)
      : null,
    error: null,
  };
}
