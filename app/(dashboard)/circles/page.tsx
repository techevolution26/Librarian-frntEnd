import { getCircles } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";
import CirclesPageClient from "./CirclesPageClient";

export default async function CirclesPage() {
  const token = await requireAccessToken("/circles");
  const circles = await getCircles(token);

  return <CirclesPageClient initialCircles={circles} />;
}