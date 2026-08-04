import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Reveal } from "@/components/ui/Reveal";
import { stagger } from "@/lib/stagger";
import { SectionHeading } from "@/components/ui/Section";
import { whyChooseUs } from "@/content/home";
import { homeSections } from "@/content/sections";

export function WhyChoose() {
  return (
    <section className="bg-mist py-20 sm:py-24 lg:py-28">
      <Container size="wide">
        <SectionHeading {...homeSections.whyChoose} />

        {/* Edge-to-edge images with the copy underneath — no card chrome, so the
            photography reads as one continuous band across the section. */}
        <ul className="mt-14 grid gap-px overflow-hidden bg-navy-950/10 md:grid-cols-3">
          {whyChooseUs.map((item, index) => (
            <Reveal key={item.title} as="li" className="bg-mist" delay={stagger(index, 0.1)}>
              <PhotoSlot
                src={item.image.src}
                alt={item.image.alt}
                icon={item.icon}
                ratio="4/3"
                sizes="(min-width: 768px) 33vw, 100vw"
                className="rounded-card"
              />
              <div className="px-1 py-7 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tabular-nums text-brand-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon name={item.icon} className="h-5 w-5 text-navy-950" />
                </div>
                <h3 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-navy-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
