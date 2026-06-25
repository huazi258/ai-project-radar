import type { ProjectRecord } from "@/types/project";

function formatList(items: string[]) {
  if (items.length === 0) {
    return "- 暂无";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

export function formatProjectCardMarkdown(project: ProjectRecord) {
  return [
    `# ${project.name}`,
    "",
    "## 项目简介",
    project.description,
    "",
    "## 目标用户",
    project.target_user,
    "",
    "## 核心痛点",
    project.pain_point,
    "",
    "## MVP 功能",
    formatList(project.mvp_scope),
    "",
    "## 技术栈",
    formatList(project.tech_stack),
    "",
    "## 项目状态",
    project.status,
  ].join("\n");
}
