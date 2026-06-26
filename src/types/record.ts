export type RecordType =
  | "learning_record"
  | "structured_expression"
  | "project_thinking"
  | "tutorial_note"
  | "ai_usage"
  | "daily_review";

export type LegacyRecordType = "learning" | "project_idea";

export type RecordTypeInput = RecordType | LegacyRecordType;

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
  learning_record: "学习记录",
  structured_expression: "结构化表达",
  project_thinking: "项目思考",
  tutorial_note: "教程笔记",
  ai_usage: "AI 使用记录",
  daily_review: "每日复盘",
};

export const recordTypes = Object.keys(recordTypeLabels) as RecordType[];

export const legacyRecordTypeMap: Record<LegacyRecordType, RecordType> = {
  learning: "learning_record",
  project_idea: "project_thinking",
};

export function normalizeRecordType(value: string): RecordType {
  if (value in legacyRecordTypeMap) {
    return legacyRecordTypeMap[value as LegacyRecordType];
  }

  if (recordTypes.includes(value as RecordType)) {
    return value as RecordType;
  }

  return "learning_record";
}

export function getRecordTypeStorageValues(type: RecordType): string[] {
  const legacyValues = Object.entries(legacyRecordTypeMap)
    .filter(([, normalizedType]) => normalizedType === type)
    .map(([legacyType]) => legacyType);

  return [type, ...legacyValues];
}

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
