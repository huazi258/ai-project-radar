import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusIcon, StructureIcon } from "@/components/common/ui-icons";
import { StructureRecordCard } from "@/components/structure/structure-record-card";
import { getCurrentUserRecordsByType } from "@/lib/records/queries";

export default async function StructurePage() {
  const { records, error, isAuthenticated } =
    await getCurrentUserRecordsByType("structured_expression");

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="app-page">
      <main className="app-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="page-kicker">Structure ideas</p>
            <h1 className="page-title">结构化表达</h1>
            <p className="page-description">
              把松散想法整理成清晰、有层次、可以直接复制使用的表达。
            </p>
          </div>

          <Link
            href="/structure/new"
            className="button-primary shrink-0"
          >
            <PlusIcon className="size-4" />
            新建结构化表达
          </Link>
        </div>

        {error ? (
          <div className="alert-error mt-8">
            结构化表达加载失败：{error}
          </div>
        ) : null}

        {!error && records.length === 0 ? (
          <div className="empty-state mt-8">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#e8f8f5] text-[#087b70]">
              <StructureIcon className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-[#172033]">
              还没有结构化表达任务
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d798e]">
              新建一条表达整理任务，把松散描述沉淀成可继续处理的内容。
            </p>
            <Link
              href="/structure/new"
              className="button-primary mt-5"
            >
              新建第一条结构化表达
            </Link>
          </div>
        ) : null}

        {!error && records.length > 0 ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {records.map((record) => (
              <StructureRecordCard key={record.id} record={record} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
