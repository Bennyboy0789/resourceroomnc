import Link from "next/link";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { categories } from "@/content/categories";
import { homeSections } from "@/content/sections";

/**
 * "Explore our programs" — the shortcut row directly beneath the hero.
 *
 * It used to point at four hand-picked program pages, which meant the home page
 * advertised one taxonomy and the nav another. It now renders the same four
 * categories as the Programs menu, so this row is the first of the three clicks
 * rather than a shortcut that skips the browse layer.
 */
export function QuickLinks() {
  return (
    <div className="border-b border-navy-950/10 bg-white">
      <Container size="wide">
        <p className="eyebrow border-b border-navy-950/8 py-4 text-brand-500">
          {homeSections.quickLinks.title}
        </p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li
              key={category.slug}
              className="border-b border-navy-950/8 last:border-b-0 sm:border-b-0 sm:border-l sm:border-navy-950/8 sm:first:border-l-0 lg:[&:nth-child(3)]:border-l"
            >
              <Link
                href={`/${category.slug}`}
                className="group flex h-full items-center gap-3 px-1 py-5 transition-colors sm:px-6"
              >
                <Icon
                  name={category.icon}
                  className="h-5 w-5 shrink-0 text-brand-500 transition-colors group-hover:text-navy-950"
                />
                <span className="text-xs font-bold uppercase leading-snug tracking-[0.06em] text-navy-950">
                  {category.label}
                </span>
                <Icon
                  name="arrowRight"
                  className="ml-auto h-4 w-4 shrink-0 text-navy-600 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
