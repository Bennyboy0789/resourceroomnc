import { ImageResponse } from "next/og";
import { addressLine, site } from "@/content/site";

/**
 * Default social preview card, generated at build time.
 *
 * Next applies this to every route that does not set its own
 * `openGraph.images` — which fixes the 60 pages that previously shared as a
 * bare text link, the homepage among them. Blog posts with a featured image
 * still override it.
 *
 * Drawn rather than shipped as a file for the same reason as `icon.tsx`: there
 * is no 1200×630 brand asset to use yet. Swap in a real one when the logo
 * artwork arrives; the metadata plumbing will not need to change.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.legalName} — ${site.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#08152f",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      {/* Brand mark */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#3d60a9",
            color: "#fff100",
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: -1,
            borderRadius: 12,
          }}
        >
          RR
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#ffffff", fontSize: 34, fontWeight: 800, letterSpacing: -0.5 }}>
            Resource Room
          </div>
          {/* Satori requires an explicit display on any element with more than
              one child, so interpolations are joined into a single string. */}
          <div style={{ color: "#8fa6d4", fontSize: 20, letterSpacing: 3 }}>
            {`${site.address.city.toUpperCase()}, ${site.address.state}`}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "flex" }}>A Complete Learning Center for&nbsp;</span>
          <span style={{ display: "flex", color: "#fff100" }}>Every Student.</span>
        </div>
        <div style={{ color: "#b9c7e4", fontSize: 26, marginTop: 24, lineHeight: 1.4 }}>
          Tutoring · Camps · SAT &amp; ACT · College Prep · Pathways Academy
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "2px solid #1a3468",
          paddingTop: 28,
          color: "#8fa6d4",
          fontSize: 22,
        }}
      >
        <div style={{ display: "flex" }}>{addressLine}</div>
        <div style={{ display: "flex", color: "#fff100", fontWeight: 700 }}>{site.phone}</div>
      </div>
    </div>,
    size,
  );
}
