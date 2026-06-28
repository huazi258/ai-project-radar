import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/common/ui-icons";
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
  const accentClass =
    record.type === "learning_record"
      ? "[--card-accent:#4056d6]"
      : record.type === "structured_expression"
        ? "[--card-accent:#18a999]"
        : record.type === "project_thinking"
          ? "[--card-accent:#b45dcb]"
          : "[--card-accent:#7a879b]";

  return (
    <Link
      href={getRecordHref(record.type, record.id)}
      className={`surface-card interactive-card group flex min-h-64 flex-col p-6 ${accentClass}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.08em] text-[#8793a6] uppercase">
            {record.createdAt}
          </p>
          <h2 className="mt-3 font-display text-xl font-bold tracking-[-0.025em] text-[#172033]">
            {record.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#637087]">
            {record.content}
          </p>
        </div>
        <ArrowUpRightIcon className="size-5 shrink-0 text-[#9aa5b5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#4056d6]" />
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <span className="badge badge-brand">{record.typeLabel}</span>
        {record.tags.length > 0 ? (
          record.tags.map((tag) => (
            <span key={tag} className="badge">
              {tag}
            </span>
          ))
        ) : (
          <span className="badge">
            未添加标签
          </span>
        )}
      </div>
    </Link>
  );
}
