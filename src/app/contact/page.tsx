import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/ui/Section";
import { heroImages, pageHeroes } from "@/content/sections";
import { addressLine, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Schedule a free consultation with Resource Room in Holly Springs, NC. Call 984-777-1244 or send us a note about your student.",
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

export default function ContactPage() {
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
            <h2 className="text-2xl font-bold tracking-tight text-navy-950">Send us a message</h2>
            <p className="mt-2 text-navy-600">
              Tell us a little about your student and we will follow up to schedule your free
              consultation.
            </p>
            <div className="mt-8">
              <ContactForm />
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
                    className="flex items-start gap-4 rounded-none border border-navy-900/10 bg-mist p-6 transition-colors hover:border-navy-900/25 hover:bg-white"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-none bg-navy-900 text-sun-400">
                      <Icon name={method.icon} className="h-5 w-5" />
                    </span>
                    {/* `min-w-0` + `break-words`: a flex item will not shrink
                        below its longest unbreakable word, and
                        "Learn@ResourceRoomNC.com" is one. Without this the card
                        pushes the page sideways on a narrow screen. */}
                    <span className="min-w-0">
                      <span className="eyebrow block text-brand-600">{method.label}</span>
                      <span className="mt-1.5 block break-words font-semibold text-navy-950">
                        {method.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-none border border-navy-900/10 bg-mist p-6">
              <p className="eyebrow text-brand-600">Hours</p>
              <p className="mt-2 font-semibold text-navy-950">{site.hours.weekdays}</p>
              <p className="mt-1 text-sm text-navy-600">{site.hours.weekend}</p>
              <p className="mt-4 flex items-center gap-2 border-t border-navy-900/10 pt-4 text-sm font-semibold text-navy-800">
                <Icon name="check" className="h-4 w-4 text-brand-600" />
                Free consultations, always
              </p>
            </div>

            <div className="mt-4 overflow-hidden rounded-none border border-navy-900/10">
              <iframe
                title={`Map to Resource Room at ${addressLine}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  site.mapEmbedQuery,
                )}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full border-0"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
