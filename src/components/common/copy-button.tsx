"use client";

import { useState } from "react";

type CopyButtonProps = {
  text?: string | null;
  label: string;
  disabledLabel?: string;
  className?: string;
};

export function CopyButton({
  text,
  label,
  disabledLabel = label,
  className = "",
}: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const canCopy = Boolean(text?.trim());

  async function handleCopy() {
    if (!canCopy || !text) {
      setStatus("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setStatus("success");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!canCopy}
        className="inline-flex h-10 w-fit items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
      >
        {canCopy ? label : disabledLabel}
      </button>

      {status === "success" ? (
        <p className="text-sm text-emerald-700">已复制</p>
      ) : null}

      {status === "error" ? (
        <p className="text-sm text-red-700">
          复制失败，请检查浏览器剪贴板权限后重试。
        </p>
      ) : null}
    </div>
  );
}
