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
};

export default nextConfig;
