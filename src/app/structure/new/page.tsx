import Link from "next/link";
import { redirect } from "next/navigation";
import { StructureRecordForm } from "@/components/structure/structure-record-form";
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

function buildStructureContent(formData: FormData) {
  const content = getStringValue(formData, "content");
  const targetUsage = getStringValue(formData, "target_usage");
  const outputStyle = getStringValue(formData, "output_style");

  return [
    content,
    "",
    "---",
    "",
    "## 结构化表达元信息",
    "",
    `- 表达用途：${targetUsage || "未填写"}`,
    `- 输出风格：${outputStyle || "未填写"}`,
  ].join("\n");
}

export default function NewStructurePage() {
  async function createStructureRecord(formData: FormData) {
    "use server";

    const title = getStringValue(formData, "title");
    const content = buildStructureContent(formData);
    const tags = parseTags(getStringValue(formData, "tags"));

    const result = await createCurrentUserRecord({
      title,
      content,
      type: "structured_expression",
      tags,
    });

    if (!result.isAuthenticated) {
      redirect("/login");
    }

    if (result.error) {
      throw new Error(result.error);
    }

    redirect("/structure");
  }

  return (
    <div className="app-page">
      <main className="app-container-narrow">
        <Link
          href="/structure"
          className="text-sm font-semibold text-[#6d798e] transition-colors hover:text-[#3044bd]"
        >
          ← 返回结构化表达
        </Link>

        <div className="mt-6">
          <p className="page-kicker">New structure</p>
          <h1 className="page-title">新建结构化表达</h1>
          <p className="page-description">
            先写下原始想法，并告诉 AI 这段内容准备用在哪里、希望呈现什么风格。
          </p>
        </div>

        <div className="mt-8">
          <StructureRecordForm action={createStructureRecord} />
        </div>
      </main>
    </div>
  );
}
