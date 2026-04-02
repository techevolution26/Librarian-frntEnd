"use client";

import PdfReader, {
  type SavePdfProgressPayload,
} from "@/components/reader/PdfReader";
import { savePdfProgress } from "@/lib/api";

interface PdfReaderClientBridgeProps {
  bookId: number;
  fileUrl: string;
  title: string;
  initialPage?: number;
  initialTotalPages?: number | null;
  initialProgress?: number | null;
  initialBookmarkPage?: number | null;
}

export default function PdfReaderClientBridge({
  bookId,
  fileUrl,
  title,
  initialPage = 1,
  initialTotalPages = null,
  initialProgress = 0,
  initialBookmarkPage = null,
}: PdfReaderClientBridgeProps) {
  const handleProgressSave = async (payload: SavePdfProgressPayload) => {
    await savePdfProgress(payload);
  };

  return (
    <PdfReader
      bookId={bookId}
      fileUrl={fileUrl}
      title={title}
      initialPage={initialPage}
      initialTotalPages={initialTotalPages}
      initialProgress={initialProgress}
      initialBookmarkPage={initialBookmarkPage}
      onProgressSave={handleProgressSave}
    />
  );
}