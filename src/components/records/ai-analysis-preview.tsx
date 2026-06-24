export function AiAnalysisPreviewPanel() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">AI 分析占位区</h2>
      </div>

      <div className="grid gap-6 p-5">
        <div>
          <h3 className="text-sm font-medium text-zinc-500">AI 分析结果</h3>
          <p className="mt-2 leading-7 text-zinc-700">
            当前阶段还没有接入 AI 分析。后续会在这里展示摘要、问题发现和
            Markdown 输出。
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-500">技能标签</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
              等待 AI 分析
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-500">下一步任务</h3>
          <ul className="mt-3 grid gap-2">
            <li className="rounded-md border border-dashed border-zinc-200 px-3 py-2 text-sm text-zinc-500">
              AI 分析完成后将在这里展示建议任务。
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-500">Markdown 预览</h3>
          <pre className="mt-3 overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
            {"AI 分析完成后将在这里展示 Markdown 内容。"}
          </pre>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            开始 AI 分析
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            生成项目卡片
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            复制 Markdown
          </button>
        </div>
      </div>
    </section>
  );
}
