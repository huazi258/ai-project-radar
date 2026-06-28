import Link from "next/link";
import type { RecordType } from "@/types/record";

type LibraryFilterValue = "all" | Extract<
  RecordType,
  "learning_record" | "structured_expression" | "project_thinking"
>;

type LibraryTypeFilterProps = {
  activeType: LibraryFilterValue;
};

const filters: { label: string; value: LibraryFilterValue; href: string }[] = [
  { label: "全部", value: "all", href: "/library" },
  { label: "学习记录", value: "learning_record", href: "/library?type=learning_record" },
  {
    label: "结构化表达",
    value: "structured_expression",
    href: "/library?type=structured_expression",
  },
  { label: "项目思考", value: "project_thinking", href: "/library?type=project_thinking" },
];

export function LibraryTypeFilter({ activeType }: LibraryTypeFilterProps) {
  return (
    <nav
      aria-label="内容类型筛选"
      className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl border border-[#dfe5f0] bg-white/70 p-1"
    >
      {filters.map((filter) => {
        const isActive = filter.value === activeType;

        return (
          <Link
            key={filter.value}
            href={filter.href}
            className={`inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[#17233d] text-white shadow-sm"
                : "text-[#6d798e] hover:bg-[#f2f5fa] hover:text-[#26334d]"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </nav>
  );
}
