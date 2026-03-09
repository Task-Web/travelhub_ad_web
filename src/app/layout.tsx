import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TravelHub",
  description: "State-driven travel booking platform built on a unified Next.js stack.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
