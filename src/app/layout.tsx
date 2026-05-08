import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlooMery — Flower Bouquet Shop",
  description:
    "Hand-crafted flower bouquets for every occasion. Order beautiful bouquets online for pickup or delivery across Metro Manila.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream text-slate-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
