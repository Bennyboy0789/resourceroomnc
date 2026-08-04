import type { Metadata } from "next";
import { CareersForm } from "@/components/ContactForm";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { pageHeroes } from "@/content/sections";
import { site } from "@/content/site";
import { seoDescription, seoTitle } from "@/lib/seo";

export const metadata: Metadata = {
  /* Leads with the job, not the invitation. "Join Our Team" is the nav label;
     nobody searches it. "Tutoring & Teaching Jobs — Holly Springs, NC" is
     what a candidate actually types, and lands on 60 characters exactly. */
  title: seoTitle("Tutoring & Teaching Jobs", "Holly Springs, NC"),
  description: seoDescription(
    "Resource Room hires licensed educators, tutors, camp instructors and support staff in Holly Springs, NC. Send a resume to Learn@ResourceRoomNC.com.",
  ),
  alternates: { canonical: "/join-our-team" },
};

/*
 * Plain strings. These are visible card headings, not `<title>` tags —
 * running them through `seoTitle()` appended the brand suffix to each one and
 * the page rendered "Camp Instructors | Resource Room" on screen.
 */
const roles = [
  {
    icon: "pencil" as const,
    title: "Tutors & Subject Instructors",
    body: "K-12 across all subjects, including AP Math and AP Science. Licensed teachers and experienced subject specialists.",
  },
  {
    icon: "sun" as const,
    title: "Camp Instructors",
    body: "Track-out, teacher-workday and summer camps built on standards-aligned STEAM curriculum.",
  },
  {
    icon: "heart" as const,
    title: "ABA & Behavioral Support Staff",
    body: "Supporting students inside a structured educational setting, alongside our instructional team.",
  },
  {
    icon: "cap" as const,
    title: "College Prep & Test Prep Specialists",
    body: "SAT and ACT instruction, admissions advisement and essay coaching.",
  },
];

const reasons = [
  {
    icon: "users" as const,
    title: "Small groups, real teaching",
    body: "Sessions are one-to-one or small group. You get to actually teach, not manage a room of thirty.",
  },
  {
    icon: "clock" as const,
    title: "Schedules that work",
    body: "Part-time, full-time, after-school and seasonal camp roles across the year.",
  },
  {
    icon: "badge" as const,
    title: "Educator-led",
    body: "The owners are licensed career educators. Decisions get made by people who have taught.",
  },
];

export default function JoinOurTeamPage() {
  return (
    <>
      <PageHero {...pageHeroes.joinOurTeam}>
        <Button
          href={`${site.emailHref}?subject=${encodeURIComponent("Application — Resource Room")}`}
          size="lg"
        >
          Send us your resume
          <Icon name="arrowRight" className="h-4 w-4" />
        </Button>
      </PageHero>

      <Section tone="white">
        <SectionHeading
          eyebrow="Roles we hire for"
          title="Where you might"
          accent="fit in."
          description="Openings vary through the year. If your background matches one of these, we would like to hear from you even when nothing is posted."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {roles.map((role) => (
            <li
              key={role.title}
              className="flex gap-5 rounded-card border border-navy-900/10 bg-white p-6"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-chip bg-brand-50 text-brand-500">
                <Icon name={role.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-navy-950">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{role.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="mist">
        <SectionHeading
          eyebrow="Why work here"
          title="What the job actually"
          accent="looks like."
          align="center"
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {reasons.map((reason) => (
            <li
              key={reason.title}
              className="rounded-card border border-navy-900/8 bg-white p-7 text-center"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sun-500 text-navy-950">
                <Icon name={reason.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-navy-950">
                {reason.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-navy-600">{reason.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" size="narrow" id="apply">
        <SectionHeading
          eyebrow="Apply"
          title="Ready to"
          accent="apply?"
          description="Please submit the form, and email your resume for consideration. We read every one."
        />
        <div className="mt-10">
          <CareersForm />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-navy-900/10 pt-8 sm:flex-row">
          <Button
            href={`${site.emailHref}?subject=${encodeURIComponent("Application — Resource Room")}`}
            variant="navy"
          >
            <Icon name="mail" className="h-4 w-4" />
            {site.email}
          </Button>
          <Button href={site.phoneHref} variant="quiet">
            <Icon name="phone" className="h-4 w-4" />
            {site.phone}
          </Button>
        </div>
      </Section>
    </>
  );
}
