import { adminListActivity } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";
import {
    Activity,
    Archive,
    BookOpen,
    Clock,
    Code2,
    FileUp,
    Image,
    RotateCcw,
    Shield,
    Star,
    Trash2,
} from "lucide-react";

function formatActionLabel(action: string): string {
    return action
        .replaceAll(".", " / ")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function getActionIcon(action: string) {
    if (action.includes("featured")) return Star;
    if (action.includes("archived")) return Archive;
    if (action.includes("restored")) return RotateCcw;
    if (action.includes("deleted")) return Trash2;
    if (action.includes("pdf")) return FileUp;
    if (action.includes("cover")) return Image;
    if (action.includes("metadata")) return Code2;
    return Activity;
}

function getActionTone(action: string): string {
    if (action.includes("deleted")) {
        return "border-red-400/20 bg-red-500/10 text-red-100";
    }

    if (action.includes("archived")) {
        return "border-orange-400/20 bg-orange-500/10 text-orange-100";
    }

    if (action.includes("featured")) {
        return "border-yellow-400/20 bg-yellow-400/10 text-yellow-100";
    }

    if (action.includes("restored")) {
        return "border-emerald-400/20 bg-emerald-500/10 text-emerald-100";
    }

    return "border-cyan-400/20 bg-cyan-500/10 text-cyan-100";
}

function metadataToEntries(metadata: Record<string, unknown> | null) {
    if (!metadata) return [];

    return Object.entries(metadata).map(([key, value]) => ({
        key,
        value:
            typeof value === "string" || typeof value === "number" || typeof value === "boolean"
                ? String(value)
                : JSON.stringify(value),
    }));
}

export default async function AdminActivityPage() {
    const token = await requireAccessToken("/admin/activity");
    const logs = await adminListActivity(token);

    const latestLog = logs[0] ?? null;

    return (
        <div className="w-full space-y-6 pb-32 sm:pb-24 lg:pb-16">
            <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-2xl">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
                            <Shield className="h-3.5 w-3.5" />
                            Audit stream
                        </div>

                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                            Admin activity
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                            A live-style event trail for catalog changes, uploads, visibility
                            updates, and destructive operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <MetricCard label="Events" value={String(logs.length)} />
                        <MetricCard
                            label="Latest"
                            value={latestLog ? `#${latestLog.id}` : "—"}
                        />
                        <MetricCard
                            label="Mode"
                            value="Secure"
                        />
                    </div>
                </div>
            </section>

            {logs.length > 0 ? (
                <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/80 shadow-2xl">
                    <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/40">
                            <Code2 className="h-4 w-4" />
                            Event console
                        </div>
                    </div>

                    <div className="divide-y divide-white/10">
                        {logs.map((log, index) => {
                            const Icon = getActionIcon(log.action);
                            const tone = getActionTone(log.action);
                            const entries = metadataToEntries(log.metadata);

                            return (
                                <article
                                    key={log.id}
                                    className="group relative grid gap-4 px-5 py-5 transition hover:bg-white/[0.03] lg:grid-cols-[180px_1fr]"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative">
                                            <div
                                                className={[
                                                    "flex h-11 w-11 items-center justify-center rounded-2xl border",
                                                    tone,
                                                ].join(" ")}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            {index !== logs.length - 1 ? (
                                                <div className="absolute left-1/2 top-12 h-[calc(100%+1.25rem)] w-px -translate-x-1/2 bg-white/10" />
                                            ) : null}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-mono text-xs text-white/35">
                                                EVT-{String(log.id).padStart(5, "0")}
                                            </p>
                                            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/45">
                                                <Clock className="h-3.5 w-3.5" />
                                                {formatDate(log.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="min-w-0 rounded-3xl border border-white/10 bg-black/30 p-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-100/70">
                                                    {log.action}
                                                </p>

                                                <h3 className="mt-2 text-lg font-semibold text-white">
                                                    {formatActionLabel(log.action)}
                                                </h3>

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                                                        <BookOpen className="h-3.5 w-3.5" />
                                                        {log.entity_type}
                                                    </span>

                                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/60">
                                                        id:{log.entity_id ?? "null"}
                                                    </span>

                                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/60">
                                                        admin:{log.admin_user_id ?? "system"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className={[
                                                    "w-fit rounded-full border px-3 py-1 text-xs font-medium",
                                                    tone,
                                                ].join(" ")}
                                            >
                                                {log.action.split(".").at(-1)?.replaceAll("_", " ") ?? "event"}
                                            </div>
                                        </div>

                                        {entries.length > 0 ? (
                                            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
                                                <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                                                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                                                    <span className="ml-2 font-mono text-[11px] text-white/35">
                                                        metadata.json
                                                    </span>
                                                </div>

                                                <dl className="divide-y divide-white/10">
                                                    {entries.map((entry) => (
                                                        <div
                                                            key={entry.key}
                                                            className="grid gap-2 px-4 py-3 sm:grid-cols-[180px_1fr]"
                                                        >
                                                            <dt className="font-mono text-xs text-cyan-100/70">
                                                                {entry.key}
                                                            </dt>
                                                            <dd className="break-all font-mono text-xs text-white/65">
                                                                {entry.value}
                                                            </dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                            </div>
                                        ) : (
                                            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs text-white/35">
                                                {"{} // no metadata attached"}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            ) : (
                <section className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-8">
                    <div className="mx-auto max-w-xl text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                            <Activity className="h-6 w-6 text-white/50" />
                        </div>

                        <h3 className="mt-4 text-xl font-semibold text-white">
                            No admin events yet
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-white/55">
                            Upload, edit, feature, archive, or delete a book and the action
                            will appear here as an audit event.
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
}

function MetricCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                {label}
            </p>
            <p className="mt-2 font-mono text-xl font-semibold text-white">
                {value}
            </p>
        </div>
    );
}