import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/cn";

const tones = {
  navy: "from-navy-800 via-navy-900 to-navy-950 text-gold-400/70",
  gold: "from-gold-400 via-gold-500 to-gold-600 text-white/70",
  brand: "from-brand-500 via-brand-600 to-brand-700 text-white/70",
} as const;

/**
 * Branded stand-in for a photograph.
 *
 * The site ships without photography, so these render as designed gradient
 * panels rather than empty boxes. To use a real photo, replace the component
 * body with a <Image src={...} alt={...} fill className="object-cover" /> —
 * the aspect ratio and rounding stay the same.
 */
export function PhotoSlot({
  icon,
  tone = "navy",
  className,
  ratio = "4/3",
}: {
  icon: IconName;
  tone?: keyof typeof tones;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-2xl bg-gradient-to-br",
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
