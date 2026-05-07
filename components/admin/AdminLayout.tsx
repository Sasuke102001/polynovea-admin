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
          width: 280px;
          background: linear-gradient(180deg, var(--bg-card) 0%, rgba(18, 18, 18, 0.8) 100%);
          border-right: 1px solid rgba(42, 42, 42, 0.5);
          display: flex;
          flex-direction: column;
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 100;
          transition: transform 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .sidebar-header {
          padding: 2rem 1.5rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(42, 42, 42, 0.5);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text-primary);
          transition: opacity 0.2s;
        }
        .brand:hover {
          opacity: 0.8;
        }
        .brand-icon {
          color: var(--accent-authority);
          font-size: 1.5rem;
        }
        .brand-text {
          font-family: "Clash Display", sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: -0.3px;
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
          padding: 1.5rem 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          min-height: 44px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          background: transparent;
        }
        .nav-item:hover {
          background: rgba(124, 58, 237, 0.1);
          color: var(--text-primary);
          border-color: rgba(124, 58, 237, 0.2);
        }
        .nav-item.active {
          background: rgba(124, 58, 237, 0.15);
          color: #ffffff;
          border-color: rgba(124, 58, 237, 0.3);
          font-weight: 600;
        }
        .nav-icon {
          font-size: 1rem;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        .sidebar-footer {
          padding: 1.5rem 0.875rem;
          border-top: 1px solid rgba(42, 42, 42, 0.5);
        }
        .logout-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 10px;
          border: 1px solid rgba(42, 42, 42, 0.8);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-secondary);
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .logout-btn:hover {
          border-color: rgba(239, 68, 68, 0.5);
          color: #fca5a5;
          background: rgba(239, 68, 68, 0.1);
        }
        .main-wrapper {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .topbar {
          display: none;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(42, 42, 42, 0.5);
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
          padding: 8px;
        }
        .mobile-toggle span {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--text-secondary);
          border-radius: 1px;
          transition: all 0.2s;
        }
        .page-title {
          font-family: "Clash Display", sans-serif;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 1rem;
        }
        .main-content {
          flex: 1;
          padding: 2.5rem;
          overflow-x: auto;
          background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(18, 18, 18, 0.5) 100%);
        }
        .sidebar-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 90;
        }
        @media (max-width: 768px) {
          .sidebar {
            width: 260px;
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
            padding: 1.5rem;
          }
          .sidebar-backdrop {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
