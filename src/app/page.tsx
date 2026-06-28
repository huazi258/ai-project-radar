import Link from "next/link";
import {
  ArrowUpRightIcon,
  LearningIcon,
  ProjectIcon,
  RadarIcon,
  StructureIcon,
} from "@/components/common/ui-icons";
import { DashboardHome } from "@/components/layout/dashboard-home";
import { getDashboardData } from "@/lib/supabase/dashboard";

const featureModules = [
  {
    title: "学习记录",
    label: "沉淀过程",
    description: "记录学习内容、状态和反思，再由 AI 提炼知识点、问题与下一步行动。",
    icon: LearningIcon,
    color: "bg-[#eef0ff] text-[#4056d6]",
  },
  {
    title: "结构化表达",
    label: "整理思路",
    description: "把松散描述转换成清晰、有层次、可以直接复制使用的表达。",
    icon: StructureIcon,
    color: "bg-[#e8f8f5] text-[#087b70]",
  },
  {
    title: "项目思考",
    label: "推动想法",
    description: "梳理目标用户、核心问题和 MVP，并继续沉淀为项目卡片与 PRD。",
    icon: ProjectIcon,
    color: "bg-[#f7ecfb] text-[#8b3aa3]",
  },
];

export default async function Home() {
  const dashboardData = await getDashboardData();

  if (dashboardData.isAuthenticated) {
    return <DashboardHome data={dashboardData} />;
  }

  return (
    <div className="app-page">
      <main className="app-container">
        <section className="relative overflow-hidden rounded-[1.6rem] border border-[#dbe2ef] bg-white/82 px-6 py-12 shadow-[0_24px_70px_rgba(48,68,120,0.09)] backdrop-blur-xl sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <div className="relative z-10 max-w-[47rem]">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-[#4056d6] uppercase">
              <RadarIcon className="size-4" />
              AI learning workspace
            </div>
            <h1 className="mt-6 font-display text-[clamp(3rem,8vw,6.6rem)] leading-[0.95] font-bold tracking-[-0.065em] text-[#172033]">
              让每一次学习
              <span className="block text-[#4056d6]">都有下一步。</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#5f6b80] sm:text-lg">
              AI Project Radar 是面向个人学习者的思考工作台。记录过程、整理表达、推演项目，把零散输入变成可以继续行动的成果。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="button-primary">
                开始使用
                <ArrowUpRightIcon className="size-4" />
              </Link>
              <Link href="#features" className="button-secondary">
                看看工作方式
              </Link>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute -right-28 -bottom-44 size-[30rem] rounded-full border border-[#4056d6]/10 sm:-right-16 sm:-bottom-36"
          >
            <div className="absolute inset-14 rounded-full border border-[#4056d6]/12" />
            <div className="absolute inset-28 rounded-full border border-[#4056d6]/14" />
            <div className="absolute top-[6.1rem] left-[7.5rem] size-3 rounded-full bg-[#18a999] shadow-[0_0_0_8px_rgba(24,169,153,0.1)]" />
            <div className="absolute top-1/2 left-1/2 h-px w-[10rem] origin-left -rotate-[32deg] bg-gradient-to-r from-[#4056d6]/30 to-transparent" />
          </div>
        </section>

        <section id="features" className="mt-16 scroll-mt-28">
          <p className="page-kicker">One workspace, three paths</p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-[#172033] sm:text-4xl">
              从输入，到更清楚的成果
            </h2>
            <p className="max-w-md text-sm leading-7 text-[#6d798e]">
              三个模块共用同一套内容脉络，让记录、表达和项目不再散落。
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {featureModules.map((module) => {
              const Icon = module.icon;

              return (
                <article
                  key={module.title}
                  className="surface-card min-h-[16rem] p-6"
                >
                  <span
                    className={`grid size-11 place-items-center rounded-xl ${module.color}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-7 text-xs font-bold tracking-[0.12em] text-[#8a96a9] uppercase">
                    {module.label}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.025em] text-[#172033]">
                    {module.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#637087]">
                    {module.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
