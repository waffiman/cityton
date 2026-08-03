"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  submitClientInquiry,
  submitPartnerApplication,
  type FormState,
} from "@/app/actions/contact";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false };

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {error ? <span className="block text-xs text-red">{error}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";

export function ClientInquiryForm({ className }: { className?: string }) {
  const t = useTranslations("forms");
  const [state, action, pending] = useActionState(submitClientInquiry, initial);

  if (state.ok) {
    return (
      <div className={cn("rounded-2xl bg-teal/10 p-8 text-center ring-1 ring-teal/20", className)}>
        <p className="text-lg font-semibold text-teal-dark">{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={action} className={cn("space-y-4", className)} noValidate>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <Field label={t("name")} error={state.fieldErrors?.name?.[0] && t("required")}>
        <input name="name" required className={inputClass} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("email")} error={state.fieldErrors?.email?.[0] && t("invalidEmail")}>
          <input name="email" type="email" required className={inputClass} />
        </Field>
        <Field label={t("phone")}>
          <input name="phone" type="tel" className={inputClass} />
        </Field>
      </div>
      <Field label={t("propertyType")} error={state.fieldErrors?.propertyType?.[0] && t("required")}>
        <select name="propertyType" required className={inputClass} defaultValue="">
          <option value="" disabled>
            —
          </option>
          <option value="home">{t("propertyTypes.home")}</option>
          <option value="office">{t("propertyTypes.office")}</option>
          <option value="retail">{t("propertyTypes.retail")}</option>
          <option value="security">{t("propertyTypes.security")}</option>
          <option value="other">{t("propertyTypes.other")}</option>
        </select>
      </Field>
      <Field label={t("message")} error={state.fieldErrors?.message?.[0] && t("required")}>
        <textarea name="message" required rows={4} className={inputClass} />
      </Field>
      {state.error && state.error !== "validation" ? (
        <p className="text-sm text-red">{t("error")}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}

export function PartnerApplicationForm({ className }: { className?: string }) {
  const t = useTranslations("forms");
  const [state, action, pending] = useActionState(
    submitPartnerApplication,
    initial,
  );

  if (state.ok) {
    return (
      <div className={cn("rounded-2xl bg-teal/10 p-8 text-center ring-1 ring-teal/20", className)}>
        <p className="text-lg font-semibold text-teal-dark">{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={action} className={cn("space-y-4", className)} noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <Field label={t("company")} error={state.fieldErrors?.company?.[0] && t("required")}>
        <input name="company" required className={inputClass} />
      </Field>
      <Field
        label={t("contactPerson")}
        error={state.fieldErrors?.contactPerson?.[0] && t("required")}
      >
        <input name="contactPerson" required className={inputClass} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("email")} error={state.fieldErrors?.email?.[0] && t("invalidEmail")}>
          <input name="email" type="email" required className={inputClass} />
        </Field>
        <Field label={t("phone")}>
          <input name="phone" type="tel" className={inputClass} />
        </Field>
      </div>
      <Field label={t("role")} error={state.fieldErrors?.role?.[0] && t("required")}>
        <select name="role" required className={inputClass} defaultValue="">
          <option value="" disabled>
            —
          </option>
          <option value="construction">{t("roles.construction")}</option>
          <option value="glass">{t("roles.glass")}</option>
          <option value="facility">{t("roles.facility")}</option>
          <option value="architect">{t("roles.architect")}</option>
          <option value="property">{t("roles.property")}</option>
          <option value="developer">{t("roles.developer")}</option>
        </select>
      </Field>
      <Field label={t("message")} error={state.fieldErrors?.message?.[0] && t("required")}>
        <textarea name="message" required rows={4} className={inputClass} />
      </Field>
      {state.error && state.error !== "validation" ? (
        <p className="text-sm text-red">{t("error")}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
