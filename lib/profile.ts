// lib/profile.ts
import type { Book } from "@/lib/types";
import type {
  ActivityItem,
  ProfileStat,
  ReadingProgressItem,
  UserProfileResponse,
} from "@/lib/api";

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  avatar: string;
  memberSince: string;
  libraryStatus: string;
  readingMode: string;
  preferences: string[];
  stats: ProfileStat[];
  favoriteBooks: Book[];
  recentBooks: Book[];
  readingProgress: ReadingProgressItem[];
  suggestedBook: Book | null;
  recentActivity: ActivityItem[];
}


// export interface ReadingProgressItem {
//   id: number;
//   title: string;
//   progress: number;
// }

// export interface ActivityItem {
//   id: number;
//   title: string;
//   action: string;
//   href: string;
// }

const DEFAULT_AVATAR = "https://picsum.photos/300";

export function mapUserProfile(profile: UserProfileResponse): UserProfile {
  return {
    name: profile.name,
    email: profile.email,
    plan: profile.plan,
    avatar: profile.avatar ?? DEFAULT_AVATAR,
    memberSince: profile.member_since,
    libraryStatus: profile.library_status,
    readingMode: profile.reading_mode,
    preferences: profile.preferences,
    stats: profile.stats,
    favoriteBooks: profile.favorite_books,
    recentBooks: profile.recent_books,
    readingProgress: profile.reading_progress,
    suggestedBook: profile.suggested_book,
    recentActivity: profile.recent_activity,
  };
}