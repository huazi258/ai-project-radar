import { CopyButton } from "@/components/common/copy-button";
import type { AiRecordAnalysis } from "@/types/ai";

type AiAnalysisResultProps = {
  analysis: AiRecordAnalysis;
};

export function AiAnalysisResult({ analysis }: AiAnalysisResultProps) {
  return (
    <div className="grid gap-6">
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
        <h3 className="text-sm font-medium text-zinc-500">暴露问题</h3>
        <ul className="mt-3 grid gap-2">
          {analysis.problems.map((problem) => (
            <li
              key={problem}
              className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
            >
              {problem}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-500">下一步行动</h3>
        <ul className="mt-3 grid gap-2">
          {analysis.next_actions.map((action) => (
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
        <h3 className="text-sm font-medium text-zinc-500">Markdown 输出</h3>
        <CopyButton
          text={analysis.markdown_output}
          label="复制 AI 分析 Markdown"
          disabledLabel="暂无 AI 分析 Markdown"
          className="mt-3"
        />
        <pre className="mt-3 overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
          {analysis.markdown_output}
        </pre>
      </div>
    </div>
  );
}
