"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiAnalysisResult } from "@/components/ai-output/ai-analysis-result";
import type { AiReport } from "@/types/ai";
import type { ProjectRecord } from "@/types/project";

type AiAnalysisPreviewPanelProps = {
  initialAnalysis?: AiReport | null;
  initialError?: string | null;
  recordId: string;
};

type AnalyzeResponse = {
  analysis?: AiReport;
  report?: AiReport;
  error?: string;
};

type ProjectResponse = {
  project?: ProjectRecord;
  error?: string;
};

export function AiAnalysisPreviewPanel({
  initialAnalysis = null,
  initialError = null,
  recordId,
}: AiAnalysisPreviewPanelProps) {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AiReport | null>(initialAnalysis);
  const [error, setError] = useState(initialError ?? "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);

  async function handleAnalyze() {
    setError("");
    setIsAnalyzing(true);

    try {
      const response = await fetch(`/api/records/${recordId}/analyze`, {
        method: "POST",
      });
      const result = (await response.json()) as AnalyzeResponse;

      const savedReport = result.report ?? result.analysis;

      if (!response.ok || !savedReport) {
        setError(result.error ?? "AI 分析失败，请稍后重试。");
        return;
      }

      setAnalysis(savedReport);
    } catch (analyzeError) {
      setError(
        analyzeError instanceof Error
          ? analyzeError.message
          : "AI 分析失败，请稍后重试。",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleGenerateProject() {
    setError("");
    setIsGeneratingProject(true);

    try {
      const response = await fetch(`/api/records/${recordId}/project`, {
        method: "POST",
      });
      const result = (await response.json()) as ProjectResponse;

      if (!response.ok || !result.project) {
        setError(result.error ?? "项目卡片生成失败，请稍后重试。");
        return;
      }

      router.push(`/projects/${result.project.id}`);
      router.refresh();
    } catch (projectError) {
      setError(
        projectError instanceof Error
          ? projectError.message
          : "项目卡片生成失败，请稍后重试。",
      );
    } finally {
      setIsGeneratingProject(false);
    }
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">AI 分析</h2>
      </div>

      <div className="grid gap-6 p-5">
        {!analysis ? (
          <div className="rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-4">
            <h3 className="text-sm font-medium text-zinc-700">
              等待开始分析
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              点击按钮后会调用服务端 AI 分析接口，成功后保存到 ai_reports
              表，并在这里展示最近一次分析结果。
            </p>
          </div>
        ) : (
          <AiAnalysisResult analysis={analysis} />
        )}

        {isAnalyzing ? (
          <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
            正在分析记录内容...
          </p>
        ) : null}

        {isGeneratingProject ? (
          <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
            正在生成项目卡片...
          </p>
        ) : null}

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || isGeneratingProject}
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isAnalyzing ? "分析中..." : "开始 AI 分析"}
          </button>
          <button
            type="button"
            onClick={handleGenerateProject}
            disabled={isAnalyzing || isGeneratingProject}
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
          >
            {isGeneratingProject ? "生成中..." : "生成项目卡片"}
          </button>
        </div>
      </div>
    </section>
  );
}
