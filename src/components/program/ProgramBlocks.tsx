import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { FilterableSchedule } from "@/components/program/FilterableSchedule";
import { PhotoCarousel } from "@/components/program/PhotoCarousel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import {
  imagePosition,
  type PricingTier,
  type ProgramBlock,
  type ProgramImage,
  type ScheduleGroup,
} from "@/content/programs";
import { cn } from "@/lib/cn";
import { stagger } from "@/lib/stagger";

/**
 * Renders a program page's long-form sections.
 *
 * The live program pages each have a different anatomy — a tuition table here,
 * a track-out calendar there, an FAQ on most — so the content files describe
 * them as an ordered list of blocks and this walks it. Section tones alternate
 * automatically so a page never has to hard-code its own rhythm.
 */

const TONES = ["white", "frost", "mist"] as const;

export function ProgramBlocks({
  blocks,
  accent,
}: {
  blocks: ProgramBlock[];
  accent: "sun" | "blue";
}) {
  /* A gallery with no pictures yet would otherwise render as a heading over
     empty space, and would take a tone out of the alternating sequence on the
     way past. Dropped before anything is laid out. */
  const visible = blocks.filter((block) => block.kind !== "gallery" || block.photos.length > 0);

  return (
    <>
      {visible.map((block, index) => (
        <Section key={`${block.kind}-${block.title}`} tone={TONES[index % TONES.length]}>
          <SectionHeading
            eyebrow={block.eyebrow}
            title={block.title}
            accent={block.accent}
            description={block.description}
          />
          <div className="mt-12">
            <Block block={block} accent={accent} />
          </div>
        </Section>
      ))}
    </>
  );
}

function Block({ block, accent }: { block: ProgramBlock; accent: "sun" | "blue" }) {
  switch (block.kind) {
    case "prose":
      return <Prose body={block.body} image={block.image} wide={block.wide} />;
    case "links":
      return <Links links={block.links} wide={block.wide} accent={accent} />;
    case "cards":
      return <Cards cards={block.cards} wide={block.wide} accent={accent} note={block.note} />;
    case "steps":
      return <Steps steps={block.steps} accent={accent} />;
    case "pricing":
      return <Pricing tiers={block.tiers} note={block.note} accent={accent} />;
    case "person":
      return <Person block={block} accent={accent} />;
    case "schedule":
      return (
        <Schedule
          groups={block.groups}
          note={block.note}
          filters={block.filters}
          bookHref={block.bookHref}
          bookLabel={block.bookLabel}
        />
      );
    case "gallery":
      return <PhotoCarousel photos={block.photos} />;
    case "video":
      return <Videos videos={block.videos} vertical={block.vertical} />;
    case "checklist":
      return <Checklist items={block.items} />;
    case "dates":
      return <Dates items={block.items} note={block.note} accent={accent} />;
    case "faq":
      return <Faq items={block.items} />;
  }
}

/** Gold on sun-accented programs, blue on the rest. */
function chipClass(accent: "sun" | "blue") {
  return accent === "sun" ? "bg-sun-500 text-navy-950" : "bg-brand-50 text-brand-500";
}

function Prose({ body, image, wide }: { body: string[]; image?: ProgramImage; wide?: boolean }) {
  const copy = (
    <div
      className={cn("space-y-5", !image && !wide && "max-w-3xl", wide && "sm:columns-2 sm:gap-10")}
    >
      {body.map((paragraph, index) => (
        <Reveal key={paragraph} delay={stagger(index, 0.06)}>
          <p className="text-lg leading-relaxed text-navy-700">{paragraph}</p>
        </Reveal>
      ))}
    </div>
  );

  if (!image) return copy;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
      {copy}
      <div className="order-first lg:order-last lg:sticky lg:top-28">
        <PhotoSlot
          src={image.src}
          alt={image.alt}
          position={imagePosition(image)}
          icon="users"
          ratio="4/5"
          sizes="(min-width: 1024px) 30vw, 100vw"
        />
      </div>
    </div>
  );
}

function Cards({
  cards,
  wide,
  accent,
  note,
}: {
  cards: { title: string; body: string; icon?: IconName }[];
  wide?: boolean;
  accent: "sun" | "blue";
  note?: string;
}) {
  return (
    <>
    <ul className={cn("grid gap-5", wide ? "md:grid-cols-2" : "md:grid-cols-3")}>
      {cards.map((card, index) => (
        <Reveal key={card.title} as="li" delay={stagger(index, 0.06)}>
          <div className="h-full rounded-card border border-navy-900/8 bg-white p-7">
            {card.icon ? (
              <span
                className={cn("grid h-11 w-11 place-items-center rounded-chip", chipClass(accent))}
              >
                <Icon name={card.icon} className="h-5 w-5" />
              </span>
            ) : null}
            <h3
              className={cn(
                "text-lg font-bold tracking-tight text-navy-950",
                card.icon ? "mt-5" : "",
              )}
            >
              {card.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-navy-600">{card.body}</p>
          </div>
        </Reveal>
      ))}
    </ul>
    {note ? (
      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-navy-500">{note}</p>
    ) : null}
    </>
  );
}

/**
 * The card shell of `Cards`, wrapped in an anchor.
 *
 * The whole card is the link rather than a button inside it — a 44px target on
 * a phone instead of a 100px one, and one anchor per destination rather than
 * two competing for the same anchor text.
 */
function Links({
  links,
  wide,
  accent,
}: {
  links: { title: string; body: string; href: string; icon?: IconName; external?: boolean }[];
  wide?: boolean;
  accent: "sun" | "blue";
}) {
  return (
    <ul className={cn("grid gap-5", wide ? "md:grid-cols-2" : "md:grid-cols-3")}>
      {links.map((link, index) => {
        // Matches Button: an absolute URL skips the client-side router.
        const offsite = link.external || link.href.startsWith("http");

        const body = (
          <>
            {link.icon ? (
              <span
                className={cn("grid h-11 w-11 place-items-center rounded-chip", chipClass(accent))}
              >
                <Icon name={link.icon} className="h-5 w-5" />
              </span>
            ) : null}
            <h3
              className={cn(
                "flex items-start gap-2 text-lg font-bold tracking-tight text-navy-950 transition-colors duration-300 group-hover:text-brand-500",
                link.icon ? "mt-5" : "",
              )}
            >
              {link.title}
              <Icon
                name={offsite ? "arrowUpRight" : "arrowRight"}
                className="mt-1 h-4 w-4 shrink-0 text-brand-500 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-navy-600">{link.body}</p>
          </>
        );

        const classes =
          "group block h-full rounded-card border border-navy-900/8 bg-white p-7 transition-colors duration-300 hover:border-brand-500/40 hover:bg-brand-50/40";

        return (
          <Reveal key={link.href} as="li" delay={stagger(index, 0.06)}>
            {offsite ? (
              <a href={link.href} className={classes} target="_blank" rel="noopener noreferrer">
                {body}
              </a>
            ) : (
              <Link href={link.href} className={classes}>
                {body}
              </Link>
            )}
          </Reveal>
        );
      })}
    </ul>
  );
}

function Steps({
  steps,
  accent,
}: {
  steps: { title: string; body: string; note?: string }[];
  accent: "sun" | "blue";
}) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <Reveal key={step.title} as="li" delay={stagger(index, 0.06)}>
          <div className="flex gap-5 rounded-card border border-navy-900/8 bg-white p-6 sm:gap-7 sm:p-7">
            <span
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-chip text-sm font-bold tabular-nums",
                chipClass(accent),
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-bold tracking-tight text-navy-950">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-navy-600">{step.body}</p>
              {step.note ? (
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-brand-500">
                  {step.note}
                </p>
              ) : null}
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

function Pricing({
  tiers,
  note,
  accent,
}: {
  tiers: PricingTier[];
  note?: string;
  accent: "sun" | "blue";
}) {
  // Single-tier blocks would stretch a lone card across the full width, so they
  // get a narrower column of their own.
  const columns =
    tiers.length === 1
      ? "max-w-xl"
      : tiers.length === 2
        ? "grid gap-5 md:grid-cols-2"
        : tiers.length >= 5
          ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          : "grid gap-5 md:grid-cols-3";

  return (
    <>
      <div className={columns}>
        {tiers.map((tier, index) => (
          <Reveal key={tier.name} delay={stagger(index, 0.06)}>
            <div
              className={cn(
                "flex h-full flex-col border bg-white p-7",
                tier.featured ? "border-navy-900 shadow-sm" : "border-navy-900/8",
              )}
            >
              {tier.badge ? (
                <p
                  className={cn(
                    "mb-4 inline-flex w-fit px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em]",
                    chipClass(accent),
                  )}
                >
                  {tier.badge}
                </p>
              ) : null}

              <h3 className="text-base font-bold tracking-tight text-navy-950">{tier.name}</h3>

              <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                {tier.wasPrice ? (
                  <span className="text-lg text-navy-500 line-through">{tier.wasPrice}</span>
                ) : null}
                <span className="display text-4xl text-navy-950">{tier.price}</span>
                {tier.cadence ? (
                  <span className="text-sm font-medium text-navy-500">{tier.cadence}</span>
                ) : null}
              </p>

              {tier.meta ? (
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{tier.meta}</p>
              ) : null}

              <ul className="mt-6 space-y-3 border-t border-navy-900/8 pt-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-relaxed text-navy-700">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {tier.note ? (
                <p className="mt-6 border-t border-navy-900/8 pt-5 text-xs leading-relaxed text-navy-500">
                  {tier.note}
                </p>
              ) : null}

              {/* Every tier carries its own action. Without one, a family
                  reading a $2,099 package has to scroll to the bottom of the
                  page to do anything about it — and the live site put a
                  "Book a Free Consultation" button on each card. `mt-auto`
                  keeps the buttons on a shared baseline across the row. */}
              <div className="mt-auto pt-6">
                <Button
                  href={tier.cta?.href ?? "/contact"}
                  variant={tier.featured ? "navy" : "quiet"}
                  className="w-full"
                >
                  {tier.cta?.label ?? "Book a Free Consultation"}
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {note ? <p className="mt-8 max-w-3xl text-sm leading-relaxed text-navy-500">{note}</p> : null}
    </>
  );
}

function Person({
  block,
  accent,
}: {
  block: Extract<ProgramBlock, { kind: "person" }>;
  accent: "sun" | "blue";
}) {
  return (
    <div className="rounded-card border border-navy-900/10 bg-white p-8 sm:p-10">
      {/* With a portrait the block runs as photo-beside-text; without one the
          copy takes the full width rather than leaving a gap. */}
      <div className={cn("grid gap-8", block.image && "lg:grid-cols-[0.9fr_1.6fr] lg:gap-12")}>
        {block.image ? (
          <div className="lg:sticky lg:top-28 lg:self-start">
            <PhotoSlot
              src={block.image.src}
              alt={block.image.alt}
              position={imagePosition(block.image)}
              icon="users"
              tone={accent === "sun" ? "sun" : "brand"}
              ratio="4/5"
              sizes="(min-width: 1024px) 30vw, 100vw"
            />
          </div>
        ) : null}

        <div className="min-w-0">
          <p className="text-2xl font-bold tracking-tight text-navy-950">{block.name}</p>
          <p className="mt-1.5 text-sm font-semibold text-brand-500">{block.credentials}</p>

          <div className={cn("mt-6 grid gap-8", !block.image && "lg:grid-cols-[1.2fr_0.8fr]")}>
            <div className="space-y-4">
              {block.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-navy-700">
                  {paragraph}
                </p>
              ))}
            </div>

            {block.bullets?.length ? (
              <ul className="space-y-3 self-start border-l-4 border-navy-900/10 pl-6">
                {block.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-navy-700">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      {block.summary ? (
        <p
          className={cn(
            "mt-8 border-l-4 p-6 leading-relaxed text-navy-800",
            accent === "sun" ? "border-sun-500 bg-sun-50/60" : "border-brand-500 bg-mist",
          )}
        >
          {block.summary}
        </p>
      ) : null}
    </div>
  );
}

function Schedule({
  groups,
  note,
  filters,
  bookHref,
  bookLabel,
}: {
  groups: Extract<ProgramBlock, { kind: "schedule" }>["groups"];
  note?: string;
  filters?: Extract<ProgramBlock, { kind: "schedule" }>["filters"];
  bookHref?: string;
  bookLabel?: string;
}) {
  const cards = groups.map((group, index) => (
    <ScheduleCard key={group.title} group={group} index={index} bookHref={bookHref} />
  ));

  return (
    <>
      {filters ? (
        <FilterableSchedule groups={groups} allLabel={filters.allLabel}>
          {cards}
        </FilterableSchedule>
      ) : (
        <div
          className={cn(
            "grid gap-5",
            groups.length > 1 && "sm:grid-cols-2",
            groups.length > 4 && "lg:grid-cols-3",
          )}
        >
          {cards}
        </div>
      )}

      {note ? <p className="mt-8 max-w-3xl text-sm leading-relaxed text-navy-500">{note}</p> : null}

      {bookHref ? (
        <div className="mt-8">
          <Button href={bookHref} size="lg">
            {bookLabel ?? "Book now"}
            <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </>
  );
}

function ScheduleCard({
  group,
  index,
  bookHref,
}: {
  group: ScheduleGroup;
  index: number;
  bookHref?: string;
}) {
  return (
    <Reveal delay={stagger(index % 6, 0.04)}>
      <div className="h-full rounded-card border border-navy-900/8 bg-white p-6">
        <h3 className="text-base font-bold tracking-tight text-navy-950">{group.title}</h3>
        {group.subtitle ? <p className="mt-1 text-sm text-navy-500">{group.subtitle}</p> : null}

        <dl className="mt-5 space-y-3.5">
          {group.rows.map((row) => (
            <div
              key={`${row.label}-${row.value}`}
              className="border-t border-navy-900/8 pt-3.5 first:border-t-0 first:pt-0"
            >
              {/* The link lives inside the `dt` rather than wrapping the row:
                  a `dl` may only hold `dt`/`dd` (or a `div` of them), so an
                  anchor around the pair would be invalid. `dt` takes flow
                  content, so the date itself becomes the link. */}
              <dt className="text-xs font-bold uppercase tracking-[0.06em] text-navy-500">
                {bookHref ? (
                  <Link
                    href={bookHref}
                    className="group inline-flex min-h-11 items-center gap-1.5 text-brand-500 transition-colors hover:text-brand-600"
                  >
                    {row.label}
                    <Icon
                      name="arrowRight"
                      className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                    <span className="sr-only"> — book this week</span>
                  </Link>
                ) : (
                  row.label
                )}
              </dt>
              <dd
                className={cn(
                  "text-sm leading-relaxed text-navy-800",
                  /* The link already carries a 44px touch target, which is
                     its own top margin. */
                  bookHref ? "-mt-1.5" : "mt-1",
                )}
              >
                {row.value}
              </dd>
              {row.note ? (
                <dd className="mt-1 text-sm leading-relaxed text-navy-500">{row.note}</dd>
              ) : null}
            </div>
          ))}
        </dl>

        {group.note ? (
          <p className="mt-5 border-t border-navy-900/8 pt-4 text-xs leading-relaxed text-brand-500">
            {group.note}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}

/**
 * YouTube embeds.
 *
 * Served from youtube-nocookie.com, which holds off on the tracking cookie
 * until someone actually presses play, and deferred with `loading="lazy"` so
 * the player only downloads once the reader has scrolled near it. Two eager
 * embeds is about a megabyte of third-party JavaScript charged to a phone
 * that may never reach this far down the page.
 *
 * `rel=0` keeps the end screen on this channel rather than offering up a
 * competitor's camp.
 */
function Videos({
  videos,
  vertical,
}: {
  videos: { id: string; title: string }[];
  vertical?: boolean;
}) {
  return (
    <ul className={cn("grid gap-6", videos.length > 1 && "sm:grid-cols-2")}>
      {videos.map((video, index) => (
        <Reveal
          key={video.id}
          as="li"
          delay={stagger(index, 0.08)}
          /* Shorts are tall. Left full-width they tower over everything else
             on the page, so they are capped and centred in their column. */
          className={vertical ? "mx-auto w-full max-w-[330px]" : "w-full"}
        >
          <div
            className={cn(
              "overflow-hidden rounded-card bg-navy-950 shadow-lg",
              vertical ? "aspect-[9/16]" : "aspect-video",
            )}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
              title={video.title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item, index) => (
        <Reveal key={item} as="li" delay={stagger(index, 0.04)}>
          <div className="flex h-full gap-4 rounded-card border border-navy-900/8 bg-white p-5 text-sm leading-relaxed text-navy-700">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
            {item}
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

function Dates({
  items,
  note,
  accent,
}: {
  items: { date: string; note: string }[];
  note?: string;
  accent: "sun" | "blue";
}) {
  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.date} as="li" delay={stagger(index, 0.04)}>
            <div className="flex h-full flex-col rounded-card border border-navy-900/8 bg-white p-6">
              <span className={cn("grid h-9 w-9 place-items-center rounded-chip", chipClass(accent))}>
                <Icon name="clock" className="h-4 w-4" />
              </span>
              <p className="mt-4 text-base font-bold tracking-tight text-navy-950">{item.date}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{item.note}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      {note ? <p className="mt-8 max-w-3xl text-sm leading-relaxed text-navy-500">{note}</p> : null}
    </>
  );
}

/**
 * FAQ accordion, running the full section width in two columns from `lg`.
 *
 * These lists get long — the advocacy page carries six questions and the SAT
 * page seven — and a single narrow column left most of the section empty while
 * pushing the last question far down the page. Splitting the items in half
 * rather than using CSS columns keeps each `<details>` intact: a column break
 * through an open answer would separate it from its question.
 *
 * Each question is an `<h3>` inside the `<summary>`, not bare text. The
 * FAQPage schema already declared these as questions, but nothing in the
 * document structure agreed: passage extraction and AI answer engines lean on
 * heading hierarchy, and a question sitting in a `<summary>` is invisible to
 * that. A heading is valid inside `<summary>`, and it also gives screen-reader
 * users the questions in their heading list.
 */
function Faq({ items }: { items: { q: string; a: string }[] }) {
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  return (
    <div className="grid gap-x-12 lg:grid-cols-2">
      {columns.map((column, index) =>
        column.length ? (
          <div
            key={index}
            className="divide-y divide-navy-900/10 border-t border-navy-900/10 last:border-b lg:border-b"
          >
            {column.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-bold tracking-tight text-navy-950">{item.q}</h3>
                  <Icon
                    name="chevronDown"
                    className="mt-1 h-4 w-4 shrink-0 text-brand-500 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="pb-6 leading-relaxed text-navy-600">{item.a}</p>
              </details>
            ))}
          </div>
        ) : null,
      )}
    </div>
  );
}
