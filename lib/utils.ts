import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TimeRange , RollUpResponse } from "@/app/types/types"


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

export function generateDates(range: TimeRange): Date[] {
  if(!range) throw new Error("No date range provided");
  const dates: Date[] = [];
  const start = new Date(range.from);
  const end = range.to ? new Date(range.to) : new Date(range.from);

  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1); // move to next day
  }

  return dates;
}

export function groupByDay(data: RollUpResponse[]): RollUpResponse[] {
  const map = new Map<string, RollUpResponse>();

  for (const item of data) {
    if (!item.bucket) continue;

    // Extract YYYY-MM-DD from bucket (ignores hours)
    const day = item.bucket.split('T')[0];

    if (!map.has(day)) {
      map.set(day, { ...item, bucket: day });
    } else {
      const existing = map.get(day)!;
      existing.views += item.views;
      existing.visitors += item.visitors;
    }
  }

  return Array.from(map.values());
}

export function isTheSameDayAndMonth(date1: Date, date2: Date): boolean {
    return date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0]
}
