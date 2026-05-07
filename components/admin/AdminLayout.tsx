"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/admin/authCheck";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "◆" },
  { href: "/admin/events", label: "Live Events", icon: "▲" },
  { href: "/admin/past-shows", label: "Past Shows", icon: "▼" },
  { href: "/admin/venues", label: "Venues", icon: "■" },
  { href: "/admin/blog", label: "Blog", icon: "◈" },
  { href: "/admin/metrics", label: "Metrics", icon: "◉" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/admin";
  };

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link href="/admin" className="brand">
            <span className="brand-icon">◈</span>
            <span className="brand-text">Polynovea</span>
          </Link>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>&times;</button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            <span /><span /><span />
          </button>
          <span className="page-title">
            {navItems.find((n) => pathname === n.href || pathname.startsWith(`${n.href}/`))?.label || "Admin"}
          </span>
        </header>
        <main className="main-content">{children}</main>
      </div>

      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-primary);
        }
        .sidebar {
          width: 260px;
          background: var(--bg-card);
          border-right: 1px solid var(--border-muted);
          display: flex;
          flex-direction: column;
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 100;
          transition: transform 0.3s ease;
        }
        .sidebar-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-muted);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          text-decoration: none;
          color: var(--text-primary);
        }
        .brand-icon {
          color: var(--accent-authority);
          font-size: 1.25rem;
        }
        .brand-text {
          font-family: "Clash Display", sans-serif;
          font-weight: 600;
          font-size: 1.125rem;
        }
        .mobile-close {
          display: none;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
        }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .nav-item:hover {
          background: rgba(124, 58, 237, 0.08);
          color: var(--text-primary);
          border-color: rgba(124, 58, 237, 0.15);
        }
        .nav-item.active {
          background: rgba(124, 58, 237, 0.15);
          color: #e5d4ff;
          border: 1px solid rgba(124, 58, 237, 0.3);
          font-weight: 600;
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.1);
        }
        .nav-icon {
          font-size: 0.75rem;
          width: 20px;
          text-align: center;
        }
        .sidebar-footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid var(--border-muted);
        }
        .logout-btn {
          width: 100%;
          padding: 0.625rem;
          border-radius: 8px;
          border: 1px solid var(--border-muted);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          border-color: rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          background: rgba(239, 68, 68, 0.06);
        }
        .main-wrapper {
          flex: 1;
          margin-left: 260px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .topbar {
          display: none;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-muted);
          background: var(--bg-card);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .mobile-toggle {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .mobile-toggle span {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--text-secondary);
          border-radius: 1px;
        }
        .page-title {
          font-family: "Clash Display", sans-serif;
          font-weight: 600;
          color: var(--text-primary);
        }
        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-x: auto;
        }
        .sidebar-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 90;
        }
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .mobile-close {
            display: block;
          }
          .main-wrapper {
            margin-left: 0;
          }
          .topbar {
            display: flex;
          }
          .main-content {
            padding: 1.25rem;
          }
          .sidebar-backdrop {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
