import { proxyAdminRequest } from "@/lib/admin-bridge";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const formData = await request.formData();

  return proxyAdminRequest(`/books/${id}/cover`, {
    method: "POST",
    body: formData,
  });
}