import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAuthToken() {
  return localStorage.getItem("eduquest_token");
}

export function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function setAuthToken(token: string) {
  localStorage.setItem("eduquest_token", token);
}

export function clearAuthToken() {
  localStorage.removeItem("eduquest_token");
}
