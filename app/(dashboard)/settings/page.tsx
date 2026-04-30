import { getOnboardingPreferences, getUserSettings } from "@/lib/api";
import { mapUserSettings } from "@/lib/settings";
import { requireAccessToken } from "@/lib/server-auth";
import SettingsPageClient from "./SettingsPageClient";

export default async function SettingsPage() {
  const token = await requireAccessToken("/settings");

  const [settingsResponse, onboardingResponse] = await Promise.all([
    getUserSettings(token),
    getOnboardingPreferences(token),
  ]);

  const initialSettings = mapUserSettings(settingsResponse);

  return (
    <SettingsPageClient
      initialSettings={initialSettings}
      initialOnboarding={onboardingResponse}
    />
  );
}