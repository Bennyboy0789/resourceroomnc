import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/home/FinalCta";
import { PageHero } from "@/components/PageHero";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { courseGroups, courses, coursesInGroup } from "@/content/courses";
import { heroImages, pageHeroes } from "@/content/sections";
import { formatPrice, groupIcon } from "@/lib/courses";
import { stagger } from "@/lib/stagger";
import { seoDescription, seoTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: seoTitle("Course Catalog", "Holly Springs, NC"),
  description: seoDescription(
    "Every Resource Room course: STEAM and robotics, drones, 3D design, LEGO, Minecraft and Scratch, emerging-learner classes, workshops, and tutoring add-ons in Holly Springs, NC.",
  ),
  alternates: { canonical: "/courses" },
};

export default function CoursesPage() {
  return (
    <>
      <PageHero
        {...pageHeroes.courses}
        image={heroImages.courses}
        icon="sparkle"
        breadcrumb={{ label: "All programs", href: "/programs" }}
      />

      <Section tone="white" size="wide">
        <nav aria-label="Course groups" className="flex flex-wrap gap-2">
          {courseGroups.map((group) => (
            <a
              key={group}
              href={`#${groupAnchor(group)}`}
              className="inline-flex min-h-11 items-center border border-navy-900/20 px-4 text-xs font-bold uppercase tracking-[0.08em] text-navy-700 transition-colors hover:border-navy-900/50 hover:text-navy-950"
            >
              {group}
              <span className="ml-2 text-navy-500">{coursesInGroup(group).length}</span>
            </a>
          ))}
        </nav>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-navy-600">
          {courses.length} courses across {courseGroups.length} groups. Courses without a listed
          rate are quoted at your free consultation.
        </p>
      </Section>

      {courseGroups.map((group, groupIndex) => (
        <Section
          key={group}
          id={groupAnchor(group)}
          tone={groupIndex % 2 === 0 ? "mist" : "white"}
          size="wide"
        >
          <SectionHeading eyebrow={`${coursesInGroup(group).length} courses`} title={group} />

          {/* Two columns from the smallest screen up. A catalog is for
              scanning, and one full-width square tile per course made 24
              courses a twenty-screen scroll on a phone. */}
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {coursesInGroup(group).map((course, index) => (
              <Reveal key={course.slug} as="li" delay={stagger(index % 4, 0.07)}>
                <article className="group h-full">
                  {/* Redundant with the heading link below; hidden from the
                      a11y tree so it is not a second, nameless link. */}
                  <Link
                    href={`/courses/${course.slug}`}
                    aria-hidden="true"
                    tabIndex={-1}
                    className="block overflow-hidden"
                  >
                    <PhotoSlot
                      src={course.image ?? undefined}
                      alt={course.imageAlt}
                      icon={groupIcon(group)}
                      ratio="1/1"
                      position="top"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="rounded-none transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>
                  <p className="mt-4 flex flex-wrap items-center gap-x-3 text-xs font-bold uppercase tracking-[0.08em] text-brand-600">
                    {course.grades ? <span>{course.grades}</span> : null}
                    {course.price ? (
                      <span className="text-navy-950">{formatPrice(course.price)}</span>
                    ) : null}
                  </p>
                  <h3 className="mt-2 text-base font-bold leading-snug tracking-tight text-navy-950">
                    <Link href={`/courses/${course.slug}`} className="hover:text-brand-700">
                      {course.name}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-600">
                    {course.summary}
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </Section>
      ))}

      <FinalCta />
    </>
  );
}

function groupAnchor(group: string) {
  return group.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
