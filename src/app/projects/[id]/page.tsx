import Link from "next/link";
import { redirect } from "next/navigation";
import { CopyButton } from "@/components/common/copy-button";
import { PrdPreview } from "@/components/projects/prd-preview";
import { formatProjectCardMarkdown } from "@/lib/markdown/project";
import { getCurrentUserProjectById } from "@/lib/projects/queries";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return "未记录";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const statusLabels: Record<string, string> = {
  idea: "想法",
  planning: "规划中",
  building: "开发中",
  done: "已完成",
  paused: "已暂停",
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const { project, error, isAuthenticated } =
    await getCurrentUserProjectById(id);

  if (!isAuthenticated) {
    redirect("/login");
  }

  const projectMarkdown = project ? formatProjectCardMarkdown(project) : "";

  return (
    <div className="app-page">
      <main className="app-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem]">
        <section>
          <Link
            href="/projects"
            className="text-sm font-semibold text-[#6d798e] transition-colors hover:text-[#3044bd]"
          >
            ← 返回项目库
          </Link>

          {error ? (
            <div className="alert-error mt-6 p-6">
              <h1 className="font-display text-lg font-bold">
                项目读取失败
              </h1>
              <p className="mt-2">{error}</p>
            </div>
          ) : null}

          {!error && !project ? (
            <div className="empty-state mt-6">
              <h1 className="font-display text-xl font-bold text-[#172033]">
                没有找到这个项目
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6d798e]">
                这个项目可能不存在，或者不属于当前登录用户。
              </p>
              <Link
                href="/projects"
                className="button-primary mt-5"
              >
                返回项目库
              </Link>
            </div>
          ) : null}

          {project ? (
            <article className="surface-card mt-6 p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8793a6]">
                    创建于 {formatDateTime(project.created_at)}
                  </p>
                  <h1 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-[#172033] sm:text-4xl">
                    {project.name}
                  </h1>
                </div>
                <span className="badge badge-brand">
                  {statusLabels[project.status] ?? project.status}
                </span>
              </div>

              <CopyButton
                text={projectMarkdown}
                label="复制项目卡片 Markdown"
                disabledLabel="暂无项目卡片 Markdown"
                className="mt-5"
              />

              <dl className="mt-7 grid gap-3 rounded-2xl border border-[#e1e6ef] bg-[#f8faff] p-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="section-label">项目状态</dt>
                  <dd className="mt-2 text-[#4d5a70]">
                    {statusLabels[project.status] ?? project.status}
                  </dd>
                </div>
                <div>
                  <dt className="section-label">来源记录</dt>
                  <dd className="mt-2 truncate text-[#4d5a70]" title={project.source_record_id}>
                    {project.source_record_id}
                  </dd>
                </div>
                <div>
                  <dt className="section-label">更新时间</dt>
                  <dd className="mt-2 text-[#4d5a70]">
                    {formatDateTime(project.updated_at)}
                  </dd>
                </div>
              </dl>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <section className="content-panel sm:col-span-2">
                  <h2 className="section-label">项目简介</h2>
                  <p className="mt-3 leading-7 text-[#4d5a70]">
                    {project.description}
                  </p>
                </section>

                <section className="content-panel">
                  <h2 className="section-label">目标用户</h2>
                  <p className="mt-3 leading-7 text-[#4d5a70]">
                    {project.target_user}
                  </p>
                </section>

                <section className="content-panel">
                  <h2 className="section-label">核心问题</h2>
                  <p className="mt-3 leading-7 text-[#4d5a70]">
                    {project.pain_point}
                  </p>
                </section>

                <section className="content-panel sm:col-span-2">
                  <h2 className="section-label">MVP 功能</h2>
                  <ul className="mt-3 grid gap-2">
                    {project.mvp_scope.length > 0 ? (
                      project.mvp_scope.map((item) => (
                        <li
                          key={item}
                          className="rounded-xl border border-[#e1e6ef] bg-white px-3 py-2 text-sm leading-6 text-[#4d5a70]"
                        >
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="rounded-xl border border-dashed border-[#d6ddea] px-3 py-2 text-sm text-[#758197]">
                        暂未生成 MVP 功能
                      </li>
                    )}
                  </ul>
                </section>

                <section className="content-panel sm:col-span-2">
                  <h2 className="section-label">技术栈</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tech_stack.length > 0 ? (
                      project.tech_stack.map((item) => (
                        <span
                          key={item}
                          className="badge badge-signal"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="badge">
                        未添加技术栈
                      </span>
                    )}
                  </div>
                </section>
              </div>
            </article>
          ) : null}
        </section>

        <PrdPreview projectId={project?.id} markdown={project?.prd_markdown} />
      </main>
    </div>
  );
}
