import { getUserProfile } from "@/lib/api";
import { mapUserProfile } from "@/lib/profile";
import { requireAccessToken } from "@/lib/server-auth";
import ProfilePageClient from "./ProfilePageClient";

export default async function ProfilePage() {
    const token = await requireAccessToken("/profile");
    const profileResponse = await getUserProfile(token);
    const profile = mapUserProfile(profileResponse);

    return <ProfilePageClient initialProfile={profile} />;
}