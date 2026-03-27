import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Heart, Bell, MessageSquare } from "lucide-react";
import { Footer } from "@/components/Footer";

const BuyerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/dashboard");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#4f8ef7] mx-auto mb-4" />
          <p className="text-[#94a3b8] text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const firstName = user.user_metadata?.first_name || "there";

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Top Bar */}
      <header className="h-16 border-b border-[#1e2d4a] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img
            src="/lovable-uploads/6da76baf-f15f-427e-aaa0-1bd3c859bf32.png"
            alt="Spottail"
            className="h-7"
          />
          <span className="text-[#475569] text-sm">/ Buyer Dashboard</span>
        </div>
        <p className="text-[#94a3b8] text-sm">
          Hey, <span className="text-white font-medium">{firstName}</span> 👋
        </p>
      </header>

      <main className="max-w-[1100px] mx-auto p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<Heart className="w-5 h-5 text-[#4f8ef7]" />}
            label="Shortlisted"
            value={0}
          />
          <StatCard
            icon={<Bell className="w-5 h-5 text-[#ff4f17]" />}
            label="Trending Alerts"
            value={0}
            highlight
          />
          <StatCard
            icon={<MessageSquare className="w-5 h-5 text-[#4f8ef7]" />}
            label="Enquiries Sent"
            value={0}
            sub="awaiting reply"
          />
        </div>

        {/* Placeholder sections */}
        <section className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-1">About to Trend</h2>
          <p className="text-[#94a3b8] text-sm mb-4">
            Products gaining momentum across TikTok, Reddit, Pinterest and more.
          </p>
          <div className="text-center py-12 text-[#475569] text-sm">
            Trend feed coming soon — we're building this next.
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#111827] border border-[#1e2d4a] rounded-xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-[#1e2d4a] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[#94a3b8] text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 ${highlight && value > 0 ? "text-[#ff4f17]" : "text-white"}`}>
          {value}
        </p>
        {sub && <p className="text-[#475569] text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default BuyerDashboard;
