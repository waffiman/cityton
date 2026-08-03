export type FaqAudience = "client" | "partner" | "shared";

export type FaqItem = {
  id: string;
  audience: FaqAudience[];
  /** Keys under faq.items.<id>.{q,a} in messages */
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "howLong",
    audience: ["client", "shared"],
  },
  {
    id: "removeable",
    audience: ["client", "shared"],
  },
  {
    id: "outdoorIndoor",
    audience: ["client", "shared"],
  },
  {
    id: "darkness",
    audience: ["client", "shared"],
  },
  {
    id: "warranty",
    audience: ["client", "partner", "shared"],
  },
  {
    id: "pricing",
    audience: ["client", "partner", "shared"],
  },
  {
    id: "partnerModels",
    audience: ["partner"],
  },
  {
    id: "responseTime",
    audience: ["partner", "shared"],
  },
  {
    id: "securityCert",
    audience: ["client", "partner", "shared"],
  },
];

export function getFaqIds(audience: FaqAudience, limit?: number): string[] {
  const ids = FAQ_ITEMS.filter((f) => f.audience.includes(audience)).map(
    (f) => f.id,
  );
  return limit ? ids.slice(0, limit) : ids;
}
