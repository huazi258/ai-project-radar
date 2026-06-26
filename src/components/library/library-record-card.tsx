import Link from "next/link";
import type { RecordListItem, RecordType } from "@/types/record";

type LibraryRecordCardProps = {
  record: RecordListItem;
};

function getRecordHref(type: RecordType, id: string) {
  if (type === "learning_record") {
    return `/learning/${id}`;
  }

  if (type === "structured_expression") {
    return `/structure/${id}`;
  }

  if (type === "project_thinking") {
    return `/project-thinking/${id}`;
  }

  return `/records/${id}`;
}

export function LibraryRecordCard({ record }: LibraryRecordCardProps) {
  return (
    <Link
      href={getRecordHref(record.type, record.id)}
      className="block rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            {record.typeLabel} · {record.createdAt}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-950">
            {record.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
            {record.content}
          </p>
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
