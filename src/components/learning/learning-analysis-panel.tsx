"use client";

import { useState } from "react";
import { LearningAnalysisResult } from "@/components/ai-output/learning-analysis-result";
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
    <aside className="h-fit rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">AI 学习建议</h2>
      </div>
      <div className="grid gap-5 p-5">
        {!analysis ? (
          <p className="rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-500">
            还没有学习建议。点击按钮后，系统会分析这条学习记录，并保存最近一次结果。
          </p>
        ) : (
          <LearningAnalysisResult analysis={analysis} />
        )}

        {isAnalyzing ? (
          <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
            正在生成学习建议...
          </p>
        ) : null}

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isAnalyzing ? "生成中..." : "生成学习建议"}
        </button>
      </div>
    </aside>
  );
}
