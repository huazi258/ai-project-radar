type PrdPreviewProps = {
  markdown?: string | null;
};

export function PrdPreview({ markdown }: PrdPreviewProps) {
  const hasPrd = Boolean(markdown?.trim());

  return (
    <section className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">PRD 展示区</h2>
      </div>
      <div className="p-5">
        {hasPrd ? (
          <pre className="max-h-[520px] overflow-x-auto whitespace-pre-wrap rounded-md bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
            {markdown}
          </pre>
        ) : (
          <div className="rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-5">
            <p className="text-sm font-medium text-zinc-700">
              还没有生成 PRD
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              这里会在后续阶段展示项目 PRD 内容，本阶段只保留占位。
            </p>
          </div>
        )}

        <button
          type="button"
          disabled
          className="mt-5 inline-flex h-11 cursor-not-allowed items-center justify-center rounded-md bg-zinc-300 px-5 text-sm font-medium text-white"
        >
          生成 PRD
        </button>
      </div>
    </section>
  );
}
