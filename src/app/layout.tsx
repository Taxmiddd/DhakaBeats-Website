import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CursorGradient from "@/components/ui/CursorGradient";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dhaka Beats | One Beat Ahead",
  description: "Premium Event Management Platform in Dhaka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-electric-red/30 relative">
        <CursorGradient />
        <Navbar />
        <main className="flex-grow flex flex-col relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
