"use client";

import { useState, useEffect } from "react";
import { isAuthenticated, login, logout } from "@/lib/admin/authCheck";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setAuthChecked(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(inputKey)) {
      setIsAuth(true);
    } else {
      setError("Invalid admin key.");
    }
  };

  if (!authChecked) {
    return (
      <div className="auth-loading">
        <div className="spinner" />
        <style jsx>{`
          .auth-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
          }
          .spinner {
            width: 32px;
            height: 32px;
            border: 2px solid var(--border-muted);
            border-top-color: var(--accent-intelligence);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h1>Polynovea Admin</h1>
          <p>Enter your admin API key to continue.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin API Key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              autoFocus
            />
            {error && <span className="auth-error">{error}</span>}
            <button type="submit">Access Dashboard</button>
          </form>
        </div>
        <style jsx>{`
          .auth-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
            padding: 1rem;
          }
          .auth-card {
            background: var(--bg-card);
            border: 1px solid var(--border-muted);
            border-radius: 12px;
            padding: 2.5rem;
            width: 100%;
            max-width: 400px;
          }
          .auth-card h1 {
            font-family: "Clash Display", sans-serif;
            font-size: 1.5rem;
            margin: 0 0 0.5rem;
            color: var(--text-primary);
          }
          .auth-card p {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin: 0 0 1.5rem;
          }
          .auth-card form {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .auth-card input {
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid var(--border-muted);
            background: rgba(255, 255, 255, 0.03);
            color: var(--text-primary);
            font-size: 0.9375rem;
            outline: none;
            transition: border-color 0.2s;
          }
          .auth-card input:focus {
            border-color: var(--accent-intelligence);
          }
          .auth-card button {
            padding: 0.75rem;
            border-radius: 8px;
            border: none;
            background: var(--accent-authority);
            color: #0a0a0a;
            font-weight: 600;
            font-size: 0.9375rem;
            cursor: pointer;
            transition: opacity 0.2s;
          }
          .auth-card button:hover {
            opacity: 0.9;
          }
          .auth-error {
            color: #fca5a5;
            font-size: 0.8125rem;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
