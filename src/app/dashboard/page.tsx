import Link from "next/link";
import { dashboardStats, mockProjects, mockRecords } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
              欢迎回来，继续整理你的学习雷达
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
              这里先使用 mock 数据展示未来的工作台结构，真实数据会在后续阶段接入。
            </p>
          </div>

          <Link
            href="/records/new"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            快速新建记录
          </Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {dashboardStats.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-zinc-200 bg-white p-5"
            >
              <p className="text-sm font-medium text-zinc-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-zinc-950">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="text-base font-semibold text-zinc-950">
                最近记录
              </h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {mockRecords.slice(0, 3).map((record) => (
                <Link
                  key={record.id}
                  href={`/records/${record.id}`}
                  className="block px-5 py-4 transition-colors hover:bg-zinc-50"
                >
                  <p className="font-medium text-zinc-950">{record.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {record.typeLabel} · {record.createdAt}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="text-base font-semibold text-zinc-950">
                最近项目
              </h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {mockProjects.slice(0, 3).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block px-5 py-4 transition-colors hover:bg-zinc-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-zinc-950">{project.name}</p>
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">
                    {project.techStack.join(" / ")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
