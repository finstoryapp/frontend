export function getPremiumEndsDate(unixTimestamp: number | null): string {
  if (!unixTimestamp) {
    return "";
  }

  const date = new Date(unixTimestamp);

  const formatterDate = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatterTime = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return `${formatterDate.format(date)}, ${formatterTime.format(date)}`;
}
