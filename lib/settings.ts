// lib/settings.ts
export type ThemeOption = "system" | "light" | "dark";
export type DensityOption = "comfortable" | "compact";
export type ReadingModeOption = "paged" | "scroll";
export type FontSizeOption = "small" | "medium" | "large";
export type LineHeightOption = "compact" | "comfortable" | "relaxed";
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
    readingMode: ReadingModeOption;
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

export interface UserSettingsResponse {
  account: {
    full_name: string;
    email: string;
    plan: string;
  };
  appearance: {
    theme: string;
    density: string;
    reading_mode: string;
  };
  reading: {
    font_size: string;
    line_height: string;
    auto_bookmark: boolean;
    show_progress_bar: boolean;
  };
  notifications: {
    email_updates: boolean;
    reading_reminders: boolean;
    product_announcements: boolean;
  };
  privacy: {
    profile_visibility: string;
    share_reading_activity: boolean;
  };
}

export function mapUserSettings(input: UserSettingsResponse): UserSettings {
  return {
    account: {
      fullName: input.account.full_name,
      email: input.account.email,
      plan: input.account.plan,
    },
    appearance: {
      theme: input.appearance.theme as ThemeOption,
      density: input.appearance.density as DensityOption,
      readingMode: input.appearance.reading_mode as ReadingModeOption,
    },
    reading: {
      fontSize: input.reading.font_size as FontSizeOption,
      lineHeight: input.reading.line_height as LineHeightOption,
      autoBookmark: input.reading.auto_bookmark,
      showProgressBar: input.reading.show_progress_bar,
    },
    notifications: {
      emailUpdates: input.notifications.email_updates,
      readingReminders: input.notifications.reading_reminders,
      productAnnouncements: input.notifications.product_announcements,
    },
    privacy: {
      profileVisibility: input.privacy.profile_visibility as VisibilityOption,
      shareReadingActivity: input.privacy.share_reading_activity,
    },
  };
}