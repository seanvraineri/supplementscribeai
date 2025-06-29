import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const satoshi = localFont({
  src: '../fonts/Satoshi-Variable.woff2',
  variable: '--font-satoshi',
})

export const metadata: Metadata = {
  title: "Why Don't Supplements Work? AI-Powered Personalized Nutrition | SupplementScribe",
  description: "Tired all the time? Gut health problems? Weight loss plateau? Stop wasting money on generic supplements. Our AI analyzes your genetics & biomarkers to create personalized supplement plans that actually work. Solve root causes, not symptoms.",
  keywords: "why don't supplements work, why am I tired all the time, gut health problems, weight loss plateau, brain fog causes, hormone imbalance symptoms, supplement side effects, personalized supplements, DNA based supplements, AI nutrition, custom supplement plans, biomarker analysis, root cause analysis, chronic fatigue, sleep problems, personalized nutrition, genetic analysis supplements",
  authors: [{ name: "SupplementScribe AI" }],
  openGraph: {
    title: "Why Don't Supplements Work? AI-Powered Personalized Nutrition Solutions",
    description: "Stop wasting money on generic supplements that don't work. Our AI creates personalized supplement plans based on your genetics, biomarkers, and health analysis. Finally, supplements that work for YOUR unique biology.",
    url: "https://supplementscribe.ai",
    siteName: "SupplementScribe AI",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SupplementScribe AI - Why Generic Supplements Fail & How Personalized Nutrition Works"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Don't Supplements Work? AI-Powered Personalized Solutions",
    description: "Stop wasting money on generic supplements. Get personalized nutrition that actually works for your unique biology.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D0D0D',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} font-sans`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0D0D0D" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SupplementScribe AI",
              "description": "AI-powered personalized supplement recommendations based on comprehensive health analysis",
              "url": "https://supplementscribe.ai",
              "logo": "https://supplementscribe.ai/logo.png",
              "sameAs": [
                "https://twitter.com/supplementscribe",
                "https://linkedin.com/company/supplementscribe"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@supplementscribe.ai"
              },
              "offers": {
                "@type": "Offer",
                "name": "Personalized Supplement Plans",
                "description": "AI-powered personalized supplement recommendations",
                "price": "19.99",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
