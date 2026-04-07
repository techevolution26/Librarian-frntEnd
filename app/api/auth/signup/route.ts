import { NextResponse } from "next/server";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function POST(request: Request) {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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
            { detail: data?.detail ?? "Signup failed" },
            { status: response.status },
        );
    }

    return NextResponse.json(data, { status: 201 });
}