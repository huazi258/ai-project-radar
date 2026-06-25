import { NextRequest, NextResponse } from "next/server";
import { generateProjectCard } from "@/lib/ai/generate-project-card";
import { getLatestAiReportForRecord } from "@/lib/ai-reports/queries";
import { checkRateLimit, getOriginError } from "@/lib/api/request-guard";
import { saveProjectCard } from "@/lib/projects/queries";
import { getCurrentUserRecordById } from "@/lib/records/queries";

type ProjectRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: `项目卡片生成请求过于频繁，请 ${retryAfterSeconds} 秒后再试。`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

export async function POST(
  request: NextRequest,
  { params }: ProjectRouteContext,
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
      { error: "请先登录后再生成项目卡片。" },
      { status: 401 },
    );
  }

  if (error) {
    return NextResponse.json(
      { error: `记录读取失败：${error}` },
      { status: 500 },
    );
  }

  if (!record) {
    return NextResponse.json(
      { error: "记录不存在，或不属于当前登录用户。" },
      { status: 404 },
    );
  }

  const rateLimit = checkRateLimit({
    key: `ai-project-card:${userId}`,
    limit: 8,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  const { report, error: reportError } = await getLatestAiReportForRecord(
    record.id,
    userId,
  );

  if (reportError) {
    return NextResponse.json(
      { error: `AI 分析结果读取失败：${reportError}` },
      { status: 500 },
    );
  }

  if (!report) {
    return NextResponse.json(
      { error: "请先完成 AI 分析。" },
      { status: 400 },
    );
  }

  try {
    const projectCard = await generateProjectCard(record, report);
    const { project, error: saveError } = await saveProjectCard({
      userId,
      sourceRecordId: record.id,
      project: projectCard,
    });

    if (saveError || !project) {
      return NextResponse.json(
        { error: `项目卡片已生成，但保存失败：${saveError}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ project });
  } catch (projectError) {
    const message =
      projectError instanceof Error
        ? projectError.message
        : "项目卡片生成失败。";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
