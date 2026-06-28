import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/common/ui-icons";
import type { ProjectRecord } from "@/types/project";

type ProjectCardProps = {
  project: ProjectRecord;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const statusLabels: Record<string, string> = {
  idea: "想法",
  planning: "规划中",
  building: "开发中",
  done: "已完成",
  paused: "已暂停",
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="surface-card interactive-card group flex min-h-[21rem] flex-col p-6 [--card-accent:#4056d6]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.08em] text-[#8793a6] uppercase">
            {formatDateTime(project.created_at)}
          </p>
          <h2 className="mt-3 font-display text-xl font-bold tracking-[-0.025em] text-[#172033]">
            {project.name}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#637087]">
            {project.description}
          </p>
        </div>
        <ArrowUpRightIcon className="size-5 shrink-0 text-[#9aa5b5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#4056d6]" />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="content-panel">
          <dt className="section-label">目标用户</dt>
          <dd className="mt-2 line-clamp-2 leading-6 text-[#4d5a70]">
            {project.target_user}
          </dd>
        </div>
        <div className="content-panel">
          <dt className="section-label">核心问题</dt>
          <dd className="mt-2 line-clamp-2 leading-6 text-[#4d5a70]">
            {project.pain_point}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <span className="badge badge-brand">
          {statusLabels[project.status] ?? project.status}
        </span>
        <span className="badge">来源记录</span>
        {project.tech_stack.length > 0 ? (
          project.tech_stack.slice(0, 3).map((item) => (
            <span key={item} className="badge">
              {item}
            </span>
          ))
        ) : (
          <span className="badge">
            未添加技术栈
          </span>
        )}
      </div>
    </Link>
  );
}
