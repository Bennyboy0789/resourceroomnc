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
  /** Google Maps embed for the contact page (no API key required). */
  mapEmbedQuery: "2100 Crossway Ln, Holly Springs, NC 27540",
  /**
   * The existing WordPress blog. Update if the blog moves to a subdomain
   * or is rebuilt inside this app.
   */
  blogUrl: "https://resourceroomnc.com/blog",
  /** Pathways Academy runs on its own site. */
  pathwaysUrl: "https://pathways.resourceroom.com",
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
  {
    label: "Raleigh's Best 2025 — Bronze",
    detail: "Education category",
  },
];

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  children?: { label: string; href: string; external?: boolean }[];
};

export const navigation: NavLink[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Mission", href: "/about#mission" },
    ],
  },
  {
    label: "All Programs",
    href: "/programs",
    children: [
      { label: "Tutoring", href: "/programs/tutoring" },
      { label: "Camps", href: "/programs/camps" },
      { label: "SAT / ACT Prep", href: "/programs/sat-act-prep" },
      { label: "Pathways Academy", href: "/programs/pathways-academy" },
      { label: "Homeschool Co-Op", href: "/programs/homeschool-co-op" },
      { label: "ABA Services", href: "/programs/aba-services" },
      { label: "College Prep", href: "/programs/college-prep" },
      { label: "IEP & 504 Advocate", href: "/programs/iep-504-advocate" },
    ],
  },
  { label: "IEP & 504 Advocate", href: "/programs/iep-504-advocate" },
  { label: "Contact Us", href: "/contact" },
  { label: "Join Our Team", href: "/join-our-team" },
  { label: "Blog", href: site.blogUrl, external: true },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Programs",
    links: [
      { label: "Tutoring Programs", href: "/programs/tutoring" },
      { label: "Track-Out & Summer Camps", href: "/programs/camps" },
      { label: "SAT / ACT Prep", href: "/programs/sat-act-prep" },
      { label: "College Prep", href: "/programs/college-prep" },
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
      { label: "Join Our Team", href: "/join-our-team" },
      { label: "Blog", href: site.blogUrl, external: true },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export type SocialLink = { label: string; href: string; icon: "facebook" | "instagram" };

/** Update these with the live profile URLs before launch. */
export const socials: SocialLink[] = [
  { label: "Facebook", href: "https://www.facebook.com/resourceroomnc", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/resourceroomnc", icon: "instagram" },
];
