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

    setMessage("注册成功。请检查邮箱完成确认，然后返回登录。");
  }

  return (
    <div className="app-page">
      <main className="app-container grid gap-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center">
        <section>
          <p className="page-kicker">Your workspace</p>
          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.7rem,7vw,5.4rem)] leading-[1] font-bold tracking-[-0.06em] text-[#172033]">
            登录 AI Project Radar
          </h1>
          <p className="page-description mt-6 text-lg">
            回到你的 AI 学习工作台，继续记录、整理和推进那些值得做下去的想法。
          </p>
        </section>

        <section className="form-card">
          <div className="grid grid-cols-2 rounded-xl bg-[#f0f3f8] p-1">
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={`h-10 rounded-lg text-sm font-semibold transition-colors ${
                mode === "sign-in"
                  ? "bg-white text-[#172033] shadow-sm"
                  : "text-[#758197] hover:text-[#172033]"
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={`h-10 rounded-lg text-sm font-semibold transition-colors ${
                mode === "sign-up"
                  ? "bg-white text-[#172033] shadow-sm"
                  : "text-[#758197] hover:text-[#172033]"
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
            <label className="grid gap-2">
              <span className="field-label">邮箱</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="field-control"
              />
            </label>

            <label className="grid gap-2">
              <span className="field-label">密码</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="至少 6 位密码"
                required
                minLength={6}
                className="field-control"
              />
            </label>

            {error ? (
              <p className="alert-error">{error}</p>
            ) : null}

            {message ? (
              <p className="alert-success">{message}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full"
            >
              {isLoading ? "处理中..." : mode === "sign-in" ? "登录" : "注册"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
