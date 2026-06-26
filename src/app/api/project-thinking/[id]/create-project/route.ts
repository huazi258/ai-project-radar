import { NextRequest, NextResponse } from "next/server";
import { getLatestProjectThinkingAnalysisReport } from "@/lib/ai/project-thinking-analysis";
import { getOriginError } from "@/lib/api/request-guard";
import {
  getProjectBySourceRecord,
  saveProjectCard,
} from "@/lib/projects/queries";
import { getCurrentUserRecordById } from "@/lib/records/queries";

type CreateProjectRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: NextRequest,
  { params }: CreateProjectRouteContext,
) {
  const originError = getOriginError(request);

  if (originError) {
    return NextResponse.json({ error: originError }, { status: 403 });
  }

  const { id } = await params;
  const { record, error, isAuthenticated, userId } =
    await getCurrentUserRecordById(id);

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "请先登录后再保存项目卡片。" },
      { status: 401 },
    );
  }

  if (error) {
    return NextResponse.json(
      { error: `项目思考读取失败：${error}` },
      { status: 500 },
    );
  }

  if (!record) {
    return NextResponse.json(
      { error: "项目思考不存在，或不属于当前登录用户。" },
      { status: 404 },
    );
  }

  if (record.type !== "project_thinking") {
    return NextResponse.json(
      { error: "只能从项目思考类型创建项目卡片。" },
      { status: 400 },
    );
  }

  const existingProject = await getProjectBySourceRecord({
    userId,
    sourceRecordId: record.id,
  });

  if (existingProject.error) {
    return NextResponse.json(
      { error: `检查已有项目失败：${existingProject.error}` },
      { status: 500 },
    );
  }

  if (existingProject.project) {
    return NextResponse.json({
      project: existingProject.project,
      existed: true,
      message: "该项目思考已经保存过项目卡片，已跳转到已有项目。",
    });
  }

  const latestReport = await getLatestProjectThinkingAnalysisReport(
    record.id,
    userId,
  );

  if (latestReport.error) {
    return NextResponse.json(
      { error: `读取 AI 项目方案失败：${latestReport.error}` },
      { status: 500 },
    );
  }

  if (!latestReport.report) {
    return NextResponse.json(
      { error: "请先生成 AI 项目方案，再保存为项目卡片。" },
      { status: 400 },
    );
  }

  const { report } = latestReport;
  const savedProject = await saveProjectCard({
    userId,
    sourceRecordId: record.id,
    project: {
      name: report.project_name,
      description: report.project_summary,
      target_user: report.target_user,
      pain_point: report.core_problem,
      mvp_scope: report.mvp_features,
      tech_stack: report.tech_stack,
      status: "idea",
    },
  });

  if (savedProject.error || !savedProject.project) {
    return NextResponse.json(
      { error: `项目卡片保存失败：${savedProject.error}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    project: savedProject.project,
    existed: false,
    message: "项目卡片已保存。",
  });
}
