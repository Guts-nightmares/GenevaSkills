import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDateShort(dateStr) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function isPastDeadline(dateStr) {
  if (!dateStr) return false
  const now = new Date()
  const date = new Date(dateStr)
  return date < now
}

export function isUpcoming(dateStr) {
  if (!dateStr) return false
  const now = new Date()
  const date = new Date(dateStr)
  const diff = date - now
  const twoDays = 2 * 24 * 60 * 60 * 1000
  return diff > 0 && diff <= twoDays
}
