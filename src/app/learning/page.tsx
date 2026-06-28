import Link from "next/link";
import { redirect } from "next/navigation";
import { LearningIcon, PlusIcon } from "@/components/common/ui-icons";
import { LearningRecordCard } from "@/components/learning/learning-record-card";
import { getCurrentUserRecordsByType } from "@/lib/records/queries";

export default async function LearningPage() {
  const { records, error, isAuthenticated } =
    await getCurrentUserRecordsByType("learning_record");

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="app-page">
      <main className="app-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="page-kicker">Learning log</p>
            <h1 className="page-title">学习记录</h1>
            <p className="page-description">
              留下今天学到的、遇到的问题和下一步计划，让每次学习都有迹可循。
            </p>
          </div>

          <Link
            href="/learning/new"
            className="button-primary shrink-0"
          >
            <PlusIcon className="size-4" />
            新建学习记录
          </Link>
        </div>

        {error ? (
          <div className="alert-error mt-8">
            学习记录加载失败：{error}
          </div>
        ) : null}

        {!error && records.length === 0 ? (
          <div className="empty-state mt-8">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#eef0ff] text-[#4056d6]">
              <LearningIcon className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-[#172033]">
              还没有学习记录
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d798e]">
              新建第一条学习记录，把今天学到的东西沉淀下来。
            </p>
            <Link
              href="/learning/new"
              className="button-primary mt-5"
            >
              新建第一条学习记录
            </Link>
          </div>
        ) : null}

        {!error && records.length > 0 ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {records.map((record) => (
              <LearningRecordCard key={record.id} record={record} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
