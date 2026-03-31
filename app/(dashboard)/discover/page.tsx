import { Suspense } from "react";
import DiscoverPageClient from "./DiscoverPageClient";

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DiscoverPageClient />
    </Suspense>
  );
}