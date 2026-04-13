/**
 * Shared dashboard constants & helpers.
 * Import from here — do NOT copy-paste these into individual pages.
 */

/** Base card style. Spread into inline style objects. */
export const cardStyle: React.CSSProperties = {
  background:    "var(--c-card)",
  border:        "1.5px solid var(--c-border)",
  borderRadius:  18,
  padding:       "22px 24px",
};

/** Base input style. Spread + override as needed. */
export const inputStyle: React.CSSProperties = {
  width:       "100%",
  padding:     "11px 14px",
  borderRadius: 11,
  fontSize:    13,
  fontWeight:  500,
  fontFamily:  "inherit",
  background:  "var(--c-bg2)",
  border:      "1.5px solid var(--c-border)",
  color:       "var(--c-text1)",
  outline:     "none",
  boxSizing:   "border-box",
};

/** Format currency as $1,234.56 (global / Stripe) */
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format a number with commas */
export function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}
