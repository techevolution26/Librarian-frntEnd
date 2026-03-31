import { Suspense } from "react";
import LibraryPageClient from "./LibraryPageClient";

export default function LibraryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LibraryPageClient />
        </Suspense>
    );
}