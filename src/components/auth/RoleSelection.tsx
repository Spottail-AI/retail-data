import { useState } from "react";
import { ShoppingBag, ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/hooks/use-user-role";

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
  loading?: boolean;
}

const buyerBullets = [
  "Browse Spottail Source — the marketplace for retail-ready products",
  "Discover trending products on TikTok, Reddit & more before they peak",
  "Filter by category, trend signal, verified brands, and MOQ",
  "Shortlist products and request samples in one click",
  "Get alerts when shortlisted products start trending",
];

export const RoleSelection = ({ onSelect, loading }: RoleSelectionProps) => {
  const [selected, setSelected] = useState<UserRole | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">How will you use Spottail?</h2>
        <p className="text-muted-foreground text-sm mt-1">Choose your role to get a personalised experience</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Supplier Card */}
        <button
          type="button"
          onClick={() => setSelected("supplier")}
          className={cn(
            "relative rounded-xl border p-5 text-left transition-all duration-200",
            "bg-[#111827] hover:border-[#4f8ef7]/60",
            selected === "supplier"
              ? "border-[#4f8ef7] ring-1 ring-[#4f8ef7]/30"
              : "border-[#1e2d4a]"
          )}
        >
          {selected === "supplier" && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#4f8ef7] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          <div className="w-10 h-10 rounded-lg bg-[#1e2d4a] flex items-center justify-center mb-3">
            <ShoppingBag className="w-5 h-5 text-[#4f8ef7]" />
          </div>
          <h3 className="font-bold text-white text-base">Supplier / Brand</h3>
          <p className="text-[#94a3b8] text-sm mt-1">
            List your products and get discovered by retail buyers globally
          </p>
        </button>

        {/* Buyer Card */}
        <button
          type="button"
          onClick={() => setSelected("buyer")}
          className={cn(
            "relative rounded-xl border p-5 text-left transition-all duration-200",
            "bg-[#111827] hover:border-[#4f8ef7]/60",
            selected === "buyer"
              ? "border-[#4f8ef7] ring-1 ring-[#4f8ef7]/30"
              : "border-[#1e2d4a]"
          )}
        >
          {selected === "buyer" && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#4f8ef7] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          <div className="w-10 h-10 rounded-lg bg-[#1e2d4a] flex items-center justify-center mb-3">
            <ShoppingCart className="w-5 h-5 text-[#4f8ef7]" />
          </div>
          <h3 className="font-bold text-white text-base">Retail Buyer / Distributor</h3>
          <p className="text-[#94a3b8] text-sm mt-1">
            Find products about to trend and source from verified suppliers
          </p>
        </button>
      </div>

      {/* Expanded bullets for buyer */}
      {selected === "buyer" && (
        <ul className="space-y-2 pl-1 animate-in fade-in slide-in-from-top-2 duration-300">
          {buyerBullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-[#94a3b8]">
              <Check className="w-4 h-4 text-[#4ADE80] mt-0.5 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        disabled={!selected || loading}
        onClick={() => selected && onSelect(selected)}
        className={cn(
          "w-full py-3 rounded-lg font-semibold text-sm transition-all",
          selected
            ? "bg-[#c5f135] text-[#0a0f1c] hover:bg-[#d4ff44]"
            : "bg-[#1e2d4a] text-[#475569] cursor-not-allowed"
        )}
      >
        {loading ? "Setting up..." : "Continue →"}
      </button>
    </div>
  );
};
