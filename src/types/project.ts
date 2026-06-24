export type ProjectStatus = "idea" | "planning" | "building" | "done" | "paused";

export type ProjectCardData = {
  id: string;
  name: string;
  description: string;
  targetUser: string;
  painPoint: string;
  mvpScope: string[];
  techStack: string[];
  status: ProjectStatus;
  createdAt: string;
};

export type ProjectPrdPreview = {
  title: string;
  markdown: string;
};
