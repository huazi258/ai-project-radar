import { NextRequest, NextResponse } from "next/server";
import { generateProjectPrd } from "@/lib/ai/generate-project-prd";
import {
  getCurrentUserProjectById,
  updateProjectPrd,
} from "@/lib/projects/queries";

type GeneratePrdRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: NextRequest,
  { params }: GeneratePrdRouteContext,
) {
  const { id } = await params;
  const { project, error, isAuthenticated } =
    await getCurrentUserProjectById(id);

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "请先登录后再生成 PRD。" },
      { status: 401 },
    );
  }

  if (error) {
    return NextResponse.json(
      { error: `项目读取失败：${error}` },
      { status: 500 },
    );
  }

  if (!project) {
    return NextResponse.json(
      { error: "项目不存在，或不属于当前登录用户。" },
      { status: 404 },
    );
  }

  try {
    const prd = await generateProjectPrd(project);
    const { project: updatedProject, error: saveError } =
      await updateProjectPrd({
        projectId: project.id,
        userId: project.user_id,
        prdMarkdown: prd.prd_markdown,
      });

    if (saveError || !updatedProject) {
      return NextResponse.json(
        { error: `PRD 已生成，但保存失败：${saveError}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      project: updatedProject,
      prd_markdown: updatedProject.prd_markdown,
    });
  } catch (prdError) {
    const message = prdError instanceof Error ? prdError.message : "PRD 生成失败。";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
