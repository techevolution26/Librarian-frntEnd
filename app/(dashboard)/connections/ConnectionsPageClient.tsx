"use client";

import { useMemo, useState } from "react";
import { Link } from "lucide-react";
import {
    ApiError,
    actOnConnection,
    inviteConnection,
    type UserConnection,
} from "@/lib/api";

interface Props {
    initialConnections: UserConnection[];
    currentUserEmail: string;
}

function getOtherParticipant(
    connection: UserConnection,
    currentUserEmail: string,
) {
    return connection.requester.email === currentUserEmail
        ? connection.addressee
        : connection.requester;
}

export default function ConnectionsPageClient({
    initialConnections,
    currentUserEmail,
}: Props) {
    const [connections, setConnections] = useState<UserConnection[]>(initialConnections);
    const [email, setEmail] = useState("");
    const [relationship, setRelationship] =
        useState<UserConnection["relationship_type"]>("friend");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const incomingPending = useMemo(
        () =>
            connections.filter(
                (connection) =>
                    connection.status === "pending" &&
                    connection.addressee.email === currentUserEmail,
            ),
        [connections, currentUserEmail],
    );

    const outgoingPending = useMemo(
        () =>
            connections.filter(
                (connection) =>
                    connection.status === "pending" &&
                    connection.requester.email === currentUserEmail,
            ),
        [connections, currentUserEmail],
    );

    const accepted = useMemo(
        () => connections.filter((connection) => connection.status === "accepted"),
        [connections],
    );

    async function handleInvite() {
        setLoading(true);
        setMessage(null);

        try {
            const created = await inviteConnection(email, relationship);
            setConnections((prev) => [created, ...prev]);
            setEmail("");
            setRelationship("friend");
            setMessage("Invitation sent.");
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 404) {
                    setMessage("That email does not appear to belong to a registered user.");
                } else if (error.status === 409) {
                    setMessage("A connection already exists for that user.");
                } else {
                    setMessage(error.detail ?? "Failed to send invite.");
                }
            } else {
                setMessage("Failed to send invite.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleAction(
        connectionId: number | undefined,
        action: "accept" | "decline",
    ) {
        if (!connectionId) {
            setMessage("Missing connection id.");
            return;
        }

        try {
            const updated = await actOnConnection(connectionId, action);
            setConnections((prev) =>
                prev.map((connection) =>
                    connection.id === connectionId ? updated : connection,
                ),
            );
            setMessage(action === "accept" ? "Connection accepted." : "Invitation declined.");
        } catch (error) {
            if (error instanceof ApiError) {
                setMessage(error.detail ?? "Action failed.");
            } else {
                setMessage("Action failed.");
            }
        }
    }

    return (
        <div className="space-y-8 pb-32 sm:pb-20 lg:pb-12 px-4 sm:px-8 lg:px-12 w-full max-w-none">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-lg sm:p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    {/* add link icon inside */}
                    <div className="max-w-2xl">
                        <h1 className="flex items-center gap-x-2 text-2xl font-semibold tracking-tight text-white">
                            Connect
                            {/* 'shrink-0' prevents the icon from squishing on tiny mobile screens */}
                            <Link className="size-5 shrink-0 text-blue-500" />
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-white/60">
                            Invite friends, family, classmates, or mentors and build your
                            private reading network.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:w-[720px]">
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter email"
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                        />

                        <select
                            value={relationship}
                            onChange={(event) =>
                                setRelationship(
                                    event.target.value as UserConnection["relationship_type"],
                                )
                            }
                            className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none"
                        >
                            <option value="friend" className="bg-neutral-900 text-white">
                                Friend
                            </option>
                            <option value="family" className="bg-neutral-900 text-white">
                                Family
                            </option>
                            <option value="school" className="bg-neutral-900 text-white">
                                School
                            </option>
                            <option value="mentor" className="bg-neutral-900 text-white">
                                Mentor
                            </option>
                        </select>

                        <button
                            type="button"
                            onClick={handleInvite}
                            disabled={loading || !email.trim()}
                            className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-70"
                        >
                            {loading ? "Sending..." : "Invite"}
                        </button>
                    </div>
                </div>

                {message ? (
                    <p className="mt-4 text-sm text-white/65">{message}</p>
                ) : null}
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Incoming</h2>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                            {incomingPending.length}
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        {incomingPending.length > 0 ? (
                            incomingPending.map((connection) => (
                                <div
                                    key={connection.id}
                                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                >
                                    <p className="text-sm font-medium text-white">
                                        {connection.requester.full_name}
                                    </p>
                                    <p className="mt-1 text-xs text-white/50">
                                        {connection.requester.email}
                                    </p>
                                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/35">
                                        {connection.relationship_type}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleAction(connection.id, "accept")}
                                            className="rounded-xl bg-white px-3 py-2 text-sm text-black"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAction(connection.id, "decline")}
                                            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-white/50">No incoming requests.</p>
                        )}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Sent</h2>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                            {outgoingPending.length}
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        {outgoingPending.length > 0 ? (
                            outgoingPending.map((connection) => (
                                <div
                                    key={connection.id}
                                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                >
                                    <p className="text-sm font-medium text-white">
                                        {connection.addressee.full_name}
                                    </p>
                                    <p className="mt-1 text-xs text-white/50">
                                        {connection.addressee.email}
                                    </p>
                                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/35">
                                        {connection.relationship_type}
                                    </p>
                                    <p className="mt-3 text-xs text-white/50">Waiting for response</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-white/50">No sent requests.</p>
                        )}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Accepted</h2>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                            {accepted.length}
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        {accepted.length > 0 ? (
                            accepted.map((connection) => {
                                const otherUser = getOtherParticipant(connection, currentUserEmail);

                                return (
                                    <div
                                        key={connection.id}
                                        className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                    >
                                        <p className="text-sm font-medium text-white">
                                            {otherUser.full_name}
                                        </p>
                                        <p className="mt-1 text-xs text-white/50">{otherUser.email}</p>
                                        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/35">
                                            {connection.relationship_type}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-white/50">No connections yet.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}