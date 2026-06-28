import { SubmitButton } from "@/components/common/submit-button";

type StructureRecordFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

const targetUsageOptions = [
  { label: "发给 AI", value: "发给 AI" },
  { label: "写作表达", value: "写作表达" },
  { label: "汇报说明", value: "汇报说明" },
  { label: "社交沟通", value: "社交沟通" },
  { label: "项目说明", value: "项目说明" },
];

const outputStyleOptions = [
  { label: "清晰简洁", value: "清晰简洁" },
  { label: "正式书面", value: "正式书面" },
  { label: "适合给 AI", value: "适合给 AI" },
  { label: "口语自然", value: "口语自然" },
  { label: "逻辑分点", value: "逻辑分点" },
];

export function StructureRecordForm({ action }: StructureRecordFormProps) {
  return (
    <form action={action} className="form-card">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 sm:col-span-2">
          <span className="field-label">标题</span>
          <input
            name="title"
            type="text"
            required
            placeholder="例如：整理一段给 Codex 的任务说明"
            className="field-control"
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">表达用途</span>
          <select
            name="target_usage"
            required
            defaultValue="发给 AI"
            className="field-control"
          >
            {targetUsageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="field-label">输出风格</span>
          <select
            name="output_style"
            required
            defaultValue="清晰简洁"
            className="field-control"
          >
            {outputStyleOptions.map((option) => (
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
            placeholder="表达, Prompt, 需求说明"
            className="field-control"
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="field-label">原始输入</span>
          <textarea
            name="content"
            rows={12}
            required
            placeholder="写下你想整理的一段原始描述，可以是口语化想法、需求说明、任务描述或汇报内容。"
            className="field-control min-h-72 resize-y"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <SubmitButton
          idleLabel="保存结构化表达"
          pendingLabel="正在保存"
        />
      </div>
    </form>
  );
}
