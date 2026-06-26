import { CopyButton } from "@/components/common/copy-button";
import type { AiExpressionStructure } from "@/types/ai";

type ExpressionStructureResultProps = {
  analysis: AiExpressionStructure;
};

export function ExpressionStructureResult({
  analysis,
}: ExpressionStructureResultProps) {
  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-sm font-medium text-zinc-500">核心意思</h3>
        <p className="mt-2 leading-7 text-zinc-700">{analysis.core_meaning}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-500">结构化版本</h3>
        <p className="mt-2 whitespace-pre-line leading-7 text-zinc-700">
          {analysis.structured_version}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-500">优化后提示词</h3>
        <p className="mt-2 whitespace-pre-line leading-7 text-zinc-700">
          {analysis.optimized_prompt}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-500">补充建议</h3>
        <ul className="mt-3 grid gap-2">
          {analysis.suggestions.length > 0 ? (
            analysis.suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
              >
                {suggestion}
              </li>
            ))
          ) : (
            <li className="rounded-md border border-dashed border-zinc-200 px-3 py-2 text-sm text-zinc-500">
              暂无建议
            </li>
          )}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-500">Markdown 输出</h3>
        <CopyButton
          text={analysis.markdown_output}
          label="复制结构化表达 Markdown"
          disabledLabel="暂无结构化表达 Markdown"
          className="mt-3"
        />
        <pre className="mt-3 max-h-80 overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
          {analysis.markdown_output}
        </pre>
      </div>
    </div>
  );
}
