import Link from "next/link";
import { RecordForm } from "@/components/records/record-form";

export default function NewRecordPage() {
  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-4xl">
        <Link
          href="/records"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
        >
          返回记录列表
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-zinc-500">New Record</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
            新建学习记录
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            当前是静态表单占位，不会真实提交或保存数据。
          </p>
        </div>

        <div className="mt-8">
          <RecordForm />
        </div>
      </main>
    </div>
  );
}
