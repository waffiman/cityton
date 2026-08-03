/**
 * Typed media asset manifest — never hardcode raw filenames in pages.
 */
export const media = {
  hero: {
    landscapeMp4: "/media/hero/hero-landscape.mp4",
    landscapeWebm: "/media/hero/hero-landscape.webm",
    portraitMp4: "/media/hero/hero-portrait.mp4",
    poster: "/media/hero/hero-poster.jpg",
    processPortrait: "/media/hero/process-portrait.mp4",
  },
  loops: {
    about: {
      mp4: "/media/loops/about-loop.mp4",
      webm: "/media/loops/about-loop.webm",
      poster: "/media/loops/about-loop-poster.jpg",
    },
    clients: {
      mp4: "/media/loops/clients-loop.mp4",
      webm: "/media/loops/clients-loop.webm",
      poster: "/media/loops/clients-loop-poster.jpg",
    },
    partners: {
      mp4: "/media/loops/partners-loop.mp4",
      webm: "/media/loops/partners-loop.webm",
      poster: "/media/loops/partners-loop-poster.jpg",
    },
    cases: {
      mp4: "/media/loops/cases-loop.mp4",
      webm: "/media/loops/cases-loop.webm",
      poster: "/media/loops/cases-loop-poster.jpg",
    },
  },
  photos: {
    facadeWide: "/media/photos/facade-wide.jpg",
    interior1: "/media/photos/interior-1.jpg",
    interior2: "/media/photos/interior-2.jpg",
    detailPortrait: "/media/photos/detail-portrait.jpg",
    installTeam: "/media/photos/install-team.jpg",
    installShopfront: "/media/photos/install-shopfront.jpg",
    reflectiveFacade: "/media/photos/reflective-facade.jpg",
    reflectiveFacade2: "/media/photos/reflective-facade-2.jpg",
    modernHome: "/media/photos/modern-home.jpg",
    architectureDetail: "/media/photos/architecture-detail.jpg",
    windowClose: "/media/photos/window-close.jpg",
    installDetail: "/media/photos/install-detail.jpg",
    // Extracted from CityTonMedia/Video
    squeegee1: "/media/photos/squeegee-1.jpg",
    squeegee2: "/media/photos/squeegee-2.jpg",
    installClose1: "/media/photos/install-close-1.jpg",
    installClose2: "/media/photos/install-close-2.jpg",
    facadeWork1: "/media/photos/facade-work-1.jpg",
    glassDetail1: "/media/photos/glass-detail-1.jpg",
    processHands1: "/media/photos/process-hands-1.jpg",
    processHands2: "/media/photos/process-hands-2.jpg",
    windowFilm1: "/media/photos/window-film-1.jpg",
    windowFilm2: "/media/photos/window-film-2.jpg",
    reflective1: "/media/photos/reflective-1.jpg",
    reflective2: "/media/photos/reflective-2.jpg",
    interiorWork1: "/media/photos/interior-work-1.jpg",
    interiorWork2: "/media/photos/interior-work-2.jpg",
    processEdge1: "/media/photos/process-edge-1.jpg",
    processEdge2: "/media/photos/process-edge-2.jpg",
    filmRoll1: "/media/photos/film-roll-1.jpg",
  },
  cases: {
    viennaShopfront: "/media/cases/vienna-shopfront.jpg",
    viennaShopfront2: "/media/cases/vienna-shopfront-2.jpg",
    reflectiveFacade: "/media/cases/reflective-facade.jpg",
  },
  brand: {
    logo: "/brand/logo-header.png",
    logoFull: "/brand/logo.png",
    wordmark: "/brand/logo-wordmark.svg",
    armolan: "/brand/Armolan-logo.png",
    llumar: "/brand/Llumar-Logo.jpg",
  },
} as const;

export type PhotoKey = keyof typeof media.photos;
