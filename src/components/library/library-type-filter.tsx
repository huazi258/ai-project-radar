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
    <nav aria-label="内容类型筛选" className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = filter.value === activeType;

        return (
          <Link
            key={filter.value}
            href={filter.href}
            className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${
              isActive
                ? "bg-zinc-950 text-white"
                : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </nav>
  );
}
