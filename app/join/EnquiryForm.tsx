"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";

import { Field } from "@/app/components/ui/Field";
import { Chip } from "@/app/components/ui/Chip";
import { Button } from "@/app/components/ui/Button";
import { MeetingPreference } from "./MeetingPreference";
import {
  ENQUIRY_CATEGORIES,
  enquiry,
  submitEnquiry,
  type EnquiryPayload,
} from "@/app/lib/enquiry";

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function EnquiryForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [category, setCategory] = useState<string>(ENQUIRY_CATEGORIES[0]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    // Honigtopf: für Menschen unsichtbar, Bots füllen es aus. Kein Captcha.
    if (value("website")) {
      setStatus("sent");
      return;
    }

    const next: Errors = {};
    if (!value("name")) next.name = "Please enter your name.";
    if (!value("institution")) next.institution = "Please enter your institution.";
    if (!value("email")) next.email = "Please enter your email address.";
    else if (!EMAIL.test(value("email")))
      next.email = "That does not look like an email address.";
    if (!value("message")) next.message = "Please tell us what you would like to discuss.";
    if (!data.get("consent")) next.consent = "Please confirm this before sending.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");

    const slots = data.getAll("slot").map(String);
    const payload: EnquiryPayload = {
      name: value("name"),
      institution: value("institution"),
      category: value("category") || category,
      email: value("email"),
      phone: value("phone"),
      message: value("message"),
      wantsMeeting: value("wantsMeeting") === "true",
      lengthMinutes: (Number(value("lengthMinutes")) === 60 ? 60 : 30) as 30 | 60,
      timeZone: value("timeZone"),
      slots,
      submittedAt: new Date().toISOString(),
      source: "join-page",
    };

    const result = await submitEnquiry(payload);
    if (result.ok) setStatus("sent");
    else setStatus("failed");
  }

  if (status === "sent") return <Sent />;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <Chip
        label="Reason of contact"
        name="category"
        options={ENQUIRY_CATEGORIES}
        value={category}
        onChange={setCategory}
      />

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 text-label uppercase text-ink-3">Personal info</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id={`${id}-name`}
            name="name"
            label="Your name"
            required
            autoComplete="name"
            error={errors.name}
          />
          <Field
            id={`${id}-institution`}
            name="institution"
            label="Institution"
            required
            autoComplete="organization"
            error={errors.institution}
          />
          <Field
            id={`${id}-email`}
            name="email"
            type="email"
            label="Email"
            required
            autoComplete="email"
            error={errors.email}
          />
          <Field
            id={`${id}-phone`}
            name="phone"
            type="tel"
            label="Phone"
            optional
            autoComplete="tel"
          />
        </div>
      </fieldset>

      <div>
        <p className="mb-3 text-label uppercase text-ink-3">Preferred call time · optional</p>
        <MeetingPreference />
      </div>

      <Field
        id={`${id}-message`}
        name="message"
        label="Your message"
        as="textarea"
        error={errors.message}
      />

      {/* Honigtopf — für Menschen unsichtbar, für Screenreader ausgeblendet */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-caption text-ink-3">
          <input
            type="checkbox"
            name="consent"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
            className="mt-0.5 checkbox"
          />
          <span>
            I agree that my details may be used to respond to this enquiry. See the{" "}
            <Link href="/privacy" className="text-accent-hover underline underline-offset-2">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id={`${id}-consent-error`} className="mt-2 text-caption text-danger">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </Button>
      </div>

      <div aria-live="polite">
        {status === "failed" && (
          <Notice>
            Sending failed. Please try again — or write to{" "}
            <a href={`mailto:${enquiry.fallbackEmail}`} className="underline underline-offset-2">
              {enquiry.fallbackEmail}
            </a>{" "}
            so your enquiry does not get lost.
          </Notice>
        )}
      </div>

    </form>
  );
}

function Sent() {
  return (
    <div className="rounded-md bg-tint-10 p-block">
      <p className="text-h3 text-ink">Thank you — your enquiry is on its way.</p>
      <p className="mt-3 max-w-measure text-caption text-ink-3">
        We will come back to you personally, usually within two working days, and send you the
        membership documentation.
      </p>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-danger bg-tint-05 p-4 text-caption text-ink-2">
      {children}
    </div>
  );
}
