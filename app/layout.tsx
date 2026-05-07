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
            --text-primary: #f5f5f5;
            --text-secondary: #a0a0a0;
            --accent-authority: #E6D3A3;
            --accent-intelligence: #7C3AED;
            --border-muted: #2a2a2a;
          }
          input, textarea, select {
            font-family: inherit;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
