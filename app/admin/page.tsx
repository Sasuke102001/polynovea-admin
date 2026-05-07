"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
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
        <style jsx>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: var(--space-2xl);
        }
        .dashboard-header {
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--border-muted);
        }
        .dashboard-header h1 {
          font-family: "Clash Display", sans-serif;
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 700;
          margin: 0 0 0.5rem;
          color: var(--text-primary);
          letter-spacing: -0.4px;
        }
        .subtitle {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.9375rem;
          font-weight: 400;
        }
        .stats-grid, .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: var(--space-lg);
        }
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-muted);
          border-radius: 12px;
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .stat-card:hover {
          border-color: rgba(124, 58, 237, 0.3);
          background: var(--bg-elevated);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
        }
        .stat-card.skeleton {
          min-height: 130px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .stat-icon {
          font-size: 1.5rem;
          color: var(--accent-intelligence);
        }
        .stat-value {
          font-family: "Clash Display", sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .section {
          padding-top: 1rem;
        }
        .section h2 {
          font-family: "Clash Display", sans-serif;
          font-size: 1.375rem;
          font-weight: 700;
          margin: 0 0 1.5rem;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-lg);
        }
        .action-card {
          background: var(--bg-card);
          border: 1px solid var(--border-muted);
          border-radius: 12px;
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .action-card:hover {
          border-color: var(--accent-authority);
          background: var(--bg-elevated);
          box-shadow: 0 4px 12px rgba(230, 211, 163, 0.1);
        }
        .action-label {
          font-weight: 700;
          color: var(--accent-authority);
          font-size: 1rem;
        }
        .action-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          font-weight: 400;
        }
      `}</style>
      </AdminLayout>
  );
}
