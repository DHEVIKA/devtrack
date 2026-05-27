import DiscussionsWidget from "@/components/DiscussionsWidget";
import CommunityMetrics from "@/components/CommunityMetrics";
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
import LocalCodingTime from "@/components/LocalCodingTime";
import CodingTimeCard from "@/components/CodingTimeCard";
import RecentActivity from "@/components/RecentActivity";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import DashboardSSEProvider from "@/components/DashboardSSEProvider";
import DashboardClient from "@/components/DashboardClient";

import type { ComponentType } from "react";

// =====================
// Dynamic imports
// =====================
const ContributionGraph = dynamic(
  () => import("@/components/ContributionGraph"),
  { ssr: false }
);

const ContributionHeatmap = dynamic(
  () => import("@/components/ContributionHeatmap"),
  { ssr: false }
);

const FriendComparison = dynamic(
  () => import("@/components/FriendComparison"),
  { ssr: false }
);

const ActivityRingChart = dynamic(
  () => import("@/components/ActivityRingChart"),
  { ssr: false }
);

const CodingActivityInsightsCard = dynamic(
  () => import("@/components/CodingActivityInsightsCard"),
  { ssr: false }
);

const PRReviewTrendChart = dynamic(
  () => import("@/components/PRReviewTrendChart"),
  { ssr: false }
);

const PRMetrics = dynamic(
  () => import("@/components/PRMetrics"),
  { ssr: false }
);

const PRBreakdownChart = dynamic(
  () => import("@/components/PRBreakdownChart"),
  { ssr: false }
);

const CommitTimeChart = dynamic(
  () => import("@/components/CommitTimeChart"),
  { ssr: false }
);

// =====================
// Page
// =====================
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/");
  if (session.error === "TokenRevoked") redirect("/");

  const widgets = [
    { id: "prMetrics", component: PRMetrics },
    { id: "communityMetrics", component: CommunityMetrics },
    { id: "prBreakdown", component: PRBreakdownChart },
    { id: "commitTime", component: CommitTimeChart },
    { id: "streakTracker", component: StreakTracker },
    { id: "issueMetrics", component: IssueMetrics },
    { id: "ciAnalytics", component: CIAnalytics },
    { id: "languageBreakdown", component: LanguageBreakdown },
    { id: "topRepos", component: TopRepos },
  ];

  return (
    <DashboardSSEProvider>
      <div className="min-h-screen bg-[var(--background)] p-4 text-[var(--foreground)] md:p-8">

        <DashboardHeader />

        <div className="mb-6 flex justify-end gap-2 items-center">
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

        <div className="mb-6 mt-6">
          <Link href="/wrapped">
            <div className="rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 p-6 shadow-lg">
              <div className="flex justify-between items-center">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ContributionGraph />
            <div className="mt-6">
              <ContributionHeatmap />
            </div>
            <div className="mt-6">
              <FriendComparison />
            </div>
          </div>

          <div>
            <StreakTracker />
            <LocalCodingTime />
            <CodingTimeCard />
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

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
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