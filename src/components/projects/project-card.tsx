import Link from "next/link";
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

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            {formatDateTime(project.created_at)}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-950">
            {project.name}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
            {project.description}
          </p>
        </div>
        <span className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
          {project.status}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-zinc-500">目标用户</dt>
          <dd className="mt-1 line-clamp-2 leading-6 text-zinc-700">
            {project.target_user}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-500">核心痛点</dt>
          <dd className="mt-1 line-clamp-2 leading-6 text-zinc-700">
            {project.pain_point}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech_stack.length > 0 ? (
          project.tech_stack.map((item) => (
            <span
              key={item}
              className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500"
            >
              {item}
            </span>
          ))
        ) : (
          <span className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500">
            未添加技术栈
          </span>
        )}
      </div>
    </Link>
  );
}
