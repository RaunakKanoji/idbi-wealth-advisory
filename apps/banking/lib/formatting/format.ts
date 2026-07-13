/** Presentation-edge formatting (F003: amounts are numbers until this point). */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatInr(amount: number): string {
  return inrFormatter.format(amount);
}

/** Compact INR for tight mobile cards, e.g. ₹63K, ₹22.9L, ₹3.0Cr. */
export function formatInrCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(1)}Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(1)}L`;
  if (abs >= 1_000) return `${sign}₹${Math.round(abs / 1_000)}K`;
  return inrFormatter.format(amount);
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
