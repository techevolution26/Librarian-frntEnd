import { Suspense } from "react";
import { getBooks } from "@/lib/api";
import DiscoverPageClient from "./DiscoverPageClient";

export const dynamic = "force-dynamic";

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
        <p className="mt-4 text-sm text-white/70">
          You are about to discover...
        </p>
      </section>
    </div>
  );
}

function DiscoverUnavailable() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          Discover books
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Discover
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
          We couldn&apos;t load books right now. Please try again in a moment.
        </p>
      </section>
    </div>
  );
}

export default async function DiscoverPage() {
  let books = null;

  try {
    books = await getBooks();
  } catch (error) {
    // Optionally log error here
    return <DiscoverUnavailable />;
  }

  // JSX is now outside the try/catch block
  return (
    <Suspense fallback={<DiscoverFallback />}>
      <DiscoverPageClient initialBooks={books} />
    </Suspense>
  );
}

