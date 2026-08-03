import type { NextConfig } from "next";
import { getRedirects } from "./src/content/redirects";

const nextConfig: NextConfig = {
  /**
   * Permanent redirects from the WordPress site this replaces.
   *
   * Sourced from `src/content/redirects.ts`, which derives the blog and course
   * entries from the imported content so a re-import keeps them in sync. These
   * are 308s: the old URLs are gone for good and the ranking should move with
   * them.
   */
  async redirects() {
    return getRedirects();
  },

  /**
   * Security headers.
   *
   * Neither `next start` nor Vercel sends any of these by default, so without
   * this block the site ships with none. Applied at the framework rather than
   * the platform so they travel with the code and survive a host change.
   *
   * Deliberately no Content-Security-Policy here. A CSP that is wrong is worse
   * than none — it silently breaks the Google Maps embed, Stripe checkout and
   * the inline JSON-LD — and it needs to be written against the real set of
   * third-party origins and verified in report-only mode first. Left as a
   * post-deploy task rather than shipped as a guess.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stops the browser second-guessing a declared MIME type, which is
          // the vector behind most "image that is actually a script" attacks.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No reason for any page here to be framed.
          { key: "X-Frame-Options", value: "DENY" },
          // Send the origin cross-site, the full path same-site: analytics
          // still attribute referrals without leaking deep URLs off-site.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing on this site needs a camera, microphone or location.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Two years, subdomains included, preload-eligible. Only meaningful
          // over HTTPS, so it is inert on localhost.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
