"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import type { SidebarSummary } from "@/lib/api";

interface TopbarProps {
  sidebarSummary?: SidebarSummary | null;
}

function getInitials(name: string | undefined): string {
  if (!name) return "B";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Keep topbar search separate from page-specific search.
 *
 * Admin books uses ?q=
 * Discover may use ?q=
 *
 * Topbar uses ?globalQ= to avoid hijacking page filters.
 */
const TOPBAR_QUERY_KEY = "globalQ";

export default function Topbar({ sidebarSummary }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hasMounted, setHasMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const fullName = sidebarSummary?.full_name ?? "Librarian user";
  const initials = getInitials(fullName);
  const isAdmin = sidebarSummary?.role === "ADMIN";

  const topbarSearchValue = useMemo(() => {
    return searchParams.get(TOPBAR_QUERY_KEY) ?? "";
  }, [searchParams]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setInputValue(topbarSearchValue);
  }, [topbarSearchValue]);

  const updateQuery = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set(TOPBAR_QUERY_KEY, value.trim());
    } else {
      params.delete(TOPBAR_QUERY_KEY);
    }

    /**
     * If user uses topbar search, reset normal pagination.
     * This avoids staying on page 5 after changing search.
     */
    params.delete("page");

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, {
      scroll: false,
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    updateQuery(value);
  };

  const clearQuery = () => {
    setInputValue("");
    updateQuery("");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/85 backdrop-blur-xl">
      <div className="px-3 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <label htmlFor="topbar-search" className="sr-only">
              Search across The Library
            </label>

            <div className="relative w-full lg:max-w-2xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />

              <input
                id="topbar-search"
                value={inputValue}
                onChange={handleChange}
                placeholder="Search across The Library..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-20 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-white/20 focus:bg-white/10 sm:pr-24"
              />

              {hasMounted && inputValue ? (
                <button
                  type="button"
                  onClick={clearQuery}
                  className="absolute inset-y-0 right-2 my-auto inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs text-white/60 transition hover:bg-white/10 hover:text-white sm:right-3 sm:text-sm"
                  aria-label="Clear topbar search"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              ) : (
                <div className="pointer-events-none absolute inset-y-0 right-3 hidden items-center text-xs text-white/35 sm:flex">
                  Global
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 sm:inline-flex"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </button>

          <button
            type="button"
            className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-400 ring-2 ring-neutral-950" />
          </button>

          <Link
            href="/profile"
            className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-1.5 transition hover:bg-white/10 sm:px-3 sm:py-2"
            aria-label="Open profile"
          >
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/10">
              {sidebarSummary?.avatar_url ? (
                <Image
                  src={sidebarSummary.avatar_url}
                  alt={fullName}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-white">
                  {initials}
                </span>
              )}
            </div>

            <div className="hidden min-w-0 leading-tight sm:block">
              <p className="max-w-32 truncate text-sm font-medium text-white">
                {fullName}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
                    isAdmin
                      ? "border border-red-400/20 bg-red-500/10 text-red-100"
                      : "border border-white/10 bg-white/5 text-white/45",
                  ].join(" ")}
                >
                  {isAdmin ? "Admin" : "Reader"}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}