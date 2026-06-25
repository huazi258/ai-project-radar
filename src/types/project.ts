export type ProjectStatus = "idea" | "planning" | "building" | "done" | "paused";

export type ProjectCardInput = {
  name: string;
  description: string;
  target_user: string;
  pain_point: string;
  mvp_scope: string[];
  tech_stack: string[];
  status: string;
};

export type ProjectRecord = ProjectCardInput & {
  id: string;
  user_id: string;
  source_record_id: string;
  created_at: string;
};

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
