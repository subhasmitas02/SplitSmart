import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function createUserInitials(displayName: string): string {
  if (!displayName) return '??';
  
  const names = displayName.split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

export function getRandomColor(): string {
  const colors = [
    '#6366f1', // primary
    '#8b5cf6', // secondary
    '#f97316', // accent
    '#22c55e', // success
    '#ef4444'  // error
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

export function generateShareableLink(itemType: string, itemId: number): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/${itemType}/${itemId}`;
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}
