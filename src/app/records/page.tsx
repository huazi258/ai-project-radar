import Link from "next/link";
import { redirect } from "next/navigation";
import { RecordCard } from "@/components/records/record-card";
import { getCurrentUserRecords } from "@/lib/records/queries";

export default async function RecordsPage() {
  const { records, error, isAuthenticated } = await getCurrentUserRecords();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Records</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
              学习记录
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
              这里展示你已经保存到 Supabase records 表中的学习记录。
            </p>
          </div>

          <Link
            href="/records/new"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            新建记录
          </Link>
        </div>

        {error ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            记录加载失败：{error}
          </div>
        ) : null}

        {!error && records.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-zinc-950">
              还没有记录
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              去新建第一条记录，开始整理你的学习雷达。
            </p>
            <Link
              href="/records/new"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              新建第一条记录
            </Link>
          </div>
        ) : null}

        {!error && records.length > 0 ? (
          <section className="mt-8 grid gap-4">
            {records.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
