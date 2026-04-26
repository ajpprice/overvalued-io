import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfigNotice from "@/components/ConfigNotice";

export const metadata: Metadata = {
  title: "overvalued.io — community stock review & short execution",
  description: "Bearish theses on the most overvalued public companies. Vote, debate, short.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-bg text-ink">
        <ConfigNotice />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
