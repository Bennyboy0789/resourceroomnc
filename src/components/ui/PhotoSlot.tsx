import Image from "next/image";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

const tones = {
  navy: "from-navy-800 via-navy-900 to-navy-950 text-sun-500/70",
  /* Yellow panel carries a dark icon rather than a light one. */
  sun: "from-sun-200 via-sun-500 to-sun-700 text-navy-900/50",
  brand: "from-brand-400 via-brand-500 to-brand-600 text-white/70",
} as const;

/**
 * A photograph, or a branded gradient panel when no photo exists yet.
 *
 * Pass `src`/`alt` to render the real image; without them the component falls
 * back to the designed placeholder so a missing asset never leaves an empty box.
 *
 * `position` matters for the square product tiles: they carry their title in the
 * top third, so cropping them into a wide slot has to keep the top edge.
 */
export function PhotoSlot({
  src,
  alt,
  icon,
  tone = "navy",
  className,
  ratio = "4/3",
  position = "center",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
}: {
  src?: string;
  alt?: string;
  icon: IconName;
  tone?: keyof typeof tones;
  className?: string;
  ratio?: string;
  position?: "top" | "center";
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div
        style={{ aspectRatio: ratio }}
        className={cn(
          "relative isolate w-full overflow-hidden bg-navy-900/5",
          className,
        )}
      >
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", position === "top" ? "object-top" : "object-center")}
        />
      </div>
    );
  }

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cn(
        "relative isolate w-full overflow-hidden bg-gradient-to-br",
        tones[tone],
        className,
      )}
    >
      {/* Soft dot texture so the panel reads as a designed surface. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <Icon
        name={icon}
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 opacity-70"
        strokeWidth={1}
      />
    </div>
  );
}
