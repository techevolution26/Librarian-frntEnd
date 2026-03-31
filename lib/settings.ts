// lib/settings.ts
export type ThemeOption = "system" | "light" | "dark";
export type DensityOption = "comfortable" | "compact";
export type FontSizeOption = "small" | "medium" | "large";
export type LineHeightOption = "relaxed" | "comfortable" | "compact";
export type VisibilityOption = "private" | "friends" | "public";

export interface UserSettings {
  account: {
    fullName: string;
    email: string;
    plan: string;
  };
  appearance: {
    theme: ThemeOption;
    density: DensityOption;
    readingMode: "paged" | "scroll";
  };
  reading: {
    fontSize: FontSizeOption;
    lineHeight: LineHeightOption;
    autoBookmark: boolean;
    showProgressBar: boolean;
  };
  notifications: {
    emailUpdates: boolean;
    readingReminders: boolean;
    productAnnouncements: boolean;
  };
  privacy: {
    profileVisibility: VisibilityOption;
    shareReadingActivity: boolean;
  };
}

export function getUserSettings(): UserSettings {
  return {
    account: {
      fullName: "Tech Resolute",
      email: "techresolute@example.com",
      plan: "Free plan",
    },
    appearance: {
      theme: "dark",
      density: "comfortable",
      readingMode: "scroll",
    },
    reading: {
      fontSize: "medium",
      lineHeight: "comfortable",
      autoBookmark: true,
      showProgressBar: true,
    },
    notifications: {
      emailUpdates: true,
      readingReminders: true,
      productAnnouncements: false,
    },
    privacy: {
      profileVisibility: "private",
      shareReadingActivity: false,
    },
  };
}