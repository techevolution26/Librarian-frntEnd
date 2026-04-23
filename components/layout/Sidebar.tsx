import { getSidebarSummary } from "@/lib/api";
import { getAccessToken } from "@/lib/server-auth";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
  const token = await getAccessToken();
  const sidebarSummary = token ? await getSidebarSummary(token).catch(() => null) : null;

  return <SidebarClient sidebarSummary={sidebarSummary} />;
}