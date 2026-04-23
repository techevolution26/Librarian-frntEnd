import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const cookie = req.headers.get("cookie");

  const res = await fetch(`${API}/connections/${params.id}/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookie ?? "",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}