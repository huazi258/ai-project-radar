import { NextRequest, NextResponse } from "next/server";
import { analyzeRecord } from "@/lib/ai/analyze-record";
import { saveAiReport } from "@/lib/ai-reports/queries";
import { getCurrentUserRecordById } from "@/lib/records/queries";

type AnalyzeRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: NextRequest,
  { params }: AnalyzeRouteContext,
) {
  const { id } = await params;
  const { record, error, isAuthenticated, userId } =
    await getCurrentUserRecordById(id);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "请先登录后再分析记录。" }, { status: 401 });
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
