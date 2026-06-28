import { SubmitButton } from "@/components/common/submit-button";

type ProjectThinkingFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

const directionOptions = [
  { label: "学习工具", value: "学习工具" },
  { label: "AI 应用", value: "AI 应用" },
  { label: "效率工具", value: "效率工具" },
  { label: "内容整理", value: "内容整理" },
  { label: "作品展示", value: "作品展示" },
];

const purposeOptions = [
  { label: "练习全栈开发", value: "练习全栈开发" },
  { label: "沉淀学习成果", value: "沉淀学习成果" },
  { label: "解决个人问题", value: "解决个人问题" },
  { label: "作品集展示", value: "作品集展示" },
  { label: "验证产品想法", value: "验证产品想法" },
];

const difficultyOptions = [
  { label: "尽量简单", value: "尽量简单" },
  { label: "适合一周 MVP", value: "适合一周 MVP" },
  { label: "适合个人开发", value: "适合个人开发" },
  { label: "可以稍复杂", value: "可以稍复杂" },
];

const techOptions = [
  { label: "Next.js + Supabase", value: "Next.js + Supabase" },
  { label: "Next.js + AI API", value: "Next.js + AI API" },
  { label: "纯前端优先", value: "纯前端优先" },
  { label: "轻后端优先", value: "轻后端优先" },
  { label: "暂不限定", value: "暂不限定" },
];

export function ProjectThinkingForm({ action }: ProjectThinkingFormProps) {
  return (
    <form action={action} className="form-card">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 sm:col-span-2">
          <span className="field-label">标题</span>
          <input
            name="title"
            type="text"
            required
            placeholder="例如：一个帮助整理学习记录的 AI 工具"
            className="field-control"
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">项目方向</span>
          <select
            name="project_direction"
            required
            defaultValue="AI 应用"
            className="field-control"
          >
            {directionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="field-label">目标用途</span>
          <select
            name="target_purpose"
            required
            defaultValue="沉淀学习成果"
            className="field-control"
          >
            {purposeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="field-label">难度限制</span>
          <select
            name="difficulty_limit"
            required
            defaultValue="适合个人开发"
            className="field-control"
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="field-label">技术偏好</span>
          <select
            name="tech_preference"
            required
            defaultValue="Next.js + Supabase"
            className="field-control"
          >
            {techOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="field-label">标签</span>
          <input
            name="tags"
            type="text"
            placeholder="AI, MVP, 学习工具"
            className="field-control"
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="field-label">原始想法</span>
          <textarea
            name="content"
            rows={12}
            required
            placeholder="写下你的项目想法、当前需求、用户痛点、功能设想或开发限制。"
            className="field-control min-h-72 resize-y"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <SubmitButton
          idleLabel="保存项目思考"
          pendingLabel="正在保存"
        />
      </div>
    </form>
  );
}
