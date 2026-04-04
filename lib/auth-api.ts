const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function signup(payload: {
    full_name: string;
    email: string;
    password: string;
}) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Signup failed");
    return response.json();
}

export async function login(payload: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.json();
}

export async function logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) throw new Error("Logout failed");
    return response.json();
}