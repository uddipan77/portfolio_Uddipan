// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uddipan Basu Bir",
  description: "Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen antialiased bg-white text-neutral-900
                   dark:bg-black dark:text-neutral-100
                   overflow-x-hidden scroll-smooth"
      >
        {children}
      </body>
    </html>
  );
}
