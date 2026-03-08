import DashboardShell from "@/components/dashboard/DashboardShell";
import { CompetitorCardGrid } from "@/components/dashboard/CompetitorCardGrid";

const CompetitorAnalysis = () => (
  <DashboardShell
    title="Competitor Analysis"
    description="Track competitor pricing and positioning to identify margin opportunities."
  >
    <CompetitorCardGrid />
  </DashboardShell>
);

export default CompetitorAnalysis;
