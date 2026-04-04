"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, signup } from "@/lib/auth-api";

interface SignupPageClientProps {
    nextPath: string;
}

export default function SignupPageClient({
    nextPath,
}: SignupPageClientProps) {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await signup({
                full_name: fullName,
                email,
                password,
            });

            await login({ email, password });

            router.push(nextPath || "/library");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Signup failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Get started
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    Create account
                </h1>
                <p className="mt-3 text-sm leading-7 text-white/65">
                    Save books, track progress, manage bookmarks, and personalize your reading experience.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-white/70">Full name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/20 focus:bg-white/10"
                            placeholder="John Alfred"
                        />
                    </div>

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
                            minLength={6}
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
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-white/55">
                    Already have an account?{" "}
                    <Link
                        href={`/login?next=${encodeURIComponent(nextPath)}`}
                        className="text-white hover:text-white/80"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </main>
    );
}