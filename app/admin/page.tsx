"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Toast from "@/components/admin/Toast";
import type { LiveEvent, PastShow, VenuePartnership, BlogPost, LiveMetric } from "@/lib/admin/types";

interface Stats {
  events: number;
  pastShows: number;
  venues: number;
  blogPosts: number;
  metrics: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ events: 0, pastShows: 0, venues: 0, blogPosts: 0, metrics: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [eRes, pRes, vRes, bRes, mRes] = await Promise.all([
          fetch("/api/content/live-events"),
          fetch("/api/content/past-shows"),
          fetch("/api/content/venue-partnerships"),
          fetch("/api/content/blog-posts"),
          fetch("/api/content/live-metrics"),
        ]);
        const [eJson, pJson, vJson, bJson, mJson] = await Promise.all([
          eRes.json(), pRes.json(), vRes.json(), bRes.json(), mRes.json(),
        ]);
        setStats({
          events: (eJson.data as LiveEvent[] | null)?.length || 0,
          pastShows: (pJson.data as PastShow[] | null)?.length || 0,
          venues: (vJson.data as VenuePartnership[] | null)?.length || 0,
          blogPosts: (bJson.data as BlogPost[] | null)?.length || 0,
          metrics: (mJson.data as LiveMetric[] | null)?.length || 0,
        });
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: "Live Events", value: stats.events, href: "/admin/events", icon: "▲" },
    { label: "Past Shows", value: stats.pastShows, href: "/admin/past-shows", icon: "▼" },
    { label: "Venues", value: stats.venues, href: "/admin/venues", icon: "■" },
    { label: "Blog Posts", value: stats.blogPosts, href: "/admin/blog", icon: "◈" },
    { label: "Metrics", value: stats.metrics, href: "/admin/metrics", icon: "◉" },
  ];

  const quickActions = [
    { label: "New Event", href: "/admin/events", desc: "Create an upcoming performance" },
    { label: "New Venue", href: "/admin/venues", desc: "Add a venue partnership" },
    { label: "New Post", href: "/admin/blog", desc: "Publish a blog article" },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p className="subtitle">Overview of your Polynovea Records content.</p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="stat-card skeleton" />
              ))}
            </div>
          ) : (
            <div className="stats-grid">
              {statCards.map((card) => (
                <Link key={card.label} href={card.href} className="stat-card">
                  <span className="stat-icon">{card.icon}</span>
                  <span className="stat-value">{card.value}</span>
                  <span className="stat-label">{card.label}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="section">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href} className="action-card">
                  <span className="action-label">{action.label}</span>
                  <span className="action-desc">{action.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Toast />
      </AdminLayout>
      <style jsx>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .dashboard-header h1 {
          font-family: "Clash Display", sans-serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 600;
          margin: 0 0 0.375rem;
          color: var(--text-primary);
        }
        .subtitle {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.9375rem;
        }
        .stats-grid, .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-muted);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.2s;
        }
        .stat-card:hover {
          border-color: rgba(124, 58, 237, 0.3);
          transform: translateY(-2px);
        }
        .stat-card.skeleton {
          min-height: 120px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .stat-icon {
          font-size: 1.25rem;
          color: var(--accent-intelligence);
        }
        .stat-value {
          font-family: "Clash Display", sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .section h2 {
          font-family: "Clash Display", sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 1rem;
          color: var(--text-primary);
        }
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        .action-card {
          background: var(--bg-card);
          border: 1px solid var(--border-muted);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          text-decoration: none;
          transition: all 0.2s;
        }
        .action-card:hover {
          border-color: var(--accent-authority);
        }
        .action-label {
          font-weight: 600;
          color: var(--accent-authority);
          font-size: 0.9375rem;
        }
        .action-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }
      `}</style>
    </ProtectedRoute>
  );
}
