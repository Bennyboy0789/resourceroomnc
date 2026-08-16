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

        {/*
          * Stacked on a phone the images are separated by a hairline — `gap-px`
          * over a tinted list — which reads correctly there and is left alone.
          *
          * Once the three sit side by side that same hairline made them one
          * continuous band, so from `md` up the divider is dropped for a real
          * gap and each photograph is capped well short of its column. The
          * container is 110rem wide, so an uncapped third of it runs to about
          * 500px a side and the row becomes a wall of photography.
          */}
        <ul className="mt-14 grid gap-px overflow-hidden bg-navy-950/10 md:grid-cols-3 md:gap-x-10 md:overflow-visible md:bg-transparent">
          {whyChooseUs.map((item, index) => (
            <Reveal key={item.title} as="li" className="bg-mist" delay={stagger(index, 0.1)}>
              <PhotoSlot
                src={item.image.src}
                alt={item.image.alt}
                icon={item.icon}
                ratio="4/3"
                /* Matches the cap below, so the browser stops fetching a 500px
                   render for a 352px slot. */
                sizes="(min-width: 768px) 22rem, 100vw"
                className="rounded-card md:mx-auto md:max-w-[22rem]"
              />
              {/* Capped to the same width as the photograph above it, so the
                  centred copy sits under the image rather than under the
                  column, which on a 110rem container are far apart. */}
              <div className="px-1 py-7 sm:px-6 md:mx-auto md:max-w-[22rem] md:px-0 md:text-center">
                <div className="flex items-center gap-3 md:justify-center">
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
