import Link from "next/link";
import { redirect } from "next/navigation";
import { LearningRecordForm } from "@/components/learning/learning-record-form";
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

function buildLearningContent(formData: FormData) {
  const content = getStringValue(formData, "content");
  const learningCategory = getStringValue(formData, "learning_category");
  const learningStatus = getStringValue(formData, "learning_status");
  const durationMinutes = getStringValue(formData, "duration_minutes");

  return [
    content,
    "",
    "---",
    "",
    "## 学习记录元信息",
    "",
    `- 学习分类：${learningCategory || "未填写"}`,
    `- 学习状态：${learningStatus || "未填写"}`,
    `- 学习时长：${durationMinutes ? `${durationMinutes} 分钟` : "未填写"}`,
  ].join("\n");
}

export default function NewLearningPage() {
  async function createLearningRecord(formData: FormData) {
    "use server";

    const title = getStringValue(formData, "title");
    const content = buildLearningContent(formData);
    const tags = parseTags(getStringValue(formData, "tags"));

    const result = await createCurrentUserRecord({
      title,
      content,
      type: "learning_record",
      tags,
    });

    if (!result.isAuthenticated) {
      redirect("/login");
    }

    if (result.error) {
      throw new Error(result.error);
    }

    redirect("/learning");
  }

  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-4xl">
        <Link
          href="/learning"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
        >
          返回学习记录
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-zinc-500">New Learning</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
            新建学习记录
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            记录今天学到的内容、学习状态和投入时间。当前阶段只保存记录，不调用 AI。
          </p>
        </div>

        <div className="mt-8">
          <LearningRecordForm action={createLearningRecord} />
        </div>
      </main>
    </div>
  );
}
