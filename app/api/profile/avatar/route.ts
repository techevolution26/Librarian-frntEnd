import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
        cache: "no-store",
    });

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        const data = await response.json().catch(() => null);
        return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text().catch(() => "");
    return NextResponse.json(
        { detail: text || "Avatar upload failed" },
        { status: response.status },
    );
}