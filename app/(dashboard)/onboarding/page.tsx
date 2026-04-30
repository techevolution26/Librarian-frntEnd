// app/(dashboard)/onboarding/page.tsx
import { getOnboardingPreferences } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";
import OnboardingPageClient from "./OnboardingPageClient";

export default async function OnboardingPage() {
  const token = await requireAccessToken("/onboarding");
  const preferences = await getOnboardingPreferences(token);

  return <OnboardingPageClient initialPreferences={preferences} />;
}