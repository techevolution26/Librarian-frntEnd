"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, X } from "lucide-react";

const SUBJECT_OPTIONS = [
    { value: "report-issue", label: "Report an Issue" },
    { value: "suggestion", label: "Suggestion" },
    { value: "technical-issue", label: "Technical Issue" },
    { value: "feature-request", label: "Feature Request" },
    { value: "billing", label: "Billing Question" },
];

const EDGE_GAP = 16;

export default function SupportWidget() {
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [subject, setSubject] = useState(SUBJECT_OPTIONS[0].value);
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    const widgetRef = useRef<HTMLDivElement>(null);
    const firstFieldRef = useRef<HTMLSelectElement>(null);
    const closeTimeoutRef = useRef<number | null>(null);

    const dragStateRef = useRef<{
        active: boolean;
        startClientX: number;
        startClientY: number;
        startTranslateX: number;
        startTranslateY: number;
    }>({
        active: false,
        startClientX: 0,
        startClientY: 0,
        startTranslateX: 0,
        startTranslateY: 0,
    });

    const subjectId = useId();
    const emailId = useId();
    const messageId = useId();
    const statusId = useId();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const clampPosition = (nextTranslateX: number, nextTranslateY: number) => {
        const widgetEl = widgetRef.current;
        if (!widgetEl || typeof window === "undefined") {
            return { x: nextTranslateX, y: nextTranslateY };
        }

        const rect = widgetEl.getBoundingClientRect();

        const minTranslateX = EDGE_GAP - rect.left;
        const maxTranslateX = window.innerWidth - EDGE_GAP - rect.right;

        const minTranslateY = EDGE_GAP - rect.top;
        const maxTranslateY = window.innerHeight - EDGE_GAP - rect.bottom;

        return {
            x: Math.min(Math.max(nextTranslateX, minTranslateX), maxTranslateX),
            y: Math.min(Math.max(nextTranslateY, minTranslateY), maxTranslateY),
        };
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                !isSubmitting &&
                !dragStateRef.current.active &&
                widgetRef.current &&
                !widgetRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isSubmitting) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        const focusTimer = window.setTimeout(() => {
            firstFieldRef.current?.focus();
        }, 50);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
            window.clearTimeout(focusTimer);
        };
    }, [isOpen, isSubmitting]);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                window.clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const next = clampPosition(translateX, translateY);
            setTranslateX(next.x);
            setTranslateY(next.y);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [translateX, translateY]);

    const resetForm = () => {
        setSubject(SUBJECT_OPTIONS[0].value);
        setMessage("");
        setEmail("");
    };

    const handleToggle = () => {
        if (isSubmitting) return;
        setIsOpen((prev) => !prev);
    };

    const handleClose = () => {
        if (isSubmitting) return;
        setIsOpen(false);
    };

    const endDrag = () => {
        dragStateRef.current.active = false;
    };

    const startDrag = (clientX: number, clientY: number) => {
        dragStateRef.current = {
            active: true,
            startClientX: clientX,
            startClientY: clientY,
            startTranslateX: translateX,
            startTranslateY: translateY,
        };
    };

    const updateDrag = (clientX: number, clientY: number) => {
        if (!dragStateRef.current.active) return;

        const deltaX = clientX - dragStateRef.current.startClientX;
        const deltaY = clientY - dragStateRef.current.startClientY;

        const next = clampPosition(
            dragStateRef.current.startTranslateX + deltaX,
            dragStateRef.current.startTranslateY + deltaY,
        );

        setTranslateX(next.x);
        setTranslateY(next.y);
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            updateDrag(event.clientX, event.clientY);
        };

        const handleMouseUp = () => {
            endDrag();
        };

        const handleTouchMove = (event: TouchEvent) => {
            if (event.touches[0]) {
                updateDrag(event.touches[0].clientX, event.touches[0].clientY);
            }
        };

        const handleTouchEnd = () => {
            endDrag();
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchmove", handleTouchMove, { passive: true });
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [translateX, translateY]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedMessage = message.trim();
        const trimmedEmail = email.trim();

        if (!trimmedMessage) return;

        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const res = await fetch("/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: SUBJECT_OPTIONS.find((opt) => opt.value === subject)?.label,
                    message: trimmedMessage,
                    email: trimmedEmail || undefined,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to send");
            }

            resetForm();
            setSubmitStatus("success");

            closeTimeoutRef.current = window.setTimeout(() => {
                setIsOpen(false);
                setSubmitStatus("idle");
            }, 3000);
        } catch {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const widgetStyle = isMounted
        ? {
            transform: `translate(${translateX}px, ${translateY}px)`,
        }
        : undefined;

    return (
        <div
            ref={widgetRef}
            className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
            style={widgetStyle}
        >
            <button
                type="button"
                onClick={handleToggle}
                onMouseDown={(e) => {
                    if (!isOpen) startDrag(e.clientX, e.clientY);
                }}
                onTouchStart={(e) => {
                    if (!isOpen && e.touches[0]) {
                        startDrag(e.touches[0].clientX, e.touches[0].clientY);
                    }
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700 sm:h-14 sm:w-14"
                aria-label={isOpen ? "Close support widget" : "Open support widget"}
                aria-expanded={isOpen}
                aria-controls="support-widget-panel"
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
            </button>

            {isOpen && (
                <div
                    id="support-widget-panel"
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="support-widget-title"
                    className="absolute bottom-14 right-0 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl sm:bottom-16 sm:w-96"
                >
                    <div
                        className="cursor-grab bg-blue-600 px-4 py-4 text-white active:cursor-grabbing sm:px-5"
                        onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
                        onTouchStart={(e) => {
                            if (e.touches[0]) {
                                startDrag(e.touches[0].clientX, e.touches[0].clientY);
                            }
                        }}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 id="support-widget-title" className="text-base font-semibold sm:text-lg">
                                    How can we help?
                                </h3>
                                <p className="mt-1 text-sm text-blue-100">
                                    We&apos;ll get back to you soon.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="rounded-lg p-1 text-blue-100 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Close support widget"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-5">
                        <div>
                            <label
                                htmlFor={subjectId}
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                What is this about?
                            </label>
                            <select
                                id={subjectId}
                                ref={firstFieldRef}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                disabled={isSubmitting}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                {SUBJECT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor={emailId}
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Your email <span className="text-gray-400">(optional)</span>
                            </label>
                            <input
                                id={emailId}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="we'll reply here"
                                autoComplete="email"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor={messageId}
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Message
                            </label>
                            <textarea
                                id={messageId}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                required
                                disabled={isSubmitting}
                                placeholder="Describe your issue or suggestion..."
                                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                            <div className="mt-2 flex items-center justify-between gap-3">
                                <p className="text-xs text-gray-400">
                                    Be as specific as you can for a faster reply.
                                </p>
                                <span className="shrink-0 text-xs text-gray-400">
                                    {message.trim().length} chars
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div
                                id={statusId}
                                aria-live="polite"
                                className="min-h-[20px] text-sm"
                            >
                                {submitStatus === "success" ? (
                                    <span className="text-green-600">
                                        Sent! We&apos;ll be in touch.
                                    </span>
                                ) : null}

                                {submitStatus === "error" ? (
                                    <span className="text-red-600">
                                        Failed to send. Try again.
                                    </span>
                                ) : null}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !message.trim()}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Sending
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send message
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}