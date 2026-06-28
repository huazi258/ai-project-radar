"use client";

import { useState } from "react";
import { LearningAnalysisResult } from "@/components/ai-output/learning-analysis-result";
import { SparkIcon } from "@/components/common/ui-icons";
import type { AiLearningAnalysisReport } from "@/types/ai";

type LearningAnalysisPanelProps = {
  recordId: string;
  initialAnalysis?: AiLearningAnalysisReport | null;
  initialError?: string | null;
};

type LearningAnalyzeResponse = {
  report?: AiLearningAnalysisReport;
  error?: string;
};

export function LearningAnalysisPanel({
  recordId,
  initialAnalysis = null,
  initialError = null,
}: LearningAnalysisPanelProps) {
  const [analysis, setAnalysis] =
    useState<AiLearningAnalysisReport | null>(initialAnalysis);
  const [error, setError] = useState(initialError ?? "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleAnalyze() {
    setError("");
    setIsAnalyzing(true);

    try {
      const response = await fetch(`/api/learning/${recordId}/analyze`, {
        method: "POST",
      });
      const result = (await response.json()) as LearningAnalyzeResponse;

      if (!response.ok || !result.report) {
        setError(result.error ?? "学习建议生成失败，请稍后重试。");
        return;
      }

      setAnalysis(result.report);
    } catch (analyzeError) {
      setError(
        analyzeError instanceof Error
          ? analyzeError.message
          : "学习建议生成失败，请稍后重试。",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <aside className="surface-card h-fit overflow-hidden">
      <div className="border-b border-[#dfe5f0] bg-gradient-to-r from-[#eef0ff] to-white px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-white text-[#4056d6] shadow-sm">
            <SparkIcon className="size-4.5" />
          </span>
          <div>
            <p className="text-[0.68rem] font-bold tracking-[0.12em] text-[#7180a5] uppercase">
              AI analysis
            </p>
            <h2 className="mt-0.5 font-display text-lg font-bold text-[#172033]">
              学习建议
            </h2>
          </div>
        </div>
      </div>
      <div className="grid gap-5 p-5">
        {!analysis ? (
          <div className="content-panel border-dashed">
            <p className="text-sm font-semibold text-[#344057]">
              还没有学习建议
            </p>
            <p className="mt-2 text-sm leading-6 text-[#718096]">
              AI 会梳理知识点、当前问题与下一步行动，并保存最近一次结果。
            </p>
          </div>
        ) : (
          <LearningAnalysisResult analysis={analysis} />
        )}

        {isAnalyzing ? (
          <p className="alert-neutral flex items-center gap-5">
            <span className="loading-dot" aria-hidden="true" />
            正在梳理这次学习记录
          </p>
        ) : null}

        {error ? (
          <p className="alert-error">{error}</p>
        ) : null}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="button-primary w-full"
        >
          {isAnalyzing ? "生成中..." : "生成学习建议"}
        </button>
      </div>
    </aside>
  );
}
