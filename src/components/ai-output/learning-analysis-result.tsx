import { CopyButton } from "@/components/common/copy-button";
import type { AiLearningAnalysis } from "@/types/ai";

type LearningAnalysisResultProps = {
  analysis: AiLearningAnalysis;
};

function TextSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="section-label">{title}</h3>
      <div
        className={`content-panel mt-3 text-sm leading-7 whitespace-pre-line ${
          items.length > 0
            ? "text-[#4d5a70]"
            : "border-dashed text-[#758197]"
        }`}
      >
        {items.length > 0 ? items.join("\n") : "暂无内容"}
      </div>
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

      <TextSection title="已学知识点" items={analysis.learned_points} />
      <TextSection title="当前问题" items={analysis.problems} />
      <TextSection title="学习建议" items={analysis.suggestions} />
      <TextSection title="下一步行动" items={analysis.next_actions} />

      <div>
        <h3 className="section-label">可复制内容</h3>
        <CopyButton
          text={analysis.markdown_output}
          label="复制学习建议 Markdown"
          disabledLabel="暂无学习建议 Markdown"
          className="mt-3"
        />
      </div>
    </div>
  );
}
