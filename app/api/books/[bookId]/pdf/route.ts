import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

interface RouteContext {
  params: Promise<{
    bookId: string;
  }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { bookId } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  // First, ask the API for the book content so we can get the upstream source URL
  const contentResp = await fetch(`${API_BASE_URL}/books/${bookId}/content`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  }).catch(() => null as Response | null);

  if (!contentResp) {
    return NextResponse.json({ detail: "Upstream unavailable" }, { status: 503 });
  }

  if (!contentResp.ok) {
    const data = await contentResp.json().catch(() => null);
    return NextResponse.json(data, { status: contentResp.status });
  }

  const content = await contentResp.json().catch(() => null as any);
  const sourceUrl: string | undefined = content?.source_url;

  if (!sourceUrl) {
    return NextResponse.json({ detail: "Source unavailable" }, { status: 404 });
  }

  // Fetch the actual file from the upstream source URL server-side to avoid CORS
  const fileResp = await fetch(sourceUrl, {
    // no special headers here — the upstream file is expected to be publicly readable
    // If your upstream requires auth, add appropriate headers here.
    cache: "no-store",
  }).catch(() => null as Response | null);

  if (!fileResp) {
    return NextResponse.json({ detail: "Failed to fetch file" }, { status: 502 });
  }

  if (!fileResp.ok) {
    const text = await fileResp.text().catch(() => null);
    return NextResponse.json({ detail: text ?? "Failed to fetch file" }, { status: fileResp.status });
  }

  const buf = await fileResp.arrayBuffer();
  const contentType = fileResp.headers.get("content-type") ?? "application/pdf";

  return new NextResponse(Buffer.from(buf), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(buf.byteLength),
    },
  });
}
