import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const publicNavigationItems = [
  { label: "首页", href: "/" },
  { label: "功能介绍", href: "/#features" },
  { label: "登录", href: "/login" },
  { label: "注册", href: "/login?mode=sign-up" },
];

const authenticatedNavigationItems = [
  { label: "首页", href: "/" },
  { label: "学习记录", href: "/records" },
  { label: "结构化表达", href: "/expressions" },
  { label: "项目思考", href: "/project-thinking" },
  { label: "项目库", href: "/projects" },
  { label: "内容库", href: "/records" },
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

  async function signOut() {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="text-base font-semibold text-zinc-950">
          AI Project Radar
        </Link>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <nav aria-label="主导航" className="flex flex-wrap gap-1">
            {navigationItems.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex flex-col gap-2 border-t border-zinc-100 pt-3 lg:flex-row lg:items-center lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
              <span className="max-w-56 truncate text-sm text-zinc-500">
                {userLabel}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
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
