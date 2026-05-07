export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  capacity: string;
  status: string;
  desc: string;
  cta: string;
  href: string;
  statusType: "active" | "progress" | "planned";
  created_at: string;
  updated_at: string;
}

export interface PastShow {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  capacity: string;
  status: string;
  desc: string;
  cta: string;
  href: string;
  statusType: "active" | "progress" | "planned";
  attendance: number;
  created_at: string;
  updated_at: string;
}

export interface VenuePartnership {
  id: string;
  name: string;
  city: string;
  capacity: string;
  type: string;
  desc: string;
  contact_email: string;
  logo_url: string;
  contactStatus: string;
  statusType: "active" | "progress" | "planned";
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiveMetric {
  id: number;
  label: string;
  value: string;
  period: string;
  trend: string;
  trendDirection: "up" | "down";
}

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
