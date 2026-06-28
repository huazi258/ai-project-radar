import Link from "next/link";
import { redirect } from "next/navigation";
import { StructureGenerationPanel } from "@/components/structure/structure-generation-panel";
import { getLatestExpressionStructureReport } from "@/lib/ai/expression-structure";
import { getCurrentUserRecordById } from "@/lib/records/queries";

type StructureDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StructureDetailPage({
  params,
}: StructureDetailPageProps) {
  const { id } = await params;
  const { record, error, isAuthenticated, userId } =
    await getCurrentUserRecordById(id);

  if (!isAuthenticated) {
    redirect("/login");
  }

  const isStructureRecord = record?.type === "structured_expression";
  const latestStructure =
    record && isStructureRecord
      ? await getLatestExpressionStructureReport(record.id, userId)
      : { report: null, error: null };

  return (
    <div className="app-page">
      <main className="app-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem]">
        <section>
          <Link
            href="/structure"
            className="text-sm font-semibold text-[#6d798e] transition-colors hover:text-[#3044bd]"
          >
            ← 返回结构化表达
          </Link>

          {error ? (
            <div className="alert-error mt-6 p-6">
              <h1 className="font-display text-lg font-bold">
                结构化表达加载失败
              </h1>
              <p className="mt-2">{error}</p>
            </div>
          ) : null}

          {!error && (!record || !isStructureRecord) ? (
            <div className="empty-state mt-6">
              <h1 className="font-display text-xl font-bold text-[#172033]">
                没有找到这条结构化表达
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6d798e]">
                这条记录可能不存在、不属于当前登录用户，或者不是结构化表达类型。
              </p>
              <Link
                href="/structure"
                className="button-primary mt-5"
              >
                返回结构化表达
              </Link>
            </div>
          ) : null}

          {record && isStructureRecord ? (
            <article className="surface-card mt-6 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="badge badge-signal">原始输入</span>
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
                <p className="section-label">待整理内容</p>
                <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-8 text-[#4d5a70]">
                  {record.content}
                </p>
              </section>
            </article>
          ) : null}
        </section>

        <StructureGenerationPanel
          recordId={id}
          initialAnalysis={latestStructure.report}
          initialError={latestStructure.error}
        />
      </main>
    </div>
  );
}
