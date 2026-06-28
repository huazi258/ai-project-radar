import Link from "next/link";
import { redirect } from "next/navigation";
import { RadarIcon } from "@/components/common/ui-icons";
import { SiteNavigation } from "@/components/layout/site-navigation";
import { createClient } from "@/lib/supabase/server";

const publicNavigationItems = [
  { label: "首页", href: "/" },
  { label: "功能介绍", href: "/#features" },
  { label: "登录", href: "/login" },
  { label: "注册", href: "/login?mode=sign-up" },
];

const authenticatedNavigationItems = [
  { label: "工作台", href: "/dashboard" },
  { label: "学习记录", href: "/learning" },
  { label: "结构化表达", href: "/structure" },
  { label: "项目思考", href: "/project-thinking" },
  { label: "项目库", href: "/projects" },
  { label: "内容库", href: "/library" },
  { label: "设置", href: "/settings" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navigationItems = user
    ? authenticatedNavigationItems
    : publicNavigationItems;
  const userLabel = user?.user_metadata?.display_name ?? user?.email;
  const brandHref = user ? "/dashboard" : "/";

  async function signOut() {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe5f0]/80 bg-[#f7f9fd]/88 backdrop-blur-xl">
      <div className="app-container flex min-h-16 flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <Link
          href={brandHref}
          className="group flex w-fit items-center gap-2.5 text-[#172033]"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-[#17233d] text-white shadow-[0_8px_22px_rgba(23,35,61,0.18)] transition-transform group-hover:-rotate-6">
            <RadarIcon className="size-5" />
          </span>
          <span>
            <span className="block font-display text-[0.95rem] font-bold tracking-[-0.02em]">
              AI Project Radar
            </span>
            <span className="block text-[0.62rem] font-semibold tracking-[0.12em] text-[#7a879b] uppercase">
              Learning workspace
            </span>
          </span>
        </Link>

        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
          <SiteNavigation items={navigationItems} />

          {user ? (
            <div className="flex items-center justify-between gap-3 border-t border-[#dfe5f0] pt-3 lg:border-t-0 lg:border-l lg:py-0 lg:pl-4">
              <span className="max-w-48 truncate text-xs font-medium text-[#7a879b]">
                {userLabel}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-lg border border-[#d5dcea] bg-white/80 px-3 py-2 text-xs font-semibold text-[#536078] transition-colors hover:border-[#b9c3d5] hover:text-[#1d2942]"
                >
                  退出登录
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
