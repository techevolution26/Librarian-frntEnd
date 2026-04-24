import { getConnections, getCurrentUser } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";
import ConnectionsPageClient from "./ConnectionsPageClient";

export default async function ConnectionsPage() {
  const token = await requireAccessToken("/connections");

  const [connections, user] = await Promise.all([
    getConnections(token),
    getCurrentUser(token),
  ]);

  return (
    <ConnectionsPageClient
      initialConnections={connections}
      currentUserEmail={user.email}
    />
  );
}