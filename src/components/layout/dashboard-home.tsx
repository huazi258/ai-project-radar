import Link from "next/link";
import type { DashboardData } from "@/lib/supabase/dashboard";

type DashboardHomeProps = {
  data: DashboardData;
};

const statDescriptions = {
  learningRecords: "来自当前账号的 records 数据",
  expressionEntries: "结构化表达模块尚未建表",
  projectThoughts: "项目思考模块尚未建表",
  projects: "来自当前账号的 projects 数据",
};

const quickActions = [
  {
    title: "写学习记录",
    description: "记录今天学了什么、遇到什么问题，以及下一步准备做什么。",
    href: "/records/new",
  },
  {
    title: "整理一段表达",
    description: "把松散想法整理成更清楚、更适合复制的结构化表达。",
    href: "/expressions/new",
  },
  {
    title: "思考一个项目",
    description: "把项目想法提炼成方向、MVP 范围和后续 PRD。",
    href: "/project-thinking/new",
  },
];

export function DashboardHome({ data }: DashboardHomeProps) {
  const displayName = data.user?.displayName ?? data.user?.email ?? "学习者";
  const stats = [
    {
      label: "最近学习记录数量",
      value: data.stats.learningRecords,
      description: statDescriptions.learningRecords,
    },
    {
      label: "最近结构化表达数量",
      value: data.stats.expressionEntries,
      description: statDescriptions.expressionEntries,
    },
    {
      label: "最近项目思考数量",
      value: data.stats.projectThoughts,
      description: statDescriptions.projectThoughts,
    },
    {
      label: "项目数量",
      value: data.stats.projects,
      description: statDescriptions.projects,
    },
  ];

  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-6xl">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">个人工作台</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
              欢迎回来，{displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
              从学习记录、结构化表达和项目思考三个入口继续沉淀你的 AI 学习过程。
            </p>
          </div>

          <Link
            href="/records/new"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            写学习记录
          </Link>
        </section>

        {data.error ? (
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            统计读取失败：{data.error}
          </p>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-zinc-200 bg-white p-5"
            >
              <p className="text-sm font-medium text-zinc-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-zinc-950">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {item.description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-950">快捷入口</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              >
                <h3 className="text-base font-semibold text-zinc-950">
                  {action.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-950">
              第二版方向
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              当前工作台已经使用真实 records 和 projects 统计。结构化表达和项目思考页面会在后续阶段接入独立数据。
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-950">内容库</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              第一版记录和项目库继续保留，后续会把学习记录、表达整理和项目思考统一沉淀到个人内容库。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/records"
                className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                查看记录
              </Link>
              <Link
                href="/projects"
                className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                查看项目库
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
