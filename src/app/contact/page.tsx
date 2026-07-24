import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/ui/Section";
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
      <PageHero
        eyebrow="Contact us"
        title="Schedule a free"
        accent="consultation."
        description="Tell us where your student is and where you want them to be. The first conversation is free, and it is with an educator — not a salesperson."
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy-900">Send us a note</h2>
            <p className="mt-2 text-navy-600">
              Fill this in and we will follow up to schedule your consultation.
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
                    className="flex items-start gap-4 rounded-2xl border border-navy-900/10 bg-mist p-6 transition-colors hover:border-navy-900/25 hover:bg-white"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-400">
                      <Icon name={method.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="eyebrow block text-brand-600">{method.label}</span>
                      <span className="mt-1.5 block font-semibold text-navy-900">
                        {method.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 overflow-hidden rounded-2xl border border-navy-900/10">
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
