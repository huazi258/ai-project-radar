"use client";

import { useState } from "react";
import { ExpressionStructureResult } from "@/components/ai-output/expression-structure-result";
import type { AiExpressionStructureReport } from "@/types/ai";

type StructureGenerationPanelProps = {
  recordId: string;
  initialAnalysis?: AiExpressionStructureReport | null;
  initialError?: string | null;
};

type StructureGenerateResponse = {
  report?: AiExpressionStructureReport;
  error?: string;
};

export function StructureGenerationPanel({
  recordId,
  initialAnalysis = null,
  initialError = null,
}: StructureGenerationPanelProps) {
  const [analysis, setAnalysis] =
    useState<AiExpressionStructureReport | null>(initialAnalysis);
  const [error, setError] = useState(initialError ?? "");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setError("");
    setIsGenerating(true);

    try {
      const response = await fetch(`/api/structure/${recordId}/generate`, {
        method: "POST",
      });
      const result = (await response.json()) as StructureGenerateResponse;

      if (!response.ok || !result.report) {
        setError(result.error ?? "结构化表达生成失败，请稍后重试。");
        return;
      }

      setAnalysis(result.report);
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "结构化表达生成失败，请稍后重试。",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <aside className="h-fit rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">
          AI 结构化输出
        </h2>
      </div>
      <div className="grid gap-5 p-5">
        {!analysis ? (
          <p className="rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-500">
            还没有结构化表达结果。点击按钮后，系统会整理这段表达并保存最近一次结果。
          </p>
        ) : (
          <ExpressionStructureResult analysis={analysis} />
        )}

        {isGenerating ? (
          <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
            正在生成结构化表达...
          </p>
        ) : null}

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isGenerating ? "生成中..." : "生成结构化表达"}
        </button>
      </div>
    </aside>
  );
}
