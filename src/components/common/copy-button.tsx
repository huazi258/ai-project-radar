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
        className="button-secondary w-fit"
      >
        {canCopy ? label : disabledLabel}
      </button>

      {status === "success" ? (
        <p className="text-sm font-semibold text-[#087b70]">已复制到剪贴板</p>
      ) : null}

      {status === "error" ? (
        <p className="text-sm font-semibold text-[#a42840]">
          复制失败，请检查浏览器剪贴板权限后重试。
        </p>
      ) : null}
    </div>
  );
}
