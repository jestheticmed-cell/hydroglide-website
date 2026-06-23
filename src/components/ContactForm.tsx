"use client";

import { ChevronDown, X } from "lucide-react";
import { FormEvent, useState } from "react";

type ContactErrors = {
  phone?: string;
  email?: string;
  message?: string;
};

const countryCodeOptions = [
  "United States +1",
  "Canada +1",
  "Australia +61",
  "United Kingdom +44",
  "China +86",
  "Hong Kong +852",
  "Singapore +65",
  "New Zealand +64",
  "Germany +49",
  "France +33",
  "Italy +39",
  "Spain +34",
  "Netherlands +31",
  "United Arab Emirates +971",
  "Japan +81",
  "South Korea +82"
];

export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    setErrors({
      ...(phone ? {} : { phone: "Phone Number is required" }),
      ...(email ? {} : { email: "Email is required" }),
      ...(message ? {} : { message: "How can we help? is required" })
    });
  }

  const hasErrors = Boolean(errors.phone || errors.email || errors.message);
  const fieldClass = (hasError?: boolean) =>
    `h-14 rounded-xl border bg-white px-5 text-base tracking-[0.06em] text-ink outline-none transition placeholder:text-charcoal ${
      hasError ? "border-red-500" : "border-line focus:border-ink"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto mt-20 max-w-3xl text-left">
      {hasErrors ? (
        <div className="relative mb-8 rounded border border-red-200 bg-red-50 px-6 py-5 text-xl tracking-[0.06em] text-red-700">
          <button type="button" aria-label="Dismiss errors" onClick={() => setErrors({})} className="absolute right-5 top-5 text-red-400 hover:text-red-700">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="grid gap-5 pr-8">
            {errors.phone ? <p>{errors.phone}</p> : null}
            {errors.email ? <p>{errors.email}</p> : null}
            {errors.message ? <p>{errors.message}</p> : null}
          </div>
        </div>
      ) : null}

      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="relative block">
            <select
              name="countryCode"
              aria-label="Country phone code"
              defaultValue="United States +1"
              className="h-14 w-full appearance-none rounded-xl border border-line bg-white px-5 pr-12 text-base tracking-[0.06em] text-ink outline-none transition focus:border-[#41b8ae]"
            >
              {countryCodeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2f4b7c]" aria-hidden="true" />
          </label>
          <input name="phone" placeholder="Phone Number*" className={fieldClass(Boolean(errors.phone))} />
        </div>

        <input name="name" placeholder="Name" className={fieldClass(false)} />
        <input name="email" type="email" placeholder="Email*" className={fieldClass(Boolean(errors.email))} />
        <textarea
          name="message"
          placeholder="How can we help?*"
          rows={8}
          className={`resize-none rounded-xl border bg-white px-5 py-4 text-base tracking-[0.06em] text-ink outline-none transition placeholder:text-charcoal ${
            errors.message ? "border-red-500" : "border-line focus:border-ink"
          }`}
        />
      </div>

      <div className="mt-16 text-center">
        <button type="submit" className="h-14 min-w-[260px] rounded-full bg-[#41b8ae] px-10 text-lg font-semibold tracking-[0.04em] text-white transition hover:bg-[#36a9a0] focus:outline-none focus:ring-2 focus:ring-[#41b8ae] focus:ring-offset-2">
          Request contact
        </button>
      </div>
    </form>
  );
}
