import { CopyButton } from "@/components/common/copy-button";
import type { AiExpressionStructure } from "@/types/ai";

type ExpressionStructureResultProps = {
  analysis: AiExpressionStructure;
};

export function ExpressionStructureResult({
  analysis,
}: ExpressionStructureResultProps) {
  return (
    <div className="grid gap-5">
      <div className="content-panel">
        <h3 className="section-label">核心意思</h3>
        <p className="mt-3 leading-7 text-[#4d5a70]">{analysis.core_meaning}</p>
      </div>

      <div className="rounded-[0.9rem] border border-[#c9e9e4] bg-[#f1fbf9] p-4">
        <h3 className="section-label text-[#087b70]">优化表达</h3>
        <p className="mt-3 whitespace-pre-line leading-7 text-[#334f4c]">
          {analysis.structured_version}
        </p>
      </div>

      <div className="content-panel">
        <h3 className="section-label">可直接使用的提示词</h3>
        <p className="mt-3 whitespace-pre-line leading-7 text-[#4d5a70]">
          {analysis.optimized_prompt}
        </p>
      </div>

      <div>
        <h3 className="section-label">结构拆解与建议</h3>
        <ul className="mt-3 grid gap-2">
          {analysis.suggestions.length > 0 ? (
            analysis.suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="content-panel text-sm leading-6 text-[#4d5a70]"
              >
                {suggestion}
              </li>
            ))
          ) : (
            <li className="content-panel border-dashed text-sm text-[#758197]">
              暂无建议
            </li>
          )}
        </ul>
      </div>

      <div>
        <h3 className="section-label">可复制内容</h3>
        <CopyButton
          text={analysis.markdown_output}
          label="复制结构化表达 Markdown"
          disabledLabel="暂无结构化表达 Markdown"
          className="mt-3"
        />
        <pre className="markdown-panel mt-3">
          {analysis.markdown_output}
        </pre>
      </div>
    </div>
  );
}
