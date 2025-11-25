import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDateShort(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

export function isPastDeadline(deadline) {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export function isUpcoming(deadline) {
  if (!deadline) return false
  const deadlineDate = new Date(deadline)
  const today = new Date()
  const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays >= 0
}
