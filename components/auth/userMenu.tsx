"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/auth-api";

interface UserMenuProps {
    user: {
        full_name: string;
        email: string;
        avatar_url: string | null;
    };
}

export default function UserMenu({ user }: UserMenuProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            await logout();
            router.push("/");
            router.refresh();
        } finally {
            setIsLoggingOut(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
            >
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {user.avatar_url ? (
                        <Image
                            src={user.avatar_url}
                            alt={user.full_name}
                            fill
                            className="object-cover"
                            sizes="36px"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-white/20 to-white/5" />
                    )}
                </div>

                <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium text-white">{user.full_name}</p>
                    <p className="text-xs text-white/45">{user.email}</p>
                </div>
            </button>

            {isOpen ? (
                <div className="absolute right-0 z-30 mt-3 w-56 rounded-2xl border border-white/10 bg-neutral-950/95 p-2 shadow-2xl backdrop-blur-xl">
                    <Link
                        href="/profile"
                        className="block rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        Profile
                    </Link>

                    <Link
                        href="/library"
                        className="block rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        Library
                    </Link>

                    <Link
                        href="/settings"
                        className="block rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        Settings
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-70"
                    >
                        {isLoggingOut ? "Logging out..." : "Log out"}
                    </button>
                </div>
            ) : null}
        </div>
    );
}