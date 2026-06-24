import Link from "next/link";
import type { AiAnalysisPreview } from "@/types/record";

type AiAnalysisPreviewPanelProps = {
  analysis: AiAnalysisPreview;
};

export function AiAnalysisPreviewPanel({
  analysis,
}: AiAnalysisPreviewPanelProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">
          AI 分析结果预览
        </h2>
      </div>

      <div className="grid gap-6 p-5">
        <div>
          <h3 className="text-sm font-medium text-zinc-500">内容摘要</h3>
          <p className="mt-2 leading-7 text-zinc-700">{analysis.summary}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-500">技能标签</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-500">下一步任务</h3>
          <ul className="mt-3 grid gap-2">
            {analysis.nextActions.map((action) => (
              <li
                key={action}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
              >
                {action}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-500">Markdown 预览</h3>
          <pre className="mt-3 overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
            {analysis.markdown}
          </pre>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/projects/1"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            生成项目卡片
          </Link>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            复制 Markdown
          </button>
        </div>
      </div>
    </section>
  );
}
