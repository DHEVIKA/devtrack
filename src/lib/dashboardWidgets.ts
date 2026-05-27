import ContributionGraph from "@/components/ContributionGraph";
import ContributionHeatmap from "@/components/ContributionHeatmap";
import FriendComparison from "@/components/FriendComparison";
import StreakTracker from "@/components/StreakTracker";
import LocalCodingTime from "@/components/LocalCodingTime";
import CodingTimeCard from "@/components/CodingTimeCard";
import PRMetrics from "@/components/PRMetrics";
import CommunityMetrics from "@/components/CommunityMetrics";
import PRBreakdownChart from "@/components/PRBreakdownChart";
import CommitTimeChart from "@/components/CommitTimeChart";

export const defaultWidgets = [
  { id: "contributionGraph", component: ContributionGraph },
  { id: "contributionHeatmap", component: ContributionHeatmap },
  { id: "friendComparison", component: FriendComparison },
  { id: "streakTracker", component: StreakTracker },
  { id: "localCodingTime", component: LocalCodingTime },
  { id: "codingTimeCard", component: CodingTimeCard },
  { id: "prMetrics", component: PRMetrics },
  { id: "communityMetrics", component: CommunityMetrics },
  { id: "prBreakdownChart", component: PRBreakdownChart },
  { id: "commitTimeChart", component: CommitTimeChart },
];