import Link from "next/link";
import {
  ArrowUpRightIcon,
  FolderIcon,
  LearningIcon,
  ProjectIcon,
  SparkIcon,
  StructureIcon,
} from "@/components/common/ui-icons";
import type { DashboardData } from "@/lib/supabase/dashboard";

type DashboardHomeProps = {
  data: DashboardData;
};

const workbenchModules = [
  {
    title: "学习记录",
    eyebrow: "记录 → 分析",
    description: "把今天学到的、卡住的和下一步计划写下来，让 AI 帮你找到学习节奏。",
    href: "/learning/new",
    cta: "开始记录",
    icon: LearningIcon,
    accent: "#4056d6",
    iconClass: "bg-[#eef0ff] text-[#4056d6]",
  },
  {
    title: "结构化表达",
    eyebrow: "输入 → 整理",
    description: "把口语化想法、任务说明或提示词，整理成清晰且可直接使用的表达。",
    href: "/structure/new",
    cta: "整理表达",
    icon: StructureIcon,
    accent: "#18a999",
    iconClass: "bg-[#e8f8f5] text-[#087b70]",
  },
  {
    title: "项目思考",
    eyebrow: "想法 → 方案",
    description: "从一个模糊想法出发，梳理目标用户、核心问题、MVP 和技术路径。",
    href: "/project-thinking/new",
    cta: "推演项目",
    icon: ProjectIcon,
    accent: "#b45dcb",
    iconClass: "bg-[#f7ecfb] text-[#8b3aa3]",
  },
];

export function DashboardHome({ data }: DashboardHomeProps) {
  const displayName = data.user?.displayName ?? data.user?.email ?? "学习者";

  return (
    <div className="app-page">
      <main className="app-container">
        <section className="relative overflow-hidden rounded-[1.5rem] bg-[#17233d] px-6 py-8 text-white shadow-[0_24px_70px_rgba(23,35,61,0.2)] sm:px-9 sm:py-10 lg:min-h-[22rem] lg:px-12 lg:py-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "linear-gradient(to right, black, transparent 72%)",
            }}
          />

          <div className="relative z-10 max-w-[42rem]">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-[#9fb1df] uppercase">
              <SparkIcon className="size-4" />
              个人 AI 学习工作台
            </div>
            <h1 className="mt-5 font-display text-[clamp(2rem,6vw,4.6rem)] leading-[1.02] font-bold tracking-[-0.055em]">
              把零散学习，
              <span className="block text-[#aebcff]">变成可推进的成果。</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#c7d1e8] sm:text-lg">
              欢迎回来，{displayName}。从一次记录、一段表达或一个想法开始，让 AI 帮你把思考继续往前推。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/learning/new"
                className="button-primary border-[#7184f0] bg-[#7184f0] hover:border-[#8495f6] hover:bg-[#8495f6]"
              >
                写学习记录
                <ArrowUpRightIcon className="size-4" />
              </Link>
              <Link
                href="/library"
                className="button-secondary border-white/15 bg-white/8 text-white hover:border-white/25 hover:bg-white/12 hover:text-white"
              >
                <FolderIcon className="size-4" />
                浏览内容库
              </Link>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute -right-20 -bottom-28 hidden size-[26rem] rounded-full border border-white/10 lg:block"
          >
            <div className="absolute inset-12 rounded-full border border-white/10" />
            <div className="absolute inset-24 rounded-full border border-white/14" />
            <div className="absolute top-[5.2rem] left-[6.1rem] size-3 rounded-full bg-[#6fdfd0] shadow-[0_0_0_7px_rgba(111,223,208,0.12)]" />
            <div className="absolute top-[10.8rem] left-[2.8rem] size-2 rounded-full bg-[#aebcff]" />
            <div className="absolute top-1/2 left-1/2 h-px w-[9rem] origin-left -rotate-[28deg] bg-gradient-to-r from-[#aebcff]/60 to-transparent" />
          </div>
        </section>

        {data.error ? (
          <p className="alert-error mt-6">统计读取失败：{data.error}</p>
        ) : null}

        <section className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="page-kicker">Choose a path</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] text-[#172033] sm:text-3xl">
                今天想推进什么？
              </h2>
            </div>
            <p className="text-sm text-[#758197]">三个入口，对应三种思考节奏</p>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {workbenchModules.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className="surface-card interactive-card group flex min-h-[17rem] flex-col p-6"
                  style={{ "--card-accent": module.accent } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid size-11 place-items-center rounded-xl ${module.iconClass}`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <ArrowUpRightIcon className="size-5 text-[#9aa5b5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#4056d6]" />
                  </div>
                  <p className="mt-7 text-xs font-bold tracking-[0.12em] text-[#8a96a9] uppercase">
                    {module.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.025em] text-[#172033]">
                    {module.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-[#637087]">
                    {module.description}
                  </p>
                  <span className="mt-5 text-sm font-bold text-[#4056d6]">
                    {module.cta}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="surface-card mt-8 grid overflow-hidden sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="p-6 sm:p-7">
            <p className="section-label">你的沉淀</p>
            <div className="mt-4 flex flex-wrap gap-x-10 gap-y-5">
              <div>
                <p className="font-display text-3xl font-bold tracking-[-0.04em] text-[#172033]">
                  {data.stats.learningRecords}
                </p>
                <p className="mt-1 text-sm text-[#758197]">内容条目</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold tracking-[-0.04em] text-[#172033]">
                  {data.stats.projects}
                </p>
                <p className="mt-1 text-sm text-[#758197]">项目卡片</p>
              </div>
            </div>
          </div>
          <div className="border-t border-[#dfe5f0] p-6 sm:border-t-0 sm:border-l sm:p-7">
            <Link href="/projects" className="button-secondary">
              查看项目库
              <ArrowUpRightIcon className="size-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
