import Link from "next/link";
import { Icon } from "@/components/icons";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import type { IconName } from "@/components/icons";
import { imagePosition, type ProgramImage } from "@/content/programs";
import { cn } from "@/lib/cn";

/**
 * Image-dominant card: the photograph does the work, the text stays out of the
 * way. Used in rails and grids alike, so the image ratio is caller-controlled.
 *
 * The whole card is one link. The heading sits inside it rather than nesting a
 * second anchor, which keeps a single tab stop per card.
 */
export function ProgramCard({
  href,
  image,
  icon,
  category,
  title,
  body,
  ratio = "3/4",
  tone = "dark",
  external,
  className,
}: {
  href: string;
  image: ProgramImage;
  icon: IconName;
  category: string;
  title: string;
  body?: string;
  ratio?: string;
  /** "dark" is ink on a light section; "light" is ink on a dark section. */
  tone?: "dark" | "light";
  external?: boolean;
  className?: string;
}) {
  const light = tone === "light";

  const content = (
    <>
      <div className="relative overflow-hidden bg-navy-950/5">
        <PhotoSlot
          src={image.src}
          alt={image.alt}
          position={imagePosition(image)}
          icon={icon}
          ratio={ratio}
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 20rem, 78vw"
          className="rounded-none transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute left-0 top-0 bg-white/95 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-navy-950">
          {category}
        </span>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <h3
          className={cn(
            "text-lg font-extrabold uppercase leading-tight tracking-tight",
            light ? "text-white" : "text-navy-950",
          )}
        >
          {title}
        </h3>
        {body ? (
          <p
            className={cn(
              "mt-2.5 flex-1 text-sm leading-relaxed",
              light ? "text-white/65" : "text-navy-600",
            )}
          >
            {body}
          </p>
        ) : null}
        <span
          className={cn(
            "mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em]",
            light ? "text-white" : "text-navy-950",
          )}
        >
          {external ? "Visit site" : "Explore"}
          <Icon
            name={external ? "arrowUpRight" : "arrowRight"}
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </>
  );

  const classes = cn("group flex h-full flex-col", className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
