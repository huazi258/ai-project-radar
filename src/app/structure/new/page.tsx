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
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-4xl">
        <Link
          href="/structure"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
        >
          返回结构化表达
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-zinc-500">New Structure</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
            新建结构化表达
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            保存一段需要整理的原始表达。当前阶段只保存任务，不调用 AI。
          </p>
        </div>

        <div className="mt-8">
          <StructureRecordForm action={createStructureRecord} />
        </div>
      </main>
    </div>
  );
}
