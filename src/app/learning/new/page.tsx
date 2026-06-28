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
    <div className="app-page">
      <main className="app-container-narrow">
        <Link
          href="/learning"
          className="text-sm font-semibold text-[#6d798e] transition-colors hover:text-[#3044bd]"
        >
          ← 返回学习记录
        </Link>

        <div className="mt-6">
          <p className="page-kicker">New learning log</p>
          <h1 className="page-title">新建学习记录</h1>
          <p className="page-description">
            记录学到了什么、哪里还不清楚，以及准备如何继续。保存后可以生成 AI 学习建议。
          </p>
        </div>

        <div className="mt-8">
          <LearningRecordForm action={createLearningRecord} />
        </div>
      </main>
    </div>
  );
}
