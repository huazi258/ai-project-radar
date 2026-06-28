import { CopyButton } from "@/components/common/copy-button";
import type { AiProjectThinkingAnalysis } from "@/types/ai";

type ProjectThinkingResultProps = {
  analysis: AiProjectThinkingAnalysis;
};

function ListSection({ title, items }: { title: string; items: string[] }) {
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

export function ProjectThinkingResult({ analysis }: ProjectThinkingResultProps) {
  return (
    <div className="grid gap-5">
      <div className="rounded-[0.9rem] border border-[#ead7ef] bg-[#fbf5fd] p-4">
        <h3 className="section-label text-[#8b3aa3]">项目名称</h3>
        <p className="mt-3 font-display text-xl font-bold tracking-[-0.025em] text-[#172033]">
          {analysis.project_name}
        </p>
      </div>

      <div className="content-panel">
        <h3 className="section-label">项目简介</h3>
        <p className="mt-3 leading-7 text-[#4d5a70]">
          {analysis.project_summary}
        </p>
      </div>

      <div className="content-panel">
        <h3 className="section-label">目标用户</h3>
        <p className="mt-3 leading-7 text-[#4d5a70]">{analysis.target_user}</p>
      </div>

      <div className="content-panel">
        <h3 className="section-label">核心问题</h3>
        <p className="mt-3 leading-7 text-[#4d5a70]">{analysis.core_problem}</p>
      </div>

      <div className="content-panel">
        <h3 className="section-label">项目价值</h3>
        <p className="mt-3 leading-7 text-[#4d5a70]">{analysis.project_value}</p>
      </div>

      <ListSection title="MVP 功能" items={analysis.mvp_features} />
      <ListSection title="页面结构" items={analysis.page_structure} />
      <ListSection title="数据模型" items={analysis.data_model} />
      <ListSection title="技术栈" items={analysis.tech_stack} />
      <ListSection title="开发阶段" items={analysis.development_steps} />

      <div>
        <h3 className="section-label">可复制内容</h3>
        <CopyButton
          text={analysis.markdown_output}
          label="复制项目方案 Markdown"
          disabledLabel="暂无项目方案 Markdown"
          className="mt-3"
        />
        <pre className="markdown-panel mt-3">
          {analysis.markdown_output}
        </pre>
      </div>
    </div>
  );
}
