import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberToLetter(n: number): string {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  if (n < letters.length) return letters[n]!.toUpperCase();
  return (n - letters.length + 1).toString();
}
