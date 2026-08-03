"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

/**
 * Google Maps embed behind a click-to-load facade.
 *
 * The iframe is roughly 470KB and a dozen extra requests — it was most of the
 * 557KB the contact page transferred, for a map most visitors never interact
 * with. Nothing loads until someone asks for it.
 *
 * The address, a directions link and a static map graphic are all present
 * before any of that, so the useful information is never behind the click.
 */
export function MapEmbed({ query, addressLine }: { query: string; addressLine: string }) {
  const [loaded, setLoaded] = useState(false);
  const directions = `https://maps.google.com/?q=${encodeURIComponent(query)}`;

  if (loaded) {
    return (
      <iframe
        title={`Map to Resource Room at ${addressLine}`}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-80 w-full border-0"
      />
    );
  }

  return (
    <div className="relative h-80 w-full overflow-hidden bg-mist">
      {/* Suggestion of a street grid — cheap, and stops the panel reading as a
          broken image well before the real map exists. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(#102449 1px, transparent 1px), linear-gradient(90deg, #102449 1px, transparent 1px)",
          backgroundSize: "44px 44px, 44px 44px",
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="grid h-12 w-12 place-items-center bg-navy-900 text-sun-500">
          <Icon name="pin" className="h-6 w-6" />
        </span>
        <p className="font-semibold text-navy-950">{addressLine}</p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="inline-flex min-h-11 items-center border border-navy-900 bg-navy-900 px-5 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-navy-800"
          >
            Load map
          </button>
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 border border-navy-900/20 px-5 text-xs font-bold uppercase tracking-[0.08em] text-navy-700 transition-colors hover:border-navy-900/50 hover:text-navy-950"
          >
            Get directions
            <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
