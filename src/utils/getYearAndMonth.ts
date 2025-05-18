import { IYearAndMonth } from "@/types/utilsTypes";

// Returns current year and current month number (from 0 to 11)
export function getYearAndMonth(): IYearAndMonth {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  return { month, year };
}
