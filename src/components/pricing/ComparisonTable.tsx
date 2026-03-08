import { Check, X } from "lucide-react";

const rows = [
  { feature: "Competitor Tracking", free: "2", pro: "10", enterprise: "Unlimited" },
  { feature: "Price Monitoring", free: "Daily", pro: "Real-time", enterprise: "Real-time" },
  { feature: "Pricing Recommendations", free: false, pro: true, enterprise: true },
  { feature: "API Access", free: false, pro: true, enterprise: true },
  { feature: "Slack Integration", free: false, pro: true, enterprise: true },
  { feature: "Email Support", free: false, pro: true, enterprise: true },
  { feature: "Priority Support", free: false, pro: false, enterprise: true },
  { feature: "SLA Guarantee", free: false, pro: false, enterprise: true },
  { feature: "Custom Integrations", free: false, pro: false, enterprise: true },
];

const Cell = ({ value }: { value: string | boolean }) => {
  if (typeof value === "string") {
    return <span className="text-foreground font-medium text-sm">{value}</span>;
  }
  return value ? (
    <Check className="w-5 h-5 text-success mx-auto" />
  ) : (
    <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
  );
};

export const ComparisonTable = () => (
  <div className="mt-16 md:mt-24">
    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
      Compare All Plans
    </h2>
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary">
            <th className="text-left px-4 py-3 font-semibold text-foreground">Feature</th>
            <th className="text-center px-4 py-3 font-semibold text-foreground">Free</th>
            <th className="text-center px-4 py-3 font-semibold text-primary">Pro</th>
            <th className="text-center px-4 py-3 font-semibold text-foreground">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.feature}
              className={i % 2 === 0 ? "bg-card" : "bg-secondary/50"}
            >
              <td className="px-4 py-3 font-medium text-foreground">{row.feature}</td>
              <td className="px-4 py-3 text-center"><Cell value={row.free} /></td>
              <td className="px-4 py-3 text-center"><Cell value={row.pro} /></td>
              <td className="px-4 py-3 text-center"><Cell value={row.enterprise} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
