import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function GET() {

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        return NextResponse.json(
            { detail: data?.detail ?? "Failed to fetch user info" },
            { status: response.status },
        );
    }

    return NextResponse.json(data);
}