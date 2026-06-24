import type { ProjectPrdPreview } from "@/types/project";

type PrdPreviewProps = {
  prd: ProjectPrdPreview;
};

export function PrdPreview({ prd }: PrdPreviewProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">PRD 展示占位区</h2>
      </div>
      <div className="p-5">
        <p className="text-sm font-medium text-zinc-500">{prd.title}</p>
        <pre className="mt-3 overflow-x-auto rounded-md bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
          {prd.markdown}
        </pre>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            生成 PRD
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
