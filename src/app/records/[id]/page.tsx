import Link from "next/link";
import { AiAnalysisPreviewPanel } from "@/components/records/ai-analysis-preview";
import { mockRecordAnalysis, mockRecords } from "@/lib/mock-data";

export default function RecordDetailPage() {
  const record = mockRecords[0];

  return (
    <div className="px-6 py-10">
      <main className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section>
          <Link
            href="/records"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
          >
            返回记录列表
          </Link>

          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
            <p className="text-sm font-medium text-zinc-500">
              {record.typeLabel} · {record.createdAt}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
              {record.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {record.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-6 whitespace-pre-line leading-8 text-zinc-700">
              {record.content}
            </p>
          </div>
        </section>

        <AiAnalysisPreviewPanel analysis={mockRecordAnalysis} />
      </main>
    </div>
  );
}
