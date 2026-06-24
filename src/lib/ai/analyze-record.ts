import OpenAI from "openai";
import { fetch, ProxyAgent } from "undici";
import type { ClientOptions } from "openai";
import type { AiRecordAnalysis, AnalyzeRecordInput } from "@/types/ai";

type OpenAIFetch = ClientOptions["fetch"];

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "skills",
    "problems",
    "next_actions",
    "markdown_output",
  ],
  properties: {
    summary: {
      type: "string",
      description: "100 字以内的学习记录摘要。",
    },
    skills: {
      type: "array",
      items: { type: "string" },
      description: "3 到 6 个技能标签。",
    },
    problems: {
      type: "array",
      items: { type: "string" },
      description: "当前记录暴露的问题。",
    },
    next_actions: {
      type: "array",
      items: { type: "string" },
      description: "2 到 5 条可执行的下一步行动。",
    },
    markdown_output: {
      type: "string",
      description: "适合复制到 Obsidian 的 Markdown 内容。",
    },
  },
} as const;

function assertAnalysisShape(value: unknown): asserts value is AiRecordAnalysis {
  if (!value || typeof value !== "object") {
    throw new Error("AI 返回内容不是有效对象。");
  }

  const result = value as Record<string, unknown>;

  if (typeof result.summary !== "string") {
    throw new Error("AI 返回内容缺少 summary。");
  }

  if (!Array.isArray(result.skills)) {
    throw new Error("AI 返回内容缺少 skills 数组。");
  }

  if (!Array.isArray(result.problems)) {
    throw new Error("AI 返回内容缺少 problems 数组。");
  }

  if (!Array.isArray(result.next_actions)) {
    throw new Error("AI 返回内容缺少 next_actions 数组。");
  }

  if (typeof result.markdown_output !== "string") {
    throw new Error("AI 返回内容缺少 markdown_output。");
  }
}

function buildInput(record: AnalyzeRecordInput) {
  return [
    `标题：${record.title}`,
    `类型：${record.type}`,
    `标签：${record.tags.length > 0 ? record.tags.join(", ") : "无"}`,
    "正文：",
    record.content,
  ].join("\n");
}

function createOpenAIClient() {
  const proxyUrl = process.env.OPENAI_PROXY_URL;

  if (!proxyUrl) {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 60_000,
    });
  }

  const proxyAgent = new ProxyAgent(proxyUrl);

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    fetch: fetch as unknown as OpenAIFetch,
    fetchOptions: {
      dispatcher: proxyAgent,
    },
    timeout: 60_000,
  });
}

export async function analyzeRecord(
  record: AnalyzeRecordInput,
): Promise<AiRecordAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("缺少服务端环境变量 OPENAI_API_KEY。");
  }

  const client = createOpenAIClient();

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5.5",
      instructions:
        "你是一个学习记录整理助手。请把用户输入的学习记录整理成结构化结果。输出必须严格符合 JSON Schema，不要输出额外解释。",
      input: buildInput(record),
      text: {
        format: {
          type: "json_schema",
          name: "record_analysis",
          description: "学习记录 AI 分析结果。",
          strict: true,
          schema: analysisSchema,
        },
      },
    });

    if (!response.output_text) {
      throw new Error("AI 没有返回可解析的文本内容。");
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(response.output_text);
    } catch {
      throw new Error("AI 返回内容不是有效 JSON。");
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
