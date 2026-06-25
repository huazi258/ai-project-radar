export type AiRecordAnalysis = {
  summary: string;
  skills: string[];
  problems: string[];
  next_actions: string[];
  markdown_output: string;
};

export type AiReport = AiRecordAnalysis & {
  id: string;
  user_id: string;
  record_id: string;
  created_at: string;
};

export type AnalyzeRecordInput = {
  title: string;
  content: string;
  type: string;
  tags: string[];
};
