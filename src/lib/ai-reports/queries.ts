import { createClient } from "@/lib/supabase/server";
import type { AiRecordAnalysis, AiReport } from "@/types/ai";

type AiReportRow = {
  id: string;
  user_id: string;
  record_id: string;
  summary: string;
  skills: string[] | null;
  problems: string[] | null;
  next_actions: string[] | null;
  markdown_output: string;
  created_at: string;
};

type LatestReportResult = {
  report: AiReport | null;
  error: string | null;
};

type SaveReportInput = {
  userId: string;
  recordId: string;
  analysis: AiRecordAnalysis;
};

type SaveReportResult = {
  report: AiReport | null;
  error: string | null;
};

function toAiReport(row: AiReportRow): AiReport {
  return {
    id: row.id,
    user_id: row.user_id,
    record_id: row.record_id,
    summary: row.summary,
    skills: row.skills ?? [],
    problems: row.problems ?? [],
    next_actions: row.next_actions ?? [],
    markdown_output: row.markdown_output,
    created_at: row.created_at,
  };
}

export async function getLatestAiReportForRecord(
  recordId: string,
  userId: string,
): Promise<LatestReportResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_reports")
    .select(
      "id,user_id,record_id,summary,skills,problems,next_actions,markdown_output,created_at",
    )
    .eq("record_id", recordId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      report: null,
      error: error.message,
    };
  }

  return {
    report: data ? toAiReport(data as AiReportRow) : null,
    error: null,
  };
}

export async function saveAiReport({
  userId,
  recordId,
  analysis,
}: SaveReportInput): Promise<SaveReportResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_reports")
    .insert({
      user_id: userId,
      record_id: recordId,
      summary: analysis.summary,
      skills: analysis.skills,
      problems: analysis.problems,
      next_actions: analysis.next_actions,
      markdown_output: analysis.markdown_output,
    })
    .select(
      "id,user_id,record_id,summary,skills,problems,next_actions,markdown_output,created_at",
    )
    .single();

  if (error) {
    return {
      report: null,
      error: error.message,
    };
  }

  return {
    report: toAiReport(data as AiReportRow),
    error: null,
  };
}
