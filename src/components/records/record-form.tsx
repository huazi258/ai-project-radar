"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { RecordType } from "@/types/record";

const recordTypeOptions: { label: string; value: RecordType }[] = [
  { label: "学习记录", value: "learning" },
  { label: "AI 使用记录", value: "ai_usage" },
  { label: "项目灵感", value: "project_idea" },
  { label: "教程笔记", value: "tutorial_note" },
  { label: "每日复盘", value: "daily_review" },
];

function parseTags(value: string) {
  return value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function RecordForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<RecordType>("learning");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("标题和正文内容不能为空。");
      return;
    }

    setIsSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsSubmitting(false);
      setError("请先登录后再新建记录。");
      router.replace("/login");
      return;
    }

    const { error: insertError } = await supabase.from("records").insert({
      user_id: user.id,
      title: trimmedTitle,
      content: trimmedContent,
      type,
      tags: parseTags(tags),
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/records");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-200 bg-white p-6"
    >
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">标题</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例如：今天用 AI 整理了 React 学习笔记"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">记录类型</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as RecordType)}
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors focus:border-zinc-500"
          >
            {recordTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">标签</span>
          <input
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Next.js, AI, Markdown"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">正文内容</span>
          <textarea
            rows={10}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="写下今天的学习过程、遇到的问题、AI 使用经验或项目想法。"
            className="resize-none rounded-md border border-zinc-300 px-3 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? "保存中..." : "保存记录"}
        </button>
      </div>
    </form>
  );
}
