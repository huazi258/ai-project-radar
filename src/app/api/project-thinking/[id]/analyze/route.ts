import { NextRequest, NextResponse } from "next/server";
import {
  analyzeProjectThinking,
  saveProjectThinkingAnalysisReport,
} from "@/lib/ai/project-thinking-analysis";
import { checkRateLimit, getOriginError } from "@/lib/api/request-guard";
import { getCurrentUserRecordById } from "@/lib/records/queries";

type ProjectThinkingAnalyzeRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: `项目方案请求过于频繁，请 ${retryAfterSeconds} 秒后再试。`,
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
  { params }: ProjectThinkingAnalyzeRouteContext,
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
      { error: "请先登录后再生成项目方案。" },
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
      { error: "只能处理项目思考类型的内容。" },
      { status: 400 },
    );
  }

  const rateLimit = checkRateLimit({
    key: `project-thinking-analysis:${userId}`,
    limit: 12,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  try {
    const analysis = await analyzeProjectThinking(record);
    const { report, error: saveError } =
      await saveProjectThinkingAnalysisReport({
        userId,
        recordId: record.id,
        analysis,
      });

    if (saveError || !report) {
      return NextResponse.json(
        { error: `项目方案已生成，但保存失败：${saveError}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ report });
  } catch (analyzeError) {
    const message =
      analyzeError instanceof Error
        ? analyzeError.message
        : "项目方案生成失败。";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
