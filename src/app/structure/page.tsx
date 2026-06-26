import Link from "next/link";
import { redirect } from "next/navigation";
import { StructureRecordCard } from "@/components/structure/structure-record-card";
import { getCurrentUserRecordsByType } from "@/lib/records/queries";

export default async function StructurePage() {
  const { records, error, isAuthenticated } =
    await getCurrentUserRecordsByType("structured_expression");

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Structure</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
              结构化表达
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
              只展示当前账号下 type 为 structured_expression 的表达整理任务。
            </p>
          </div>

          <Link
            href="/structure/new"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            新建结构化表达
          </Link>
        </div>

        {error ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            结构化表达加载失败：{error}
          </div>
        ) : null}

        {!error && records.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-zinc-950">
              还没有结构化表达任务
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              新建一条表达整理任务，把松散描述沉淀成可继续处理的内容。
            </p>
            <Link
              href="/structure/new"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              新建第一条结构化表达
            </Link>
          </div>
        ) : null}

        {!error && records.length > 0 ? (
          <section className="mt-8 grid gap-4">
            {records.map((record) => (
              <StructureRecordCard key={record.id} record={record} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
