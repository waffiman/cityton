export type Certificate = {
  href: string;
  preview: string;
  caption: string;
};

/** Prüfberichte shown on a series page. Keyed by series slug. */
export const seriesCertificates: Record<string, Certificate[]> = {
  safety: [
    {
      href: "/media/docs/arm-safety-en-356.pdf",
      preview: "/media/docs/arm-safety-en-356-p1.jpg",
      caption: "DIN EN 356 · ARM Safety Clear 12 mil",
    },
    {
      href: "/media/docs/arm-safety-en-12600.pdf",
      preview: "/media/docs/arm-safety-en-12600-p1.jpg",
      caption: "DIN EN 12600 · ARM Safety 8 mil",
    },
  ],
};
