import Link from "next/link";
import { redirect } from "next/navigation";
import { LearningAnalysisPanel } from "@/components/learning/learning-analysis-panel";
import { getLatestLearningAnalysisReport } from "@/lib/ai/learning-analysis";
import { getCurrentUserRecordById } from "@/lib/records/queries";

type LearningDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LearningDetailPage({
  params,
}: LearningDetailPageProps) {
  const { id } = await params;
  const { record, error, isAuthenticated, userId } =
    await getCurrentUserRecordById(id);

  if (!isAuthenticated) {
    redirect("/login");
  }

  const isLearningRecord = record?.type === "learning_record";
  const latestAnalysis =
    record && isLearningRecord
      ? await getLatestLearningAnalysisReport(record.id, userId)
      : { report: null, error: null };

  return (
    <div className="app-page">
      <main className="app-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem]">
        <section>
          <Link
            href="/learning"
            className="text-sm font-semibold text-[#6d798e] transition-colors hover:text-[#3044bd]"
          >
            ← 返回学习记录
          </Link>

          {error ? (
            <div className="alert-error mt-6 p-6">
              <h1 className="font-display text-lg font-bold">
                学习记录加载失败
              </h1>
              <p className="mt-2">{error}</p>
            </div>
          ) : null}

          {!error && (!record || !isLearningRecord) ? (
            <div className="empty-state mt-6">
              <h1 className="font-display text-xl font-bold text-[#172033]">
                没有找到这条学习记录
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6d798e]">
                这条记录可能不存在、不属于当前登录用户，或者不是学习记录类型。
              </p>
              <Link
                href="/learning"
                className="button-primary mt-5"
              >
                返回学习记录
              </Link>
            </div>
          ) : null}

          {record && isLearningRecord ? (
            <article className="surface-card mt-6 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="badge badge-brand">学习记录</span>
                <p className="text-xs font-semibold text-[#8793a6]">
                  创建于 {record.createdAt}
                </p>
              </div>
              <h1 className="mt-5 font-display text-3xl font-bold tracking-[-0.04em] text-[#172033] sm:text-4xl">
                {record.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-2">
                {record.tags.length > 0 ? (
                  record.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="badge">
                    未添加标签
                  </span>
                )}
              </div>

              <section className="mt-7 border-t border-[#e2e7f0] pt-7">
                <p className="section-label">学习内容</p>
                <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-8 text-[#4d5a70]">
                  {record.content}
                </p>
              </section>
            </article>
          ) : null}
        </section>

        <LearningAnalysisPanel
          recordId={id}
          initialAnalysis={latestAnalysis.report}
          initialError={latestAnalysis.error}
        />
      </main>
    </div>
  );
}
