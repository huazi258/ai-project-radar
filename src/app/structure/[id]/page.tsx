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
    <div className="px-6 py-10">
      <main className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section>
          <Link
            href="/structure"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
          >
            返回结构化表达
          </Link>

          {error ? (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
              <h1 className="text-lg font-semibold text-red-800">
                结构化表达加载失败
              </h1>
              <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
            </div>
          ) : null}

          {!error && (!record || !isStructureRecord) ? (
            <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
              <h1 className="text-lg font-semibold text-zinc-950">
                没有找到这条结构化表达
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                这条记录可能不存在、不属于当前登录用户，或者不是结构化表达类型。
              </p>
              <Link
                href="/structure"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                返回结构化表达
              </Link>
            </div>
          ) : null}

          {record && isStructureRecord ? (
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

        <StructureGenerationPanel
          recordId={id}
          initialAnalysis={latestStructure.report}
          initialError={latestStructure.error}
        />
      </main>
    </div>
  );
}
