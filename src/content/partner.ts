/**
 * B2B partner page structural data. Copy lives in messages under `partner.*`.
 * Interest values are persisted into Inquiry.objektart when source="partner".
 */

export const interestValues = [
  "recommendation",
  "project",
  "montage",
  "other",
] as const;

export type InterestValue = (typeof interestValues)[number];

export const audienceKeys = [
  "broker",
  "facility",
  "glazier",
  "architect",
  "interior",
  "sunshade",
  "developer",
] as const;

export const solutionKeys = ["sun", "uv", "privacy", "safety"] as const;

export const processKeys = [
  "referral",
  "consult",
  "select",
  "install",
  "support",
  "payout",
] as const;

export const serviceKeys = [
  "advice",
  "film",
  "measure",
  "material",
  "montage",
  "warranty",
] as const;

export const contributionKeys = ["spot", "forward", "noTech", "accompany"] as const;

export const advantageKeys = [
  "value",
  "expert",
  "noOps",
  "montage",
  "payout",
  "longterm",
] as const;

export const modelKeys = ["recommend", "project"] as const;

export const refItems = [
  {
    src: "/media/install-shopfront.jpg",
    altKey: "shopAlt",
    captionKey: "shop",
    wide: true,
  },
  {
    src: "/media/facade-wide-crop.jpg",
    altKey: "houseAlt",
    captionKey: "house",
    wide: true,
  },
  {
    src: "/media/interior-2.jpg",
    altKey: "interiorAlt",
    captionKey: "interior",
    wide: false,
  },
  {
    src: "/media/gallery_7.JPG",
    altKey: "glassAlt",
    captionKey: "glass",
    wide: false,
  },
  {
    src: "/media/gallery_9.JPG",
    altKey: "facadeAlt",
    captionKey: "facade",
    wide: false,
  },
  {
    src: "/media/prof-montage.JPG",
    altKey: "officeAlt",
    captionKey: "office",
    wide: false,
  },
] as const;

export const heroImage = {
  src: "/media/Architect-1.jpg",
  altKey: "heroAlt",
} as const;
