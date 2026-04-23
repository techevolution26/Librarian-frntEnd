"use client";

import { useMemo, useState } from "react";
import {
    inviteConnection,
    actOnConnection,
    type UserConnection,
} from "@/lib/api";

interface Props {
    initialConnections: UserConnection[];
}

export default function ConnectionsPageClient({ initialConnections }: Props) {
    const [connections, setConnections] = useState<UserConnection[]>(initialConnections);
    const [email, setEmail] = useState("");
    const [relationship, setRelationship] = useState<UserConnection["relationship_type"]>("friend");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const pending = useMemo(
        () => connections.filter((c) => c.status === "pending"),
        [connections],
    );

    const accepted = useMemo(
        () => connections.filter((c) => c.status === "accepted"),
        [connections],
    );

    async function handleInvite() {
        setLoading(true);
        setMessage(null);

        try {
            const created = await inviteConnection(email, relationship);
            setConnections((prev) => [created, ...prev]);
            setEmail("");
            setMessage("Invitation sent.");
        } catch {
            setMessage("Failed to send invite.");
        } finally {
            setLoading(false);
        }
    }

    async function handleAction(id: number, action: "accept" | "decline") {
        try {
            const updated = await actOnConnection(id, action);
            setConnections((prev) =>
                prev.map((c) => (c.id === id ? updated : c)),
            );
        } catch {
            setMessage("Action failed.");
        }
    }

    return (
        <div className="space-y-8">
            {/* Invite */}
            <section className="rounded-2xl border border-white/10 p-6">
                <h1 className="text-xl font-semibold">Connections</h1>

                <div className="mt-4 flex gap-2">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
                    />

                    <select
                        value={relationship}
                        onChange={(e) =>
                            setRelationship(e.target.value as UserConnection["relationship_type"])
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    >
                        <option value="friend">Friend</option>
                        <option value="family">Family</option>
                        <option value="school">School</option>
                        <option value="mentor">Mentor</option>
                    </select>

                    <button
                        onClick={handleInvite}
                        disabled={loading}
                        className="rounded-xl bg-white px-4 py-2 text-black text-sm"
                    >
                        {loading ? "Sending..." : "Invite"}
                    </button>
                </div>

                {message && <p className="mt-3 text-sm text-white/60">{message}</p>}
            </section>

            {/* Pending */}
            <section>
                <h2 className="text-lg font-semibold">Pending</h2>

                {pending.length > 0 ? (
                    pending.map((c) => (
                        <div key={c.id} className="mt-3 rounded-xl border p-4">
                            <p>{c.requester.full_name} → {c.addressee.full_name}</p>

                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => handleAction(c.id, "accept")}
                                    className="rounded-lg bg-white px-3 py-1 text-black text-sm"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleAction(c.id, "decline")}
                                    className="rounded-lg border px-3 py-1 text-sm"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-white/50 mt-2">No pending invites.</p>
                )}
            </section>

            {/* Accepted */}
            <section>
                <h2 className="text-lg font-semibold">Accepted</h2>

                {accepted.length > 0 ? (
                    accepted.map((c) => (
                        <div key={c.id} className="mt-3 rounded-xl border p-4">
                            <p>{c.requester.full_name} ↔ {c.addressee.full_name}</p>
                            <p className="text-xs text-white/50">{c.relationship_type}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-white/50 mt-2">No connections yet.</p>
                )}
            </section>
        </div>
    );
}