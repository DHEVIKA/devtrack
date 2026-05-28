import ContributionGraph from "@/components/ContributionGraph";
import ContributionHeatmap from "@/components/ContributionHeatmap";
import FriendComparison from "@/components/FriendComparison";
import StreakTracker from "@/components/StreakTracker";
import CodingTimeWidget from "@/components/CodingTimeWidget";
import PRMetrics from "@/components/PRMetrics";
import CommunityMetrics from "@/components/CommunityMetrics";
import PRBreakdownChart from "@/components/PRBreakdownChart";
import CommitTimeChart from "@/components/CommitTimeChart";

export const defaultWidgets = [
  { id: "contributionGraph", component: ContributionGraph },
  { id: "contributionHeatmap", component: ContributionHeatmap },
  { id: "friendComparison", component: FriendComparison },
  { id: "streakTracker", component: StreakTracker },
  { id: "codingTimeWidget", component: CodingTimeWidget },
  { id: "prMetrics", component: PRMetrics },
  { id: "communityMetrics", component: CommunityMetrics },
  { id: "prBreakdownChart", component: PRBreakdownChart },
  { id: "commitTimeChart", component: CommitTimeChart },
];