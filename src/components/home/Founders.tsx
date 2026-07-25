import { Section } from "@/components/ui/Section";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Button } from "@/components/ui/Button";
import { founders } from "@/content/home";

export function Founders() {
  return (
    <Section tone="white">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          {/* Gold frame, offset behind the photo. Rendered first so the photo
              paints over it where the two overlap. */}
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -left-4 h-full w-full rounded-2xl border-2 border-sun-500/60"
          />
          <PhotoSlot icon="users" tone="navy" ratio="4/3" />
        </div>

        <div>
          <p className="eyebrow text-brand-600">Our founders</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            {founders.heading}
          </h2>
          {founders.body.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-lg leading-relaxed text-navy-600">
              {paragraph}
            </p>
          ))}

          <figure className="mt-8 rounded-2xl border-l-4 border-brand-500 bg-mist p-6">
            <blockquote className="text-base leading-relaxed text-navy-800">
              &ldquo;{founders.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-navy-900">
              — {founders.attribution}
            </figcaption>
          </figure>

          <Button href="/about" variant="quiet" className="mt-8">
            More about Resource Room
          </Button>
        </div>
      </div>
    </Section>
  );
}
