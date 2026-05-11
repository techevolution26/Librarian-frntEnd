"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    logoutUser,
    updateOnboardingPreferences,
    updateUserSettings,
    type OnboardingPreferences,
} from "@/lib/api";

import {
    type UserSettings,
    type ThemeOption,
    type DensityOption,
    type FontSizeOption,
    type LineHeightOption,
    type VisibilityOption,
} from "@/lib/settings";

interface SettingsPageClientProps {
    initialSettings: UserSettings;
    initialOnboarding: OnboardingPreferences;
}

interface SectionCardProps {
    eyebrow: string;
    title: string;
    description: string;
    children: React.ReactNode;
}

interface ToggleRowProps {
    label: string;
    description: string;
    checked: boolean;
    onChange: (next: boolean) => void;
}

interface SelectRowProps<T extends string> {
    label: string;
    description: string;
    value: T;
    options: readonly T[] | T[];
    onChange: (next: T) => void;
}

interface InputRowProps {
    label: string;
    description: string;
    value: string;
    onChange: (next: string) => void;
    type?: "text" | "email";
}

function SectionCard({
    eyebrow,
    title,
    description,
    children,
}: SectionCardProps) {
    return (
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl">
            <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    {eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    {title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/65">{description}</p>
            </div>

            <div className="mt-6 space-y-4">{children}</div>
        </section>
    );
}

function InputRow({
    label,
    description,
    value,
    onChange,
    type = "text",
}: InputRowProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="mt-1 text-sm text-white/55">{description}</p>
            </div>

            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/20 focus:bg-white/10"
            />
        </div>
    );
}

function SelectRow<T extends string>({
    label,
    description,
    value,
    options,
    onChange,
}: SelectRowProps<T>) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="mt-1 text-sm text-white/55">{description}</p>
            </div>

            <select
                value={value}
                onChange={(event) => onChange(event.target.value as T)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20"
            >
                {options.map((option) => (
                    <option key={option} value={option} className="bg-neutral-900 text-white">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: ToggleRowProps) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="max-w-xl">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="mt-1 text-sm text-white/55">{description}</p>
            </div>

            <button
                type="button"
                onClick={() => onChange(!checked)}
                aria-pressed={checked}
                className={[
                    "relative mt-1 h-7 w-12 rounded-full border transition",
                    checked ? "border-white/20 bg-white" : "border-white/10 bg-white/10",
                ].join(" ")}
            >
                <span
                    className={[
                        "absolute top-1 h-5 w-5 rounded-full transition",
                        checked ? "left-6 bg-black" : "left-1 bg-white",
                    ].join(" ")}
                />
            </button>
        </div>
    );
}

function PreferenceChips({
    label,
    options,
    selected,
    onChange,
}: {
    label: string;
    options: string[];
    selected: string[];
    onChange: (items: string[]) => void;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-medium text-white">{label}</p>

            <div className="mt-3 flex flex-wrap gap-2">
                {options.map((option) => {
                    const active = selected.includes(option);

                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() =>
                                onChange(
                                    active
                                        ? selected.filter((item) => item !== option)
                                        : [...selected, option],
                                )
                            }
                            className={[
                                "rounded-full border px-4 py-2 text-sm transition",
                                active
                                    ? "border-white bg-white text-black"
                                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                            ].join(" ")}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function SettingsPageClient({
    initialSettings,
    initialOnboarding,
}: SettingsPageClientProps) {
    const router = useRouter();

    const [settings, setSettings] = useState<UserSettings>(initialSettings);

    const [personalization, setPersonalization] = useState({
        preferredGenres: initialOnboarding.preferred_genres,
        readingGoals: initialOnboarding.reading_goals,
        contentStyles: initialOnboarding.content_styles,
        preferredLengths: initialOnboarding.preferred_lengths,
        weeklyTarget: initialOnboarding.weekly_target ?? "",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isSavingPersonalization, setIsSavingPersonalization] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const updateAccount = <K extends keyof UserSettings["account"]>(
        key: K,
        value: UserSettings["account"][K],
    ) => {
        setSettings((prev) => ({
            ...prev,
            account: { ...prev.account, [key]: value },
        }));
    };

    const updateAppearance = <K extends keyof UserSettings["appearance"]>(
        key: K,
        value: UserSettings["appearance"][K],
    ) => {
        setSettings((prev) => ({
            ...prev,
            appearance: { ...prev.appearance, [key]: value },
        }));
    };

    const updateReading = <K extends keyof UserSettings["reading"]>(
        key: K,
        value: UserSettings["reading"][K],
    ) => {
        setSettings((prev) => ({
            ...prev,
            reading: { ...prev.reading, [key]: value },
        }));
    };

    const updateNotifications = <K extends keyof UserSettings["notifications"]>(
        key: K,
        value: UserSettings["notifications"][K],
    ) => {
        setSettings((prev) => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: value },
        }));
    };

    const updatePrivacy = <K extends keyof UserSettings["privacy"]>(
        key: K,
        value: UserSettings["privacy"][K],
    ) => {
        setSettings((prev) => ({
            ...prev,
            privacy: { ...prev.privacy, [key]: value },
        }));
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setMessage(null);

        try {
            await logoutUser();
            router.replace("/login");
            router.refresh();
        } catch {
            setMessage("Failed to sign out.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            await updateUserSettings({
                theme: settings.appearance.theme,
                density: settings.appearance.density,
                reading_mode: settings.appearance.readingMode,
                font_size: settings.reading.fontSize,
                line_height: settings.reading.lineHeight,
                auto_bookmark: settings.reading.autoBookmark,
                show_progress_bar: settings.reading.showProgressBar,
                email_updates: settings.notifications.emailUpdates,
                reading_reminders: settings.notifications.readingReminders,
                product_announcements: settings.notifications.productAnnouncements,
                profile_visibility: settings.privacy.profileVisibility,
                share_reading_activity: settings.privacy.shareReadingActivity,
            });

            setMessage("Settings saved.");
            router.refresh();
        } catch {
            setMessage("Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePersonalization = async () => {
        setIsSavingPersonalization(true);
        setMessage(null);

        try {
            const updated = await updateOnboardingPreferences({
                preferred_genres: personalization.preferredGenres,
                reading_goals: personalization.readingGoals,
                content_styles: personalization.contentStyles,
                preferred_lengths: personalization.preferredLengths,
                weekly_target: personalization.weeklyTarget || null,
                onboarding_completed: true,
            });

            setPersonalization({
                preferredGenres: updated.preferred_genres,
                readingGoals: updated.reading_goals,
                contentStyles: updated.content_styles,
                preferredLengths: updated.preferred_lengths,
                weeklyTarget: updated.weekly_target ?? "",
            });

            setMessage("Personalization saved.");
            router.refresh();
        } catch {
            setMessage("Failed to save personalization.");
        } finally {
            setIsSavingPersonalization(false);
        }
    };

    return (
        <div className="w-full max-w-none space-y-5 px-3 pb-28 sm:space-y-7 sm:px-6 sm:pb-20 lg:px-10 lg:pb-12">
            <section className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-2xl sm:rounded-[2rem]">
                <div className="p-4 sm:p-6 lg:p-8">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-100/70 sm:text-xs">
                        Settings
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                        Control your experience
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
                        Tune your profile, reading comfort, recommendations, notifications,
                        and privacy.
                    </p>

                    {message ? (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
                            {message}
                        </div>
                    ) : null}

                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <SettingsMetric label="Theme" value={settings.appearance.theme} />
                        <SettingsMetric label="Mode" value={settings.appearance.readingMode} />
                        <SettingsMetric label="Profile" value={settings.privacy.profileVisibility} />
                        <SettingsMetric
                            label="Target"
                            value={personalization.weeklyTarget || "Not set"}
                        />
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                    <CompactSection
                        eyebrow="Account"
                        title="Profile details"
                        description="Your account identity and login details."
                    >
                        <div className="grid gap-3 sm:grid-cols-2">
                            <InputRow
                                label="Full name"
                                description="Shown across your profile and social features."
                                value={settings.account.fullName}
                                onChange={(value) => updateAccount("fullName", value)}
                            />

                            <InputRow
                                label="Email"
                                description="Used for login and account communication."
                                type="email"
                                value={settings.account.email}
                                onChange={(value) => updateAccount("email", value)}
                            />
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-white">Current plan</p>
                                    <p className="mt-1 text-xs text-white/45">
                                        Your active subscription tier.
                                    </p>
                                </div>

                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                                    {settings.account.plan}
                                </span>
                            </div>
                        </div>
                    </CompactSection>

                    <CompactSection
                        eyebrow="Reader"
                        title="Reading comfort"
                        description="Adjust the default reader experience."
                    >
                        <div className="grid gap-3 sm:grid-cols-2">
                            <SelectRow<"paged" | "scroll">
                                label="Reading mode"
                                description="Default reader navigation style."
                                value={settings.appearance.readingMode}
                                options={["paged", "scroll"]}
                                onChange={(value) => updateAppearance("readingMode", value)}
                            />

                            <SelectRow<FontSizeOption>
                                label="Font size"
                                description="Default reader text size."
                                value={settings.reading.fontSize}
                                options={["small", "medium", "large"]}
                                onChange={(value) => updateReading("fontSize", value)}
                            />

                            <SelectRow<LineHeightOption>
                                label="Line height"
                                description="Adjust spacing for reading comfort."
                                value={settings.reading.lineHeight}
                                options={["compact", "comfortable", "relaxed"]}
                                onChange={(value) => updateReading("lineHeight", value)}
                            />

                            <SelectRow<DensityOption>
                                label="Density"
                                description="Control spacing throughout the interface."
                                value={settings.appearance.density}
                                options={["comfortable", "compact"]}
                                onChange={(value) => updateAppearance("density", value)}
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <ToggleRow
                                label="Auto-bookmark"
                                description="Automatically save your last reading position."
                                checked={settings.reading.autoBookmark}
                                onChange={(value) => updateReading("autoBookmark", value)}
                            />

                            <ToggleRow
                                label="Progress bar"
                                description="Show reading progress inside the reader."
                                checked={settings.reading.showProgressBar}
                                onChange={(value) => updateReading("showProgressBar", value)}
                            />
                        </div>
                    </CompactSection>

                    <CompactSection
                        eyebrow="Personalization"
                        title="Content preferences"
                        description="Shape recommendations, discover shelves, and featured books."
                    >
                        <PreferenceChips
                            label="Preferred genres"
                            options={[
                                "Productivity",
                                "Business",
                                "Mindset",
                                "Fiction",
                                "Design",
                                "Tech",
                                "Finance",
                                "Faith",
                            ]}
                            selected={personalization.preferredGenres}
                            onChange={(items) =>
                                setPersonalization((prev) => ({
                                    ...prev,
                                    preferredGenres: items,
                                }))
                            }
                        />

                        <PreferenceChips
                            label="Reading goals"
                            options={[
                                "Learn skills",
                                "Career growth",
                                "Build habits",
                                "Study",
                                "Relax",
                            ]}
                            selected={personalization.readingGoals}
                            onChange={(items) =>
                                setPersonalization((prev) => ({
                                    ...prev,
                                    readingGoals: items,
                                }))
                            }
                        />

                        <details className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <summary className="cursor-pointer text-sm font-medium text-white">
                                More recommendation preferences
                            </summary>

                            <div className="mt-4 space-y-4">
                                <PreferenceChips
                                    label="Content style"
                                    options={[
                                        "Practical",
                                        "Story-driven",
                                        "Academic",
                                        "Inspirational",
                                    ]}
                                    selected={personalization.contentStyles}
                                    onChange={(items) =>
                                        setPersonalization((prev) => ({
                                            ...prev,
                                            contentStyles: items,
                                        }))
                                    }
                                />

                                <PreferenceChips
                                    label="Preferred length"
                                    options={["Short reads", "Medium books", "Deep books"]}
                                    selected={personalization.preferredLengths}
                                    onChange={(items) =>
                                        setPersonalization((prev) => ({
                                            ...prev,
                                            preferredLengths: items,
                                        }))
                                    }
                                />
                            </div>
                        </details>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm font-medium text-white">Weekly target</p>
                            <p className="mt-1 text-xs text-white/45">
                                Pick the rhythm you want the app to encourage.
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {["15 mins/day", "30 mins/day", "1 book/week", "Weekends only"].map(
                                    (target) => {
                                        const active = personalization.weeklyTarget === target;

                                        return (
                                            <button
                                                key={target}
                                                type="button"
                                                onClick={() =>
                                                    setPersonalization((prev) => ({
                                                        ...prev,
                                                        weeklyTarget: target,
                                                    }))
                                                }
                                                className={[
                                                    "rounded-full border px-3 py-2 text-xs transition sm:text-sm",
                                                    active
                                                        ? "border-white bg-white text-black"
                                                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                                                ].join(" ")}
                                            >
                                                {target}
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSavePersonalization}
                            disabled={isSavingPersonalization}
                            className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-70 sm:w-fit"
                        >
                            {isSavingPersonalization ? "Saving..." : "Save personalization"}
                        </button>
                    </CompactSection>
                </div>

                <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
                    <CompactSection
                        eyebrow="Appearance"
                        title="Interface"
                        description="Small display and theme preferences."
                    >
                        <SelectRow<ThemeOption>
                            label="Theme"
                            description="Choose how The Librarian should appear."
                            value={settings.appearance.theme}
                            options={["system", "light", "dark"]}
                            onChange={(value) => updateAppearance("theme", value)}
                        />
                    </CompactSection>

                    <CompactSection
                        eyebrow="Notifications"
                        title="Updates"
                        description="Choose the updates you receive."
                    >
                        <ToggleRow
                            label="Email updates"
                            description="Important account and platform updates."
                            checked={settings.notifications.emailUpdates}
                            onChange={(value) => updateNotifications("emailUpdates", value)}
                        />

                        <ToggleRow
                            label="Reading reminders"
                            description="Reminders to continue books in progress."
                            checked={settings.notifications.readingReminders}
                            onChange={(value) => updateNotifications("readingReminders", value)}
                        />

                        <ToggleRow
                            label="Product announcements"
                            description="Feature launches and product news."
                            checked={settings.notifications.productAnnouncements}
                            onChange={(value) =>
                                updateNotifications("productAnnouncements", value)
                            }
                        />
                    </CompactSection>

                    <CompactSection
                        eyebrow="Privacy"
                        title="Visibility"
                        description="Control profile and activity sharing."
                    >
                        <SelectRow<VisibilityOption>
                            label="Profile visibility"
                            description="Who can see your profile."
                            value={settings.privacy.profileVisibility}
                            options={["private", "friends", "public"]}
                            onChange={(value) => updatePrivacy("profileVisibility", value)}
                        />

                        <ToggleRow
                            label="Share reading activity"
                            description="Allow others to see recent reading activity."
                            checked={settings.privacy.shareReadingActivity}
                            onChange={(value) => updatePrivacy("shareReadingActivity", value)}
                        />
                    </CompactSection>

                    <section className="rounded-[1.5rem] border border-red-500/20 bg-red-500/5 p-4 shadow-xl sm:rounded-[2rem] sm:p-5">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-red-200/60 sm:text-xs">
                            Account actions
                        </p>

                        <h2 className="mt-2 text-lg font-semibold text-white">
                            Session & safety
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-white/55">
                            Save your changes, sign out, or manage high-impact account actions.
                        </p>

                        <div className="mt-5 grid gap-3">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-70"
                            >
                                {isSaving ? "Saving..." : "Save changes"}
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/85 transition hover:bg-white/10 disabled:opacity-70"
                            >
                                {isLoggingOut ? "Signing out..." : "Sign out"}
                            </button>

                            <button
                                type="button"
                                className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm text-red-100 transition hover:bg-red-500/20"
                            >
                                Delete account
                            </button>
                        </div>
                    </section>
                </aside>
            </section>
        </div>
    );
}

function SettingsMetric({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                {label}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-white">
                {value}
            </p>
        </div>
    );
}

function CompactSection({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow: string;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:rounded-[2rem] sm:p-5">
            <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                    {eyebrow}
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                    {title}
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/55">
                    {description}
                </p>
            </div>

            <div className="space-y-4">{children}</div>
        </section>
    );
}