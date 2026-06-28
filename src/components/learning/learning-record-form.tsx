import { SubmitButton } from "@/components/common/submit-button";

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
    <form action={action} className="form-card">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 sm:col-span-2">
          <span className="field-label">标题</span>
          <input
            name="title"
            type="text"
            required
            placeholder="例如：完成 Next.js Server Actions 学习"
            className="field-control"
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">学习分类</span>
          <select
            name="learning_category"
            required
            defaultValue="programming"
            className="field-control"
          >
            {learningCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="field-label">学习状态</span>
          <select
            name="learning_status"
            required
            defaultValue="in_progress"
            className="field-control"
          >
            {learningStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="field-label">
            学习时长（分钟）
          </span>
          <input
            name="duration_minutes"
            type="number"
            min={0}
            step={1}
            placeholder="例如：45"
            className="field-control"
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">标签</span>
          <input
            name="tags"
            type="text"
            placeholder="Next.js, AI, 学习复盘"
            className="field-control"
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="field-label">学习内容</span>
          <textarea
            name="content"
            rows={12}
            required
            placeholder="写下今天学了什么、遇到了什么问题、用了哪些资料，以及下一步准备做什么。"
            className="field-control min-h-72 resize-y"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <SubmitButton
          idleLabel="保存学习记录"
          pendingLabel="正在保存"
        />
      </div>
    </form>
  );
}
