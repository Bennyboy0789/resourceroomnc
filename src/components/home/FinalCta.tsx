import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { finalCta } from "@/content/home";
import { site } from "@/content/site";

export function FinalCta({
  heading = finalCta.heading,
  body = finalCta.body,
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden="true"
        className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-sun-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl"
      />

      <Container className="relative py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">{body}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/contact" size="lg">
            Schedule a Free Consultation
          </Button>
          <Button href={site.phoneHref} variant="outline" size="lg">
            <Icon name="phone" className="h-4 w-4" />
            {site.phone}
          </Button>
        </div>
      </Container>
    </section>
  );
}
