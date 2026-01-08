import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';

export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return 'N/A';

  const dateObj = new Date(date);

  if (isToday(dateObj)) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  }
  if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE \'at\' h:mm a');
  }
  if (isThisYear(dateObj)) {
    return format(dateObj, 'MMM d \'at\' h:mm a');
  }
  return format(dateObj, 'MMM d, yyyy');
};

export const formatFullDateTime = (date: string | Date): string => {
  if (!date) return 'N/A';
  return format(new Date(date), 'PPpp'); // e.g., "Jan 1, 2026, 3:45 PM"
};
