import Link from "next/link";

const navigationItems = [
  { label: "首页", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "记录", href: "/records" },
  { label: "项目", href: "/projects" },
  { label: "设置", href: "/settings" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-base font-semibold text-zinc-950">
          AI Project Radar
        </Link>

        <nav aria-label="主导航" className="flex flex-wrap gap-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
