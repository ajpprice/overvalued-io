import type { Metadata } from "next";
import "./globals.css";
import "./components.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "overvalued.io — short what you hate",
  description:
    "Reviews-with-receipts shorting. Bearish theses on the most overvalued public companies. Vote, debate, short.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body style={{ background: "var(--ov-bg)", color: "var(--ov-fg)" }} className="min-h-screen flex flex-col font-mono">
        <Header />
        <main className="flex-1 pb-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
