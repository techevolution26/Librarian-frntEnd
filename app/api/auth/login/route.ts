import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      { detail: data?.detail ?? "Login failed" },
      { status: response.status },
    );
  }

  const token = data?.access_token;

  if (!token) {
    return NextResponse.json(
      { detail: "No access token returned" },
      { status: 500 },
    );
  }

  const nextResponse = NextResponse.json({ ok: true });

  nextResponse.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return nextResponse;
}