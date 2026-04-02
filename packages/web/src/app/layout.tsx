import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buddymon Arena",
  description: "Battle your Claude Code buddies!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <nav className="border-b border-[var(--border-subtle)] p-4">
          <div className="max-w-6xl mx-auto flex items-center gap-6">
            <a href="/" className="text-lg font-bold text-white hover:text-[var(--color-explorer)]">
              BUDDYMON
            </a>
            <a href="/arena" className="text-xs hover:text-white">
              Arena
            </a>
            <a href="/classes" className="text-xs hover:text-white">
              Classes
            </a>
            <a href="/leaderboard" className="text-xs hover:text-white">
              Leaderboard
            </a>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
