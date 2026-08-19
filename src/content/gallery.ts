/**
 * Gallery page copy. Images are discovered from
 * public/media/referenzen/ at request time — drop files there, no CMS list.
 * Captions are keyed by filename (edit here when real project/film names arrive).
 */

export type GalleryCaption = {
  project: string;
  film: string;
};

export const gallery = {
  title: "Objekte, an denen die Folie arbeitet",
  lead:
    "Ein Ausschnitt aus montierten Projekten — Fassaden, Innenräume und Schutzfolierungen. Tippen Sie ein Bild an, um es zu vergrößern.",
  empty:
    "Noch keine Fotos hinterlegt. Legen Sie Bilder in public/media/referenzen/ ab — die Gallery aktualisiert sich nach dem Neuladen.",
  /** Fallback when a file has no entry in `captions`. */
  captionFallback: {
    project: "Projekt",
    film: "Folie auf Anfrage",
  } satisfies GalleryCaption,
  captions: {
    "gallery_1.png": {
      project: "Wohnobjekt · Sonnenschutz",
      film: "Dual Reflective Serie",
    },
    "gallery_2.png": {
      project: "Fassade · Tageslicht",
      film: "LLumar Architectural",
    },
    "gallery_4.png": {
      project: "Wohnobjekt · Dual Reflective",
      film: "Armolan Dual Reflective",
    },
    "gallery_5.JPG": {
      project: "Büro · Blendschutz",
      film: "Sonnenschutzfolie",
    },
    "gallery_7.JPG": {
      project: "Gewerbeobjekt",
      film: "Sicherheitsfolie",
    },
    "gallery_8.jpg": {
      project: "Schaufenster",
      film: "UV-Schutzfolie",
    },
    "gallery_9.JPG": {
      project: "Innenraum · Privatsphäre",
      film: "Sichtschutzfolie",
    },
    "gallery_10.JPG": {
      project: "Fassadenband",
      film: "Energiesparfolie",
    },
    "interior-2.jpg": {
      project: "Interieur · Glaswand",
      film: "Sonnenschutzfolie",
    },
    "photo_2026-08-14_23-59-53.jpg": {
      project: "Montageobjekt",
      film: "Folie auf Anfrage",
    },
    "reflective-facade-upscaled.jpg": {
      project: "Reflektierende Fassade",
      film: "Dual Reflective Serie",
    },
  } satisfies Record<string, GalleryCaption>,
};
