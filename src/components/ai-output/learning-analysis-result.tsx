import { CopyButton } from "@/components/common/copy-button";
import type { AiLearningAnalysis } from "@/types/ai";

type LearningAnalysisResultProps = {
  analysis: AiLearningAnalysis;
};

function ListSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
      <ul className="mt-3 grid gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item}
              className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
            >
              {item}
            </li>
          ))
        ) : (
          <li className="rounded-md border border-dashed border-zinc-200 px-3 py-2 text-sm text-zinc-500">
            暂无内容
          </li>
        )}
      </ul>
    </div>
  );
}

export function LearningAnalysisResult({
  analysis,
}: LearningAnalysisResultProps) {
  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-sm font-medium text-zinc-500">学习记录总结</h3>
        <p className="mt-2 leading-7 text-zinc-700">{analysis.summary}</p>
      </div>

      <ListSection title="已学知识点" items={analysis.learned_points} />
      <ListSection title="当前问题" items={analysis.problems} />
      <ListSection title="学习建议" items={analysis.suggestions} />
      <ListSection title="下一步行动" items={analysis.next_actions} />

      <div>
        <h3 className="text-sm font-medium text-zinc-500">Markdown 输出</h3>
        <CopyButton
          text={analysis.markdown_output}
          label="复制学习建议 Markdown"
          disabledLabel="暂无学习建议 Markdown"
          className="mt-3"
        />
        <pre className="mt-3 max-h-80 overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
          {analysis.markdown_output}
        </pre>
      </div>
    </div>
  );
}
