/**
 * Global site content and configuration.
 * Edit here to change contact details, navigation, or award badges site-wide.
 */

export const site = {
  name: "Resource Room",
  legalName: "Resource Room NC",
  tagline: "A Complete Learning Center for Every Student",
  description:
    "From early reading to AP Calculus, summer camps to a private high school, every Resource Room program is built around one student at the center: yours.",
  url: "https://resourceroomnc.com",
  phone: "984-777-1244",
  phoneHref: "tel:+19847771244",
  email: "Learn@ResourceRoomNC.com",
  emailHref: "mailto:Learn@ResourceRoomNC.com",
  address: {
    street: "2100 Crossway Ln",
    city: "Holly Springs",
    state: "NC",
    zip: "27540",
  },
  /**
   * Resource Room started in one room on Staten Island in 2015 and the NY
   * address is still listed on the live site's contact blocks. Programs run out
   * of Holly Springs — this is here so the footer and contact page can show
   * both, the way resourceroomnc.com does.
   */
  nyAddress: {
    street: "534 Forest Ave",
    city: "Staten Island",
    state: "NY",
    zip: "10310",
  },
  hours: {
    weekdays: "Mon–Fri: 9am–7pm",
    weekend: "Saturday by appointment",
  },
  /** Google Maps embed for the contact page (no API key required). */
  mapEmbedQuery: "2100 Crossway Ln, Holly Springs, NC 27540",
  /**
   * The blog now lives in this app at /blog. Posts are imported from
   * WordPress by `node scripts/import-wordpress.mjs` — re-run it after Joe
   * publishes.
   */
  blogUrl: "/blog",
  /** Pathways Academy runs on its own site. */
  pathwaysUrl: "https://pathways.resourceroom.com",
  consultationUrl: "/contact",
} as const;

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.state}`;

export const nyAddressLine = `${site.nyAddress.street}, ${site.nyAddress.city}, ${site.nyAddress.state} ${site.nyAddress.zip}`;

export type Award = {
  label: string;
  detail: string;
  /** Renders the five-star row ahead of the label. */
  stars?: boolean;
};

export const awards: Award[] = [
  {
    label: "100+ Five-Star Reviews",
    detail: "From families across the Triangle",
    stars: true,
  },
  {
    label: "Holly Springs Business of the Year",
    detail: "2022",
  },
];

export type Accolade = {
  label: string;
  /** Official badge artwork, where we hold it. Falls back to an icon. */
  badge?: { src: string; alt: string };
};

/**
 * The full award strip, shown as its own row on the home page. The hero badges
 * above stay at two so the headline keeps its weight; every award the live site
 * claims is listed here.
 */
export const accolades: Accolade[] = [
  {
    label:
      "Winner of the Holly Springs Chamber of Commerce Parrish “Ham” Womble Distinguished Service Award",
  },
  {
    label: "Voted 2025 Raleigh's Best by The News & Observer",
    badge: {
      src: "/images/award-raleighs-best-2025.png",
      alt: "Raleigh's Best 2025 Winner — The News & Observer",
    },
  },
  { label: "Voted 2022 Business of the Year for Holly Springs, NC" },
];

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  /** Opens the full-width program menu instead of a plain dropdown. */
  mega?: boolean;
  children?: { label: string; href: string; external?: boolean }[];
};

export const navigation: NavLink[] = [
  { label: "Programs", href: "/programs", mega: true },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Resource Room Learning Center", href: "/about" },
      { label: "Our Mission", href: "/about#mission" },
      { label: "Preferred Partners", href: "/about/preferred-partners" },
      { label: "Join Our Team", href: "/join-our-team" },
    ],
  },
  { label: "Courses", href: "/courses" },
  { label: "IEP & 504 Advocate", href: "/programs/iep-504-advocate" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/**
 * How the eight programs are grouped inside the mega menu.
 *
 * This is presentation only — every entry points at an existing
 * `/programs/[slug]` page. Grouping the list into columns keeps the menu
 * scannable without inventing browse categories that would need pages of their
 * own to justify.
 */
export const programMenuGroups: { title: string; slugs: string[] }[] = [
  {
    title: "Academics",
    slugs: ["tutoring", "sat-act-prep", "college-prep", "executive-functioning"],
  },
  { title: "Daytime & Camps", slugs: ["camps", "summer-bridge", "homeschool-co-op"] },
  { title: "Specialized Support", slugs: ["pathways-academy", "aba-services", "iep-504-advocate"] },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Programs",
    links: [
      { label: "Tutoring Programs", href: "/programs/tutoring" },
      { label: "Track-Out & Summer Camps", href: "/programs/camps" },
      { label: "SAT / ACT Prep", href: "/programs/sat-act-prep" },
      { label: "College Prep", href: "/programs/college-prep" },
      { label: "Executive Functioning", href: "/programs/executive-functioning" },
      { label: "Summer Bridge", href: "/programs/summer-bridge" },
      { label: "All Programs", href: "/programs" },
    ],
  },
  {
    title: "Specialized Support",
    links: [
      { label: "Pathways Academy", href: "/programs/pathways-academy" },
      { label: "Homeschool Co-Op", href: "/programs/homeschool-co-op" },
      { label: "ABA Services", href: "/programs/aba-services" },
      { label: "IEP & 504 Advocate", href: "/programs/iep-504-advocate" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Mission", href: "/about#mission" },
      { label: "Preferred Partners", href: "/about/preferred-partners" },
      { label: "Join Our Team", href: "/join-our-team" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

export type SocialLink = { label: string; href: string; icon: "facebook" | "instagram" };

/** Confirmed against the links in the live site's footer. */
export const socials: SocialLink[] = [
  { label: "Facebook", href: "https://www.facebook.com/resourceroomnc", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/resourceroomnc/", icon: "instagram" },
];
