import "server-only";
import type Stripe from "stripe";
import { addressLine, site } from "@/content/site";

/**
 * The two emails a completed order produces.
 *
 * Kept apart from the webhook route so the wording can be read and changed
 * without touching signature verification, and so both messages are built
 * from one description of the order rather than assembling the same figures
 * twice.
 *
 * Plain text on purpose. It is what the SMTP2Go helper already sends for the
 * contact forms, it cannot render broken in a client, and a receipt is a list
 * of lines and a total — nothing here needs a layout.
 */

export type OrderLine = {
  description: string;
  quantity: number;
  /** Line total in the smallest currency unit, as Stripe reports it. */
  amountTotal: number;
};

export type Order = {
  /** Checkout Session id, the reference the office can search Stripe for. */
  reference: string;
  placedAt: Date;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  billingAddress: string | null;
  /** From the checkout's custom field. */
  studentName: string | null;
  /**
   * What the family typed in the free-text field at checkout — usually which
   * dates they want for a single-day booking, sometimes a question.
   */
  customerNote: string | null;
  /** Answers to picker options that carried no price of their own. */
  enrollmentNotes: string | null;
  lines: OrderLine[];
  amountTotal: number;
  currency: string;
};

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

/**
 * Turns the stored enrollment notes into something readable.
 *
 * The checkout route records them as `price_1ABC: Choose Your Program=Summer
 * August 10-14, 2026; ...` — a Stripe price id, the picker's label, and the
 * answer. The id means nothing to anyone reading an email, and the raw
 * `key=value` form is not something to send a parent.
 */
function parseNotes(raw: string | null) {
  if (!raw) return [];

  return raw
    .split(";")
    .map((part) => part.replace(/^\s*price_[^:]*:\s*/, "").trim())
    .filter(Boolean)
    .map((part) => {
      const split = part.indexOf("=");
      if (split === -1) return { label: null, value: part };
      return { label: part.slice(0, split).trim(), value: part.slice(split + 1).trim() };
    })
    .filter((note) => note.value);
}

function orderLines(order: Order) {
  return order.lines.map((line) => {
    const label = line.quantity > 1 ? `${line.description} × ${line.quantity}` : line.description;
    return `  ${label} — ${money(line.amountTotal, order.currency)}`;
  });
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "America/New_York",
});

/**
 * The office copy: everything needed to action the booking without opening
 * Stripe. Student name and enrolment notes lead, because those are the two
 * things Stripe's own notification email does not carry.
 */
export function officeOrderEmail(order: Order) {
  const lines = [
    `A new order was placed on ${site.url}.`,
    "",
    `Student:        ${order.studentName ?? "— not provided —"}`,
    `Total:          ${money(order.amountTotal, order.currency)}`,
    `Placed:         ${dateFormat.format(order.placedAt)} ET`,
    "",
    "WHAT WAS PURCHASED",
    ...orderLines(order),
    "",
    "CUSTOMER",
    `  Name:         ${order.customerName ?? "—"}`,
    `  Email:        ${order.customerEmail ?? "—"}`,
    `  Phone:        ${order.customerPhone ?? "—"}`,
    `  Billing:      ${order.billingAddress ?? "—"}`,
  ];

  /* Above the picker answers and the customer block: this is the one part of
     the order somebody has to read and act on, and it is where the dates for
     a single-day booking arrive. */
  if (order.customerNote) {
    lines.push("", "NOTE FROM THE FAMILY", `  ${order.customerNote}`);
  }

  const notes = parseNotes(order.enrollmentNotes);
  if (notes.length) {
    lines.push(
      "",
      "OPTIONS CHOSEN",
      ...notes.map((note) => `  ${note.label ? `${note.label}: ` : ""}${note.value}`),
    );
  }

  lines.push(
    "",
    "REFERENCE",
    `  Checkout session: ${order.reference}`,
    `  Stripe dashboard: https://dashboard.stripe.com/payments`,
    "",
    "Reply to this email to reach the customer directly.",
  );

  /* Named if we have one, dropped entirely if not — "New website order — new
     order — $75" is what happens when a placeholder gets a slot of its own. */
  const who = order.studentName ?? order.customerName;
  const total = money(order.amountTotal, order.currency);

  return {
    subject: who ? `New website order — ${who} — ${total}` : `New website order — ${total}`,
    text: lines.join("\n"),
    /* Replying to the notification should reach the family, not the sender
       address nobody monitors. */
    replyTo: order.customerEmail ?? undefined,
  };
}

/** The customer copy: what they bought, what they paid, what happens next. */
export function customerReceiptEmail(order: Order) {
  const lines = [
    `Thank you${order.customerName ? `, ${order.customerName.split(" ")[0]}` : ""}.`,
    "",
    `We have received your order and your payment of ${money(order.amountTotal, order.currency)}.`,
    "",
    "WHAT YOU PURCHASED",
    ...orderLines(order),
    "",
    `Total paid:     ${money(order.amountTotal, order.currency)}`,
    `Order date:     ${dateFormat.format(order.placedAt)} ET`,
    `Order number:   ${order.reference}`,
  ];

  if (order.studentName) {
    lines.push(`Student:        ${order.studentName}`);
  }

  /* Values only here. The picker's label ("Choose Your Program") is internal
     wording that reads oddly on a receipt; the answer is the useful part. */
  const notes = parseNotes(order.enrollmentNotes);
  if (notes.length) {
    lines.push("", "DATES AND OPTIONS YOU CHOSE", ...notes.map((note) => `  ${note.value}`));
  }

  /* Read back to them. If they asked for particular dates, seeing their own
     words repeated is what tells them the request landed somewhere. */
  if (order.customerNote) {
    lines.push("", "WHAT YOU TOLD US", `  ${order.customerNote}`);
  }

  lines.push(
    "",
    "WHAT HAPPENS NEXT",
    "  Our team will be in touch within one business day to confirm scheduling",
    "  and answer any questions. There is nothing else you need to do right now.",
    "",
    "Questions before then?",
    `  Call ${site.phone} or reply to this email.`,
    "",
    site.legalName,
    addressLine,
    site.url,
  );

  return {
    subject: `Your ${site.name} order — ${money(order.amountTotal, order.currency)}`,
    text: lines.join("\n"),
  };
}

/**
 * Which variant a line item's Price is — the camp week, the test date, the
 * grade level.
 *
 * Stripe's line-item `description` is the product name alone ("STEM Themed
 * Camps"), so an order for a specific week read as just the product and the
 * office could not tell which week the family paid for. The seed script writes
 * the variant onto each Price twice: `nickname` carries the human label
 * ("Summer July 27-31") and `opt_<Attribute>` metadata carries the raw values.
 * The nickname is preferred because it joins multi-attribute variants in the
 * curated order; metadata is the fallback for prices created without one.
 */
function variantLabel(price: Stripe.Price | null | undefined): string | null {
  if (!price) return null;

  // Single-variant products are seeded with the placeholder nickname
  // "Standard" — there was nothing to choose, so there is nothing to say.
  if (price.nickname && price.nickname !== "Standard") return price.nickname;

  const values = Object.entries(price.metadata ?? {})
    .filter(([key, value]) => key.startsWith("opt_") && value)
    .map(([, value]) => value);
  return values.length ? values.join(" / ") : null;
}

/** Flattens a Stripe Checkout Session into the shape both emails read from. */
export function orderFromSession(session: Stripe.Checkout.Session): Order {
  const address = session.customer_details?.address;
  const billing = address
    ? [address.line1, address.line2, address.city, address.state, address.postal_code]
        .filter(Boolean)
        .join(", ")
    : null;

  const field = (key: string) =>
    session.custom_fields?.find((entry) => entry.key === key)?.text?.value || null;

  return {
    reference: session.id,
    placedAt: new Date((session.created ?? Date.now() / 1000) * 1000),
    customerName: session.customer_details?.name ?? null,
    customerEmail: session.customer_details?.email ?? null,
    customerPhone: session.customer_details?.phone ?? null,
    billingAddress: billing,
    studentName: field("student_name"),
    customerNote: field("notes"),
    enrollmentNotes: session.metadata?.enrollment_notes ?? null,
    lines: (session.line_items?.data ?? []).map((item) => {
      const name = item.description ?? "Item";
      const variant = variantLabel(item.price);
      return {
        description: variant && variant !== name ? `${name} — ${variant}` : name,
        quantity: item.quantity ?? 1,
        amountTotal: item.amount_total ?? 0,
      };
    }),
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
  };
}
