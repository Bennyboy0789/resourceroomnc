import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { learningCenterPitch } from "@/content/home";

/**
 * The band that sits between the founders and the counters on the live site —
 * the "we are a complete learning center, come say hello" pitch.
 */
export function LearningCenterPitch() {
  return (
    <Section tone="frost" size="narrow">
      <h2 className="display text-balance text-3xl text-navy-950 sm:text-4xl">
        {learningCenterPitch.heading}
      </h2>
      <div className="mt-7 space-y-5">
        {learningCenterPitch.body.map((paragraph) => (
          <p key={paragraph} className="text-lg leading-relaxed text-navy-700">
            {paragraph}
          </p>
        ))}
      </div>
      <Button href={learningCenterPitch.cta.href} variant="navy" size="lg" className="mt-9">
        {learningCenterPitch.cta.label}
      </Button>
    </Section>
  );
}
