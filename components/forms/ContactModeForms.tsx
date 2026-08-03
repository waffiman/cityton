"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ClientInquiryForm,
  PartnerApplicationForm,
} from "@/components/forms/ContactForms";
import { cn } from "@/lib/utils";

export function ContactModeForms() {
  const t = useTranslations("contact");
  const [mode, setMode] = useState<"b2c" | "b2b">("b2c");

  return (
    <div>
      <div className="mb-6 inline-flex rounded-full bg-bg-soft p-1 ring-1 ring-border">
        <button
          type="button"
          onClick={() => setMode("b2c")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition",
            mode === "b2c" ? "bg-teal text-white" : "text-ink/70 hover:text-ink",
          )}
        >
          {t("modeB2c")}
        </button>
        <button
          type="button"
          onClick={() => setMode("b2b")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition",
            mode === "b2b" ? "bg-teal text-white" : "text-ink/70 hover:text-ink",
          )}
        >
          {t("modeB2b")}
        </button>
      </div>
      {mode === "b2c" ? <ClientInquiryForm /> : <PartnerApplicationForm />}
    </div>
  );
}
