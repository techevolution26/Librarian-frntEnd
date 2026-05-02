// components/home/CirclePowerButton.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
    BookOpen,
    Compass,
    Home,
    Library,
    Settings,
    Infinity,
    MessageCirclePlus,
    X,
} from "lucide-react";

const featureItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/library", label: "Library", icon: Library },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/connections", label: "Connect", icon: MessageCirclePlus },
    { href: "/circles", label: "Circles", icon: Infinity },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function CirclePowerButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Desktop / tablet: top-left mini sidebar */}
            <div className="fixed left-4 top-24 z-50 hidden md:block">
                <div className="rounded-[2rem] border border-white/10 bg-neutral-950/90 p-3 shadow-2xl backdrop-blur-xl">
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black transition hover:scale-105"
                        aria-label={open ? "Close feature launcher" : "Open feature launcher"}
                    >
                        {open ? <X className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                    </button>

                    <div
                        className={[
                            "grid transition-all duration-300",
                            open ? "mt-3 gap-2 opacity-100" : "h-0 gap-0 overflow-hidden opacity-0",
                        ].join(" ")}
                    >
                        {featureItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-32">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Small screens: icon-only bottom umbrella */}
            <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 md:hidden">
                <div className="relative flex h-20 w-20 items-center justify-center">
                    {featureItems.map((item, index) => {
                        const Icon = item.icon;

                        const positions = [
                            "-translate-x-36 -translate-y-10",
                            "-translate-x-28 -translate-y-24",
                            "-translate-x-10 -translate-y-36",
                            "translate-x-10 -translate-y-36",
                            "translate-x-28 -translate-y-24",
                            "translate-x-36 -translate-y-10",
                        ];

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "absolute z-10 flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-md",
                                    // Amber Colorway
                                    "border-amber-500/20 bg-neutral-900/95 text-amber-200/90",
                                    // Hover: Becomes solid Gold with black icon for high contrast
                                    "hover:border-amber-300 hover:bg-amber-400 hover:text-black hover:-translate-y-1",
                                    open
                                        ? `${positions[index]} scale-100 opacity-100`
                                        : "translate-x-0 translate-y-0 scale-50 opacity-0 pointer-events-none",
                                ].join(" ")}
                                aria-label={item.label}
                            >
                                <Icon className="h-5 w-5" />
                            </Link>

                        );
                    })}

                    {open ? (
                        <div className="pointer-events-none absolute bottom-8 h-40 w-80 rounded-t-full border-t border-white/10 bg-white/[0.03]" />
                    ) : null}

                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        className="relative z-20 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white text-black shadow-2xl transition hover:scale-105"
                        aria-label={open ? "Close feature launcher" : "Open feature launcher"}
                    >
                        {open ? <X className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                    </button>
                </div>
            </div>
        </>
    );
}