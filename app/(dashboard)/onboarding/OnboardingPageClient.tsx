"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ApiError,
  updateOnboardingPreferences,
  type OnboardingPreferences,
} from "@/lib/api";

import { Heart, Puzzle } from "lucide-react";

const genres = [
  "Productivity",
  "Business",
  "Mindset",
  "Fiction",
  "Science",
  "Design",
  "Tech",
  "Finance",
  "Faith",
];

const goals = [
  "Learn skills",
  "Career growth",
  "Build habits",
  "Study",
  "Relax",
];

const styles = [
  "Practical",
  "Story-driven",
  "Academic",
  "Inspirational",
];

const lengths = ["Short reads", "Medium books", "Deep books"];

const targets = ["15 mins/day", "30 mins/day", "1 book/week", "Weekends only"];

interface Props {
  initialPreferences: OnboardingPreferences;
}

export default function OnboardingPageClient({ initialPreferences }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [preferredGenres, setPreferredGenres] = useState(
    initialPreferences.preferred_genres,
  );
  const [readingGoals, setReadingGoals] = useState(
    initialPreferences.reading_goals,
  );
  const [contentStyles, setContentStyles] = useState(
    initialPreferences.content_styles,
  );
  const [preferredLengths, setPreferredLengths] = useState(
    initialPreferences.preferred_lengths,
  );
  const [weeklyTarget, setWeeklyTarget] = useState(
    initialPreferences.weekly_target ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function toggle(
    value: string,
    current: string[],
    setter: (items: string[]) => void,
  ) {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);

    try {
      await updateOnboardingPreferences({
        preferred_genres: preferredGenres,
        reading_goals: readingGoals,
        content_styles: contentStyles,
        preferred_lengths: preferredLengths,
        weekly_target: weeklyTarget || null,
        onboarding_completed: true,
      });

      router.replace(next);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.detail ?? "Failed to save preferences.");
      } else {
        setMessage("Failed to save preferences.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSkip() {
    setIsSaving(true);
    setMessage(null);

    try {
      await updateOnboardingPreferences({
        preferred_genres: preferredGenres,
        reading_goals: readingGoals,
        content_styles: contentStyles,
        preferred_lengths: preferredLengths,
        weekly_target: weeklyTarget || null,
        onboarding_completed: true,
      });

      router.replace(next);
      router.refresh();
    } catch {
      setMessage("Failed to complete onboarding.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-6 text-white sm:py-10">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          Personalize your library
        </p>

        <div className="mt-3 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Build a reading experience around what matters to you
            <span className="inline-flex items-baseline">
              <Puzzle
                className="self-center w-8 h-8 ml-2 sm:w-10 sm:h-10 text-emerald-600 fill-emerald-200/50"
                strokeWidth={2.5}
              />.
            </span>
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base">
            These preferences help rank featured books, recommendations,
            discover shelves, and future reading suggestions.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <PreferenceGroup
            title="Preferred genres"
            items={genres}
            selected={preferredGenres}
            onToggle={(item) =>
              toggle(item, preferredGenres, setPreferredGenres)
            }
          />

          <PreferenceGroup
            title="Reading goals"
            items={goals}
            selected={readingGoals}
            onToggle={(item) => toggle(item, readingGoals, setReadingGoals)}
          />

          <PreferenceGroup
            title="Content style"
            items={styles}
            selected={contentStyles}
            onToggle={(item) => toggle(item, contentStyles, setContentStyles)}
          />

          <PreferenceGroup
            title="Preferred length"
            items={lengths}
            selected={preferredLengths}
            onToggle={(item) =>
              toggle(item, preferredLengths, setPreferredLengths)
            }
          />

          <section className="rounded-3xl border border-white/10 bg-black/20 p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold">Weekly reading target</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {targets.map((target) => (
                <button
                  key={target}
                  type="button"
                  onClick={() => setWeeklyTarget(target)}
                  className={[
                    "rounded-full border px-4 py-2 text-sm transition",
                    weeklyTarget === target
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                  ].join(" ")}
                >
                  {target}
                </button>
              ))}
            </div>
          </section>
        </div>

        {message ? <p className="mt-5 text-sm text-white/65">{message}</p> : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save preferences"}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            disabled={isSaving}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/75 transition hover:bg-white/10"
          >
            Skip for now
          </button>
        </div>
      </section>
    </main>
  );
}

function PreferenceGroup({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={[
                "rounded-full border px-4 py-2 text-sm transition",
                active
                  ? "border-white bg-white text-black"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
              ].join(" ")}
            >
              {item}
            </button>
          );
        })}
      </div>
    </section>
  );
}