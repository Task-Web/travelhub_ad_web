/**
 * Formatting utilities for the TravelHub clone
 */

import { format, parseISO, formatDistance, differenceInDays } from 'date-fns';

/**
 * Format a price with currency symbol
 */
export function formatPrice(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date, formatStr = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format a date range (check-in to check-out)
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  const startMonth = format(start, 'MMM');
  const endMonth = format(end, 'MMM');

  if (startMonth === endMonth) {
    return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
  }

  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

/**
 * Calculate number of nights between dates
 */
export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
  const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
  return differenceInDays(end, start);
}

/**
 * Format flight duration in hours and minutes
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}min`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}min`;
}

/**
 * Format time in 24-hour format
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm');
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

/**
 * Get review score label based on numeric rating
 */
export function getReviewScoreLabel(score: number): string {
  if (score >= 9) return 'Superb';
  if (score >= 8) return 'Very good';
  if (score >= 7) return 'Good';
  if (score >= 6) return 'Pleasant';
  return 'Review score';
}

/**
 * Get review score color class based on numeric rating
 */
export function getReviewScoreColor(score: number): string {
  if (score >= 9) return 'bg-blue-900';
  if (score >= 8) return 'bg-blue-800';
  if (score >= 7) return 'bg-blue-700';
  if (score >= 6) return 'bg-blue-600';
  return 'bg-blue-500';
}

/**
 * Format a number with thousands separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Format guest count for display
 */
export function formatGuestCount(adults: number, children: number, rooms: number): string {
  const parts: string[] = [];

  parts.push(`${adults} ${adults === 1 ? 'adult' : 'adults'}`);

  if (children > 0) {
    parts.push(`${children} ${children === 1 ? 'child' : 'children'}`);
  }

  parts.push(`${rooms} ${rooms === 1 ? 'room' : 'rooms'}`);

  return parts.join(', ');
}

/**
 * Format passenger count for flights
 */
export function formatPassengerCount(
  adults: number,
  children: number,
  infants: number
): string {
  const parts: string[] = [];

  parts.push(`${adults} ${adults === 1 ? 'adult' : 'adults'}`);

  if (children > 0) {
    parts.push(`${children} ${children === 1 ? 'child' : 'children'}`);
  }

  if (infants > 0) {
    parts.push(`${infants} ${infants === 1 ? 'infant' : 'infants'}`);
  }

  return parts.join(', ');
}
