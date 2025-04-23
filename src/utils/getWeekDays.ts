// utils/getWeekDays.ts

import { WeekDay } from "@/types/utilsTypes";

const russianWeekDays: string[] = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

/**
 * Helper function to get the day of the week in Russian (пн, вт, ср, ...)
 * @param {Date} date - The date object
 * @returns {string} - Russian weekday abbreviation
 */
function getRussianWeekDay(date: Date): string {
  const dayIndex = date.getDay(); // 0 (вс) до 6 (сб)
  return russianWeekDays[dayIndex === 0 ? 6 : dayIndex - 1]; // Если 0 (вс), используем индекс 6
}

/**
 * Function to get an array of 5 objects with date and unix time for the current day
 * and the previous 4 days.
 * @returns {WeekDay[]} - Array of objects with 'date' and 'unix' properties
 */
export function getWeekDays(): WeekDay[] {
  const currentDate: Date = new Date();
  const result: WeekDay[] = [];

  // Generate the current day object
  result.push({
    date: `${currentDate.getDate()} ${getRussianWeekDay(currentDate)}`,
    unix: Math.floor(currentDate.getTime()), // Convert to Unix timestamp (seconds)
  });

  // Generate the past 4 days
  for (let i = 1; i <= 4; i++) {
    const pastDate: Date = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - i); // Subtract i days

    result.push({
      date: `${pastDate.getDate()} ${getRussianWeekDay(pastDate)}`,
      unix: Math.floor(pastDate.getTime()), // Convert to Unix timestamp (seconds)
    });
  }

  return result;
}
