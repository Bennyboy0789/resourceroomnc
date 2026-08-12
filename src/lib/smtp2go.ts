import "server-only";

/**
 * Minimal SMTP2Go client.
 *
 * Uses the HTTP send API rather than SMTP so the site can run on serverless
 * platforms that block outbound port 587. One dependency-free POST.
 *
 * Configure via env:
 *   SMTP2GO_API_KEY   from SMTP2Go > Settings > API Keys (needs "Email: send")
 *   SMTP2GO_SENDER    verified sender address, e.g. website@resourceroomnc.com
 *   SMTP2GO_TO        comma-separated recipients; defaults to the site's email
 *
 * The sender domain must be verified in SMTP2Go or delivery is rejected —
 * sending as the visitor's own address would fail SPF/DKIM, so the visitor
 * goes in Reply-To instead.
 */

const ENDPOINT = "https://api.smtp2go.com/v3/email/send";

export type MailAttachment = {
  filename: string;
  /** Base64 of the file's bytes, which is the only form SMTP2Go accepts. */
  fileblob: string;
  mimetype: string;
};

export type MailPayload = {
  subject: string;
  /** Plain-text body. */
  text: string;
  /** Where a reply should go — the person who filled in the form. */
  replyTo?: string;
  /** Resumes from the careers form. Omitted for the consultation form. */
  attachments?: MailAttachment[];
  /**
   * Recipients, when they are not the office.
   *
   * Everything else here goes to `SMTP2GO_TO` — a form submission is always
   * inbound. The order receipt is the exception: it goes out to the customer,
   * so it passes their address explicitly.
   */
  to?: string[];
};

export function mailerConfigured(): boolean {
  return Boolean(process.env.SMTP2GO_API_KEY && process.env.SMTP2GO_SENDER);
}

export async function sendMail({
  subject,
  text,
  replyTo,
  attachments,
  to: explicitTo,
}: MailPayload): Promise<void> {
  const apiKey = process.env.SMTP2GO_API_KEY;
  const sender = process.env.SMTP2GO_SENDER;

  if (!apiKey || !sender) {
    throw new Error("SMTP2Go is not configured: set SMTP2GO_API_KEY and SMTP2GO_SENDER");
  }

  const to = (explicitTo ?? [])
    .concat(
      explicitTo?.length
        ? []
        : (process.env.SMTP2GO_TO ?? "Learn@ResourceRoomNC.com").split(","),
    )
    .map((address) => address.trim())
    .filter(Boolean);

  if (!to.length) {
    throw new Error("SMTP2Go: no recipient");
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Smtp2go-Api-Key": apiKey,
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender,
      to,
      subject,
      text_body: text,
      ...(replyTo ? { custom_headers: [{ header: "Reply-To", value: replyTo }] } : {}),
      ...(attachments?.length ? { attachments } : {}),
    }),
  });

  if (!response.ok) {
    /*
     * The body carries the reason; the status alone does not. A 403 can mean a
     * revoked key, a key without the "Email: send" scope, or a key restricted
     * to an IP allowlist that a serverless function will never match — three
     * different fixes behind one number. Truncated because SMTP2Go can return
     * a long payload, and it holds no credentials worth redacting.
     */
    const detail = await response.text().catch(() => "");
    throw new Error(
      `SMTP2Go returned ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`,
    );
  }

  // A 200 can still carry a per-message failure, so check the envelope.
  const result = (await response.json()) as {
    data?: { succeeded?: number; failed?: number; failures?: unknown[] };
  };

  if (!result.data?.succeeded) {
    throw new Error(`SMTP2Go accepted no recipients: ${JSON.stringify(result.data?.failures)}`);
  }
}
