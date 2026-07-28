import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center sm:py-32">
      <p className="eyebrow text-brand-600">404</p>
      <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-navy-950 sm:text-5xl">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-navy-600">
        The link may be out of date. Try our programs, or get in touch and we will point you the
        right way.
      </p>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/programs" size="lg">
          Browse all programs
        </Button>
        <Button href="/contact" variant="quiet" size="lg">
          Contact us
        </Button>
      </div>
    </Container>
  );
}
