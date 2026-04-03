import { Suspense } from "react";
import { getBooks } from "@/lib/api";
import DiscoverPageClient from "./DiscoverPageClient";

function DiscoverFallback() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          Discover books
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Discover
        </h1>
        <p className="mt-4 text-sm text-white/70">You Are About To Discover...</p>
      </section>
    </div>
  );
}

export default async function DiscoverPage() {
  const books = await getBooks();

  return (
    <Suspense fallback={<DiscoverFallback />}>
      <DiscoverPageClient initialBooks={books} />
    </Suspense>
  );
}