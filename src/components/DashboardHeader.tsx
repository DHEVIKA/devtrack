"use client";

import NotificationBell from "@/components/NotificationBell";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AccountToggle from "@/components/AccountToggle";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import UserAvatar from "@/components/UserAvatar";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";

export default function DashboardHeader() {
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  // Prevent hydration mismatch in Playwright/SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!session) return;

    async function loadSettings() {
      try {
        const res = await fetch("/api/user/settings");

        if (res.ok) {
          const data = await res.json();
          setIsPublic(data.is_public === true);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }

    loadSettings();
  }, [session]);

  return (
    <header className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/95 p-5 shadow-[var(--shadow-soft)] backdrop-blur-md transition-all duration-300 hover:shadow-[var(--shadow-medium)] md:p-6">

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        {/* Left Section */}
        <div>
          <h2
  className="bg-gradient-to-r from-[var(--foreground)] via-[var(--foreground)] to-[var(--accent)] bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl"
>
  Dashboard Overview
</h2>

          <p
            className="mt-2 text-xs text-[var(--muted-foreground)]"
            style={{
              fontFamily:
                "var(--font-jetbrains, ui-monospace, monospace)",
              letterSpacing: "0.06em",
            }}
          >
            coding activity at a glance
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full flex-wrap items-center justify-center gap-3 md:w-auto md:justify-end">

          {mounted && isPublic && session?.githubLogin && (
            <a
              href={`/u/${session.githubLogin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button rounded-xl px-4 py-2 text-sm font-semibold w-full sm:w-auto text-center"
              style={{
                fontFamily:
                  "var(--font-jetbrains, ui-monospace, monospace)",
                fontSize: 12,
              }}
              title="View your public profile"
            >
              Share Profile
            </a>
          )}

          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card-muted)] px-2 py-1.5 sm:justify-start sm:px-3 sm:py-2">

            <KeyboardShortcuts />

            <div className="transition-transform duration-200 hover:scale-110">
              <NotificationBell />
            </div>

            <div className="transition-transform duration-200 hover:scale-110">
              <UserAvatar />
            </div>

            <div className="transition-transform duration-200 hover:rotate-12">
              <ThemeToggle />
            </div>

            <div className="transition-transform duration-200 hover:scale-110">
              <SignOutButton />
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Toggle */}
      <div className="mt-5">
        <AccountToggle />
      </div>
    </header>
  );
}