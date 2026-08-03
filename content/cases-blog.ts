import { media } from "./media";

export type CaseStudy = {
  slug: string;
  draft?: boolean;
  objectType: "residential" | "office" | "retail" | "security" | "other";
  filmSeries: string;
  image: string;
  images?: string[];
  /** TODO: content — confirm m² */
  areaSqm?: number | null;
  /** TODO: content — confirm duration label */
  duration?: string | null;
  de: { title: string; excerpt: string; body: string[] };
  en: { title: string; excerpt: string; body: string[] };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "vienna-shopfront",
    draft: true,
    objectType: "retail",
    filmSeries: "serie-r",
    image: media.cases.viennaShopfront,
    images: [media.cases.viennaShopfront, media.cases.viennaShopfront2],
    areaSqm: null,
    duration: null,
    de: {
      title: "Schaufenster-Montage in Wien",
      excerpt:
        "Professionelle Verklebung einer reflektierenden Sonnenschutzfolie an einem Erdgeschoss-Schaufenster — inkl. Vorbereitung, Zuschnitt und Nachkontrolle.",
      body: [
        "Für ein Geschäftslokal in Wien montierte das City-Ton-Team eine reflektierende Sonnenschutzfolie auf die Schaufensterfläche. Ziel: Hitze und Blendung reduzieren, ohne die Fassadenwirkung zu zerstören.",
        "Die Montage erfolgte bei laufendem Betrieb: Reinigung, Zuschnitt vor Ort, blasenfreie Verklebung und abschließende Qualitätskontrolle. Die Folie verbessert den Komfort hinter dem Glas und schützt Auslagen vor UV-Belastung.",
        "DRAFT: Inhalte und Kennzahlen bitte mit dem Kunden freigeben.",
      ],
    },
    en: {
      title: "Shopfront installation in Vienna",
      excerpt:
        "Professional installation of reflective solar-control film on a ground-floor shopfront — including preparation, cutting and final inspection.",
      body: [
        "For a retail unit in Vienna, the City-Ton team installed reflective solar-control film on the shopfront glass. The goal: reduce heat and glare without compromising the façade.",
        "Installation happened during business hours: cleaning, on-site cutting, bubble-free application and final quality control. The film improves comfort behind the glass and protects displays from UV.",
        "DRAFT: please confirm copy and metrics with the client.",
      ],
    },
  },
  {
    slug: "reflective-facade",
    draft: true,
    objectType: "residential",
    filmSeries: "serie-r",
    image: media.cases.reflectiveFacade,
    images: [media.cases.reflectiveFacade, media.photos.reflectiveFacade2],
    areaSqm: null,
    duration: null,
    de: {
      title: "Reflektierende Fassadenfolie — Wohnobjekt",
      excerpt:
        "Sichtbare Spiegelwirkung und Hitzereduktion an einer modernen Fensterfassade — dokumentiert nach der Montage.",
      body: [
        "An einem Wohnobjekt mit großflächigen Fenstern wurde eine reflektierende Folie montiert. Das Ergebnis: klarer Sichtschutz von außen bei Tageslicht und spürbar kühlere Räume im Innenbereich.",
        "Die Aufnahme zeigt die typische Spiegelung von Himmel und Bäumen — ein starkes Argument für Serie-R-Lösungen bei starker Sonneneinstrahlung.",
        "DRAFT: Objektadresse und exakte Folienvariante ergänzen.",
      ],
    },
    en: {
      title: "Reflective façade film — residential",
      excerpt:
        "Visible mirror effect and heat reduction on a modern window façade — documented after installation.",
      body: [
        "Reflective film was installed on a residential property with large glazing. Result: clear daytime privacy from outside and noticeably cooler interiors.",
        "The photo shows the typical reflection of sky and trees — a strong case for Serie R solutions under strong solar load.",
        "DRAFT: add property address and exact film variant.",
      ],
    },
  },
];

export function getCase(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export type BlogDiagram =
  | "temperature"
  | "uv-flow"
  | "glass-impact"
  | "solar";

export type BlogPost = {
  slug: string;
  draft?: boolean;
  category: string;
  tags: string[];
  publishedAt: string;
  image: string;
  diagram?: BlogDiagram;
  de: { title: string; excerpt: string; body: string[]; pullQuote?: string };
  en: { title: string; excerpt: string; body: string[]; pullQuote?: string };
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-solar-film",
    draft: true,
    category: "Ratgeber",
    tags: ["Sonnenschutz", "Energie"],
    publishedAt: "2026-07-01",
    image: media.photos.reflectiveFacade,
    diagram: "temperature",
    de: {
      title: "Warum Fensterfolie oft die bessere Alternative zur Klimaanlage ist",
      excerpt:
        "Weniger Hitze, weniger Blendung, niedrigere Kühlkosten — ohne aufwendigen Umbau.",
      pullQuote: "Die größte Sommer-Wärmequelle ist oft die Sonne durchs Glas.",
      body: [
        "In vielen Gebäuden ist die größte Wärmequelle im Sommer nicht die Heizung, sondern die Sonne durchs Glas. Sonnenschutzfolie reduziert die eindringende Energie bereits am Fenster.",
        "Im Vergleich zu einer nachgerüsteten Klimaanlage entstehen keine laufenden Stromkosten in gleicher Höhe, und die Optik der Fassade bleibt erhalten.",
        "DRAFT: Bitte fachlich freigeben.",
      ],
    },
    en: {
      title: "Why window film is often smarter than adding air conditioning",
      excerpt:
        "Less heat, less glare, lower cooling costs — without a major retrofit.",
      pullQuote: "The biggest summer heat source is often sunlight through glass.",
      body: [
        "In many buildings the biggest summer heat source is not heating equipment but sunlight through glass. Solar film reduces incoming energy at the window.",
        "Compared with retrofitting air conditioning, running electricity costs stay lower and the façade look is preserved.",
        "DRAFT: please review for technical accuracy.",
      ],
    },
  },
  {
    slug: "uv-protection-displays",
    draft: true,
    category: "Produkte",
    tags: ["UV", "Schaufenster"],
    publishedAt: "2026-07-15",
    image: media.photos.detailPortrait,
    diagram: "uv-flow",
    de: {
      title: "UV-Schutz für Auslagen: bis zu 99,9 % ohne dunkle Tönung",
      excerpt:
        "Hochtransparente UV-Folien schützen Möbel, Textilien und Waren vor dem Ausbleichen.",
      pullQuote: "Bis zu 99,9 % UV-Schutz bei höchster Transparenz.",
      body: [
        "UV Protection Clear blockiert nahezu die gesamte UV-Strahlung und bleibt dabei nahezu unsichtbar — ideal für Museen, Juweliere und Premium-Schaufenster.",
        "DRAFT: Anwendungsbeispiele ergänzen.",
      ],
    },
    en: {
      title: "UV protection for displays: up to 99.9% without dark tint",
      excerpt:
        "High-clarity UV films protect furniture, textiles and merchandise from fading.",
      pullQuote: "Up to 99.9% UV protection at maximum clarity.",
      body: [
        "UV Protection Clear blocks nearly all UV while staying almost invisible — ideal for museums, jewellers and premium shopfronts.",
        "DRAFT: add application examples.",
      ],
    },
  },
  {
    slug: "safety-film-basics",
    draft: true,
    category: "Sicherheit",
    tags: ["Safety", "Splitterschutz"],
    publishedAt: "2026-08-01",
    image: media.photos.architectureDetail,
    diagram: "glass-impact",
    de: {
      title: "Sicherheitsfolie: Was Splitterschutz wirklich leistet",
      excerpt:
        "Bei Stoß verteilt sich die Kraft — und das Glas bleibt im Rahmen.",
      pullQuote: "Bei Stoß verteilt sich die Kraft über die gesamte Glasfläche.",
      body: [
        "Sicherheitsfolien halten Glassplitter zusammen und erschweren das Eindringen. Sie ersetzen keine Alarmanlage, erhöhen aber den Widerstand spürbar.",
        "DRAFT: Zertifizierungsstandard ergänzen, sobald vom Hersteller bestätigt.",
      ],
    },
    en: {
      title: "Security film: what shatter protection really does",
      excerpt:
        "On impact, force is distributed — and the glass stays in the frame.",
      pullQuote: "On impact, force is distributed across the entire glass surface.",
      body: [
        "Security films hold shards together and deter intrusion. They do not replace an alarm system, but they meaningfully increase resistance.",
        "DRAFT: add certification standard once confirmed by the manufacturer.",
      ],
    },
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
