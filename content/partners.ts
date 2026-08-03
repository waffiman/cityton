/**
 * Technology partner brand assets and official website URLs.
 * Logos must always be wrapped in a link to these URLs.
 */
export const PARTNERS = {
  armolan: {
    name: "Armolan Europe",
    href: "https://www.armolan.com/",
    logo: "/brand/Armolan-logo.png",
    /** White-outline logo — needs a dark surface */
    onDark: true,
    width: 200,
    height: 70,
  },
  llumar: {
    name: "LLumar",
    href: "https://www.llumar.com/",
    logo: "/brand/Llumar-Logo.jpg",
    onDark: false,
    width: 200,
    height: 125,
  },
} as const;

export type PartnerId = keyof typeof PARTNERS;
