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
    <div className="app-page">
      <main className="app-container-narrow">
        <div>
          <p className="page-kicker">Settings</p>
          <h1 className="page-title">设置</h1>
          <p className="page-description">
            查看当前账号信息和产品版本，管理你的登录状态。
          </p>
        </div>

        <section className="mt-8 grid gap-5">
          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-bold text-[#172033]">用户信息</h2>
            <div className="mt-4 grid gap-2 text-sm leading-6 text-[#637087]">
              <p>邮箱：{email}</p>
              <p>账号类型：个人学习用户</p>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-bold text-[#172033]">版本信息</h2>
            <div className="mt-4 grid gap-2 text-sm leading-6 text-[#637087]">
              <p>产品：AI Project Radar</p>
              <p>能力：记录、AI 分析、项目卡片、PRD 生成</p>
              <p>版本：0.1.0</p>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-bold text-[#172033]">账号操作</h2>
            <p className="mt-2 text-sm leading-6 text-[#637087]">
              退出后需要重新登录才能访问记录、项目和设置页面。
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="button-danger mt-4"
            >
              {isSigningOut ? "退出中..." : "退出登录"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
