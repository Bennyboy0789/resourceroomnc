import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";
/** Every session is unique — nothing here may be cached. */
export const dynamic = "force-dynamic";

const MAX_ITEMS = 20;
const MAX_QUANTITY = 30;

type IncomingItem = {
  priceId?: unknown;
  quantity?: unknown;
  notes?: unknown;
};

/**
 * Creates a Stripe Checkout Session and hands back its URL.
 *
 * The client sends Price IDs and quantities only — never amounts. Stripe
 * resolves what each price actually costs at charge time, so a tampered cart
 * cannot change what someone is billed. The cached amounts in the cart exist
 * purely to render the drawer without a round trip.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Online enrollment is not configured yet. Please call us to enroll." },
      { status: 503 },
    );
  }

  let body: { items?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = Array.isArray(body.items) ? (body.items as IncomingItem[]) : [];
  if (!raw.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (raw.length > MAX_ITEMS) {
    // Reachable now that a picker can add many sessions at once, so the message
    // says what to do about it rather than just refusing.
    return NextResponse.json(
      {
        error: `An order can hold ${MAX_ITEMS} different options. Please check out in two orders, or call us and we will book them together.`,
      },
      { status: 400 },
    );
  }

  const lineItems: { price: string; quantity: number }[] = [];
  const noteLines: string[] = [];

  for (const item of raw) {
    if (typeof item.priceId !== "string" || !item.priceId.startsWith("price_")) {
      return NextResponse.json({ error: "Invalid item in cart." }, { status: 400 });
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });
    }

    lineItems.push({ price: item.priceId, quantity });

    if (item.notes && typeof item.notes === "object") {
      for (const [name, value] of Object.entries(item.notes as Record<string, unknown>)) {
        if (typeof value === "string" && value) {
          noteLines.push(`${item.priceId}: ${name}=${value}`);
        }
      }
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${siteUrl()}/enrollment/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/cart`,
      // Stripe verifies the address; the office needs it for enrollment records.
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      // Answers to options that carried no price of their own. Stripe caps a
      // metadata value at 500 characters, so this is trimmed rather than
      // allowed to fail the whole session.
      metadata: noteLines.length ? { enrollment_notes: noteLines.join("; ").slice(0, 500) } : {},
      custom_fields: [
        {
          key: "student_name",
          label: { type: "custom", custom: "Student name" },
          type: "text",
        },
      ],
    });

    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] session creation failed:", error);
    return NextResponse.json(
      { error: "We could not start checkout. Please try again or call us." },
      { status: 502 },
    );
  }
}
