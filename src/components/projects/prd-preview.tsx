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
    <section className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-950">PRD 展示区</h2>
      </div>
      <div className="p-5">
        {hasPrd ? (
          <div className="grid gap-3">
            <CopyButton
              text={currentMarkdown}
              label="复制 PRD Markdown"
              disabledLabel="暂无 PRD Markdown"
            />
            <pre className="max-h-[520px] overflow-x-auto whitespace-pre-wrap rounded-md bg-zinc-950 p-4 text-sm leading-6 text-zinc-100">
              {currentMarkdown}
            </pre>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-5">
            <p className="text-sm font-medium text-zinc-700">
              尚未生成 PRD
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              点击生成后，会基于当前项目卡片生成一份简易 MVP PRD。
            </p>
          </div>
        )}

        {isGenerating ? (
          <p className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
            正在生成 PRD...
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleGeneratePrd}
          disabled={isGenerating || !projectId}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isGenerating ? "生成中..." : hasPrd ? "重新生成 PRD" : "生成 PRD"}
        </button>
      </div>
    </section>
  );
}
