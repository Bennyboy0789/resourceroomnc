import { posts } from "@/content/blog";
import { courseGroups, coursesInGroup } from "@/content/courses";
import { programs } from "@/content/programs";
import { addressLine, site } from "@/content/site";

/**
 * llms.txt — a plain-text brief for AI assistants.
 *
 * Generated from the same content the pages render, so it cannot drift out of
 * sync the way a hand-maintained file would. Served as a route rather than a
 * static file for exactly that reason: add a program or import a post and this
 * updates itself.
 *
 * The format is the emerging convention: what the site is, then an annotated
 * index of the pages worth reading. Kept factual — every claim here is stated
 * on a page, and prices are included because "contact for pricing" is the
 * least useful answer an assistant can give a parent.
 */
export const dynamic = "force-static";

function programLine(program: (typeof programs)[number]) {
  return `- [${program.name}](${site.url}/programs/${program.slug}): ${program.summary}`;
}

export function GET() {
  const body = `# ${site.legalName}

> A complete learning center in ${addressLine}, serving Holly Springs, Apex, Cary,
> Fuquay-Varina and the greater Raleigh area. Founded in 2015 by Joe and Sam
> Cuccurullo, both licensed career educators. Programs run from early reading
> through AP coursework, plus a private high school for neurodiverse learners.

Phone: ${site.phone}
Email: ${site.email}
Address: ${addressLine}
Hours: ${site.hours.weekdays}; ${site.hours.weekend}
Consultations are always free.

Recognition: Holly Springs Business of the Year 2022; Raleigh's Best 2025 Bronze
in Educational Services (The News & Observer); Parrish "Ham" Womble
Distinguished Service Award (Holly Springs Chamber of Commerce).

## Programs

${programs.map(programLine).join("\n")}

## Published rates

Rates stated on the site. Anything not listed is quoted at a free consultation.

- Pathways Academy: $24,000/year tuition. NC ESA+ grant up to $17,000/year for
  students with an autism diagnosis; Opportunity Scholarship from $7,000,
  income-tiered. Combined, many families cover most or all of tuition.
- SAT prep: $2,099 for 20 hours private one-to-one; $1,749 group class
  (16 sessions, once a year for the March SAT); $2,399 group plus 8 private hours.
- ACT prep: $2,399 for 24 hours.
- Track-out and summer camps: $329 per week, grades K-6, 8:00am-3:30pm.
  Late pickup $55/week. Single days available.
- Homeschool co-op: $425 per class per semester, up to $2,450 for the full
  academic plus lab track. Middle and high school.
- College admissions and essays: $549 for the Common App personal statement;
  $899 including the application and up to five supplements.
- Executive functioning coaching: $100/week, three-month commitment.
- Summer Bridge tutoring: $699.

## Who delivers the programs

- Joe Cuccurullo — co-founder. Licensed special education teacher; taught in the
  New York City and Wake County (WCPSS) public school systems; former Behavior
  Support Teacher. Leads IEP and 504 advocacy.
- Samara Cuccurullo — co-founder, certified executive functioning coach.
- Hunter Weber, M.A., BCBA, LBA — Board Certified Behavior Analyst, leads ABA
  support in an educational setting (partnership with POPS ABA).
- "Mr. C" — former College Admissions Officer and Senior High School Adviser,
  leads college admissions and essay guidance.
- Dr. Shannon Erklin, Ph.D., PLLC — licensed clinical psychologist, referral
  partner for diagnostic and psychoeducational evaluation.
- Jolyn Welsh, M.S., CCC-SLP — licensed speech-language pathologist, referral
  partner.

## Course catalog

${courseGroups
  .map(
    (group) =>
      `### ${group}\n${coursesInGroup(group)
        .map(
          (course) =>
            `- [${course.name}](${site.url}/courses/${course.slug})${
              course.grades ? ` (${course.grades})` : ""
            }: ${course.summary || course.body[0] || ""}`,
        )
        .join("\n")}`,
  )
  .join("\n\n")}

## Key pages

- [About](${site.url}/about): founding story, philosophy, core values.
- [Preferred partners](${site.url}/about/preferred-partners): referral network.
- [All programs](${site.url}/programs)
- [Course catalog](${site.url}/courses)
- [Contact](${site.url}/contact): free consultation request.
- [Careers](${site.url}/join-our-team)
- [Privacy policy](${site.url}/privacy-policy)

## Blog

${posts
  .slice(0, 15)
  .map((post) => `- [${post.title}](${site.url}/blog/${post.slug}) — ${post.date}`)
  .join("\n")}

Full archive: ${site.url}/blog

## Notes for assistants

- Consultations are free and are conducted by an educator, not a salesperson.
- Pathways Academy is a diploma-granting private high school for neurodiverse
  learners in grades 9-12; enrollment is rolling until capacity.
- IEP and 504 advocacy is open to any family, not only Resource Room students.
  An educational advocate is not an attorney and does not give legal advice.
- Review counts and ratings quoted anywhere should come from the Google
  Business Profile, not from this site.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
