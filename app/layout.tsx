/* eslint-disable @next/next/no-page-custom-font -- non-blocking webfont load; system fallbacks in CSS */
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { siteConfig, buildAbsoluteUrl } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { WhatsAppFloat, MobileBottomBar } from "@/components/layout/FloatingActions";
import { CookieNotice } from "@/components/layout/CookieNotice";
import { getSiteSettings } from "@/lib/queries";
import "./globals.css";

/**
 * Fonts (Sora + Inter) load via stylesheet links so builds never hard-fail on
 * Google Fonts network hiccups. Variables --font-display / --font-body are set
 * in globals.css with system fallbacks for instant first paint.
 */

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(buildAbsoluteUrl()),
    title: {
      default: `${siteConfig.name} — Solar Installation & CCTV Supply in Abuja`,
      template: `%s | ${siteConfig.name}`,
    },
    description:
      "Reliable solar installation and equipment supply in Abuja, FCT — plus CCTV camera supply and installation. Panels, inverters, lithium & tubular batteries, complete kits. Certified installers, warranty-backed systems, nationwide delivery.",
    keywords: [
      "solar installation Nigeria",
      "solar inverter supplier",
      "solar panels price Nigeria",
      "solar company in Abuja",
      "solar installers in Abuja",
      "solar inverter supplier Abuja",
      "solar panels price Abuja",
      "solar installation FCT",
      "CCTV installation Abuja",
      "CCTV cameras Nigeria",
    ],
    openGraph: {
      type: "website",
      locale: "en_NG",
      url: buildAbsoluteUrl(),
      siteName: siteConfig.name,
      title: `${siteConfig.name} — Solar Installation & CCTV Supply in Abuja`,
      description:
        "Dependable solar power and CCTV security systems for homes, businesses and institutions across Abuja and Nigeria.",
      images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — Solar Installation & CCTV Supply in Abuja`,
      description:
        "Dependable solar power and CCTV security systems for homes, businesses and institutions across Abuja and Nigeria.",
      images: ["/og-default.svg"],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: buildAbsoluteUrl() },
    ...(process.env.NEXT_PUBLIC_GA_ID
      ? { googleAnalytics: { id: process.env.NEXT_PUBLIC_GA_ID } }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings().catch(() => null);
  const announcement =
    settings?.announcementEnabled && settings.announcementText
      ? { text: settings.announcementText, link: settings.announcementLink }
      : null;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only-focusable rounded-lg bg-deep-900 px-4 py-2 text-sm font-semibold text-white">
          Skip to content
        </a>
        {announcement && <AnnouncementBar text={announcement.text} link={announcement.link} />}
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <MobileBottomBar />
        <CookieNotice />
        <Analytics />
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <noscript>
            {/* Meta Pixel placeholder — injected at runtime when NEXT_PUBLIC_META_PIXEL_ID is set */}
          </noscript>
        )}
      </body>
    </html>
  );
}
