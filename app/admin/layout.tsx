import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polynovea Admin",
  description: "Admin dashboard for Polynovea Records",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
