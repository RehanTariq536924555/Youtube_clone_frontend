import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCompactNumber(number: number | string) {
    if (typeof number === 'string') return number; // Already formatted dummy data
    const formatter = Intl.NumberFormat("en", { notation: "compact" });
    return formatter.format(number);
}
