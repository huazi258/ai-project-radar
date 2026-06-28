import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderIcon, ProjectIcon } from "@/components/common/ui-icons";
import { ProjectCard } from "@/components/projects/project-card";
import { getCurrentUserProjects } from "@/lib/projects/queries";

export default async function ProjectsPage() {
  const { projects, error, isAuthenticated } = await getCurrentUserProjects();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="app-page">
      <main className="app-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="page-kicker">Project library</p>
            <h1 className="page-title">项目库</h1>
            <p className="page-description">
              集中查看从学习与项目思考中沉淀的项目卡片，并继续完善 PRD。
            </p>
          </div>
          <Link
            href="/project-thinking/new"
            className="button-secondary shrink-0"
          >
            <ProjectIcon className="size-4" />
            推演新项目
          </Link>
        </div>

        {error ? (
          <section className="alert-error mt-8 p-6">
            <h2 className="font-display text-lg font-bold">
              项目读取失败
            </h2>
            <p className="mt-2">{error}</p>
          </section>
        ) : null}

        {!error && projects.length === 0 ? (
          <section className="empty-state mt-8">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#eef0ff] text-[#4056d6]">
              <FolderIcon className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-[#172033]">
              还没有项目卡片
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#6d798e]">
              先写下一条项目思考并生成 AI 方案，再把它保存为项目卡片。
            </p>
            <Link
              href="/project-thinking/new"
              className="button-primary mt-5"
            >
              开始项目思考
            </Link>
          </section>
        ) : null}

        {!error && projects.length > 0 ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
