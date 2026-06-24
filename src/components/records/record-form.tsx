export function RecordForm() {
  return (
    <form className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">标题</span>
          <input
            type="text"
            placeholder="例如：今天用 AI 整理了 React 学习笔记"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">记录类型</span>
          <select className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-500">
            <option>学习记录</option>
            <option>AI 使用记录</option>
            <option>项目灵感</option>
            <option>教程笔记</option>
            <option>每日复盘</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">标签</span>
          <input
            type="text"
            placeholder="Next.js, AI, Markdown"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">正文内容</span>
          <textarea
            rows={10}
            placeholder="写下今天的学习过程、遇到的问题、AI 使用经验或项目想法。"
            className="resize-none rounded-md border border-zinc-300 px-3 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          保存记录
        </button>
      </div>
    </form>
  );
}
