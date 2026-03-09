/**
 * Utility for merging Tailwind CSS classes
 *
 * Combines clsx for conditional classes with tailwind-merge
 * to properly handle conflicting Tailwind classes.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
