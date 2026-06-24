import Link from "next/link";
import { PrdPreview } from "@/components/projects/prd-preview";
import { mockProjectPrd, mockProjects } from "@/lib/mock-data";

export default function ProjectDetailPage() {
  const project = mockProjects[0];

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

          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  {project.createdAt}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
                  {project.name}
                </h1>
              </div>
              <span className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                {project.status}
              </span>
            </div>

            <div className="mt-6 grid gap-6">
              <section>
                <h2 className="text-sm font-medium text-zinc-500">项目简介</h2>
                <p className="mt-2 leading-7 text-zinc-700">
                  {project.description}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-medium text-zinc-500">目标用户</h2>
                <p className="mt-2 leading-7 text-zinc-700">
                  {project.targetUser}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-medium text-zinc-500">核心痛点</h2>
                <p className="mt-2 leading-7 text-zinc-700">
                  {project.painPoint}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-medium text-zinc-500">MVP 功能</h2>
                <ul className="mt-3 grid gap-2">
                  {project.mvpScope.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-sm font-medium text-zinc-500">技术栈</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        <PrdPreview prd={mockProjectPrd} />
      </main>
    </div>
  );
}
