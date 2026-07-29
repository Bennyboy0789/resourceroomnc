import { Icon } from "@/components/icons";
import { VariantPicker } from "@/components/shop/VariantPicker";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getProductsForProgram } from "@/lib/catalog";
import { site } from "@/content/site";

/**
 * Enrollment options for a program, if it has any.
 *
 * Renders nothing when the program has no products in Stripe. Several programs
 * genuinely have none — IEP advocacy, ABA support, Pathways and one-to-one
 * tutoring were all "external" products in the old store, meaning they were
 * never bought online and always started with a conversation. Those pages keep
 * their consultation call to action instead.
 */
export async function EnrollmentSection({ programSlug }: { programSlug: string }) {
  const products = await getProductsForProgram(programSlug);
  if (!products.length) return null;

  return (
    <Section tone="frost" id="enroll">
      <SectionHeading
        eyebrow="Enroll"
        title="Reserve your"
        accent="place."
        description="Choose your options below. Checkout is handled securely by Stripe — we never see your card details."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {products.map((product) => (
          <VariantPicker key={product.id} product={product} />
        ))}
      </div>

      <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-navy-600">
        <Icon name="phone" className="h-4 w-4 shrink-0 text-brand-600" />
        Not sure which option fits? Call {site.phone} and we will walk you through it.
        <Button href={site.consultationUrl} variant="quiet">
          Free consultation
        </Button>
      </p>
    </Section>
  );
}
