/**
 * Returns the start and end Unix timestamps (in milliseconds) for the given month.
 * @param year - The full year (e.g. 2024)
 * @param month - The month index (0 = January, 11 = December)
 * @returns An object with `start` and `end` timestamps in milliseconds.
 */
export function getUnixMonthStartEnd(
  year: number,
  month: number
): { start: number; end: number } {
  if (month < 0 || month > 11) {
    throw new Error("Month must be between 0 and 11.");
  }

  const startOfMonth = new Date(year, month, 1);
  const startUnix = startOfMonth.getTime();

  const endOfMonth = new Date(year, month + 1, 0);
  const SECONDS_IN_DAY_MINUS_ONE = 86399 * 1000;
  const endUnix = endOfMonth.getTime() + SECONDS_IN_DAY_MINUS_ONE;

  return { start: startUnix, end: endUnix };
}
