import Link from "next/link";
import type { RecordListItem } from "@/types/record";

type LearningRecordCardProps = {
  record: RecordListItem;
};

export function LearningRecordCard({ record }: LearningRecordCardProps) {
  return (
    <Link
      href={`/learning/${record.id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            创建于 {record.createdAt}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-950">
            {record.title}
          </h2>
        </div>
        <span className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
          查看详情
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {record.tags.length > 0 ? (
          record.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500">
            未添加标签
          </span>
        )}
      </div>
    </Link>
  );
}
