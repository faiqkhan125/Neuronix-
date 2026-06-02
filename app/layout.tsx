import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar, Footer } from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Neuronix AI - Premium Digital Assets Marketplace",
    template: "%s | Neuronix AI"
  },
  description: "Neuronix AI is the premier marketplace for premium digital assets, including high-quality website templates, UI kits, SaaS dashboards, and AI source code. Built for developers and designers to accelerate their workflow.",
  keywords: [
    "AI Marketplace", "Digital Assets", "Website Templates", "UI Kits", "SaaS Dashboards", 
    "React Templates", "Next.js Templates", "Source Code Marketplace", "Developer Tools", 
    "Web Design Assets", "Premium Scripts", "SaaS UI Kit", "Neon UI Design"
  ],
  authors: [{ name: "Neuronix AI Team" }],
  creator: "Neuronix AI",
  publisher: "Neuronix AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Neuronix AI - Premium Digital Assets Marketplace",
    description: "Discover high-quality website templates, UI kits, and SaaS dashboards at Neuronix AI. The world's most advanced marketplace for premium digital assets.",
    url: "https://neuronix-ai.run.app",
    siteName: "Neuronix AI",
    images: [
      {
        url: "https://picsum.photos/seed/neuronix/1200/630",
        width: 1200,
        height: 630,
        alt: "Neuronix AI Marketplace Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: 'https://neuronix-ai.run.app',
  },
  twitter: {
    card: "summary_large_image",
    title: "Neuronix AI - Premium Digital Assets Marketplace",
    description: "The world's most advanced marketplace for premium digital assets. Built for developers, by developers.",
    images: ["https://picsum.photos/seed/neuronix/1200/630"],
    creator: "@neuronix_ai",
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
  verification: {
    google: "google-site-verification-placeholder",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Neuronix AI",
    "url": "https://neuronix-ai.run.app",
    "description": "Premium marketplace for high-quality website templates, UI kits, and SaaS dashboards.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://neuronix-ai.run.app/marketplace?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} bg-dark-bg text-text min-h-screen flex flex-col font-sans`} suppressHydrationWarning>
        <ErrorBoundary>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
