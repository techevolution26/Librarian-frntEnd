import { adminListActivity } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";

export default async function AdminActivityPage() {
    const token = await requireAccessToken("/admin/activity");
    const logs = await adminListActivity(token);

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-semibold text-white">Admin activity</h2>
                <p className="mt-1 text-sm text-white/55">
                    Recent catalog and moderation operations.
                </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04]">
                {logs.length > 0 ? (
                    <div className="divide-y divide-white/10">
                        {logs.map((log) => (
                            <div key={log.id} className="p-5">
                                <p className="font-medium text-white">{log.action}</p>
                                <p className="mt-1 text-sm text-white/55">
                                    {log.entity_type} #{log.entity_id ?? "-"} •{" "}
                                    {new Date(log.created_at).toLocaleString()}
                                </p>

                                {log.metadata ? (
                                    <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/30 p-3 text-xs text-white/65">
                                        {JSON.stringify(log.metadata, null, 2)}
                                    </pre>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-sm text-white/55">
                        No admin activity yet.
                    </div>
                )}
            </div>
        </div>
    );
}