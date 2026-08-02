"use server";

import { mailerConfigured, sendMail } from "@/lib/smtp2go";

export type ContactState = {
  status: "idle" | "sent" | "error";
  message?: string;
};

/** Fields we accept, in the order they appear in the delivered email. */
const CONSULTATION_FIELDS = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["grade", "Student grade"],
  ["program", "Program of interest"],
] as const;

const CAREERS_FIELDS = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["education", "Highest education level"],
  ["position", "Position applying for"],
] as const;

const MAX_LENGTH = 5000;

function clean(value: FormDataEntryValue | null): string {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 300);
}

/**
 * Handles both the consultation form and the careers form.
 *
 * Runs on the server so the SMTP2Go key never reaches the browser. Validation
 * is deliberately light — a real parent typing a real message should never be
 * bounced by a regex — but the honeypot and the length cap keep out the bulk
 * of automated spam.
 */
export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Bots fill hidden fields; humans never see this one.
  if (clean(formData.get("company"))) {
    return { status: "sent" };
  }

  const kind = clean(formData.get("formKind")) === "careers" ? "careers" : "consultation";
  const fields = kind === "careers" ? CAREERS_FIELDS : CONSULTATION_FIELDS;

  const name = clean(formData.get("name"));
  const email = clean(formData.get("email"));
  const message = String(formData.get("message") ?? "")
    .trim()
    .slice(0, MAX_LENGTH);

  if (!name || !email) {
    return { status: "error", message: "Please add your name and email so we can reply." };
  }
  if (!email.includes("@") || !email.includes(".")) {
    return { status: "error", message: "That email address does not look right." };
  }

  const lines = fields.map(([key, label]) => `${label}: ${clean(formData.get(key)) || "—"}`);
  if (message) lines.push("", message);

  const subject =
    kind === "careers"
      ? `Application — ${name}`
      : `Consultation request — ${clean(formData.get("program")) || "not sure yet"}`;

  if (!mailerConfigured()) {
    // Surfaces a misconfigured deploy in the logs instead of silently dropping
    // a real enquiry on the floor.
    console.error("[contact] SMTP2Go not configured; dropping submission from", email);
    return {
      status: "error",
      message: "We could not send that just now. Please call 984-777-1244 and we will help.",
    };
  }

  try {
    await sendMail({ subject, text: lines.join("\n"), replyTo: email });
    return { status: "sent" };
  } catch (error) {
    console.error("[contact] send failed:", error);
    return {
      status: "error",
      message: "We could not send that just now. Please call 984-777-1244 and we will help.",
    };
  }
}
