/** Shared Sri Lankan Rupee formatter — use everywhere for consistent display. */

export type FormatLkrOptions = {
  /** Abbreviate large values as K / M (e.g. LKR 1.2M) */
  compact?: boolean;
  /** Decimal places (default: 0 for whole numbers, 2 otherwise) */
  decimals?: number;
};

const parseAmount = (amount: number | string): number => {
  const num =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^0-9.-]/g, ""))
      : amount;
  return isNaN(num) ? 0 : num;
};

export function formatLkr(
  amount: number | string,
  opts?: FormatLkrOptions
): string {
  const num = parseAmount(amount);

  if (opts?.compact) {
    if (num >= 1_000_000) return `LKR ${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `LKR ${(num / 1_000).toFixed(1)}K`;
  }

  const decimals =
    opts?.decimals ?? (Number.isInteger(num) ? 0 : 2);

  return `LKR ${num.toLocaleString("en-LK", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-LK");
}
