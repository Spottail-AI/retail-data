import { useState } from "react";
import { ShoppingBag, ShoppingCart, Check } from "lucide-react";
import type { UserRole } from "@/hooks/use-user-role";

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
  loading?: boolean;
}

const buyerBullets = [
const buyerBullets = [
  "Browse Spottail Source — the marketplace for retail-ready products",
  "Discover trending products on TikTok, Reddit & more before they peak",
  "Filter by category, trend signal, verified brands, and MOQ",
  "Shortlist products and request samples in one click",
  "Get alerts when shortlisted products start trending",
];

const supplierBullets = [
  "Track competitors and retail product prices over time",
  "List your retail products on Spottail Source — where retail buyers can find them",
  "Find distributors and suppliers for your products in one click",
  "Discover trending products on TikTok, Reddit & more before they peak",
];

// v2 design tokens
const ink = "#1A1A18";
const white = "#FEFEFE";
const surface = "#F7F7F4";
const teal = "#0D9B8A";
const tealLight = "#E6F5F3";
const border = "rgba(26,26,24,0.12)";
const muted = "rgba(26,26,24,0.6)";

export const RoleSelection = ({ onSelect, loading }: RoleSelectionProps) => {
  const [selected, setSelected] = useState<UserRole | null>(null);

  const cardStyle = (isSelected: boolean): React.CSSProperties => ({
    position: "relative",
    background: isSelected ? tealLight : white,
    border: `1.5px solid ${isSelected ? teal : border}`,
    borderRadius: 14,
    padding: 18,
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "Manrope, system-ui, sans-serif",
    boxShadow: isSelected ? `0 0 0 3px rgba(13,155,138,0.12)` : "none",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ textAlign: "center" }}>
        <h2
          className="font-display"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: 28,
            fontWeight: 600,
            color: ink,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            margin: 0,
            marginBottom: 8,
          }}
        >
          How will you use Spottail?
        </h2>
        <p
          style={{
            fontFamily: "Manrope, system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: ink,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Select one option below to continue
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        {/* Supplier / Retail Product Owner Card */}
        <button
          type="button"
          onClick={() => setSelected("supplier")}
          style={cardStyle(selected === "supplier")}
        >
          {selected === "supplier" && (
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 22,
                height: 22,
                borderRadius: 999,
                background: teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check style={{ width: 13, height: 13, color: white }} strokeWidth={3} />
            </div>
          )}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: selected === "supplier" ? white : surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <ShoppingBag style={{ width: 18, height: 18, color: teal }} />
          </div>
          <h3
            style={{
              fontFamily: "Manrope, system-ui, sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: ink,
              margin: 0,
              marginBottom: 4,
              letterSpacing: "-0.01em",
            }}
          >
            Retail Product Owner
          </h3>
          <p
            style={{
              fontFamily: "Manrope, system-ui, sans-serif",
              fontSize: 13,
              color: muted,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            List your products and get discovered by retail buyers globally
          </p>
        </button>

        {/* Buyer Card */}
        <button
          type="button"
          onClick={() => setSelected("buyer")}
          style={cardStyle(selected === "buyer")}
        >
          {selected === "buyer" && (
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 22,
                height: 22,
                borderRadius: 999,
                background: teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check style={{ width: 13, height: 13, color: white }} strokeWidth={3} />
            </div>
          )}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: selected === "buyer" ? white : surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <ShoppingCart style={{ width: 18, height: 18, color: teal }} />
          </div>
          <h3
            style={{
              fontFamily: "Manrope, system-ui, sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: ink,
              margin: 0,
              marginBottom: 4,
              letterSpacing: "-0.01em",
            }}
          >
            Retail Buyer / Distributor
          </h3>
          <p
            style={{
              fontFamily: "Manrope, system-ui, sans-serif",
              fontSize: 13,
              color: muted,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Find products about to trend and source from verified suppliers
          </p>
        </button>
      </div>

      {/* Expanded bullets for buyer */}
      {selected === "buyer" && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {buyerBullets.map((b) => (
            <li
              key={b}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                fontFamily: "Manrope, system-ui, sans-serif",
                fontSize: 13,
                color: muted,
                lineHeight: 1.5,
              }}
            >
              <Check style={{ width: 14, height: 14, color: teal, marginTop: 3, flexShrink: 0 }} strokeWidth={3} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {!selected && (
        <p
          style={{
            fontFamily: "Manrope, system-ui, sans-serif",
            fontSize: 12,
            color: muted,
            textAlign: "center",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          Pick one of the options above to enable the button
        </p>
      )}

      <button
        type="button"
        disabled={!selected || loading}
        onClick={() => selected && onSelect(selected)}
        style={{
          width: "100%",
          height: 46,
          borderRadius: 10,
          border: "none",
          fontFamily: "Manrope, system-ui, sans-serif",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          cursor: !selected || loading ? "not-allowed" : "pointer",
          background: selected ? teal : surface,
          color: selected ? white : muted,
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => {
          if (selected && !loading) e.currentTarget.style.background = "#0B8576";
        }}
        onMouseLeave={(e) => {
          if (selected) e.currentTarget.style.background = teal;
        }}
      >
        {loading ? "Setting up..." : "Continue →"}
      </button>
    </div>
  );
};
