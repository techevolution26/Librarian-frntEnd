"use client";

import Link from "next/link";

interface AuthButtonsProps {
    loginHref?: string;
    signupHref?: string;
}

export default function AuthButtons({
    loginHref = "/login",
    signupHref = "/signup",
}: AuthButtonsProps) {
    return (
        <div className="flex items-center gap-3">
            <Link
                href={loginHref}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
            >
                Log in
            </Link>

            <Link
                href={signupHref}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
            >
                Sign up
            </Link>
        </div>
    );
}