import Link from "next/link";

const coreFlow = [
  "输入学习记录",
  "AI 结构化分析",
  "生成项目卡片",
  "整理简易 PRD",
  "复制 Markdown",
];

export default function Home() {
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
            把零散的学习记录、AI 使用经验和项目灵感整理成可追踪的项目线索，
            帮助你从学习过程里沉淀出可展示的作品方向。
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              开始使用
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold text-zinc-950">核心流程</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {coreFlow.map((step, index) => (
              <div
                key={step}
                className="rounded-lg border border-zinc-200 bg-white p-4"
              >
                <p className="text-sm font-medium text-zinc-400">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-base font-medium text-zinc-950">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
