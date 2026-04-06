"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DocumentProps, PageProps } from "react-pdf";

interface PdfReaderProps {
  bookId: number;
  fileUrl: string;
  title: string;
  initialPage?: number;
  initialTotalPages?: number | null;
  initialProgress?: number | null;
  initialBookmarkPage?: number | null;
  onProgressSave?: (payload: SavePdfProgressPayload) => Promise<void>;
}

export interface SavePdfProgressPayload {
  bookId: number;
  currentPage: number;
  totalPages: number;
  progressPercent: number;
  bookmarkPage?: number | null;
}

const MIN_SCALE = 0.7;
const MAX_SCALE = 2.4;
const DEFAULT_SCALE = 1.05;

function normalizeFileUrl(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return null;
  if (trimmed.includes("<function")) return null;
  if (trimmed === "null" || trimmed === "undefined") return null;

  return trimmed;
}

function getFriendlyPdfErrorMessage(errorMessage: string, hasUsableFileUrl: boolean): string {
  const lower = errorMessage.toLowerCase();

  if (!hasUsableFileUrl) {
    return "This book is currently not available for reading.";
  }

  if (lower.includes("404")) {
    return "This book is currently not available.";
  }

  if (lower.includes("missing pdf") || lower.includes("failed to fetch")) {
    return "We could not retrieve this PDF right now.";
  }

  if (lower.includes("invalid pdf")) {
    return "This file is not available as a valid PDF.";
  }

  return "We couldn’t load this PDF right now.";
}

export default function PdfReader({
  bookId,
  fileUrl,
  title,
  initialPage = 1,
  initialTotalPages = null,
  initialProgress = null,
  initialBookmarkPage = null,
  onProgressSave,
}: PdfReaderProps) {
  const [numPages, setNumPages] = useState<number>(initialTotalPages ?? 0);
  const [pageNumber, setPageNumber] = useState<number>(Math.max(1, initialPage));
  const [bookmarkPage, setBookmarkPage] = useState<number | null>(initialBookmarkPage);
  const [scale, setScale] = useState<number>(DEFAULT_SCALE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState<string>(String(Math.max(1, initialPage)));
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const saveTimerRef = useRef<number | null>(null);

  const [reactPdfModule, setReactPdfModule] = useState<{
    Document: React.ComponentType<DocumentProps>;
    Page: React.ComponentType<PageProps>;
    pdfjs: typeof import("react-pdf")["pdfjs"];
  } | null>(null);

  const safeFileUrl = useMemo(() => normalizeFileUrl(fileUrl), [fileUrl]);
  const hasUsableFileUrl = Boolean(safeFileUrl);

  useEffect(() => {
    if (!hasUsableFileUrl) {
      setLoadError("This book is currently not available.");
      setIsLoading(false);
      return;
    }

    let canceled = false;

    void import("react-pdf")
      .then((module) => {
        if (canceled) return;

        if (typeof window !== "undefined" && !("DOMMatrix" in window)) {
          const windowWithMatrix = window as Window & {
            WebKitCSSMatrix?: typeof DOMMatrix;
            DOMMatrix?: unknown;
          };

          windowWithMatrix.DOMMatrix =
            windowWithMatrix.WebKitCSSMatrix ||
            (class DOMMatrix {
              constructor(_init?: string | number[] | DOMMatrixInit) { }
              static fromFloat32Array(_array32: Float32Array) {
                return new DOMMatrix();
              }
              static fromFloat64Array(_array64: Float64Array) {
                return new DOMMatrix();
              }
              static fromMatrix(_other?: DOMMatrixInit) {
                return new DOMMatrix();
              }
            } as unknown as typeof DOMMatrix);
        }

        module.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        setReactPdfModule({
          Document: module.Document,
          Page: module.Page,
          pdfjs: module.pdfjs,
        });
      })
      .catch((error) => {
        setLoadError(
          error instanceof Error ? error.message : "Failed to load PDF module.",
        );
        setIsLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, [hasUsableFileUrl]);

  const progressPercent = useMemo(() => {
    if (!numPages || pageNumber < 1) {
      return initialProgress ?? 0;
    }

    return Math.max(0, Math.min(100, Math.round((pageNumber / numPages) * 100)));
  }, [initialProgress, numPages, pageNumber]);

  const clampPage = useCallback(
    (value: number) => {
      if (!numPages) return Math.max(1, value);
      return Math.min(Math.max(1, value), numPages);
    },
    [numPages],
  );

  const saveProgress = useCallback(
    async (page: number, total: number, bookmark: number | null) => {
      if (!onProgressSave || !total) return;

      setIsSaving(true);

      try {
        await onProgressSave({
          bookId,
          currentPage: page,
          totalPages: total,
          progressPercent: Math.max(
            0,
            Math.min(100, Math.round((page / total) * 100)),
          ),
          bookmarkPage: bookmark,
        });
      } finally {
        setIsSaving(false);
      }
    },
    [bookId, onProgressSave],
  );

  useEffect(() => {
    setPageInput(String(pageNumber));
  }, [pageNumber]);

  useEffect(() => {
    if (!numPages || !onProgressSave) return;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      void saveProgress(pageNumber, numPages, bookmarkPage);
    }, 700);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [bookmarkPage, numPages, onProgressSave, pageNumber, saveProgress]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber((prev) => Math.min(Math.max(1, prev), numPages));
    setIsLoading(false);
    setLoadError(null);
  }, []);

  const onDocumentLoadError = useCallback(
    (error: Error) => {
      setLoadError(getFriendlyPdfErrorMessage(error.message || "Failed to load PDF.", hasUsableFileUrl));
      setIsLoading(false);
    },
    [hasUsableFileUrl],
  );

  const goToPreviousPage = () => {
    setPageNumber((prev) => clampPage(prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => clampPage(prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(MAX_SCALE, Number((prev + 0.1).toFixed(2))));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(MIN_SCALE, Number((prev - 0.1).toFixed(2))));
  };

  const resetZoom = () => {
    setScale(DEFAULT_SCALE);
  };

  const handlePageInputCommit = () => {
    const numeric = Number(pageInput);

    if (!Number.isFinite(numeric)) {
      setPageInput(String(pageNumber));
      return;
    }

    setPageNumber(clampPage(Math.trunc(numeric)));
  };

  const handleBookmark = async () => {
    const nextBookmark = bookmarkPage === pageNumber ? null : pageNumber;
    setBookmarkPage(nextBookmark);

    if (numPages && onProgressSave) {
      await saveProgress(pageNumber, numPages, nextBookmark);
    }
  };

  const handlePageInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handlePageInputCommit();
    }
  };

  const DocumentComponent = reactPdfModule?.Document as React.ComponentType<DocumentProps>;
  const PageComponent = reactPdfModule?.Page as React.ComponentType<PageProps>;

  return (
    <section className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-3 sm:p-4">
      <div className="sticky top-0 z-20 rounded-2xl border border-white/10 bg-neutral-950/90 p-3 backdrop-blur">
        <div className="flex flex-col gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white sm:text-base">
              {title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/55 sm:text-xs">
              <span>PDF reader</span>
              <span>
                {numPages ? `Page ${pageNumber} of ${numPages}` : "Loading pages..."}
              </span>
              <span>{progressPercent}% complete</span>
              {bookmarkPage ? <span>Bookmark: page {bookmarkPage}</span> : null}
              {isSaving ? <span>Saving…</span> : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-[auto_auto_1fr_auto_auto_auto] sm:items-center">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1 || !!loadError}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={!numPages || pageNumber >= numPages || !!loadError}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

            <div className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-2 sm:col-span-1">
              <input
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={handlePageInputCommit}
                onKeyDown={handlePageInputKeyDown}
                inputMode="numeric"
                disabled={!!loadError}
                className="w-14 bg-transparent text-center text-sm text-white outline-none disabled:opacity-50"
                aria-label="Page number"
              />
              <span className="text-sm text-white/45">/ {numPages || "—"}</span>
            </div>

            <div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-3 sm:justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={!!loadError}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <button
                  type="button"
                  onClick={resetZoom}
                  disabled={!!loadError}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {Math.round(scale * 100)}%
                </button>

                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={!!loadError}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-2">
                {safeFileUrl ? (
                  <>
                    <a
                      href={safeFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 transition hover:bg-white/10"
                    >
                      Open
                    </a>

                    <a
                      href={safeFileUrl}
                      download
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 transition hover:bg-white/10"
                    >
                      Download
                    </a>
                  </>
                ) : (
                  <span className="text-xs text-white/45">File unavailable</span>
                )}
              </div>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/80 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-[60vh] items-start justify-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-2 sm:min-h-[72vh] sm:p-4">
        {!reactPdfModule && !loadError ? (
          <div className="py-16 text-center text-sm text-white/60">Loading PDF…</div>
        ) : loadError ? (
          <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-lg font-semibold text-white">Book currently unavailable</p>
            <p className="text-sm text-white/60">{loadError}</p>
            {safeFileUrl ? (
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={safeFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
                >
                  Try opening in new tab
                </a>
                <a
                  href={safeFileUrl}
                  download
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
                >
                  Download PDF
                </a>
              </div>
            ) : null}
          </div>
        ) : (
          <DocumentComponent
            file={safeFileUrl as string}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="py-16 text-center text-sm text-white/60">
                Loading PDF…
              </div>
            }
            error={null}
            className="max-w-full"
          >
            <PageComponent
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="max-w-full overflow-hidden rounded-xl shadow-2xl"
            />
          </DocumentComponent>
        )}
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1 || !!loadError}
          className="min-h-12 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous page
        </button>

        <button
          type="button"
          onClick={handleBookmark}
          disabled={!!loadError}
          className="min-h-12 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {bookmarkPage === pageNumber ? "Remove bookmark" : "Bookmark page"}
        </button>

        <button
          type="button"
          onClick={goToNextPage}
          disabled={!numPages || pageNumber >= numPages || !!loadError}
          className="min-h-12 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 xl:col-span-1"
        >
          Next page
        </button>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
        <span>
          {loadError
            ? "Document unavailable"
            : isLoading
              ? "Preparing document…"
              : `${numPages || 0} pages total`}
        </span>
        <span>
          {bookmarkPage ? `Bookmarked page ${bookmarkPage}` : "No bookmark saved"}
        </span>
      </div>
    </section>
  );
}