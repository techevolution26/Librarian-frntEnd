import { getUserSettings } from "@/lib/api";
import { mapUserSettings } from "@/lib/settings";
import SettingsPageClient from "./SettingsPageClient";

export default async function SettingsPage() {
  const settingsResponse = await getUserSettings();
  const initialSettings = mapUserSettings(settingsResponse);

  return <SettingsPageClient initialSettings={initialSettings} />;
}