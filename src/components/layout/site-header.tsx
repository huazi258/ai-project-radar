import Link from "next/link";
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
  const userInitial = (userLabel ?? "U").trim().slice(0, 1).toUpperCase();
  const brandHref = user ? "/dashboard" : "/";

  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe5f0]/80 bg-[#f7f9fd]/88 backdrop-blur-xl">
      <div className="app-container grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:px-6">
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

        <div className="col-span-2 row-start-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:justify-self-center">
          <SiteNavigation items={navigationItems} />
        </div>

        {user ? (
          <Link
            href="/settings"
            title="打开账号设置"
            className="col-start-2 row-start-1 flex max-w-52 items-center justify-self-end gap-2 rounded-xl border border-transparent p-1.5 text-[#637087] transition-colors hover:border-[#dfe5f0] hover:bg-white/80 hover:text-[#3044bd] lg:col-start-3"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eef0ff] text-xs font-bold text-[#4056d6]">
              {userInitial}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block max-w-36 truncate text-xs font-semibold">
                {userLabel}
              </span>
              <span className="mt-0.5 block text-[0.65rem] text-[#98a2b3]">
                账号设置
              </span>
            </span>
          </Link>
        ) : null}
      </div>
    </header>
  );
}
