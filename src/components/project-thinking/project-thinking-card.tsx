import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/common/ui-icons";
import type { RecordListItem } from "@/types/record";

type ProjectThinkingCardProps = {
  record: RecordListItem;
};

export function ProjectThinkingCard({ record }: ProjectThinkingCardProps) {
  return (
    <Link
      href={`/project-thinking/${record.id}`}
      className="surface-card interactive-card group flex min-h-56 flex-col p-6 [--card-accent:#b45dcb]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.08em] text-[#8793a6] uppercase">
            {record.createdAt}
          </p>
          <h2 className="mt-3 font-display text-xl font-bold tracking-[-0.025em] text-[#172033]">
            {record.title}
          </h2>
        </div>
        <ArrowUpRightIcon className="size-5 shrink-0 text-[#9aa5b5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#8b3aa3]" />
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#66738a]">
        {record.content}
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
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
