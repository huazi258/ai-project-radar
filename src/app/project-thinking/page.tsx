import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusIcon, ProjectIcon } from "@/components/common/ui-icons";
import { ProjectThinkingCard } from "@/components/project-thinking/project-thinking-card";
import { getCurrentUserRecordsByType } from "@/lib/records/queries";

export default async function ProjectThinkingPage() {
  const { records, error, isAuthenticated } =
    await getCurrentUserRecordsByType("project_thinking");

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="app-page">
      <main className="app-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="page-kicker">Project thinking</p>
            <h1 className="page-title">项目思考</h1>
            <p className="page-description">
              从一个模糊想法出发，梳理目标用户、核心问题、MVP 和技术路径。
            </p>
          </div>

          <Link
            href="/project-thinking/new"
            className="button-primary shrink-0"
          >
            <PlusIcon className="size-4" />
            新建项目思考
          </Link>
        </div>

        {error ? (
          <div className="alert-error mt-8">
            项目思考加载失败：{error}
          </div>
        ) : null}

        {!error && records.length === 0 ? (
          <div className="empty-state mt-8">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f7ecfb] text-[#8b3aa3]">
              <ProjectIcon className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-[#172033]">
              还没有项目思考
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d798e]">
              新建一条项目思考，把想法、约束和技术偏好先沉淀下来。
            </p>
            <Link
              href="/project-thinking/new"
              className="button-primary mt-5"
            >
              新建第一条项目思考
            </Link>
          </div>
        ) : null}

        {!error && records.length > 0 ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {records.map((record) => (
              <ProjectThinkingCard key={record.id} record={record} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
