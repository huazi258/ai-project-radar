export type RecordType =
  | "learning"
  | "ai_usage"
  | "project_idea"
  | "tutorial_note"
  | "daily_review";

export type LearningRecord = {
  id: string;
  title: string;
  content: string;
  type: RecordType;
  typeLabel: string;
  tags: string[];
  createdAt: string;
  summary: string;
};

export type AiAnalysisPreview = {
  summary: string;
  skills: string[];
  nextActions: string[];
  markdown: string;
};
