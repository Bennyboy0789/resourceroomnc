import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import circleLogo from "../../public/logo-circle.png";
import whiteLogo from "../../public/logo-white.png";

/**
 * Logo lockup, using the real brand assets from resourceroomnc.com.
 *
 * - `dark` (default): the blue circle mark plus a typeset wordmark, for the
 *   white header.
 * - `light`: the white knockout lockup, for navy surfaces like the footer.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  if (tone === "light") {
    return (
      <Link href="/" aria-label="Resource Room — home" className={cn("inline-block", className)}>
        <Image
          src={whiteLogo}
          alt="The Resource Room"
          priority
          className="h-14 w-auto"
          sizes="245px"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Resource Room — home"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <Image
        src={circleLogo}
        alt=""
        priority
        sizes="44px"
        className="h-11 w-11 shrink-0"
      />
      <span className="flex flex-col leading-none">
        {/* The circle mark already reads "The", so the wordmark stays short —
            it has to sit on one line next to a six-item nav. */}
        <span className="whitespace-nowrap text-lg font-bold tracking-tight text-navy-900">
          Resource Room
        </span>
        <span className="mt-1 whitespace-nowrap text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-brand-600">
          Holly Springs, NC
        </span>
      </span>
    </Link>
  );
}
