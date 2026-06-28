import { redirect } from "next/navigation";
import { FolderIcon } from "@/components/common/ui-icons";
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
    <div className="app-page">
      <main className="app-container">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="page-kicker">Content library</p>
            <h1 className="page-title">内容库</h1>
            <p className="page-description">
              汇总当前账号下的全部内容，并按学习记录、结构化表达和项目思考进行轻量筛选。
            </p>
          </div>
        </div>

        <div className="mt-8">
          <LibraryTypeFilter activeType={activeType} />
        </div>

        {error ? (
          <div className="alert-error mt-8">
            内容库加载失败：{error}
          </div>
        ) : null}

        {!error && filteredRecords.length === 0 ? (
          <div className="empty-state mt-8">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#eef0ff] text-[#4056d6]">
              <FolderIcon className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-[#172033]">
              暂无内容
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d798e]">
              当前筛选条件下还没有内容。你可以先新建学习记录、结构化表达或项目思考。
            </p>
          </div>
        ) : null}

        {!error && filteredRecords.length > 0 ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {filteredRecords.map((record) => (
              <LibraryRecordCard key={record.id} record={record} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
