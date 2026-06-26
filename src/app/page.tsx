import Link from "next/link";
import { DashboardHome } from "@/components/layout/dashboard-home";
import { getDashboardData } from "@/lib/supabase/dashboard";

const featureModules = [
  {
    title: "学习记录",
    description:
      "记录今日学习情况、教程笔记、踩坑过程和 AI 使用经验，让 AI 帮你提炼摘要、技能、问题和下一步行动。",
  },
  {
    title: "结构化表达",
    description:
      "把一段松散描述整理成更清晰、更有层次、更适合复制到文档、任务说明或提示词里的表达。",
  },
  {
    title: "项目思考",
    description:
      "把项目想法或当前需求提炼成项目方向、目标用户、MVP 范围、技术方案和简易 PRD。",
  },
];

export default async function Home() {
  const dashboardData = await getDashboardData();

  if (dashboardData.isAuthenticated) {
    return <DashboardHome data={dashboardData} />;
  }

  return (
    <div className="px-6 py-16 sm:py-24">
      <main className="mx-auto w-full max-w-6xl">
        <section className="max-w-3xl">
          <p className="text-sm font-medium text-zinc-500">
            AI 学习项目雷达
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
            AI Project Radar
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
            一个面向个人学习者的 AI 学习工作台，帮助你把学习记录、表达整理和项目思考沉淀成可复制、可追踪、可继续开发的内容。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              开始使用
            </Link>
            <Link
              href="#features"
              className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              查看功能
            </Link>
          </div>
        </section>

        <section id="features" className="mt-16 scroll-mt-24">
          <h2 className="text-xl font-semibold text-zinc-950">三个核心模块</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {featureModules.map((module) => (
              <div
                key={module.title}
                className="rounded-lg border border-zinc-200 bg-white p-5"
              >
                <h3 className="text-base font-semibold text-zinc-950">
                  {module.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {module.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-zinc-950">第一版已跑通</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
            当前项目已经完成从学习记录到 AI 分析、项目卡片、PRD 和 Markdown 复制的 MVP 闭环。第二版会在这个基础上，把入口扩展为学习记录、结构化表达和项目思考。
          </p>
        </section>
      </main>
    </div>
  );
}
