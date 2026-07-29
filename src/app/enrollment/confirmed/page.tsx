import type { Metadata } from "next";
import { ClearCartOnMount } from "@/components/shop/ClearCartOnMount";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getStripe } from "@/lib/stripe";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Enrollment Confirmed",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Post-checkout landing page.
 *
 * The session is re-read from Stripe rather than trusted from the URL: the
 * session ID is visible in the address bar, so payment status has to come from
 * Stripe itself before this page tells anyone they are enrolled.
 */
export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const stripe = getStripe();

  let paid = false;
  let email: string | null = null;

  if (stripe && sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      email = session.customer_details?.email ?? null;
    } catch (error) {
      console.error("[confirmed] could not retrieve session:", error);
    }
  }

  return (
    <>
      {paid ? <ClearCartOnMount /> : null}

      <PageHero
        eyebrow={paid ? "You're enrolled" : "Checkout"}
        title={paid ? "Thank you —" : "We couldn't confirm"}
        accent={paid ? "you're in." : "that payment."}
        description={
          paid
            ? "Your enrollment is confirmed and a receipt is on its way by email."
            : "If you were charged, do not pay again — call us and we will sort it out straight away."
        }
      />

      <Section tone="white" size="narrow">
        {paid ? (
          <div className="border border-navy-950/12 bg-mist p-8">
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-navy-950">
              What happens next
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-navy-700">
              <li className="flex gap-3">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                A receipt is on its way{email ? ` to ${email}` : ""}.
              </li>
              <li className="flex gap-3">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                A member of our team will reach out within one business day to confirm scheduling.
              </li>
              <li className="flex gap-3">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                Questions before then? Call {site.phone} or email {site.email}.
              </li>
            </ul>
          </div>
        ) : (
          <div className="border border-navy-950/12 bg-mist p-8">
            <p className="text-sm leading-relaxed text-navy-700">
              We could not verify this checkout session. That usually means the page was
              refreshed or the link was opened later. Your card may still have been charged.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href={site.phoneHref} variant="navy">
                <Icon name="phone" className="h-4 w-4" />
                {site.phone}
              </Button>
              <Button href="/cart" variant="quiet">
                Back to cart
              </Button>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/programs" variant="quiet">
            Browse more programs
          </Button>
        </div>
      </Section>
    </>
  );
}
