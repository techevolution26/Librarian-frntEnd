import { proxyAdminRequest } from "@/lib/admin-bridge";

export async function GET() {
  return proxyAdminRequest("/books/admin/activity?limit=50");
}