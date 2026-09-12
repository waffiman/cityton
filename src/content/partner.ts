/**
 * /partner structural data — keys, icons, image paths, step numbers.
 * German copy lives in the page component (this route is DE-only).
 */

export type PartnerIconName =
  | "key"
  | "buildings"
  | "glass"
  | "compass"
  | "interior"
  | "awning"
  | "crane"
  | "sun"
  | "uv"
  | "privacy"
  | "safety"
  | "consult"
  | "layers"
  | "measure"
  | "material"
  | "install"
  | "warranty";

export const audiences: { key: string; icon: PartnerIconName }[] = [
  { key: "makler", icon: "key" },
  { key: "facility", icon: "buildings" },
  { key: "glaserei", icon: "glass" },
  { key: "architekt", icon: "compass" },
  { key: "interior", icon: "interior" },
  { key: "gebaeudetechnik", icon: "awning" },
  { key: "bautraeger", icon: "crane" },
];

export const solutions: { key: string; icon: PartnerIconName }[] = [
  { key: "sonne", icon: "sun" },
  { key: "uv", icon: "uv" },
  { key: "sicht", icon: "privacy" },
  { key: "sicherheit", icon: "safety" },
];

export const processSteps: { key: string; num: string; img: string }[] = [
  { key: "anfrage", num: "01", img: "/media/consult.jpg" },
  { key: "beratung", num: "02", img: "/media/install-detail.jpg" },
  { key: "kalkulation", num: "03", img: "/media/material-2.png" },
  { key: "montage", num: "04", img: "/media/install-work-1.jpg" },
  { key: "betreuung", num: "05", img: "/media/after.jpg" },
  { key: "verguetung", num: "06", img: "/media/handshake-full.png" },
];

export const services: { key: string; icon: PartnerIconName }[] = [
  { key: "beratung", icon: "consult" },
  { key: "auswahl", icon: "layers" },
  { key: "aufmass", icon: "measure" },
  { key: "material", icon: "material" },
  { key: "montage", icon: "install" },
  { key: "garantie", icon: "warranty" },
];

export const contributions = ["bedarf", "kontakt", "aufwand", "begleitung"] as const;

export const benefits = [
  "mehrwert",
  "ansprechpartner",
  "aufwand",
  "montage",
  "verguetung",
  "langfristig",
] as const;

export const models: { key: string; role: string; inverted?: boolean }[] = [
  { key: "empfehlung", role: "Sie empfehlen" },
  { key: "projekt", role: "Wir führen aus", inverted: true },
];

export const references: { src: string; caption: string; alt: string }[] = [
  {
    src: "/media/install-shopfront.jpg",
    caption: "Geschäftslokal, Wien",
    alt: "City-Ton Montage an einer Schaufensterfront in Wien",
  },
  {
    src: "/media/facade-wide-crop.jpg",
    caption: "Montage vor Ort, Einfamilienhaus",
    alt: "Fachgerechte Folienmontage an einem Einfamilienhaus",
  },
  {
    src: "/media/referenzen/interior-2.jpg",
    caption: "Wohnung, große Fensterfront",
    alt: "Wohnung mit großer verglaster Fensterfront",
  },
  {
    src: "/media/referenzen/gallery_7.JPG",
    caption: "Verglaste Fensterfront, Sonnenschutzfolie",
    alt: "Sonnenschutzfolie an einer verglasten Wohnungsfront",
  },
  {
    src: "/media/referenzen/gallery_9.JPG",
    caption: "Fassade, Mehrparteienhaus",
    alt: "Reflektierende Fassadenfolien an einem Mehrparteienhaus",
  },
  {
    src: "/media/prof-montage.JPG",
    caption: "Montageprozess, Büroobjekt",
    alt: "Montage einer Sichtschutzfolie an einem Bürofenster",
  },
];

export const interestOptions = [
  { value: "empfehlung", label: "Empfehlungsmodell" },
  { value: "projekte", label: "Zusammenarbeit bei Projekten" },
  { value: "montage", label: "Montagepartner / Subunternehmer" },
  { value: "sonstige", label: "Sonstige Zusammenarbeit" },
] as const;

export type InterestValue = (typeof interestOptions)[number]["value"];
