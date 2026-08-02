import { partners } from "@/content/about";
import type { Program } from "@/content/programs";
import { addressLine, site, socials } from "@/content/site";

/**
 * Schema.org builders.
 *
 * These exist for two audiences. Search engines use them for rich results and
 * the local pack; answer engines (AI Overviews, ChatGPT, Perplexity) use them
 * to decide what this business *is* and to lift specific facts — hours, price,
 * grade range, the answer to a question — into a generated response.
 *
 * Deliberately NOT emitted: `aggregateRating` on the organization. Resource
 * Room really does hold 100+ five-star reviews, but self-serving review markup
 * on your own site is against Google's structured data guidelines and risks a
 * manual action. Ratings should come from the Google Business Profile instead,
 * where they are attributable to the reviewers.
 */

const ORG_ID = `${site.url}/#organization`;

/** The organization node every other node points back to. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": ORG_ID,
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    foundingDate: "2015",
    founder: [
      { "@type": "Person", name: "Joe Cuccurullo" },
      { "@type": "Person", name: "Samara Cuccurullo" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    areaServed: [
      "Holly Springs, NC",
      "Apex, NC",
      "Cary, NC",
      "Fuquay-Varina, NC",
      "Raleigh, NC",
      "Wake County, NC",
    ].map((name) => ({ "@type": "Place", name })),
    award: [
      "Holly Springs Business of the Year 2022",
      "Raleigh's Best 2025 Bronze — Educational Services, The News & Observer",
      "Parrish “Ham” Womble Distinguished Service Award, Holly Springs Chamber of Commerce",
    ],
    sameAs: socials.map((social) => social.href),
    knowsAbout: [
      "K-12 tutoring",
      "SAT and ACT preparation",
      "College admissions and essay guidance",
      "Executive functioning coaching",
      "IEP and 504 advocacy",
      "Applied behavior analysis in educational settings",
      "Neurodiverse and autism education",
      "Homeschool co-op instruction",
      "STEAM and robotics education",
    ],
  };
}

/** Programs as an offer catalog, so the full list travels with the org node. */
export function programCatalogSchema(programs: Program[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `${site.name} programs`,
    url: `${site.url}/programs`,
    provider: { "@id": ORG_ID },
    itemListElement: programs.map((program, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: program.name,
        description: program.summary,
        url: `${site.url}/programs/${program.slug}`,
        serviceType: program.category,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Place", name: addressLine },
      },
    })),
  };
}

/**
 * A single program as a Service, plus its FAQ if it has one.
 *
 * The FAQ is the highest-leverage part for answer engines: a question written
 * the way a parent asks it, with a direct answer attached, is exactly the unit
 * an AI Overview lifts.
 */
export function programSchema(program: Program) {
  const url = `${site.url}/programs/${program.slug}`;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: program.name,
    description: program.summary,
    url,
    serviceType: program.category,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Place", name: addressLine },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: program.audience.join("; "),
    },
    ...(program.image ? { image: `${site.url}${program.image.src}` } : {}),
  };

  const faqBlock = program.blocks?.find((block) => block.kind === "faq");
  const faq =
    faqBlock && faqBlock.kind === "faq"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqBlock.items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  /* Published rates, where the program states them. Answer engines quote
     price constantly and will otherwise say "contact for pricing". */
  const pricingBlock = program.blocks?.find((block) => block.kind === "pricing");
  const offers =
    pricingBlock && pricingBlock.kind === "pricing"
      ? pricingBlock.tiers
          .map((tier) => {
            const amount = Number(tier.price.replace(/[^0-9.]/g, ""));
            if (!amount) return null;
            return {
              "@type": "Offer",
              name: tier.name,
              price: amount,
              priceCurrency: "USD",
              url,
              availability: "https://schema.org/InStock",
            };
          })
          .filter(Boolean)
      : [];

  return {
    service: offers.length ? { ...service, offers } : service,
    faq,
  };
}

/** Breadcrumbs, so the SERP shows the path rather than a bare URL. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}

/** The referral network, which supports the E-E-A-T signal on /about. */
export function partnersSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${site.name} preferred partners`,
    url: `${site.url}/about/preferred-partners`,
    itemListElement: partners.map((partner, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: partner.name,
        description: partner.credentials,
        ...(partner.links?.[0]?.href.startsWith("http")
          ? { url: partner.links[0].href }
          : {}),
      },
    })),
  };
}

/** Renders one or more schema objects into a single script tag payload. */
export function jsonLd(...nodes: unknown[]) {
  const present = nodes.filter(Boolean);
  return JSON.stringify(present.length === 1 ? present[0] : present);
}
