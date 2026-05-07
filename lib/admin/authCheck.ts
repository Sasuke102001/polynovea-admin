"use client";

const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "";

export function getAuthHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ADMIN_API_KEY}`,
  };
}

export function isAuthenticated(): boolean {
  return typeof window !== "undefined" && !!localStorage.getItem("admin_auth");
}

export function login(key: string): boolean {
  if (key === ADMIN_API_KEY && key.length > 0) {
    localStorage.setItem("admin_auth", "true");
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem("admin_auth");
}
