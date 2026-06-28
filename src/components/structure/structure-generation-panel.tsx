"use client";

import { useState } from "react";
import { ExpressionStructureResult } from "@/components/ai-output/expression-structure-result";
import { SparkIcon } from "@/components/common/ui-icons";
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
    <aside className="surface-card h-fit overflow-hidden">
      <div className="border-b border-[#dfe5f0] bg-gradient-to-r from-[#e8f8f5] to-white px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-white text-[#087b70] shadow-sm">
            <SparkIcon className="size-4.5" />
          </span>
          <div>
            <p className="text-[0.68rem] font-bold tracking-[0.12em] text-[#638d89] uppercase">
              AI workspace
            </p>
            <h2 className="mt-0.5 font-display text-lg font-bold text-[#172033]">
              结构化输出
            </h2>
          </div>
        </div>
      </div>
      <div className="grid gap-5 p-5">
        {!analysis ? (
          <div className="content-panel border-dashed">
            <p className="text-sm font-semibold text-[#344057]">
              等待整理原始输入
            </p>
            <p className="mt-2 text-sm leading-6 text-[#718096]">
              AI 会提取核心意思、重组表达，并给出可直接复制的版本。
            </p>
          </div>
        ) : (
          <ExpressionStructureResult analysis={analysis} />
        )}

        {isGenerating ? (
          <p className="alert-neutral flex items-center gap-5">
            <span className="loading-dot" aria-hidden="true" />
            正在整理表达结构
          </p>
        ) : null}

        {error ? (
          <p className="alert-error">{error}</p>
        ) : null}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="button-primary w-full"
        >
          {isGenerating ? "生成中..." : "生成结构化表达"}
        </button>
      </div>
    </aside>
  );
}
