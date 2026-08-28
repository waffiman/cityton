/**
 * /ueber-uns structural data — image paths only. Copy lives in messages
 * under `about.*`; item order/keys here must match the message keys.
 */

export const about = {
  image: { src: "/media/owner.jpg" },

  team: {
    main: { src: "/media/glass-work.JPG" },
    side: [{ src: "/media/material-2.png" }, { src: "/media/prof-montage.JPG" }],
  },

  onsite: {
    images: [
      { src: "/media/referenzen/gallery_2.png" },
      { src: "/media/referenzen/reflective-facade-upscaled.jpg" },
      { src: "/media/referenzen/gallery_9.JPG" },
    ],
    cta: { href: "/gallery" },
  },

  peopleSteps: {
    items: [
      { key: "step1", num: "01", image: { src: "/media/measurement.JPG" } },
      { key: "step2", num: "02", image: { src: "/media/montage.png" } },
      { key: "step3", num: "03", image: { src: "/media/handshake-full.png" } },
    ],
  },

  partners: [
    {
      key: "llumar",
      logo: { src: "/media/logo-llumar.png", width: 120, height: 30 },
      href: "https://www.llumar.at",
    },
    {
      key: "armolan",
      logo: { src: "/media/logo-armolan.png", width: 160, height: 44 },
      href: "https://armolan.eu",
    },
  ],

  why: { keys: ["item1", "item2", "item3", "item4"] as const },


  finalCta: { cta: { href: "/kontakt" } },
};
