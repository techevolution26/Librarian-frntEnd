import { Suspense } from "react";
import { getLibraryItems, getLibrarySummary } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";
import LibraryPageClient from "./LibraryPageClient";

function LibraryFallback() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          Personal library
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your Library
        </h1>
        <p className="mt-4 text-sm text-white/70">Loading library...</p>
      </section>
    </div>
  );
}

export default async function LibraryPage() {
  const token = await requireAccessToken("/library");

  const [items, summary] = await Promise.all([
    getLibraryItems(token),
    getLibrarySummary(token),
  ]);

  return (
    <Suspense fallback={<LibraryFallback />}>
      <LibraryPageClient initialItems={items} initialSummary={summary} />
    </Suspense>
  );
}