export function getUnixMonthStartEnd(
  year: number,
  month: number
): { start: number; end: number } {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12.");
  }

  const startOfMonth = new Date(year, month - 1, 1);
  const startUnix = Math.floor(startOfMonth.getTime());

  const endOfMonth = new Date(year, month, 0);
  const endUnix = Math.floor(endOfMonth.getTime()) + 86399 * 1000;

  return { start: startUnix, end: endUnix };
}
