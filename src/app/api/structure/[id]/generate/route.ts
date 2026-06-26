import { NextRequest, NextResponse } from "next/server";
import {
  generateExpressionStructure,
  saveExpressionStructureReport,
} from "@/lib/ai/expression-structure";
import { checkRateLimit, getOriginError } from "@/lib/api/request-guard";
import { getCurrentUserRecordById } from "@/lib/records/queries";

type StructureGenerateRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: `结构化表达请求过于频繁，请 ${retryAfterSeconds} 秒后再试。`,
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
  { params }: StructureGenerateRouteContext,
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
      { error: "请先登录后再生成结构化表达。" },
      { status: 401 },
    );
  }

  if (error) {
    return NextResponse.json(
      { error: `结构化表达读取失败：${error}` },
      { status: 500 },
    );
  }

  if (!record) {
    return NextResponse.json(
      { error: "结构化表达不存在，或不属于当前登录用户。" },
      { status: 404 },
    );
  }

  if (record.type !== "structured_expression") {
    return NextResponse.json(
      { error: "只能处理结构化表达类型的内容。" },
      { status: 400 },
    );
  }

  const rateLimit = checkRateLimit({
    key: `expression-structure:${userId}`,
    limit: 12,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  try {
    const analysis = await generateExpressionStructure(record);
    const { report, error: saveError } = await saveExpressionStructureReport({
      userId,
      recordId: record.id,
      analysis,
    });

    if (saveError || !report) {
      return NextResponse.json(
        { error: `结构化表达已生成，但保存失败：${saveError}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ report });
  } catch (generateError) {
    const message =
      generateError instanceof Error
        ? generateError.message
        : "结构化表达生成失败。";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
