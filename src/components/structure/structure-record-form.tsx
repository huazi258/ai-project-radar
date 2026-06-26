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
    <form
      action={action}
      className="rounded-lg border border-zinc-200 bg-white p-6"
    >
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">标题</span>
          <input
            name="title"
            type="text"
            required
            placeholder="例如：整理一段给 Codex 的任务说明"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">表达用途</span>
          <select
            name="target_usage"
            required
            defaultValue="发给 AI"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-500"
          >
            {targetUsageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">输出风格</span>
          <select
            name="output_style"
            required
            defaultValue="清晰简洁"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-500"
          >
            {outputStyleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">标签</span>
          <input
            name="tags"
            type="text"
            placeholder="表达, Prompt, 需求说明"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">原始输入</span>
          <textarea
            name="content"
            rows={12}
            required
            placeholder="写下你想整理的一段原始描述，可以是口语化想法、需求说明、任务描述或汇报内容。"
            className="resize-none rounded-md border border-zinc-300 px-3 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          保存结构化表达
        </button>
      </div>
    </form>
  );
}
