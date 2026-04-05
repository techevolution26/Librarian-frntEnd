import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function requireAccessToken(nextPath: string): Promise<string> {
  const token = await getAccessToken();

  if (!token) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return token;
}