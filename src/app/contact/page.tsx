import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/icons";
import { MapEmbed } from "@/components/MapEmbed";
import { PageHero } from "@/components/PageHero";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Section } from "@/components/ui/Section";
import { heroImages, pageHeroes } from "@/content/sections";
import { addressLine, site } from "@/content/site";
import { seoDescription, seoTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: seoTitle("Contact Us", "Holly Springs, NC"),
  description: seoDescription(
    "Schedule a free consultation with Resource Room in Holly Springs, NC. Call 984-777-1244 or send us a note about your student.",
  ),
  alternates: { canonical: "/contact" },
};

const contactMethods = [
  {
    icon: "phone" as const,
    label: "Call us",
    value: site.phone,
    href: site.phoneHref,
  },
  {
    icon: "mail" as const,
    label: "Email us",
    value: site.email,
    href: site.emailHref,
  },
  {
    icon: "pin" as const,
    label: "Visit the center",
    value: addressLine,
    href: `https://maps.google.com/?q=${encodeURIComponent(site.mapEmbedQuery)}`,
  },
];

/*
 * `?returning=1` swaps the form's framing for families who already know us.
 *
 * Read here rather than with useSearchParams in the form: this page is static,
 * and reading the query client-side would force the whole form behind a
 * Suspense boundary for the sake of one heading.
 */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ returning?: string }>;
}) {
  const returning = (await searchParams).returning === "1";

  return (
    <>
      <PageHero {...pageHeroes.contact} image={heroImages.contact} icon="mail" />

      <Section tone="white">
        {/* `min-w-0` on the form column: a grid item defaults to
            min-width:auto, so the <select> — whose intrinsic width comes from
            its longest option, "Track-Out, Summer & Teacher-Workday Camps" —
            stretched the column past the viewport and scrolled the page
            sideways on a phone. */}
        {/* `grid-cols-1` is not cosmetic here. Without it the mobile layout is
            a single implicit `auto` track, which sizes to the widest child's
            min-content — the <select>, whose intrinsic width comes from its
            longest option. `grid-cols-1` compiles to `minmax(0, 1fr)`, which
            caps the track at the container width. */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight text-navy-950">
              {returning ? "Welcome back" : "Send us a message"}
            </h2>
            <p className="mt-2 text-navy-600">
              {returning
                ? "No consultation needed — just tell us who your student is and the days that work, and we will get them back on the schedule."
                : "Tell us a little about your student and we will follow up to schedule your free consultation."}
            </p>
            <div className="mt-8">
              <ContactForm returning={returning} />
            </div>
          </div>

          <div>
            <ul className="space-y-4">
              {contactMethods.map((method) => (
                <li key={method.label}>
                  <a
                    href={method.href}
                    {...(method.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-start gap-4 rounded-card border border-navy-900/10 bg-mist p-6 transition-colors hover:border-navy-900/25 hover:bg-white"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-chip bg-navy-900 text-sun-500">
                      <Icon name={method.icon} className="h-5 w-5" />
                    </span>
                    {/* `min-w-0` + `break-words`: a flex item will not shrink
                        below its longest unbreakable word, and
                        "Learn@ResourceRoomNC.com" is one. Without this the card
                        pushes the page sideways on a narrow screen. */}
                    <span className="min-w-0">
                      <span className="eyebrow block text-brand-500">{method.label}</span>
                      <span className="mt-1.5 block break-words font-semibold text-navy-950">
                        {method.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-card border border-navy-900/10 bg-mist p-6">
              <p className="eyebrow text-brand-500">Hours</p>
              <p className="mt-2 font-semibold text-navy-950">{site.hours.weekdays}</p>
              <p className="mt-1 text-sm text-navy-600">{site.hours.weekend}</p>
              <p className="mt-4 flex items-center gap-2 border-t border-navy-900/10 pt-4 text-sm font-semibold text-navy-800">
                <Icon name="check" className="h-4 w-4 text-brand-500" />
                Free consultations, always
              </p>
            </div>

            {/* The building, above the map. A pin tells someone the address;
                this tells them what to look for when they get there, which is
                the part people actually struggle with in a business park. */}
            <figure className="mt-4 overflow-hidden rounded-card border border-navy-900/10">
              <PhotoSlot
                src={heroImages.about.src}
                alt={heroImages.about.alt}
                icon="pin"
                ratio="3/2"
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="rounded-card"
              />
              {/* No address here. It already appears directly above in "Visit
                  the center" and again on the map below; a third copy in the
                  same column is noise. The caption earns its place by saying
                  the one thing neither of those can. */}
              <figcaption className="border-t border-navy-900/10 bg-mist px-5 py-3 text-sm text-navy-600">
                The entrance is under the green awning.
              </figcaption>
            </figure>

            <div className="mt-4 overflow-hidden rounded-card border border-navy-900/10">
              <MapEmbed query={site.mapEmbedQuery} addressLine={addressLine} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
