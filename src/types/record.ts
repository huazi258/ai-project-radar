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

export const recordTypeLabels: Record<RecordType, string> = {
  learning: "学习记录",
  ai_usage: "AI 使用记录",
  project_idea: "项目灵感",
  tutorial_note: "教程笔记",
  daily_review: "每日复盘",
};

export type RecordListItem = {
  id: string;
  title: string;
  content: string;
  type: RecordType;
  typeLabel: string;
  tags: string[];
  createdAt: string;
};

export type RecordDetail = RecordListItem & {
  updatedAt: string;
};

export type AiAnalysisPreview = {
  summary: string;
  skills: string[];
  nextActions: string[];
  markdown: string;
};
