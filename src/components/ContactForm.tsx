"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Icon } from "@/components/icons";
import { programs } from "@/content/programs";
import { careersPositions, educationLevels } from "@/content/careers";
import { site } from "@/content/site";

/*
 * `placeholder:text-navy-500` rather than a faded navy-600: placeholder text is
 * still text and has to clear 4.5:1. The old navy-600/60 measured 2.68:1.
 * The border is 40% navy so the field edge clears 3:1 against white (1.4.11).
 */
/*
 * `min-w-0` is load-bearing on the <select>: a select's intrinsic minimum width
 * comes from its longest option, and "Track-Out, Summer & Teacher-Workday
 * Camps" pushed the whole form column past a 320px viewport.
 */
/*
 * `text-base` (16px) on mobile, not `text-sm`. iOS Safari auto-zooms the
 * viewport whenever a focused form control is under 16px, and then does not
 * zoom back out — so tapping the first field threw the whole layout out of
 * scale for the rest of the form. Drops to 14px from `sm` up, where no mobile
 * browser applies that behaviour.
 */
const fieldClasses =
  "w-full min-w-0 rounded-chip border border-navy-900/40 bg-white px-4 py-3 text-base text-navy-950 placeholder:text-navy-500 focus:border-brand-500 sm:text-sm";

const labelClasses = "block text-sm font-semibold text-navy-950";

const initialState: ContactState = { status: "idle" };

/**
 * Consultation form. Posts to a Server Action that delivers through SMTP2Go,
 * so a submission reaches the inbox whether or not the visitor has a mail
 * client configured.
 *
 * Progressive enhancement: the action is wired via `useActionState`, so the
 * form still submits without client JS.
 */
export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);

  if (state.status === "sent") {
    return (
      <div
        role="status"
        className="rounded-card border border-brand-500/30 bg-brand-50 p-6 text-navy-800"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-500 text-white">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-lg font-bold text-navy-950">Thanks — that reached us.</p>
        <p className="mt-2 leading-relaxed">
          We respond within one business day, usually with a call. Miss our call? We will email to
          find a time that works. In a hurry? Call{" "}
          <a href={site.phoneHref} className="font-semibold text-navy-950 hover:underline">
            {site.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="formKind" value="consultation" />

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

      <HoneyPot />
      <SubmitButton label="Send my request" />

      {state.status === "error" ? (
        <p
          role="alert"
          className="flex items-start gap-3 border-l-4 border-alert-600 bg-alert-600/5 p-4 text-sm text-navy-900"
        >
          <Icon name="close" className="mt-0.5 h-4 w-4 shrink-0 text-alert-600" />
          {state.message}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-navy-600">
        Every message reaches a real person on our team. Prefer to talk? Call{" "}
        <a href={site.phoneHref} className="font-semibold text-navy-950 hover:underline">
          {site.phone}
        </a>
        .
      </p>
    </form>
  );
}

/** Careers variant — same delivery path, different fields. */
export function CareersForm() {
  const [state, formAction] = useActionState(submitContact, initialState);

  if (state.status === "sent") {
    return (
      <div role="status" className="rounded-card border border-brand-500/30 bg-brand-50 p-6 text-navy-800">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-500 text-white">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-lg font-bold text-navy-950">Thanks — we have your details.</p>
        <p className="mt-2 leading-relaxed">
          We read every application personally and will be in touch, usually within a few days. If
          you did not attach a resume, send one to{" "}
          <a href={site.emailHref} className="font-semibold text-navy-950 hover:underline">
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="formKind" value="careers" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="c-name">
            Your name
          </label>
          <input
            id="c-name"
            name="name"
            required
            autoComplete="name"
            className={`${fieldClasses} mt-2`}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="c-email">
            Email
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`${fieldClasses} mt-2`}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="c-phone">
            Phone
          </label>
          <input
            id="c-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={`${fieldClasses} mt-2`}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor="c-education">
            Highest education level
          </label>
          <select id="c-education" name="education" defaultValue="" className={`${fieldClasses} mt-2`}>
            <option value="">Select one</option>
            {educationLevels.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="c-position">
          Position you are applying for
        </label>
        <select id="c-position" name="position" defaultValue="" className={`${fieldClasses} mt-2`}>
          <option value="">Select one</option>
          {careersPositions.map((position) => (
            <option key={position}>{position}</option>
          ))}
        </select>
      </div>

      <ResumeField />

      <div>
        <label className={labelClasses} htmlFor="c-message">
          Ages and subjects you like teaching
        </label>
        <textarea id="c-message" name="message" rows={5} className={`${fieldClasses} mt-2 resize-y`} />
      </div>

      <HoneyPot />
      <SubmitButton label="Submit application" />

      {state.status === "error" ? (
        <p
          role="alert"
          className="flex items-start gap-3 border-l-4 border-alert-600 bg-alert-600/5 p-4 text-sm text-navy-900"
        >
          <Icon name="close" className="mt-0.5 h-4 w-4 shrink-0 text-alert-600" />
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

/**
 * Resume upload.
 *
 * A plain `<input type="file">` styled with `file:` variants rather than the
 * usual hidden-input-plus-fake-button: the native control is already keyboard
 * operable and announces the chosen filename to a screen reader, and every
 * custom version of this has to reimplement both. `accept` filters the picker;
 * the server re-checks type and size, because `accept` is only a hint.
 */
function ResumeField() {
  return (
    <div>
      <label className={labelClasses} htmlFor="c-resume">
        Upload resume
      </label>
      <input
        id="c-resume"
        name="resume"
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        aria-describedby="c-resume-hint"
        className="mt-2 w-full cursor-pointer rounded-chip border-2 border-dashed border-navy-900/25 bg-mist px-4 py-5 text-sm text-navy-600 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-navy-900 file:px-5 file:py-2.5 file:text-xs file:font-bold file:uppercase file:tracking-[0.08em] file:text-white hover:border-navy-900/40"
      />
      <p id="c-resume-hint" className="mt-2 text-xs text-navy-600">
        PDF or Word document, up to 5MB. Optional — you can also email it to us.
      </p>
    </div>
  );
}

/**
 * Hidden field bots fill in and people never see. Kept out of the tab order and
 * hidden from assistive tech rather than `display:none`, which some bots detect.
 */
function HoneyPot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor="company">Please do not fill in this field</label>
      <input id="company" name="company" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-sun-500 px-7 text-base font-semibold text-navy-950 shadow-sm transition-colors hover:bg-sun-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Sending…" : label}
      {pending ? null : <Icon name="arrowRight" className="h-4 w-4" />}
    </button>
  );
}
