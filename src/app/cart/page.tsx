import type { Metadata } from "next";
import { CartPageContents } from "@/components/shop/CartPageContents";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Your Enrollment",
  description: "Review the Resource Room programs you have selected before checking out.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Enrollment"
        title="Your"
        accent="cart."
        description="Review your selections before checkout. Payment is handled securely by Stripe."
      />
      <Section tone="white">
        <CartPageContents />
      </Section>
    </>
  );
}
