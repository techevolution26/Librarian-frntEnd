import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_BASE_URL|| 'http://localhost:8000';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookie = req.headers.get("cookie");

  const res = await fetch(`${API}/connections/invite`, {
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