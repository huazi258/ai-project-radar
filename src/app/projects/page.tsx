import { ProjectCard } from "@/components/projects/project-card";
import { mockProjects } from "@/lib/mock-data";

export default function ProjectsPage() {
  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-6xl">
        <div>
          <p className="text-sm font-medium text-zinc-500">Projects</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
            项目列表
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            这里使用 mock 数据展示从学习记录生成的项目卡片。
          </p>
        </div>

        <section className="mt-8 grid gap-4">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      </main>
    </div>
  );
}
