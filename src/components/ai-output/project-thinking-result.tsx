import { CopyButton } from "@/components/common/copy-button";
import type { AiProjectThinkingAnalysis } from "@/types/ai";

type ProjectThinkingResultProps = {
  analysis: AiProjectThinkingAnalysis;
};

function ListSection({ title, items }: { title: string; items: string[] }) {
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

export function ProjectThinkingResult({ analysis }: ProjectThinkingResultProps) {
  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-sm font-medium text-zinc-500">项目名称</h3>
        <p className="mt-2 text-lg font-semibold text-zinc-950">
          {analysis.project_name}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-500">项目简介</h3>
        <p className="mt-2 leading-7 text-zinc-700">
          {analysis.project_summary}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-500">目标用户</h3>
        <p className="mt-2 leading-7 text-zinc-700">{analysis.target_user}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-500">核心问题</h3>
        <p className="mt-2 leading-7 text-zinc-700">{analysis.core_problem}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-zinc-500">项目价值</h3>
        <p className="mt-2 leading-7 text-zinc-700">{analysis.project_value}</p>
      </div>

      <ListSection title="MVP 功能" items={analysis.mvp_features} />
      <ListSection title="页面结构" items={analysis.page_structure} />
      <ListSection title="数据模型" items={analysis.data_model} />
      <ListSection title="技术栈" items={analysis.tech_stack} />
      <ListSection title="开发阶段" items={analysis.development_steps} />

      <div>
        <h3 className="text-sm font-medium text-zinc-500">Markdown 输出</h3>
        <CopyButton
          text={analysis.markdown_output}
          label="复制项目方案 Markdown"
          disabledLabel="暂无项目方案 Markdown"
          className="mt-3"
        />
        <pre className="mt-3 max-h-80 overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
          {analysis.markdown_output}
        </pre>
      </div>
    </div>
  );
}
