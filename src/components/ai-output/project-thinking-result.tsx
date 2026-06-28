import { CopyButton } from "@/components/common/copy-button";
import type { AiProjectThinkingAnalysis } from "@/types/ai";

type ProjectThinkingResultProps = {
  analysis: AiProjectThinkingAnalysis;
};

function TextSection({ title, items }: { title: string; items: string[] }) {
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

      <TextSection title="MVP 功能" items={analysis.mvp_features} />
      <TextSection title="页面结构" items={analysis.page_structure} />
      <TextSection title="数据模型" items={analysis.data_model} />
      <TextSection title="技术栈" items={analysis.tech_stack} />
      <TextSection title="开发阶段" items={analysis.development_steps} />

      <div>
        <h3 className="section-label">可复制内容</h3>
        <CopyButton
          text={analysis.markdown_output}
          label="复制项目方案 Markdown"
          disabledLabel="暂无项目方案 Markdown"
          className="mt-3"
        />
      </div>
    </div>
  );
}
