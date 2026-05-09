import { proxyAdminRequest } from "@/lib/admin-bridge";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const formData = await request.formData();

  return proxyAdminRequest(`/books/${id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  return proxyAdminRequest(`/books/${id}`, {
    method: "DELETE",
  });
}