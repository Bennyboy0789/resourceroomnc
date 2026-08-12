import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { customerReceiptEmail, officeOrderEmail, orderFromSession } from "@/lib/order-emails";
import { mailerConfigured, sendMail } from "@/lib/smtp2go";
import { getStripe } from "@/lib/stripe";

/** Signature verification needs Node crypto and the unparsed body. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook — the thing that makes a completed payment known to us.
 *
 * Until this existed, checkout ran entirely between the customer and Stripe.
 * The charge appeared in the dashboard and nothing else happened: no order
 * email to the office, and no receipt to the family, even though the
 * confirmation page promised one.
 *
 * Two emails go out on `checkout.session.completed`:
 *   office    what was bought, by whom, for which student
 *   customer  what they bought and what they paid
 *
 * Set STRIPE_WEBHOOK_SECRET from the endpoint's signing secret. Without it
 * this route rejects everything — an unverified webhook is an open door for
 * anyone who can guess the URL to forge orders and trigger mail.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    console.error("[stripe-webhook] not configured: need STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  /* The raw text, not request.json(): the signature is computed over the exact
     bytes Stripe sent, so parsing first would break verification. */
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, secret);
  } catch (error) {
    console.error("[stripe-webhook] signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Acknowledged so Stripe stops retrying events we do not act on.
    return NextResponse.json({ received: true });
  }

  try {
    await handleCompletedCheckout(stripe, event.data.object as Stripe.Checkout.Session);
  } catch (error) {
    /*
     * 500 so Stripe retries. A failed send is recoverable — a transient
     * SMTP2Go error should not silently cost the office an order — and the
     * guard below stops a retry from mailing twice once one send has stuck.
     */
    console.error("[stripe-webhook] order email failed:", error);
    return NextResponse.json({ error: "Order email failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCompletedCheckout(stripe: Stripe, sessionStub: Stripe.Checkout.Session) {
  if (sessionStub.payment_status !== "paid") {
    console.warn("[stripe-webhook] session not paid, skipping:", sessionStub.id);
    return;
  }

  if (!mailerConfigured()) {
    // Loud, because the alternative is an order nobody is told about.
    throw new Error(`SMTP2Go not configured; no order email sent for ${sessionStub.id}`);
  }

  /* The webhook payload carries no line items — they have to be fetched. */
  const session = await stripe.checkout.sessions.retrieve(sessionStub.id, {
    expand: ["line_items", "payment_intent"],
  });

  const intent = typeof session.payment_intent === "string" ? null : session.payment_intent;

  /*
   * Duplicate guard, kept on the PaymentIntent because there is no database
   * here and Stripe delivers at least once. A retry after a partial failure
   * re-reads this flag and stops rather than mailing the family twice.
   */
  if (intent?.metadata?.order_email_sent === "true") {
    console.warn("[stripe-webhook] already emailed, skipping:", session.id);
    return;
  }

  const order = orderFromSession(session);

  const office = officeOrderEmail(order);
  await sendMail({ subject: office.subject, text: office.text, replyTo: office.replyTo });

  /*
   * The office copy is the one that must not be lost, so it is sent first and
   * marked before the customer copy is attempted. If the receipt then fails,
   * the retry is skipped by the guard above and the failure is in the logs —
   * a family missing a receipt is recoverable by hand, a booking nobody knows
   * about is not.
   */
  if (intent) {
    await stripe.paymentIntents.update(intent.id, {
      metadata: { ...intent.metadata, order_email_sent: "true" },
    });
  }

  if (order.customerEmail) {
    const receipt = customerReceiptEmail(order);
    await sendMail({
      subject: receipt.subject,
      text: receipt.text,
      to: [order.customerEmail],
    });
  } else {
    console.warn("[stripe-webhook] no customer email on session:", session.id);
  }
}
