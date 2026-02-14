// Time utility for West Africa Time (WAT) - UTC+1
// Used throughout the application for consistent timezone handling

export const TIMEZONE = "Africa/Lagos";
export const TIMEZONE_ABBR = "WAT";
export const TIMEZONE_OFFSET = "+01:00";

/**
 * Get current date/time in WAT
 */
export function getCurrentWAT(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
}

/**
 * Format a date as WAT with time
 * @param date - The date to format
 * @param includeSeconds - Whether to include seconds
 */
export function formatWATDateTime(date: Date, includeSeconds: boolean = false): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  };
  return date.toLocaleString('en-NG', options) + ' WAT';
}

/**
 * Format just the time in WAT
 */
export function formatWATTime(date: Date): string {
  return date.toLocaleTimeString('en-NG', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) + ' WAT';
}

/**
 * Format just the date in WAT
 */
export function formatWATDate(date: Date): string {
  return date.toLocaleDateString('en-NG', {
    timeZone: TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get next Monday 9am WAT
 */
export function getNextMonday9am(): Date {
  const now = getCurrentWAT();
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(9, 0, 0, 0);
  return nextMonday;
}

/**
 * Get next Friday 6pm WAT
 */
export function getNextFriday6pm(): Date {
  const now = getCurrentWAT();
  const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
  const nextFriday = new Date(now);
  nextFriday.setDate(now.getDate() + daysUntilFriday);
  nextFriday.setHours(18, 0, 0, 0);
  return nextFriday;
}

/**
 * Get next Sunday 6pm WAT
 */
export function getNextSunday6pm(): Date {
  const now = getCurrentWAT();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(18, 0, 0, 0);
  return nextSunday;
}

/**
 * Check if current time is past a deadline
 */
export function isPastDeadline(deadline: Date): boolean {
  return getCurrentWAT() > deadline;
}

/**
 * Get time remaining until deadline
 */
export function getTimeUntilDeadline(deadline: Date): string {
  const now = getCurrentWAT();
  const diff = deadline.getTime() - now.getTime();
  
  if (diff < 0) return "Overdue";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours < 1) return `${minutes} minutes remaining`;
  if (hours < 24) return `${hours} hours remaining`;
  
  const days = Math.floor(hours / 24);
  return `${days} days remaining`;
}
