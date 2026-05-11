import { proxyAdminRequest } from "@/lib/admin-bridge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.toString();

  return proxyAdminRequest(
    query ? `/books/admin/list?${query}` : "/books/admin/list",
  );
}