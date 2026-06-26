"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectThinkingResult } from "@/components/ai-output/project-thinking-result";
import type { AiProjectThinkingAnalysisReport } from "@/types/ai";

type ProjectThinkingAnalysisPanelProps = {
  recordId: string;
  initialAnalysis?: AiProjectThinkingAnalysisReport | null;
  initialError?: string | null;
};

type ProjectThinkingAnalyzeResponse = {
  report?: AiProjectThinkingAnalysisReport;
  error?: string;
};

type CreateProjectResponse = {
  project?: {
    id: string;
  };
  existed?: boolean;
  message?: string;
  error?: string;
};

export function ProjectThinkingAnalysisPanel({
  recordId,
  initialAnalysis = null,
  initialError = null,
}: ProjectThinkingAnalysisPanelProps) {
  const [analysis, setAnalysis] =
    useState<AiProjectThinkingAnalysisReport | null>(initialAnalysis);
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const router = useRouter();

  async function handleAnalyze() {
    setError("");
    setMessage("");
    setIsAnalyzing(true);

    try {
      const response = await fetch(`/api/project-thinking/${recordId}/analyze`, {
        method: "POST",
      });
      const result = (await response.json()) as ProjectThinkingAnalyzeResponse;

      if (!response.ok || !result.report) {
        setError(result.error ?? "项目方案生成失败，请稍后重试。");
        return;
      }

      setAnalysis(result.report);
    } catch (analyzeError) {
      setError(
        analyzeError instanceof Error
          ? analyzeError.message
          : "项目方案生成失败，请稍后重试。",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleCreateProject() {
    setError("");
    setMessage("");
    setIsCreatingProject(true);

    try {
      const response = await fetch(
        `/api/project-thinking/${recordId}/create-project`,
        {
          method: "POST",
        },
      );
      const result = (await response.json()) as CreateProjectResponse;

      if (!response.ok || !result.project) {
        setError(result.error ?? "项目卡片保存失败，请稍后重试。");
        return;
      }

      if (result.message) {
        setMessage(result.message);
      }

      router.push(`/projects/${result.project.id}`);
      router.refresh();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "项目卡片保存失败，请稍后重试。",
      );
    } finally {
      setIsCreatingProject(false);
    }
  }

  return (
    <aside className="h-fit rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">AI 项目方案</h2>
      </div>
      <div className="grid gap-5 p-5">
        {!analysis ? (
          <p className="rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-500">
            还没有项目方案。点击按钮后，系统会根据这条项目思考生成方案并保存最近一次结果。
          </p>
        ) : (
          <ProjectThinkingResult analysis={analysis} />
        )}

        {isAnalyzing ? (
          <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
            正在生成项目方案...
          </p>
        ) : null}

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}

        <div className="grid gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || isCreatingProject}
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isAnalyzing ? "生成中..." : "生成项目方案"}
          </button>

          <button
            type="button"
            onClick={handleCreateProject}
            disabled={!analysis || isAnalyzing || isCreatingProject}
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
          >
            {isCreatingProject ? "保存中..." : "保存为项目卡片"}
          </button>

          {!analysis ? (
            <p className="text-sm leading-6 text-zinc-500">
              生成 AI 项目方案后，才能保存为项目卡片。
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
