import Link from "next/link";
import { RecordCard } from "@/components/records/record-card";
import { mockRecords } from "@/lib/mock-data";

export default function RecordsPage() {
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
              这里使用 mock 数据展示记录列表结构，后续会接入真实数据。
            </p>
          </div>

          <Link
            href="/records/new"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            新建记录
          </Link>
        </div>

        <section className="mt-8 grid gap-4">
          {mockRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </section>
      </main>
    </div>
  );
}
