import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { StatsBar } from "@/components/home/StatsBar";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { coreValues, foundingStory, philosophy } from "@/content/about";
import { heroImages, pageHeroes } from "@/content/sections";
import { aboutHighlights, founders, whyChooseUs } from "@/content/home";
import { addressLine, site } from "@/content/site";
import { stagger } from "@/lib/stagger";
import { seoDescription, seoTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: seoTitle("About Us", "Holly Springs Learning Center"),
  description: seoDescription(
    "Resource Room is owned and operated by Joe and Sam, licensed career educators who met teaching in Manhattan, opened in Holly Springs in 2021, and now run one of the Triangle's most complete learning centers.",
  ),
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero {...pageHeroes.about} image={heroImages.about} icon="users">
        <Button href="/contact" size="lg">
          Send Us A Message
        </Button>
      </PageHero>

      <Section tone="white" size="narrow">
        <SectionHeading eyebrow="Our philosophy" title={philosophy.heading} />
        <div className="mt-8 space-y-5">
          {philosophy.body.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-navy-700">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-brand-600">Our founders</p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              {founders.heading}
            </h2>
            {founders.body.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-lg leading-relaxed text-navy-600">
                {paragraph}
              </p>
            ))}
            <figure className="mt-8 rounded-none border-l-4 border-brand-500 bg-mist p-6">
              <blockquote className="leading-relaxed text-navy-800">
                &ldquo;{founders.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-navy-950">
                — {founders.attribution}
              </figcaption>
            </figure>
          </div>

          <div className="relative order-first lg:order-last">
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 h-full w-full rounded-none border-2 border-sun-500/60"
            />
            <PhotoSlot
              src={founders.image.src}
              alt={founders.image.alt}
              icon="users"
              tone="navy"
              ratio="4/3"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section tone="frost" size="narrow">
        <SectionHeading eyebrow="How we got here" title={foundingStory.heading} />
        <div className="mt-8 space-y-5">
          {foundingStory.body.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-navy-700">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section tone="mist" id="mission">
        <SectionHeading
          eyebrow="Our mission"
          title="A top-tier educational experience for"
          accent="learners of all ages."
          description="We build high-quality, personalized programs that help students and families reach their goals — from a second grader learning to read fluently to a senior submitting a college application."
          align="center"
        />

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {whyChooseUs.map((item) => (
            <li key={item.title} className="rounded-none border border-navy-900/8 bg-white p-7">
              <span className="grid h-12 w-12 place-items-center rounded-none bg-navy-900 text-sun-400">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-navy-950">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-navy-600">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="What we stand for" title="Our core" accent="values." />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {coreValues.map((value, index) => (
            <Reveal key={value.title} as="li" delay={stagger(index, 0.06)}>
              <div className="h-full border border-navy-900/8 bg-white p-7">
                <span className="grid h-12 w-12 place-items-center bg-navy-900 text-sun-400">
                  <Icon name={value.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-navy-950">
                  {value.title}
                </h3>
                <p className="mt-2.5 leading-relaxed text-navy-600">{value.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <StatsBar />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="What we do"
              title="A wide offering, one"
              accent="standard."
              description="Every program runs out of our Holly Springs learning center and is staffed by licensed educators."
            />
            <ul className="mt-8 space-y-4">
              {aboutHighlights.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-brand-600" />
                  <div>
                    <h3 className="font-bold tracking-tight text-navy-950">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-navy-600">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-none border border-navy-900/10 bg-mist p-8">
            <p className="eyebrow text-brand-600">Our facility</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-navy-950">
              Holly Springs, NC
            </h3>
            <p className="mt-3 leading-relaxed text-navy-600">
              Our learning center hosts tutoring, camps, test prep and structured daytime programs
              under one roof, serving Holly Springs, Apex, Fuquay-Varina and the greater Raleigh
              area.
            </p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                {/* Holly Springs only. The Staten Island origin is told as
                    history in the founding story above; printed here beside
                    the operating address it reads as a second branch. */}
                <span className="text-navy-700">{addressLine}</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <a href={site.phoneHref} className="font-semibold text-navy-950 hover:underline">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="mail" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <a href={site.emailHref} className="text-navy-700 hover:underline">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
