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
  title: {
    default: "Dhaka Beats | One Beat Ahead",
    template: "%s | Dhaka Beats"
  },
  description: "Dhaka Beats is the city's most exclusive event platform, dedicated to elevating the music and culture scene. We curate high-energy concerts, underground festivals, and premium artist experiences.",
  applicationName: "Dhaka Beats",
  authors: [{ name: "Dhaka Beats Team" }],
  keywords: ["Events", "Concert", "Dhaka", "Music Festival", "Artist Management", "Ticketing"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dhakabeats.com",
    siteName: "Dhaka Beats",
    title: "Dhaka Beats | One Beat Ahead",
    description: "Premium Event Management Platform in Dhaka",
    images: [{ url: "/logo1.svg", width: 800, height: 600, alt: "Dhaka Beats" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhaka Beats | One Beat Ahead",
    description: "Premium Event Management Platform in Dhaka",
    images: ["/logo1.svg"]
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo1.svg"
  }
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
