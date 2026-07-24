import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Run Workout Builder",
  description: "Build a running workout by dragging blocks onto a timeline.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-800 antialiased">{children}</body>
    </html>
  );
}
