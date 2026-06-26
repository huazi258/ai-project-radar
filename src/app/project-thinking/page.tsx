import Link from "next/link";
import { redirect } from "next/navigation";
import { ProjectThinkingCard } from "@/components/project-thinking/project-thinking-card";
import { getCurrentUserRecordsByType } from "@/lib/records/queries";

export default async function ProjectThinkingPage() {
  const { records, error, isAuthenticated } =
    await getCurrentUserRecordsByType("project_thinking");

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              Project Thinking
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
              项目思考
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
              只展示当前账号下 type 为 project_thinking 的项目想法和需求思考。
            </p>
          </div>

          <Link
            href="/project-thinking/new"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            新建项目思考
          </Link>
        </div>

        {error ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            项目思考加载失败：{error}
          </div>
        ) : null}

        {!error && records.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-zinc-950">
              还没有项目思考
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              新建一条项目思考，把想法、约束和技术偏好先沉淀下来。
            </p>
            <Link
              href="/project-thinking/new"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              新建第一条项目思考
            </Link>
          </div>
        ) : null}

        {!error && records.length > 0 ? (
          <section className="mt-8 grid gap-4">
            {records.map((record) => (
              <ProjectThinkingCard key={record.id} record={record} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
