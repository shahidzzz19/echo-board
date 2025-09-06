import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const safeImage = (url: string | null | undefined) => (url && url.startsWith("http") ? url : null)

export const generateId = (prefix: string, unique: string | number) => `${prefix}-${unique}-${Date.now()}`

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
