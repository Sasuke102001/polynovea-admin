import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polynovea Admin",
  description: "Admin dashboard for Polynovea Records",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
          }
          :root {
            --bg-primary: #0a0a0a;
            --bg-card: #121212;
            --bg-elevated: #1a1a1a;
            --text-primary: #f5f5f5;
            --text-secondary: #a0a0a0;
            --text-muted: #707070;
            --accent-authority: #E6D3A3;
            --accent-intelligence: #7C3AED;
            --border-muted: #2a2a2a;
            --border-strong: rgba(255, 255, 255, 0.16);
            --space-xs: 0.5rem;
            --space-sm: 0.75rem;
            --space-md: 1rem;
            --space-lg: 1.5rem;
            --space-xl: 2rem;
            --space-2xl: 2.5rem;
          }
          input, textarea, select {
            font-family: inherit;
          }
          select,
          input,
          textarea {
            -webkit-appearance: none;
            appearance: none;
          }
          select {
            background-color: var(--bg-card) !important;
            color: var(--text-primary) !important;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23f5f5f5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 12px;
            padding-right: 2.5rem;
          }
          select option {
            background: var(--bg-card);
            color: var(--text-primary);
          }
          select:focus {
            outline: none;
            border-color: var(--accent-intelligence) !important;
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.18) !important;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
