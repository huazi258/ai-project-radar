type LearningRecordFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

const learningCategories = [
  { label: "编程学习", value: "programming" },
  { label: "AI 工具使用", value: "ai_usage" },
  { label: "教程笔记", value: "tutorial" },
  { label: "项目练习", value: "project_practice" },
  { label: "每日复盘", value: "daily_review" },
];

const learningStatuses = [
  { label: "刚开始", value: "started" },
  { label: "进行中", value: "in_progress" },
  { label: "已完成", value: "completed" },
  { label: "需要复习", value: "needs_review" },
];

export function LearningRecordForm({ action }: LearningRecordFormProps) {
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
            placeholder="例如：完成 Next.js Server Actions 学习"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">学习分类</span>
          <select
            name="learning_category"
            required
            defaultValue="programming"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-500"
          >
            {learningCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">学习状态</span>
          <select
            name="learning_status"
            required
            defaultValue="in_progress"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-500"
          >
            {learningStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">
            学习时长（分钟）
          </span>
          <input
            name="duration_minutes"
            type="number"
            min={0}
            step={1}
            placeholder="例如：45"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">标签</span>
          <input
            name="tags"
            type="text"
            placeholder="Next.js, AI, 学习复盘"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">学习内容</span>
          <textarea
            name="content"
            rows={12}
            required
            placeholder="写下今天学了什么、遇到了什么问题、用了哪些资料，以及下一步准备做什么。"
            className="resize-none rounded-md border border-zinc-300 px-3 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          保存学习记录
        </button>
      </div>
    </form>
  );
}
