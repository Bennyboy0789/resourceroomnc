import type { Metadata } from "next";
import { Caveat, DM_Sans, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CartProvider } from "@/components/shop/CartProvider";
import { site } from "@/content/site";
import { organizationSchema } from "@/lib/schema";
import { seoDescription, seoTitle } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/*
 * Pathways Academy's own typefaces.
 *
 * Pathways ran as a separate site with a deliberately different look — a
 * Playfair Display serif over DM Sans, where the rest of Resource Room is
 * Inter set loud and uppercase. Joe asked for that page to look exactly as it
 * did, so both families load here and are used only by
 * /programs/pathways-academy. Nothing else on the site references them.
 */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/*
 * The handwritten caption on the camp photo gallery, and nothing else.
 *
 * Loaded through next/font rather than a <link> injected at runtime: the
 * stylesheet is self-hosted at build time, so there is no render-blocking
 * request to fonts.googleapis.com, no flash of the fallback, and no third
 * party told which visitors looked at the camp page.
 */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  /*
   * No `template`. The brand suffix is applied by `seoTitle()` instead, which
   * drops it when the page title has no room — a template appends it
   * unconditionally, and on 33 pages that pushed the title past the ~60
   * characters Google shows, truncating the headline rather than the brand.
   */
  title: seoTitle(site.tagline),
  description: seoDescription(site.description),
  keywords: [
    "tutoring Holly Springs NC",
    "SAT prep Holly Springs",
    "summer camps Holly Springs",
    "homeschool co-op NC",
    "IEP advocate North Carolina",
    "learning center Holly Springs",
  ],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  alternates: {
    canonical: "/",
  },
};

/**
 * Organization markup, emitted on every page so the local-pack and
 * answer-engine signals do not depend on which page gets crawled first.
 * Page-specific nodes (Service, FAQ, Course, BlogPosting) are added by the
 * pages themselves.
 */
const structuredData = organizationSchema();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${dmSans.variable} ${caveat.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* First focusable element on the page — see `skip-link` in globals.css. */}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <CartProvider>
          <TopBar />
          <Header />
          <main id="main" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
