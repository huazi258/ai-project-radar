import Link from "next/link";
import { redirect } from "next/navigation";
import { ProjectCard } from "@/components/projects/project-card";
import { getCurrentUserProjects } from "@/lib/projects/queries";

export default async function ProjectsPage() {
  const { projects, error, isAuthenticated } = await getCurrentUserProjects();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-6xl">
        <div>
          <p className="text-sm font-medium text-zinc-500">Projects</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
            项目列表
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            这里展示你从学习记录和 AI 分析中生成的项目卡片。
          </p>
        </div>

        {error ? (
          <section className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="text-base font-semibold text-red-800">
              项目读取失败
            </h2>
            <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
          </section>
        ) : null}

        {!error && projects.length === 0 ? (
          <section className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-zinc-950">
              还没有项目卡片
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              还没有项目卡片，可以先从记录详情页生成一个项目卡片。
            </p>
            <Link
              href="/records"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              去记录列表
            </Link>
          </section>
        ) : null}

        {!error && projects.length > 0 ? (
          <section className="mt-8 grid gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
