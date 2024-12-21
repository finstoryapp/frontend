// utils/getWeekDays.ts

const russianWeekDays: string[] = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

/**
 * Helper function to get the day of the week in Russian (пн, вт, ср, ...)
 * @param {Date} date - The date object
 * @returns {string} - Russian weekday abbreviation
 */
function getRussianWeekDay(date: Date): string {
  return russianWeekDays[date.getDay() - 1]; // Adjust to match Russian week days
}

/**
 * Interface for the returned object containing date and unix time.
 */
interface WeekDay {
  date: string;
  unix: number;
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
    let pastDate: Date = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - i); // Subtract i days

    result.push({
      date: `${pastDate.getDate()} ${getRussianWeekDay(pastDate)}`,
      unix: Math.floor(pastDate.getTime()), // Convert to Unix timestamp (seconds)
    });
  }

  return result;
}
