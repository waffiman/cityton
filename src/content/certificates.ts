export type Certificate = {
  href: string;
  preview: string;
  /** Fallback label and image alt text. */
  caption: string;
  /** Tested standard, e.g. "DIN EN 356". */
  standard: string;
  /** Classification the report awards, e.g. "Klasse P1A". */
  result: string;
  /** Film the report was issued for. */
  film: string;
  brand: "Armolan" | "LLumar";
  /** Report number, so a customer can match the PDF to the claim. */
  report: string;
};

/** Prüfberichte shown on a series page. Keyed by series slug. */
export const seriesCertificates: Record<string, Certificate[]> = {
  safety: [
    {
      href: "/media/docs/arm-safety-en-356.pdf",
      preview: "/media/docs/arm-safety-en-356-p1.jpg",
      caption: "DIN EN 356 · ARM Safety Clear 12 mil",
      standard: "DIN EN 356",
      result: "Klasse P1A",
      film: "ARM Safety Clear 12 mil",
      brand: "Armolan",
      report: "2022-08-5319-04",
    },
    {
      href: "/media/docs/arm-safety-en-12600.pdf",
      preview: "/media/docs/arm-safety-en-12600-p1.jpg",
      caption: "DIN EN 12600 · ARM Safety 8 mil",
      standard: "DIN EN 12600",
      result: "Klasse 2 (B) 2",
      film: "ARM Safety 8 mil",
      brand: "Armolan",
      report: "2022-08-5319-02",
    },
    {
      href: "/media/docs/llumar-scl-ps8-en-356.pdf",
      preview: "/media/docs/llumar-scl-ps8-en-356-p1.jpg",
      caption: "DIN EN 356 · LLumar SCL SR PS8",
      standard: "DIN EN 356",
      result: "Klasse P1A · 1500 mm",
      film: "LLumar SCL SR PS8 · Safety Clear 200µ",
      brand: "LLumar",
      report: "BSI 2371/9681750",
    },
    {
      href: "/media/docs/llumar-scl-ps13-en-356.pdf",
      preview: "/media/docs/llumar-scl-ps13-en-356-p1.jpg",
      caption: "DIN EN 356 · LLumar SCL SR PS13",
      standard: "DIN EN 356",
      result: "Klasse P2A · 3000 mm",
      film: "LLumar SCL SR PS13",
      brand: "LLumar",
      report: "BSI 2371/8777667",
    },
  ],
};
