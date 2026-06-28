import Link from "next/link";
import { redirect } from "next/navigation";
import { ProjectThinkingAnalysisPanel } from "@/components/project-thinking/project-thinking-analysis-panel";
import { getLatestProjectThinkingAnalysisReport } from "@/lib/ai/project-thinking-analysis";
import { getCurrentUserRecordById } from "@/lib/records/queries";

type ProjectThinkingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectThinkingDetailPage({
  params,
}: ProjectThinkingDetailPageProps) {
  const { id } = await params;
  const { record, error, isAuthenticated, userId } =
    await getCurrentUserRecordById(id);

  if (!isAuthenticated) {
    redirect("/login");
  }

  const isProjectThinkingRecord = record?.type === "project_thinking";
  const latestProjectThinking =
    record && isProjectThinkingRecord
      ? await getLatestProjectThinkingAnalysisReport(record.id, userId)
      : { report: null, error: null };

  return (
    <div className="app-page">
      <main className="app-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem]">
        <section>
          <Link
            href="/project-thinking"
            className="text-sm font-semibold text-[#6d798e] transition-colors hover:text-[#3044bd]"
          >
            ← 返回项目思考
          </Link>

          {error ? (
            <div className="alert-error mt-6 p-6">
              <h1 className="font-display text-lg font-bold">
                项目思考加载失败
              </h1>
              <p className="mt-2">{error}</p>
            </div>
          ) : null}

          {!error && (!record || !isProjectThinkingRecord) ? (
            <div className="empty-state mt-6">
              <h1 className="font-display text-xl font-bold text-[#172033]">
                没有找到这条项目思考
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6d798e]">
                这条记录可能不存在、不属于当前登录用户，或者不是项目思考类型。
              </p>
              <Link
                href="/project-thinking"
                className="button-primary mt-5"
              >
                返回项目思考
              </Link>
            </div>
          ) : null}

          {record && isProjectThinkingRecord ? (
            <article className="surface-card mt-6 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="badge border-[#ead7ef] bg-[#f7ecfb] text-[#8b3aa3]">
                  原始想法
                </span>
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
                <p className="section-label">项目想法与约束</p>
                <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-8 text-[#4d5a70]">
                  {record.content}
                </p>
              </section>
            </article>
          ) : null}
        </section>

        <ProjectThinkingAnalysisPanel
          recordId={id}
          initialAnalysis={latestProjectThinking.report}
          initialError={latestProjectThinking.error}
        />
      </main>
    </div>
  );
}
