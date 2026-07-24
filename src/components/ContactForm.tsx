"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { programs } from "@/content/programs";
import { site } from "@/content/site";

const fieldClasses =
  "w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-600/60 focus:border-brand-500 focus:outline-2 focus:outline-offset-0 focus:outline-brand-500/30";

const labelClasses = "block text-sm font-semibold text-navy-900";

/**
 * The form composes an email to the learning center rather than posting to a
 * backend, so it works on a fully static deploy.
 *
 * To move to a real inbox integration later, replace `handleSubmit` with a
 * Server Action (or a POST to a form provider) — the markup stays as-is.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const program = String(data.get("program") ?? "");
    const subject = program
      ? `Consultation request — ${program}`
      : "Consultation request from resourceroomnc.com";

    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Student grade: ${data.get("grade")}`,
      `Program of interest: ${program || "Not sure yet"}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");

    window.location.href = `${site.emailHref}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Parent or guardian name"
            className={`${fieldClasses} mt-2`}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={`${fieldClasses} mt-2`}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(984) 000-0000"
            className={`${fieldClasses} mt-2`}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="grade">
            Student grade
          </label>
          <input
            id="grade"
            name="grade"
            placeholder="e.g. 4th grade, junior"
            className={`${fieldClasses} mt-2`}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="program">
          Program of interest
        </label>
        <select id="program" name="program" defaultValue="" className={`${fieldClasses} mt-2`}>
          <option value="">Not sure yet — help me choose</option>
          {programs.map((program) => (
            <option key={program.slug} value={program.name}>
              {program.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClasses} htmlFor="message">
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us a little about your student — where they are now and what you would like to see change."
          className={`${fieldClasses} mt-2 resize-y`}
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-7 text-base font-semibold text-navy-950 shadow-sm transition-colors hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 sm:w-auto"
      >
        Send my request
        <Icon name="arrowRight" className="h-4 w-4" />
      </button>

      <p className="text-xs leading-relaxed text-navy-600">
        Submitting opens your email app with the details filled in, addressed to{" "}
        <a href={site.emailHref} className="font-semibold text-navy-900 hover:underline">
          {site.email}
        </a>
        . Prefer to talk? Call{" "}
        <a href={site.phoneHref} className="font-semibold text-navy-900 hover:underline">
          {site.phone}
        </a>
        .
      </p>

      {submitted ? (
        <p
          role="status"
          className="flex items-start gap-3 rounded-xl border border-brand-500/30 bg-brand-50 p-4 text-sm text-navy-800"
        >
          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          Your email app should have opened with your message ready to send. If nothing happened,
          email us directly at {site.email}.
        </p>
      ) : null}
    </form>
  );
}
