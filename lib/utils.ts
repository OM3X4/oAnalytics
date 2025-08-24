import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortDateFormatter(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function formatHour(date: Date | string | number): string {
  const d = new Date(date);
  let hours = d.getHours(); // 0 - 23
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;       // convert to 12-hour format
  if (hours === 0) hours = 12; // 0 => 12
  return `${hours}${ampm}`;
}
