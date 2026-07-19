import { cn } from "@/lib/utils";

/**
 * Single source of truth for the Spottail logo.
 *
 * variant:
 *   "full"  — icon tile + "Spottail" wordmark (sidebar expanded, headers)
 *   "icon"  — the squircle tile only (collapsed sidebar, app icon, avatar)
 *   "glyph" — the spark alone in one color (watermarks, mono, tiny UI)
 *
 * The wordmark inherits the current text color, so on dark surfaces wrap it in a
 * text-white parent (or pass className="text-white"); on light surfaces it uses
 * the default foreground.
 */

const TEAL = "#0D9B8A";

const SPARK =
  "M24 11 Q26.4 21.6 37 24 Q26.4 26.4 24 37 Q21.6 26.4 11 24 Q21.6 21.6 24 11 Z";
const SPARK_GLYPH =
  "M24 9 Q26.8 21.2 39 24 Q26.8 26.8 24 39 Q21.2 26.8 9 24 Q21.2 21.2 24 9 Z";

const IconTile = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
    <rect x="2" y="2" width="44" height="44" rx="13" fill={TEAL} />
    <rect x="5.5" y="5.5" width="37" height="37" rx="10" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.2" />
    <path d={SPARK} fill="#ffffff" />
  </svg>
);

const Glyph = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
    <path d={SPARK_GLYPH} fill="currentColor" />
  </svg>
);

interface LogoProps {
  variant?: "full" | "icon" | "glyph";
  /** Height of the mark in px. For "full", the wordmark scales to match. */
  size?: number;
  className?: string;
  title?: string;
}

export const Logo = ({ variant = "full", size = 28, className, title = "Spottail" }: LogoProps) => {
  if (variant === "glyph") {
    return (
      <span className={cn("inline-flex", className)} role="img" aria-label={title}>
        <Glyph size={size} />
      </span>
    );
  }
  if (variant === "icon") {
    return (
      <span className={cn("inline-flex", className)} role="img" aria-label={title}>
        <IconTile size={size} />
      </span>
    );
  }
  return (
    <span
      className={cn("inline-flex items-center", className)}
      role="img"
      aria-label={title}
      style={{ gap: Math.round(size * 0.28) }}
    >
      <IconTile size={size} />
      <span style={{ fontWeight: 500, letterSpacing: "-0.02em", fontSize: Math.round(size * 0.56), lineHeight: 1 }}>
        Spottail
      </span>
    </span>
  );
};

export default Logo;
