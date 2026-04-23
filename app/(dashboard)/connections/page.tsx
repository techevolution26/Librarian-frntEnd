import { getConnections } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";
import ConnectionsPageClient from "./ConnectionsPageClient";

export default async function ConnectionsPage() {
  const token = await requireAccessToken("/connections");
  const connections = await getConnections(token);

  return <ConnectionsPageClient initialConnections={connections} />;
}