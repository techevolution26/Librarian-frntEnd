async function handleAuthResponse<T>(response: Response): Promise<T> {
    let data: unknown = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const detail =
            typeof data === "object" &&
                data !== null &&
                "detail" in data &&
                typeof (data as { detail?: unknown }).detail === "string"
                ? (data as { detail: string }).detail
                : "Request failed";

        throw new Error(detail);
    }

    return data as T;
}

export interface AuthUser {
    id: number;
    full_name: string;
    email: string;
    plan: string;
    avatar_url: string | null;
}

export async function signup(payload: {
    full_name: string;
    email: string;
    password: string;
}): Promise<AuthUser> {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // CRITICAL: Allows cross-domain cookies
    });

    return handleAuthResponse<AuthUser>(response);
}

export async function login(payload: {
    email: string;
    password: string;
}): Promise<{ ok: true }> {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // CRITICAL: Allows browser to save the 'access_token'
    });

    return handleAuthResponse<{ ok: true }>(response);
}

export async function logout(): Promise<{ ok: true }> {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // CRITICAL: Sends the cookie to the backend to clear it
    });

    return handleAuthResponse<{ ok: true }>(response);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
        credentials: "include", // CRITICAL: Sends the 'access_token' to verify session
    });

    if (response.status === 401) {
        return null;
    }

    return handleAuthResponse<AuthUser>(response);
}
