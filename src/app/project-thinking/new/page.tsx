import Link from "next/link";
import { redirect } from "next/navigation";
import { ProjectThinkingForm } from "@/components/project-thinking/project-thinking-form";
import { createCurrentUserRecord } from "@/lib/records/queries";

function getStringValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function parseTags(value: string) {
  return value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function buildProjectThinkingContent(formData: FormData) {
  const content = getStringValue(formData, "content");
  const projectDirection = getStringValue(formData, "project_direction");
  const targetPurpose = getStringValue(formData, "target_purpose");
  const difficultyLimit = getStringValue(formData, "difficulty_limit");
  const techPreference = getStringValue(formData, "tech_preference");

  return [
    content,
    "",
    "---",
    "",
    "## 项目思考元信息",
    "",
    `- 项目方向：${projectDirection || "未填写"}`,
    `- 目标用途：${targetPurpose || "未填写"}`,
    `- 难度限制：${difficultyLimit || "未填写"}`,
    `- 技术偏好：${techPreference || "未填写"}`,
  ].join("\n");
}

export default function NewProjectThinkingPage() {
  async function createProjectThinkingRecord(formData: FormData) {
    "use server";

    const title = getStringValue(formData, "title");
    const content = buildProjectThinkingContent(formData);
    const tags = parseTags(getStringValue(formData, "tags"));

    const result = await createCurrentUserRecord({
      title,
      content,
      type: "project_thinking",
      tags,
    });

    if (!result.isAuthenticated) {
      redirect("/login");
    }

    if (result.error) {
      throw new Error(result.error);
    }

    redirect("/project-thinking");
  }

  return (
    <div className="app-page">
      <main className="app-container-narrow">
        <Link
          href="/project-thinking"
          className="text-sm font-semibold text-[#6d798e] transition-colors hover:text-[#3044bd]"
        >
          ← 返回项目思考
        </Link>

        <div className="mt-6">
          <p className="page-kicker">New project thought</p>
          <h1 className="page-title">新建项目思考</h1>
          <p className="page-description">
            把还不成熟的想法写下来，补充目标、限制和技术偏好，再让 AI 帮你推演成项目方案。
          </p>
        </div>

        <div className="mt-8">
          <ProjectThinkingForm action={createProjectThinkingRecord} />
        </div>
      </main>
    </div>
  );
}
