"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("loading...");
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isMounted) {
        setEmail(user?.email ?? "未登录");
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleSignOut() {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="px-6 py-10">
      <main className="mx-auto w-full max-w-4xl">
        <div>
          <p className="text-sm font-medium text-zinc-500">Settings</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
            设置
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            这里展示当前登录状态的基础信息，业务数据仍然保持 mock 展示。
          </p>
        </div>

        <section className="mt-8 grid gap-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-950">
              用户信息占位
            </h2>
            <div className="mt-4 grid gap-2 text-sm text-zinc-600">
              <p>昵称：学习者 Demo</p>
              <p>邮箱：{email}</p>
              <p>角色：个人学习用户</p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-950">版本信息</h2>
            <div className="mt-4 grid gap-2 text-sm text-zinc-600">
              <p>产品：AI Project Radar</p>
              <p>当前阶段：静态页面骨架</p>
              <p>版本：0.1.0</p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-base font-semibold text-zinc-950">
              账号操作
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              点击后会调用 Supabase signOut，并返回登录页。
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="mt-4 inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              {isSigningOut ? "退出中..." : "退出登录"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
