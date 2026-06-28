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
      <h3 className="section-label">{title}</h3>
      <ul className="mt-3 grid gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item}
              className="content-panel text-sm leading-6 text-[#4d5a70]"
            >
              {item}
            </li>
          ))
        ) : (
          <li className="content-panel border-dashed text-sm text-[#758197]">
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
    <div className="grid gap-5">
      <div className="rounded-[0.9rem] border border-[#d9ddfa] bg-[#f5f6ff] p-4">
        <h3 className="section-label text-[#5969bf]">学习记录总结</h3>
        <p className="mt-3 leading-7 text-[#39465e]">{analysis.summary}</p>
      </div>

      <ListSection title="已学知识点" items={analysis.learned_points} />
      <ListSection title="当前问题" items={analysis.problems} />
      <ListSection title="学习建议" items={analysis.suggestions} />
      <ListSection title="下一步行动" items={analysis.next_actions} />

      <div>
        <h3 className="section-label">可复制内容</h3>
        <CopyButton
          text={analysis.markdown_output}
          label="复制学习建议 Markdown"
          disabledLabel="暂无学习建议 Markdown"
          className="mt-3"
        />
        <pre className="markdown-panel mt-3">
          {analysis.markdown_output}
        </pre>
      </div>
    </div>
  );
}
