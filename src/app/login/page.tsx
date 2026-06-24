"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function redirectIfAuthenticated() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isMounted && user) {
        router.replace("/dashboard");
      }
    }

    redirectIfAuthenticated();

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (mode === "sign-in") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setIsLoading(false);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    setMessage("注册成功。请检查邮箱确认链接，或在确认后返回登录。");
  }

  return (
    <div className="px-6 py-16">
      <main className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <section>
          <p className="text-sm font-medium text-zinc-500">Account</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-zinc-950">
            登录 AI Project Radar
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
            使用邮箱和密码进入你的学习项目雷达。当前阶段只接入基础登录状态，
            记录和项目数据仍然使用 mock 数据展示。
          </p>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-6">
          <div className="grid grid-cols-2 rounded-md bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={`h-10 rounded-md text-sm font-medium transition-colors ${
                mode === "sign-in"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-950"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={`h-10 rounded-md text-sm font-medium transition-colors ${
                mode === "sign-up"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-950"
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-zinc-700">邮箱</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-zinc-700">密码</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="至少 6 位密码"
                required
                minLength={6}
                className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500"
              />
            </label>

            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isLoading
                ? "处理中..."
                : mode === "sign-in"
                  ? "登录"
                  : "注册"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
