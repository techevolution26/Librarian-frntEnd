import { proxyAdminRequest } from "@/lib/admin-bridge";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(_request: Request, context: RouteContext) {
    const { id } = await context.params;

    return proxyAdminRequest(`/books/${id}/feature`, {
        method: "PATCH",
    });
}