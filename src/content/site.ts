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
  /*
   * The domain this site is actually served from.
   *
   * It must match the host in the address bar, because it drives `metadataBase`
   * — and therefore every canonical tag — plus sitemap.xml, robots.txt, llms.txt
   * and every URL inside the JSON-LD. While this said "resourceroomnc.com" the
   * live site at www.resourceroom.com was canonicalising all of its own pages to
   * the old WordPress site, which tells Google the new site is the duplicate.
   *
   * `www` on purpose: the apex 308-redirects to www, so www is the real host.
   */
  url: "https://www.resourceroom.com",
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
  /*
   * There is deliberately no second address here. Resource Room began in one
   * room on Staten Island in 2015 and the old WordPress site listed that
   * address alongside Holly Springs — but the Staten Island business was sold
   * in 2026, so publishing its address would advertise a location Resource
   * Room no longer operates. The origin is told as history on the About page.
   */
  hours: {
    weekdays: "Mon–Fri: 9am–7pm",
    weekend: "Saturday by appointment",
  },
  /** Google Maps embed for the contact page (no API key required). */
  mapEmbedQuery: "2100 Crossway Ln, Holly Springs, NC 27540",
  /**
   * Coordinates for the Holly Springs center, supplied by Joe.
   *
   * Feeds `geo` on the LocalBusiness schema, which is one of the signals
   * Google uses to place a business in the local pack. Kept here rather than
   * inline in the schema because it is business data, not markup.
   */
  geo: { latitude: 35.663466, longitude: -78.835116 },
  /**
   * The blog now lives in this app at /blog. Posts are imported from
   * WordPress by `node scripts/import-wordpress.mjs` — re-run it after Joe
   * publishes.
   */
  blogUrl: "/blog",
  /**
   * Pathways Academy now lives on this site at /programs/pathways-academy.
   *
   * It used to run on its own subdomain, which meant links bounced families
   * onto another domain mid-journey. Kept as a named value so the one-domain
   * decision is stated in one place rather than assumed at each call site.
   */
  pathwaysUrl: "/programs/pathways-academy",
  consultationUrl: "/contact",
} as const;

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.state}`;


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

/**
 * Top navigation — four items, agreed with Joe on the Aug 3 2026 call.
 *
 * It was seven. "Courses" and "IEP & 504 Advocate" both came out: the course
 * catalog is the single biggest source of the overwhelm Joe reported (it lists
 * classes that are not currently running), and IEP advocacy is one program
 * among ten, so it sits under Programs with the rest rather than competing with
 * top-level sections. Neither page is deleted — /courses stays reachable and is
 * kept out of search, and IEP & 504 keeps its program page.
 */
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
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/**
 * How the ten programs are grouped inside the mega menu.
 *
 * Three groups, named by Joe on the Aug 3 2026 call: "tutoring programs, camps,
 * specialized supports". The menu itself he liked as it was — "that programs
 * drop-down header is really nice" — so only the grouping changed:
 *
 *   Academics       -> Tutoring Programs
 *   Daytime & Camps -> STEM Camps   (he wanted "STEM" in front for SEO)
 *   Homeschool Co-Op moved out of camps and into Specialized Support
 *
 * This is presentation only — every entry points at an existing
 * `/programs/[slug]` page.
 */
export const programMenuGroups: { title: string; slugs: string[] }[] = [
  {
    title: "Tutoring Programs",
    slugs: ["tutoring", "sat-act-prep", "college-prep", "executive-functioning"],
  },
  /* Summer Bridge is tutoring that happens over the summer, not a camp. It
     reaches the menu under Tutoring Programs as a child of Tutoring, so listing
     it here as well put the same program in two groups. */
  { title: "STEM Camps", slugs: ["camps"] },
  {
    title: "Specialized Support",
    slugs: ["pathways-academy", "homeschool-co-op", "aba-services", "iep-504-advocate"],
  },
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
