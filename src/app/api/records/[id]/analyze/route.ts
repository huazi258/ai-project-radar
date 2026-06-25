import { NextRequest, NextResponse } from "next/server";
import { analyzeRecord } from "@/lib/ai/analyze-record";
import { saveAiReport } from "@/lib/ai-reports/queries";
import { checkRateLimit, getOriginError } from "@/lib/api/request-guard";
import { getCurrentUserRecordById } from "@/lib/records/queries";

type AnalyzeRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: `AI 分析请求过于频繁，请 ${retryAfterSeconds} 秒后再试。`,
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
  { params }: AnalyzeRouteContext,
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
      { error: "请先登录后再分析记录。" },
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
    key: `ai-analyze:${userId}`,
    limit: 12,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  try {
    const analysis = await analyzeRecord({
      title: record.title,
      content: record.content,
      type: record.type,
      tags: record.tags,
    });

    const { report, error: saveError } = await saveAiReport({
      userId,
      recordId: record.id,
      analysis,
    });

    if (saveError || !report) {
      return NextResponse.json(
        { error: `AI 分析已完成，但保存分析结果失败：${saveError}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ analysis: report, report });
  } catch (analyzeError) {
    const message =
      analyzeError instanceof Error ? analyzeError.message : "AI 分析失败。";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
