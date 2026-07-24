import { Icon } from "@/components/icons";
import { Section, SectionHeading } from "@/components/ui/Section";
import { whyChooseUs } from "@/content/home";

export function WhyChoose() {
  return (
    <Section tone="mist">
      <SectionHeading
        eyebrow="Why families choose us"
        title="Three things that don't"
        accent="change."
        description="Whatever program a student is in, these hold true across all of them."
        align="center"
      />

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {whyChooseUs.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-navy-900/8 bg-white p-7 text-center"
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-50 text-gold-600">
              <Icon name={item.icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-navy-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-navy-600">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
