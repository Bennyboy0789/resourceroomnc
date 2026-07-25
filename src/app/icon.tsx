import { ImageResponse } from "next/og";

// Generated at build time, so there is no binary favicon to maintain.
// Replace this file with a favicon.ico once the real logo asset is available.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3d60a9",
          color: "#fff100",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: -1,
          borderRadius: 6,
        }}
      >
        RR
      </div>
    ),
    size,
  );
}
