import { redirect } from "next/navigation";
import { LibraryRecordCard } from "@/components/library/library-record-card";
import { LibraryTypeFilter } from "@/components/library/library-type-filter";
import { getCurrentUserRecords } from "@/lib/records/queries";
import type { RecordType } from "@/types/record";

type LibraryPageProps = {
  searchParams?: Promise<{
    type?: string;
  }>;
};

const libraryFilterTypes = [
  "learning_record",
  "structured_expression",
  "project_thinking",
] as const satisfies readonly RecordType[];

type LibraryFilterType = (typeof libraryFilterTypes)[number];
type ActiveLibraryType = "all" | LibraryFilterType;

function normalizeLibraryFilter(value?: string): ActiveLibraryType {
  if (libraryFilterTypes.includes(value as LibraryFilterType)) {
    return value as LibraryFilterType;
  }

  return "all";
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeType = normalizeLibraryFilter(resolvedSearchParams?.type);
  const { records, error, isAuthenticated } = await getCurrentUserRecords();

  if (!isAuthenticated) {
    redirect("/login");
  }

  const filteredRecords =
    activeType === "all"
      ? records
      : records.filter((record) => record.type === activeType);

  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Library</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
              内容库
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
              汇总当前账号下的全部内容，并按学习记录、结构化表达和项目思考进行轻量筛选。
            </p>
          </div>
        </div>

        <div className="mt-8">
          <LibraryTypeFilter activeType={activeType} />
        </div>

        {error ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            内容库加载失败：{error}
          </div>
        ) : null}

        {!error && filteredRecords.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-zinc-950">
              暂无内容
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              当前筛选条件下还没有内容。你可以先新建学习记录、结构化表达或项目思考。
            </p>
          </div>
        ) : null}

        {!error && filteredRecords.length > 0 ? (
          <section className="mt-8 grid gap-4">
            {filteredRecords.map((record) => (
              <LibraryRecordCard key={record.id} record={record} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
