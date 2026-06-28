"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  label: string;
  href: string;
};

type SiteNavigationProps = {
  items: NavigationItem[];
};

function isItemActive(pathname: string, href: string) {
  if (href.includes("#")) {
    return false;
  }

  const route = href.split("?")[0];

  if (route === "/") {
    return pathname === route;
  }

  return pathname === route || pathname.startsWith(`${route}/`);
}

export function SiteNavigation({ items }: SiteNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="主导航"
      className="no-scrollbar -mx-1 flex min-w-0 gap-1 overflow-x-auto px-1 pb-1 lg:overflow-visible lg:pb-0"
    >
      {items.map((item) => {
        const isActive = isItemActive(pathname, item.href);

        return (
          <Link
            key={`${item.label}-${item.href}`}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[#eef0ff] text-[#3044bd]"
                : "text-[#637087] hover:bg-white/80 hover:text-[#1d2942]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
