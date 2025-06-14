import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateData(data: any, maxLength = 100): string {
  if (typeof data !== 'string') {
    if (data && typeof data.toString === 'function') {
      data = data.toString();
    } else {
      return ''; // Or some placeholder like '[data]'
    }
  }
  if (data.length <= maxLength) {
    return data;
  }
  return data.substring(0, maxLength) + '...';
}
