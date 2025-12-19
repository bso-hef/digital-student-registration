import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const GERMAN_FORMAT = "DD.MM.YYYY";
const ISO_FORMAT = "YYYY-MM-DD";

/**
 * Parse any date input to a Date object.
 * Handles: German format (DD.MM.YYYY), ISO format (YYYY-MM-DD), Date objects, Dayjs objects
 */
export function parseDate(value: unknown): Date | null {
  if (!value) return null;

  // Already a Date
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // Dayjs object
  if (dayjs.isDayjs(value)) {
    return value.isValid() ? value.toDate() : null;
  }

  // String parsing
  if (typeof value !== "string") return null;

  // Try German format first (DD.MM.YYYY) - must check before ISO to avoid misinterpretation
  const germanMatch = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (germanMatch) {
    const [, dd, mm, yyyy] = germanMatch;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return isNaN(d.getTime()) ? null : d;
  }

  // Try ISO format (YYYY-MM-DD and other standard formats)
  const isoDate = new Date(value);
  if (!isNaN(isoDate.getTime())) return isoDate;

  return null;
}

/**
 * Format a date to German display format (DD.MM.YYYY)
 */
export function formatGermanDate(
  date: Date | string | null | undefined,
): string {
  if (!date) return "";
  const parsed = parseDate(date);
  if (!parsed) return "";
  return dayjs(parsed).format(GERMAN_FORMAT);
}

/**
 * Format a date to ISO format for storage (YYYY-MM-DD)
 */
export function formatISODate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const parsed = parseDate(date);
  if (!parsed) return "";
  return dayjs(parsed).format(ISO_FORMAT);
}

/**
 * Validate if a string is a valid German date format
 */
export function isValidGermanDate(input: string): boolean {
  if (!input) return false;
  const parsed = dayjs(input, GERMAN_FORMAT, true);
  return parsed.isValid();
}
