import { redirect } from "next/navigation";
import { FolderIcon } from "@/components/common/ui-icons";
import { LibraryRecordCard } from "@/components/library/library-record-card";
import { LibraryTypeFilter } from "@/components/library/library-type-filter";
import { ProjectCard } from "@/components/projects/project-card";
import { getCurrentUserProjects } from "@/lib/projects/queries";
import { getCurrentUserRecords } from "@/lib/records/queries";

type LibraryPageProps = {
  searchParams?: Promise<{
    type?: string;
  }>;
};

const libraryFilterTypes = [
  "learning_record",
  "structured_expression",
  "project_thinking",
  "project_card",
] as const;

type LibraryFilterType = (typeof libraryFilterTypes)[number];
type ActiveLibraryType = "all" | LibraryFilterType;

function normalizeLibraryFilter(value?: string): ActiveLibraryType {
  if (libraryFilterTypes.includes(value as LibraryFilterType)) {
    return value as LibraryFilterType;
  }

  return "all";
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeType = normalizeLibraryFilter(resolvedSearchParams?.type);
  const [recordsResult, projectsResult] = await Promise.all([
    getCurrentUserRecords(),
    getCurrentUserProjects(),
  ]);
  const { records } = recordsResult;
  const { projects } = projectsResult;
  const error = recordsResult.error ?? projectsResult.error;

  if (!recordsResult.isAuthenticated || !projectsResult.isAuthenticated) {
    redirect("/login");
  }

  const filteredRecords =
    activeType === "all"
      ? records
      : activeType === "project_card"
        ? []
        : records.filter((record) => record.type === activeType);
  const filteredProjects =
    activeType === "all" || activeType === "project_card" ? projects : [];
  const hasContent =
    filteredRecords.length > 0 || filteredProjects.length > 0;

  return (
    <div className="app-page">
      <main className="app-container">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="page-kicker">Content library</p>
            <h1 className="page-title">内容库</h1>
            <p className="page-description">
              汇总当前账号下的学习记录、结构化表达、项目思考和项目卡片。
            </p>
          </div>
        </div>

        <div className="mt-8">
          <LibraryTypeFilter activeType={activeType} />
        </div>

        {error ? (
          <div className="alert-error mt-8">
            内容库加载失败：{error}
          </div>
        ) : null}

        {!error && !hasContent ? (
          <div className="empty-state mt-8">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#eef0ff] text-[#4056d6]">
              <FolderIcon className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-[#172033]">
              暂无内容
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d798e]">
              当前筛选条件下还没有内容。你可以先记录学习、整理表达或生成项目卡片。
            </p>
          </div>
        ) : null}

        {!error && hasContent ? (
          <section className="mt-8 grid gap-5 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectCard key={`project-${project.id}`} project={project} />
            ))}
            {filteredRecords.map((record) => (
              <LibraryRecordCard
                key={`record-${record.id}`}
                record={record}
              />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}
