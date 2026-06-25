import OpenAI from "openai";
import type { AiRecordAnalysis, AnalyzeRecordInput } from "@/types/ai";

function assertStringArray(value: unknown, fieldName: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`AI 返回内容缺少 ${fieldName} 字符串数组。`);
  }
}

function assertAnalysisShape(value: unknown): asserts value is AiRecordAnalysis {
  if (!value || typeof value !== "object") {
    throw new Error("AI 返回内容不是有效对象。");
  }

  const result = value as Record<string, unknown>;

  if (typeof result.summary !== "string") {
    throw new Error("AI 返回内容缺少 summary。");
  }

  assertStringArray(result.skills, "skills");
  assertStringArray(result.problems, "problems");
  assertStringArray(result.next_actions, "next_actions");

  if (typeof result.markdown_output !== "string") {
    throw new Error("AI 返回内容缺少 markdown_output。");
  }
}

function buildUserPrompt(record: AnalyzeRecordInput) {
  return [
    "请分析下面这条学习记录，并且只输出 JSON，不要输出 Markdown 代码块或额外解释。",
    "",
    "JSON 必须包含以下字段：",
    "- summary: string，100 字以内的内容摘要",
    "- skills: string[]，3 到 6 个技能标签",
    "- problems: string[]，当前暴露的问题",
    "- next_actions: string[]，2 到 5 条可执行的下一步行动",
    "- markdown_output: string，适合复制到 Obsidian 的 Markdown 内容",
    "",
    `标题：${record.title}`,
    `类型：${record.type}`,
    `标签：${record.tags.length > 0 ? record.tags.join(", ") : "无"}`,
    "正文：",
    record.content,
  ].join("\n");
}

function createDeepSeekClient() {
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    timeout: 60_000,
  });
}

export async function analyzeRecord(
  record: AnalyzeRecordInput,
): Promise<AiRecordAnalysis> {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("缺少服务端环境变量 DEEPSEEK_API_KEY。");
  }

  const client = createDeepSeekClient();

  try {
    const completion = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你是一个学习记录整理助手。你必须输出合法 JSON 对象，不要输出任何额外解释、前后缀或 Markdown 代码块。",
        },
        {
          role: "user",
          content: buildUserPrompt(record),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("DeepSeek 没有返回可解析的内容。");
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("DeepSeek 返回内容不是有效 JSON。");
    }

    assertAnalysisShape(parsed);
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`AI 分析失败：${error.message}`);
    }

    throw new Error("AI 分析失败：未知错误。");
  }
}
