import { assertDeepSeekApiKey, createDeepSeekClient } from "@/lib/ai/deepseek-client";
import type { ProjectPrdGeneration, ProjectRecord } from "@/types/project";

const REQUIRED_PRD_HEADINGS = [
  "## 1. 项目背景",
  "## 2. 目标用户",
  "## 3. 核心痛点",
  "## 4. MVP 功能",
  "## 5. 页面结构",
  "## 6. 数据结构",
  "## 7. 验收标准",
  "## 8. 后续迭代",
];

function assertProjectPrdShape(
  value: unknown,
): asserts value is ProjectPrdGeneration {
  if (!value || typeof value !== "object") {
    throw new Error("AI 返回内容不是有效对象。");
  }

  const result = value as Record<string, unknown>;

  const prdMarkdown = result.prd_markdown;

  if (typeof prdMarkdown !== "string" || !prdMarkdown.trim()) {
    throw new Error("AI 返回内容缺少 prd_markdown。");
  }

  const missingHeading = REQUIRED_PRD_HEADINGS.find(
    (heading) => !prdMarkdown.includes(heading),
  );

  if (missingHeading) {
    throw new Error(`AI 返回的 PRD 缺少必要标题：${missingHeading}`);
  }
}

function buildProjectPrdPrompt(project: ProjectRecord) {
  return [
    "请根据当前项目卡片生成一份简易 PRD。",
    "只输出 JSON，不要输出 Markdown 代码块或额外解释。",
    "",
    "JSON 必须包含以下字段：",
    "- prd_markdown: string，完整 PRD Markdown 内容",
    "",
    "PRD Markdown 必须包含以下结构：",
    `# ${project.name}`,
    ...REQUIRED_PRD_HEADINGS,
    "",
    "要求：",
    "- 内容必须基于当前项目卡片。",
    "- 第一版 PRD 只服务 MVP，范围要小，适合个人开发和学习。",
    "- 不要扩展支付、多人协作、复杂后台、插件系统等第二版功能。",
    "- 页面结构和数据结构保持简洁，不要编造过多复杂模块。",
    "- 验收标准要可手动检查。",
    "",
    "当前项目卡片：",
    `项目名称：${project.name}`,
    `项目简介：${project.description}`,
    `目标用户：${project.target_user}`,
    `核心痛点：${project.pain_point}`,
    `MVP 功能：${project.mvp_scope.join("、") || "暂无"}`,
    `技术栈：${project.tech_stack.join("、") || "暂无"}`,
    `项目状态：${project.status}`,
  ].join("\n");
}

export async function generateProjectPrd(
  project: ProjectRecord,
): Promise<ProjectPrdGeneration> {
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
          content: buildProjectPrdPrompt(project),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("DeepSeek 没有返回可解析的 PRD 内容。");
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("DeepSeek 返回的 PRD 不是有效 JSON。");
    }

    assertProjectPrdShape(parsed);

    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`PRD 生成失败：${error.message}`);
    }

    throw new Error("PRD 生成失败：未知错误。");
  }
}
