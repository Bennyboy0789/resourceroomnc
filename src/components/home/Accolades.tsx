import Image from "next/image";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { accolades } from "@/content/site";
import { stagger } from "@/lib/stagger";

/**
 * The award row on the live home page.
 *
 * The hero carries two badges so the headline keeps its weight; this strip
 * carries the full list, including the Womble Distinguished Service Award,
 * which is too long to sit beside a headline. Awards we hold official artwork
 * for show the badge; the rest fall back to the seal icon.
 */
export function Accolades() {
  return (
    <section className="border-y border-navy-900/10 bg-mist">
      <Container size="wide" className="py-12 sm:py-14">
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {accolades.map((accolade, index) => (
            <Reveal key={accolade.label} as="li" delay={stagger(index, 0.08)}>
              <div className="flex h-full items-center gap-4">
                {accolade.badge ? (
                  <Image
                    src={accolade.badge.src}
                    alt={accolade.badge.alt}
                    width={96}
                    height={78}
                    className="h-16 w-auto shrink-0"
                  />
                ) : (
                  <span className="grid h-12 w-12 shrink-0 place-items-center bg-navy-900 text-sun-400">
                    <Icon name="badge" className="h-6 w-6" />
                  </span>
                )}
                <p className="text-sm font-semibold leading-relaxed text-navy-800">
                  {accolade.label}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
