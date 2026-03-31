"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function Topbar() {
  const [query, setQuery] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <label htmlFor="book-search" className="sr-only">
            Search books
          </label>

          <div className="relative max-w-2xl">
            <input
              id="book-search"
              value={query}
              onChange={handleChange}
              placeholder="Search books, authors, genres..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-white/20 focus:bg-white/10"
            />
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/30">
              ⌘K
            </div>
          </div>
        </div>

        <button className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 sm:inline-flex">
          Filter
        </button>

        <button className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 sm:inline-flex">
          Notifications
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/10" />
          <div className="hidden leading-tight sm:block">
            <Link href="/profile" className="text-sm font-medium text-white">
              You
            </Link>
            <p className="text-xs text-white/45">Free plan</p>
          </div>
        </div>
      </div>
    </header>
  );
}