import { Button } from "@/components/ui/Button";
import { EditorialBlock } from "@/components/ui/EditorialBlock";
import { founders } from "@/content/home";

export function Founders() {
  return (
    <EditorialBlock image={founders.image.src} alt={founders.image.alt} align="left">
      <p className="eyebrow text-sun-500">Our founders</p>
      <h2 className="display mt-5 text-balance text-4xl sm:text-5xl">{founders.heading}</h2>

      {founders.body.map((paragraph) => (
        <p key={paragraph} className="mt-5 text-base leading-relaxed text-white/75">
          {paragraph}
        </p>
      ))}

      <blockquote className="mt-7 border-l-2 border-sun-500 pl-5 text-base leading-relaxed text-white/85">
        &ldquo;{founders.quote}&rdquo;
        <footer className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-white">
          — {founders.attribution}
        </footer>
      </blockquote>

      <Button href="/about" variant="outline" className="mt-9">
        More about Resource Room
      </Button>
    </EditorialBlock>
  );
}
