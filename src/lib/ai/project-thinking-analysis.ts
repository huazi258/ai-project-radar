import {
  assertDeepSeekApiKey,
  createDeepSeekClient,
} from "@/lib/ai/deepseek-client";
import { createClient } from "@/lib/supabase/server";
import type {
  AiProjectThinkingAnalysis,
  AiProjectThinkingAnalysisReport,
} from "@/types/ai";
import type { RecordDetail } from "@/types/record";

type ProjectThinkingReportRow = {
  id: string;
  user_id: string;
  record_id: string;
  report_type: string;
  summary: string;
  markdown_output: string;
  report_data: unknown;
  created_at: string;
};

type LatestProjectThinkingResult = {
  report: AiProjectThinkingAnalysisReport | null;
  error: string | null;
};

type SaveProjectThinkingInput = {
  userId: string;
  recordId: string;
  analysis: AiProjectThinkingAnalysis;
};

type SaveProjectThinkingResult = {
  report: AiProjectThinkingAnalysisReport | null;
  error: string | null;
};

function assertStringArray(value: unknown, fieldName: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`缺少 ${fieldName} 字符串数组。`);
  }
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function buildProjectThinkingMarkdown(analysis: Omit<AiProjectThinkingAnalysis, "markdown_output">) {
  return [
    `# ${analysis.project_name}`,
    "",
    "## 项目简介",
    analysis.project_summary,
    "",
    "## 目标用户",
    analysis.target_user,
    "",
    "## 核心问题",
    analysis.core_problem,
    "",
    "## 项目价值",
    analysis.project_value,
    "",
    "## MVP 功能",
    ...analysis.mvp_features.map((item) => `- ${item}`),
    "",
    "## 页面结构",
    ...analysis.page_structure.map((item) => `- ${item}`),
    "",
    "## 数据模型",
    ...analysis.data_model.map((item) => `- ${item}`),
    "",
    "## 技术栈",
    ...analysis.tech_stack.map((item) => `- ${item}`),
    "",
    "## 开发阶段",
    ...analysis.development_steps.map((item) => `- ${item}`),
  ].join("\n");
}

function assertProjectThinkingShape(
  value: unknown,
): asserts value is AiProjectThinkingAnalysis {
  if (!value || typeof value !== "object") {
    throw new Error("不是有效对象。");
  }

  const result = value as Record<string, unknown>;

  for (const fieldName of [
    "project_name",
    "project_summary",
    "target_user",
    "core_problem",
    "project_value",
  ]) {
    if (typeof result[fieldName] !== "string") {
      throw new Error(`缺少 ${fieldName} 字符串。`);
    }
  }

  assertStringArray(result.mvp_features, "mvp_features");
  assertStringArray(result.page_structure, "page_structure");
  assertStringArray(result.data_model, "data_model");
  assertStringArray(result.tech_stack, "tech_stack");
  assertStringArray(result.development_steps, "development_steps");

  if (
    "markdown_output" in result &&
    typeof result.markdown_output !== "string"
  ) {
    throw new Error("markdown_output 必须是字符串。");
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

function parseProjectThinkingJson(rawContent: string): AiProjectThinkingAnalysis {
  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJsonContent(rawContent));
  } catch (error) {
    const detail = error instanceof Error ? error.message : "未知解析错误。";
    throw new Error(`AI 返回内容格式异常，请重试。${detail}`);
  }

  try {
    assertProjectThinkingShape(parsed);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "字段校验失败。";
    throw new Error(`AI 返回内容格式异常：${detail}`);
  }

  const result = parsed as AiProjectThinkingAnalysis;
  const markdownOutput =
    typeof result.markdown_output === "string" && result.markdown_output.trim()
      ? result.markdown_output
      : buildProjectThinkingMarkdown(result);

  return {
    ...result,
    markdown_output: markdownOutput,
  };
}

function buildProjectThinkingPrompt(record: RecordDetail) {
  return [
    "请根据下面这条项目思考记录生成一个适合个人开发的项目方案，并且只输出一个严格合法的 json 对象。",
    "不要输出 Markdown 代码块，不要输出 ```json，不要输出解释文字，不要输出前缀或后缀说明。",
    "",
    "json 对象必须包含以下字段：",
    "- project_name: string，项目名称",
    "- project_summary: string，项目简介",
    "- target_user: string，目标用户",
    "- core_problem: string，核心问题",
    "- project_value: string，项目价值",
    "- mvp_features: string[]，MVP 功能",
    "- page_structure: string[]，页面结构",
    "- data_model: string[]，数据模型",
    "- tech_stack: string[]，技术栈",
    "- development_steps: string[]，开发阶段",
    "- markdown_output: string，可选但推荐，适合复制的 Markdown 内容",
    "",
    "要求：",
    "- 只生成项目方案，不要写入 projects。",
    "- 不要生成 PRD。",
    "- MVP 范围必须适合个人开发。",
    "- 技术方案优先贴合 Next.js、Supabase、AI API、Tailwind CSS。",
    "- markdown_output 字段内部可以是 Markdown 字符串，但整个返回值必须是 json 对象。",
    "",
    `标题：${record.title}`,
    `类型：${record.type}`,
    `标签：${record.tags.length > 0 ? record.tags.join(", ") : "无"}`,
    "原始项目思考：",
    record.content,
  ].join("\n");
}

function toProjectThinkingReport(
  row: ProjectThinkingReportRow,
): AiProjectThinkingAnalysisReport {
  const reportData =
    row.report_data && typeof row.report_data === "object"
      ? (row.report_data as Partial<AiProjectThinkingAnalysis>)
      : {};

  const base = {
    project_name: reportData.project_name ?? "未命名项目",
    project_summary: reportData.project_summary ?? row.summary,
    target_user: reportData.target_user ?? "",
    core_problem: reportData.core_problem ?? "",
    project_value: reportData.project_value ?? "",
    mvp_features: normalizeStringArray(reportData.mvp_features),
    page_structure: normalizeStringArray(reportData.page_structure),
    data_model: normalizeStringArray(reportData.data_model),
    tech_stack: normalizeStringArray(reportData.tech_stack),
    development_steps: normalizeStringArray(reportData.development_steps),
  };

  return {
    id: row.id,
    user_id: row.user_id,
    record_id: row.record_id,
    report_type: "project_thinking_analysis",
    ...base,
    markdown_output:
      reportData.markdown_output ?? row.markdown_output ?? buildProjectThinkingMarkdown(base),
    created_at: row.created_at,
  };
}

export async function analyzeProjectThinking(
  record: RecordDetail,
): Promise<AiProjectThinkingAnalysis> {
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
            "你是一个产品经理和全栈项目规划助手。你必须输出合法 json 对象。禁止输出任何额外解释、前后缀、Markdown 代码块或 ```json 包裹。",
        },
        {
          role: "user",
          content: buildProjectThinkingPrompt(record),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("DeepSeek 没有返回可解析的内容。");
    }

    return parseProjectThinkingJson(content);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`项目方案生成失败：${error.message}`);
    }

    throw new Error("项目方案生成失败：未知错误。");
  }
}

export async function saveProjectThinkingAnalysisReport({
  userId,
  recordId,
  analysis,
}: SaveProjectThinkingInput): Promise<SaveProjectThinkingResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_reports")
    .insert({
      user_id: userId,
      record_id: recordId,
      report_type: "project_thinking_analysis",
      summary: analysis.project_summary,
      skills: analysis.tech_stack,
      problems: [analysis.core_problem],
      next_actions: analysis.development_steps,
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
    report: toProjectThinkingReport(data as ProjectThinkingReportRow),
    error: null,
  };
}

export async function getLatestProjectThinkingAnalysisReport(
  recordId: string,
  userId: string,
): Promise<LatestProjectThinkingResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_reports")
    .select(
      "id,user_id,record_id,report_type,summary,markdown_output,report_data,created_at",
    )
    .eq("record_id", recordId)
    .eq("user_id", userId)
    .eq("report_type", "project_thinking_analysis")
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
    report: data ? toProjectThinkingReport(data as ProjectThinkingReportRow) : null,
    error: null,
  };
}
