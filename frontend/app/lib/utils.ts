import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts inches to feet and inches format (e.g., 74 → "6'2\"")
 * @param inches - The height in inches
 * @returns Formatted string in feet'inches" format
 */
export function inchesToFeet(inches: number): string {
  if (isNaN(inches) || inches < 0) return "0'0\""
  const feet = Math.floor(inches / 12)
  const remainingInches = Math.floor(inches % 12)
  return `${feet}'${remainingInches}"`
}
