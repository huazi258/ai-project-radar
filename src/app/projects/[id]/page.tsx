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
    <div className="px-6 py-10">
      <main className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section>
          <Link
            href="/projects"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
          >
            返回项目列表
          </Link>

          {error ? (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
              <h1 className="text-lg font-semibold text-red-800">
                项目读取失败
              </h1>
              <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
            </div>
          ) : null}

          {!error && !project ? (
            <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
              <h1 className="text-lg font-semibold text-zinc-950">
                没有找到这个项目
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                这个项目可能不存在，或者不属于当前登录用户。
              </p>
              <Link
                href="/projects"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                返回项目列表
              </Link>
            </div>
          ) : null}

          {project ? (
            <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    创建于 {formatDateTime(project.created_at)}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
                    {project.name}
                  </h1>
                </div>
                <span className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                  {project.status}
                </span>
              </div>

              <CopyButton
                text={projectMarkdown}
                label="复制项目卡片 Markdown"
                disabledLabel="暂无项目卡片 Markdown"
                className="mt-5"
              />

              <dl className="mt-6 grid gap-3 rounded-md bg-zinc-50 p-4 text-sm text-zinc-600 sm:grid-cols-3">
                <div>
                  <dt className="font-medium text-zinc-500">项目状态</dt>
                  <dd className="mt-1 text-zinc-700">{project.status}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-500">来源记录</dt>
                  <dd className="mt-1 break-all text-zinc-700">
                    {project.source_record_id}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-500">更新时间</dt>
                  <dd className="mt-1 text-zinc-700">
                    {formatDateTime(project.updated_at)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 grid gap-6">
                <section>
                  <h2 className="text-sm font-medium text-zinc-500">
                    项目简介
                  </h2>
                  <p className="mt-2 leading-7 text-zinc-700">
                    {project.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-sm font-medium text-zinc-500">
                    目标用户
                  </h2>
                  <p className="mt-2 leading-7 text-zinc-700">
                    {project.target_user}
                  </p>
                </section>

                <section>
                  <h2 className="text-sm font-medium text-zinc-500">
                    核心痛点
                  </h2>
                  <p className="mt-2 leading-7 text-zinc-700">
                    {project.pain_point}
                  </p>
                </section>

                <section>
                  <h2 className="text-sm font-medium text-zinc-500">
                    MVP 功能
                  </h2>
                  <ul className="mt-3 grid gap-2">
                    {project.mvp_scope.length > 0 ? (
                      project.mvp_scope.map((item) => (
                        <li
                          key={item}
                          className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
                        >
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-500">
                        暂未生成 MVP 功能
                      </li>
                    )}
                  </ul>
                </section>

                <section>
                  <h2 className="text-sm font-medium text-zinc-500">
                    技术栈
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tech_stack.length > 0 ? (
                      project.tech_stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                        未添加技术栈
                      </span>
                    )}
                  </div>
                </section>
              </div>
            </div>
          ) : null}
        </section>

        <PrdPreview projectId={project?.id} markdown={project?.prd_markdown} />
      </main>
    </div>
  );
}
