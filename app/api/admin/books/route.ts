import { proxyAdminRequest } from "@/lib/admin-bridge";

export async function GET() {
  return proxyAdminRequest("/books/admin/list?include_archived=true");
}