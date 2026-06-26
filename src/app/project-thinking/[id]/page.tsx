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
    <div className="px-6 py-10">
      <main className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section>
          <Link
            href="/project-thinking"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
          >
            返回项目思考
          </Link>

          {error ? (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
              <h1 className="text-lg font-semibold text-red-800">
                项目思考加载失败
              </h1>
              <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
            </div>
          ) : null}

          {!error && (!record || !isProjectThinkingRecord) ? (
            <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
              <h1 className="text-lg font-semibold text-zinc-950">
                没有找到这条项目思考
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                这条记录可能不存在、不属于当前登录用户，或者不是项目思考类型。
              </p>
              <Link
                href="/project-thinking"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                返回项目思考
              </Link>
            </div>
          ) : null}

          {record && isProjectThinkingRecord ? (
            <article className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
              <p className="text-sm font-medium text-zinc-500">
                创建于 {record.createdAt}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
                {record.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {record.tags.length > 0 ? (
                  record.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500">
                    未添加标签
                  </span>
                )}
              </div>

              <p className="mt-6 whitespace-pre-line leading-8 text-zinc-700">
                {record.content}
              </p>
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
