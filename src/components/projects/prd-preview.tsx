"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CopyButton } from "@/components/common/copy-button";
import type { ProjectRecord } from "@/types/project";

type PrdPreviewProps = {
  projectId?: string;
  markdown?: string | null;
};

type GeneratePrdResponse = {
  project?: ProjectRecord;
  prd_markdown?: string | null;
  error?: string;
};

export function PrdPreview({ projectId, markdown }: PrdPreviewProps) {
  const router = useRouter();
  const [currentMarkdown, setCurrentMarkdown] = useState(markdown ?? "");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const hasPrd = Boolean(currentMarkdown.trim());

  async function handleGeneratePrd() {
    if (!projectId) {
      setError("项目不存在，无法生成 PRD。");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");
    setIsGenerating(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/generate-prd`, {
        method: "POST",
      });
      const result = (await response.json()) as GeneratePrdResponse;
      const nextMarkdown =
        result.project?.prd_markdown ?? result.prd_markdown ?? "";

      if (!response.ok || !nextMarkdown) {
        setError(result.error ?? "PRD 生成失败，请稍后重试。");
        return;
      }

      setCurrentMarkdown(nextMarkdown);
      setMessage("PRD 已生成并保存。");
      router.refresh();
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "PRD 生成失败，请稍后重试。",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="surface-card h-fit overflow-hidden">
      <div className="border-b border-[#dfe5f0] bg-gradient-to-r from-[#eef0ff] to-white px-5 py-5">
        <p className="text-[0.68rem] font-bold tracking-[0.12em] text-[#7180a5] uppercase">
          Product document
        </p>
        <h2 className="mt-1 font-display text-lg font-bold text-[#172033]">
          PRD 工作区
        </h2>
      </div>
      <div className="p-5">
        {hasPrd ? (
          <div className="grid gap-3">
            <CopyButton
              text={currentMarkdown}
              label="复制 PRD Markdown"
              disabledLabel="暂无 PRD Markdown"
            />
            <pre className="markdown-panel max-h-[34rem]">
              {currentMarkdown}
            </pre>
          </div>
        ) : (
          <div className="content-panel border-dashed p-5">
            <p className="text-sm font-semibold text-[#344057]">
              尚未生成 PRD
            </p>
            <p className="mt-2 text-sm leading-6 text-[#718096]">
              点击生成后，会基于当前项目卡片生成一份简易 MVP PRD。
            </p>
          </div>
        )}

        {isGenerating ? (
          <p className="alert-neutral mt-4 flex items-center gap-5">
            <span className="loading-dot" aria-hidden="true" />
            正在生成 PRD
          </p>
        ) : null}

        {error ? (
          <p className="alert-error mt-4">{error}</p>
        ) : null}

        {message ? (
          <p className="alert-success mt-4">{message}</p>
        ) : null}

        <button
          type="button"
          onClick={handleGeneratePrd}
          disabled={isGenerating || !projectId}
          className="button-primary mt-5 w-full"
        >
          {isGenerating ? "生成中..." : hasPrd ? "重新生成 PRD" : "生成 PRD"}
        </button>
      </div>
    </section>
  );
}
