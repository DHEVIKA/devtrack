import DiscussionsWidget from "@/components/DiscussionsWidget";
import GoalTracker from "@/components/GoalTracker";
import DashboardHeader from "@/components/DashboardHeader";
import StreakTracker from "@/components/StreakTracker";
import TopRepos from "@/components/TopRepos";
import PinnedRepos from "@/components/PinnedRepos";
import InactiveRepositoriesCard from "@/components/InactiveRepositoriesCard";
import LanguageBreakdown from "@/components/LanguageBreakdown";
import CIAnalytics from "@/components/CIAnalytics";
import IssueMetrics from "@/components/IssueMetrics";
import StreakAtRiskBanner from "@/components/StreakAtRiskBanner";
import RepoAnalyticsExplorer from "@/components/repo-analytics/RepoAnalyticsExplorer";
import dynamic from "next/dynamic";

import WeeklySummaryCard from "@/components/WeeklySummaryCard";
import { AIMentorWidget } from "@/components/AIMentorWidget";
import ExportButton from "@/components/ExportButton";
import Link from "next/link";
import PersonalRecords from "@/components/PersonalRecords";

import CodingTimeWidget from "@/components/CodingTimeWidget";
import RecentActivity from "@/components/RecentActivity";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import DashboardSSEProvider from "@/components/DashboardSSEProvider";
import DashboardClient from "@/components/DashboardClient";

// Dynamic imports
const ContributionGraph = dynamic(() => import("@/components/ContributionGraph"), { ssr: false });
const ContributionHeatmap = dynamic(() => import("@/components/ContributionHeatmap"), { ssr: false });
const FriendComparison = dynamic(() => import("@/components/FriendComparison"), { ssr: false });
const ActivityRingChart = dynamic(() => import("@/components/ActivityRingChart"), { ssr: false });
const CodingActivityInsightsCard = dynamic(() => import("@/components/CodingActivityInsightsCard"), { ssr: false });
const PRReviewTrendChart = dynamic(() => import("@/components/PRReviewTrendChart"), { ssr: false });

// Types
type WidgetItem = {
  id: string;
};

export default async function DashboardPage() {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch {
    session = null;
  }

  const isE2E =
    process.env.NODE_ENV === "test" ||
    process.env.PLAYWRIGHT === "true";

  if (!session && !isE2E) {
    redirect("/");
  }

  if ((session as any)?.error === "TokenRevoked") {
    redirect("/");
  }

  const widgets: WidgetItem[] = [
    { id: "prMetrics" },
    { id: "communityMetrics" },
    { id: "prBreakdown" },
    { id: "commitTime" },
    { id: "streakTracker" },
    { id: "issueMetrics" },
    { id: "ciAnalytics" },
    { id: "languageBreakdown" },
    { id: "topRepos" },
  ];

  return (
    <DashboardSSEProvider>
      <div className="min-h-screen bg-[var(--background)] p-4 text-[var(--foreground)] md:p-8">

        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>

        <DashboardHeader />

        {/* ACTION BAR (ONLY ONCE) */}
        <div className="mb-6 flex items-center justify-end gap-2">
          <Link
            href="/wrapped"
            className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent)]"
          >
            Year in Code
          </Link>

          <Link
            href="/dashboard/settings"
            className="secondary-button flex min-w-[140px] items-center justify-center rounded-xl px-4 py-2 text-sm font-medium"
          >
            Settings
          </Link>

          <ExportButton />
        </div>

        <StreakAtRiskBanner />

        {/* WRAPPED BANNER (ONLY ONCE) */}
        <div className="mt-6">
          <Link href="/wrapped">
            <div className="overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Your Year in Code is here! ✨
                  </h2>
                  <p className="mt-1 text-white/90">
                    Discover your coding insights and habits.
                  </p>
                </div>

                <div className="rounded-full bg-white px-6 py-2 font-bold text-purple-600">
                  View Wrapped
                </div>
              </div>
            </div>
          </Link>
        </div>

        <WeeklySummaryCard />
        <AIMentorWidget />
        <PersonalRecords />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContributionGraph />
            <div className="mt-6"><ContributionHeatmap /></div>
            <div className="mt-6"><FriendComparison /></div>
          </div>

          <div>
            <StreakTracker />
            <CodingTimeWidget />
          </div>
        </div>

        <div className="mt-6">
          <RepoAnalyticsExplorer />
        </div>

        <div className="mt-6">
          <DashboardClient widgets={widgets} />
        </div>

        <div className="mt-6">
          <ActivityRingChart />
        </div>

        <div className="mt-6">
          <CodingActivityInsightsCard />
        </div>

        <div className="mt-6">
          <PRReviewTrendChart />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <IssueMetrics />
          <CIAnalytics />
        </div>

        <div className="mt-6">
          <DiscussionsWidget />
        </div>

        <div className="mt-6">
          <PinnedRepos />
        </div>

        <div className="mt-6">
          <InactiveRepositoriesCard />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <TopRepos />
          <LanguageBreakdown />
          <GoalTracker />
        </div>

        <div className="mt-6">
          <RecentActivity />
        </div>

      </div>
    </DashboardSSEProvider>
  );
}