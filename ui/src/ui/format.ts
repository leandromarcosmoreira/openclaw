import { stripReasoningTagsFromText } from "../../../src/shared/text/reasoning-tags.js";
import { t } from "../i18n/index.ts";

// Re-export backend utilities if needed directly, but prefer these wrappers
export { formatDurationHuman as formatDurationHumanInfra } from "../../../src/infra/format-time/format-duration.ts";
export { formatRelativeTimestamp as formatRelativeTimestampInfra } from "../../../src/infra/format-time/format-relative.ts";

export function formatMs(ms?: number | null): string {
  if (!ms && ms !== 0) {
    return t("common.na");
  }
  return new Date(ms).toLocaleString();
}

export function formatList(values?: Array<string | null | undefined>): string {
  if (!values || values.length === 0) {
    return t("common.none");
  }
  return values.filter((v): v is string => Boolean(v && v.trim())).join(", ");
}

export function clampText(value: string, max = 120): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, Math.max(0, max - 1))}…`;
}

export function truncateText(
  value: string,
  max: number,
): {
  text: string;
  truncated: boolean;
  total: number;
} {
  if (value.length <= max) {
    return { text: value, truncated: false, total: value.length };
  }
  return {
    text: value.slice(0, Math.max(0, max)),
    truncated: true,
    total: value.length,
  };
}

export function toNumber(value: string, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function parseList(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

export function stripThinkingTags(value: string): string {
  return stripReasoningTagsFromText(value, { mode: "preserve", trim: "start" });
}

/**
 * Format a duration as a human-readable string using i18n options.
 * Wraps the logic from infra/format-time but uses `t()` for units.
 */
export function formatDurationHuman(ms?: number | null, fallback?: string): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) {
    return fallback ?? t("common.na");
  }
  if (ms < 1000) {
    return t("time.duration.ms", { val: String(Math.round(ms)) });
  }
  const sec = Math.round(ms / 1000);
  if (sec < 60) {
    return t("time.duration.s", { val: String(sec) });
  }
  const min = Math.round(sec / 60);
  if (min < 60) {
    return t("time.duration.m", { val: String(min) });
  }
  const hr = Math.round(min / 60);
  if (hr < 24) {
    return t("time.duration.h", { val: String(hr) });
  }
  const day = Math.round(hr / 24);
  return t("time.duration.d", { val: String(day) });
}

/**
 * Format a relative timestamp using i18n options.
 * Handles both past ("5m ago") and future ("in 5m").
 */
export function formatRelativeTimestamp(
  timestampMs: number | null | undefined,
  options?: { dateFallback?: boolean; timezone?: string; fallback?: string },
): string {
  const fallback = options?.fallback ?? t("common.na");
  if (timestampMs == null || !Number.isFinite(timestampMs)) {
    return fallback;
  }

  const diff = Date.now() - timestampMs;
  const absDiff = Math.abs(diff);
  const isPast = diff >= 0;

  const sec = Math.round(absDiff / 1000);
  if (sec < 60) {
    return isPast ? t("time.justNow") : t("time.in.lessThanOneMinute");
  }

  const min = Math.round(sec / 60);
  if (min < 60) {
    return isPast ? t("time.ago.m", { val: String(min) }) : t("time.in.m", { val: String(min) });
  }

  const hr = Math.round(min / 60);
  if (hr < 48) {
    return isPast ? t("time.ago.h", { val: String(hr) }) : t("time.in.h", { val: String(hr) });
  }

  const day = Math.round(hr / 24);
  if (!options?.dateFallback || day <= 7) {
    return isPast ? t("time.ago.d", { val: String(day) }) : t("time.in.d", { val: String(day) });
  }

  // Fall back to short date display for old timestamps
  try {
    return new Intl.DateTimeFormat(t("languages.current") as string | undefined, {
      month: "short",
      day: "numeric",
      ...(options.timezone ? { timeZone: options.timezone } : {}),
    }).format(new Date(timestampMs));
  } catch {
    return isPast ? t("time.ago.d", { val: String(day) }) : t("time.in.d", { val: String(day) });
  }
}
