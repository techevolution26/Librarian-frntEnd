import { getUserProfile } from "@/lib/api";
import { mapUserProfile } from "@/lib/profile";
import ProfilePageClient from "./ProfilePageClient";

export default async function ProfilePage() {
    const profileResponse = await getUserProfile();
    const profile = mapUserProfile(profileResponse);

    return <ProfilePageClient initialProfile={profile} />;
}