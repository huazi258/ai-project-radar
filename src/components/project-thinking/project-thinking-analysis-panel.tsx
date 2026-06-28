"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectThinkingResult } from "@/components/ai-output/project-thinking-result";
import { SparkIcon } from "@/components/common/ui-icons";
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
    <aside className="surface-card h-fit overflow-hidden">
      <div className="border-b border-[#dfe5f0] bg-gradient-to-r from-[#f7ecfb] to-white px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-white text-[#8b3aa3] shadow-sm">
            <SparkIcon className="size-4.5" />
          </span>
          <div>
            <p className="text-[0.68rem] font-bold tracking-[0.12em] text-[#92739a] uppercase">
              AI project brief
            </p>
            <h2 className="mt-0.5 font-display text-lg font-bold text-[#172033]">
              项目方案
            </h2>
          </div>
        </div>
      </div>
      <div className="grid gap-5 p-5">
        {!analysis ? (
          <div className="content-panel border-dashed">
            <p className="text-sm font-semibold text-[#344057]">
              还没有项目方案
            </p>
            <p className="mt-2 text-sm leading-6 text-[#718096]">
              AI 会整理目标用户、核心问题、MVP、技术栈和开发阶段。
            </p>
          </div>
        ) : (
          <ProjectThinkingResult analysis={analysis} />
        )}

        {isAnalyzing ? (
          <p className="alert-neutral flex items-center gap-5">
            <span className="loading-dot" aria-hidden="true" />
            正在推演项目方案
          </p>
        ) : null}

        {error ? (
          <p className="alert-error">{error}</p>
        ) : null}

        {message ? (
          <p className="alert-success">{message}</p>
        ) : null}

        <div className="grid gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || isCreatingProject}
            className={`${analysis ? "button-secondary" : "button-primary"} w-full`}
          >
            {isAnalyzing ? "生成中..." : "生成项目方案"}
          </button>

          <button
            type="button"
            onClick={handleCreateProject}
            disabled={!analysis || isAnalyzing || isCreatingProject}
            className="button-primary w-full"
          >
            {isCreatingProject ? "保存中..." : "保存为项目卡片"}
          </button>

          {!analysis ? (
            <p className="text-sm leading-6 text-[#758197]">
              生成 AI 项目方案后，才能保存为项目卡片。
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
