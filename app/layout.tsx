import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { SettingsProvider } from "@/context/SettingsContext";

const inter = Inter({ subsets: ["latin"] });

const Settings = async function () {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/settings`,
    { cache: "no-cache" }
  );
  const data = await res.json();
  return data.settings || {};
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await Settings();

  return {
    title: settings.seoTitle || "Sarangsho - Latest Trusted News",
    description:
      settings.seoDescription ||
      "Swipe through the latest trusted news from verified sources worldwide.",
    keywords: settings.metaKeywords?.split(",") || [],
    icons: {
      icon: settings.favicon || "/favicon.ico",
    },
    openGraph: {
      title: settings.seoTitle || "Sarangsho - Latest Trusted News",
      description:
        settings.seoDescription ||
        "Swipe through the latest trusted news from verified sources worldwide.",
      url: "https://sarangsho.com",
      siteName: "Sarangsho",
      images: [
        {
          url: settings.logo || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: settings.seoTitle || "Sarangsho",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle || "Sarangsho",
      description:
        settings.seoDescription ||
        "Swipe through the latest trusted news from verified sources worldwide.",
      images: [settings.logo || "/og-image.jpg"],
      creator: "@sarangsho",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    generator: "v0.dev",
    metadataBase: new URL("https://sarangsho.com"),
    alternates: {
      canonical: "/",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await Settings();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SettingsProvider settings={settings}>{children}</SettingsProvider>
        <Toaster />
      </body>
    </html>
  );
}
