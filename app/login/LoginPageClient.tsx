"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/auth-api";

interface LoginPageClientProps {
    nextPath: string;
}

export default function LoginPageClient({
    nextPath,
}: LoginPageClientProps) {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await login({ email, password });
            router.push(nextPath || "/library");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Welcome back
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    Log in
                </h1>
                <p className="mt-3 text-sm leading-7 text-white/65">
                    Access your library, reading progress, bookmarks, and settings.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-white/70">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/20 focus:bg-white/10"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-white/70">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/20 focus:bg-white/10"
                            placeholder="••••••••"
                        />
                    </div>

                    {error ? (
                        <p className="text-sm text-red-300">{error}</p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-70"
                    >
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-white/55">
                    Don&apos;t have an account?{" "}
                    <Link
                        href={`/signup?next=${encodeURIComponent(nextPath)}`}
                        className="text-white hover:text-white/80"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </main>
    );
}