"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Home, Settings2, UserRound } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

function isItemActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-neutral-950/95 px-2 py-2 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] transition",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Tablet compact rail */}
      <aside className="hidden h-screen w-20 shrink-0 border-r border-white/10 bg-neutral-950/95 px-3 py-6 md:flex lg:hidden">
        <div className="flex h-full flex-col items-center">
          <Link
            href="/"
            className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10"
          >
            <span className="text-sm font-semibold text-white">L</span>
          </Link>

          <nav className="flex w-full flex-col items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-xl transition",
                    isActive
                      ? "bg-white/10 text-white ring-1 ring-white/10"
                      : "text-white/65 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white">
            7
          </div>
        </div>
      </aside>

      {/* Desktop full sidebar */}
      <aside className="hidden h-screen w-72 shrink-0 border-r border-white/10 bg-neutral-950/95 px-5 py-6 lg:flex lg:flex-col">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
              <span className="text-sm font-semibold text-white">L</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Librarian
              </h1>
              <p className="text-xs text-white/45">Transforming Your Mind</p>
            </div>
          </Link>
        </div>

        <nav className="space-y-1">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.2em] text-white/35">
            Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition",
                  isActive
                    ? "bg-white/10 text-white ring-1 ring-white/10"
                    : "text-white/65 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Reading streak
            </p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-semibold text-white">7</span>
              <span className="pb-1 text-sm text-white/55">days active</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-white/80" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}