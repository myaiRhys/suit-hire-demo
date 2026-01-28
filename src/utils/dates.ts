import { startOfWeek, addWeeks, format, parse, isFriday, nextFriday, addDays } from 'date-fns';

/**
 * Get the Friday of the current week (or next Friday if today is Saturday/Sunday)
 */
export function getCurrentWeekFriday(): Date {
  const today = new Date();

  // If today is Friday, return today
  if (isFriday(today)) {
    return today;
  }

  // Get the start of week (Monday)
  const monday = startOfWeek(today, { weekStartsOn: 1 });

  // Add 4 days to get to Friday
  const friday = addDays(monday, 4);

  // If Friday is in the past, get next Friday
  if (friday < today) {
    return nextFriday(today);
  }

  return friday;
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatWeekDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parse a week date string (YYYY-MM-DD) to a Date object
 */
export function parseWeekDate(dateString: string): Date {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

/**
 * Get the next Friday from a given date
 */
export function getNextWeek(currentFriday: string): string {
  const date = parseWeekDate(currentFriday);
  const nextWeek = addWeeks(date, 1);
  return formatWeekDate(nextWeek);
}

/**
 * Get the previous Friday from a given date
 */
export function getPreviousWeek(currentFriday: string): string {
  const date = parseWeekDate(currentFriday);
  const prevWeek = addWeeks(date, -1);
  return formatWeekDate(prevWeek);
}

/**
 * Format a date for display (e.g., "Week of Friday, Dec 19, 2025")
 */
export function formatWeekDisplay(dateString: string): string {
  const date = parseWeekDate(dateString);
  return `Week of ${format(date, 'EEEE, MMM d, yyyy')}`;
}

/**
 * Get an array of the next N Fridays from today
 */
export function getUpcomingFridays(count: number = 8): string[] {
  const fridays: string[] = [];
  let current = getCurrentWeekFriday();

  for (let i = 0; i < count; i++) {
    fridays.push(formatWeekDate(current));
    current = addWeeks(current, 1);
  }

  return fridays;
}

/**
 * Check if a date string is a Friday
 */
export function isWeekDateValid(dateString: string): boolean {
  try {
    const date = parseWeekDate(dateString);
    return isFriday(date);
  } catch {
    return false;
  }
}
