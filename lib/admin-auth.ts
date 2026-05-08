import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";

export async function requireAdmin() {
    const token = await requireAccessToken("/admin");
    const user = await getCurrentUser(token);

    if (user.role !== "ADMIN") {
        redirect("/");
    }

    return {
        token,
        user,
    };
}