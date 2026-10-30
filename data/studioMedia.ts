/**
 * Licensed representative photography, not Catalyst staff, clients or premises.
 * Provenance and replacement guidance: docs/studio-media-sources.md.
 */
export type StudioPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  sourceUrl: string;
  licenseUrl: string;
  label: string;
};

export const studioPhotos = {
  manufacturing: {
    src: "/studio/manufacturing.webp",
    width: 1400,
    height: 1000,
    alt: "Two workers guide a suspended metal component on a factory floor.",
    credit: "Photo by Cemrecan Yurtman on Unsplash",
    sourceUrl:
      "https://unsplash.com/photos/a-factory-filled-with-lots-of-machines-and-workers-WysVHhi69js",
    licenseUrl: "https://unsplash.com/license",
    label: "Representative photography",
  },
  planning: {
    src: "/studio/planning.webp",
    width: 1200,
    height: 900,
    alt: "Two colleagues organize yellow sticky notes on a glass planning wall.",
    credit: "Photo by airfocus on Unsplash",
    sourceUrl:
      "https://unsplash.com/photos/people-collaborating-on-project-plan-v89zhr0iBFY",
    licenseUrl: "https://unsplash.com/license",
    label: "Representative photography",
  },
  trades: {
    src: "/studio/trades.webp",
    width: 1200,
    height: 900,
    alt: "A technician uses insulated test probes to check an electrical control panel.",
    credit: "Photo by Toolmash Expo on Unsplash",
    sourceUrl:
      "https://unsplash.com/photos/electrician-testing-electrical-panel-with-multimeter-PkHf7BUWbtk",
    licenseUrl: "https://unsplash.com/license",
    label: "Representative photography",
  },
  warehouse: {
    src: "/studio/warehouse.webp",
    width: 1200,
    height: 900,
    alt: "A warehouse worker retrieves stock from a shelf while standing on a stepladder.",
    credit: "Photo by Kseniia Ilinykh on Unsplash",
    sourceUrl:
      "https://unsplash.com/photos/a-man-standing-on-a-ladder-in-a-warehouse-cNyDTmtBQbc",
    licenseUrl: "https://unsplash.com/license",
    label: "Representative photography",
  },
  office: {
    src: "/studio/office.webp",
    width: 1200,
    height: 800,
    alt: "Hands review a blank tax form beside a calculator, notebook and laptop.",
    credit: "Photo by Kelly Sikkema on Unsplash",
    sourceUrl:
      "https://unsplash.com/photos/person-reviewing-documents-with-calculator-and-laptop-0oZpRxG5Hkk",
    licenseUrl: "https://unsplash.com/license",
    label: "Representative photography",
  },
  community: {
    src: "/studio/community.webp",
    width: 1200,
    height: 800,
    alt: "An aerial view of homes, trees, playing fields and a neighborhood playground.",
    credit: "Photo by Alex Reynolds on Unsplash",
    sourceUrl:
      "https://unsplash.com/photos/aerial-view-of-suburban-neighborhood-with-park-and-trees-fI4J4hWCKRo",
    licenseUrl: "https://unsplash.com/license",
    label: "Representative photography",
  },
  plumbing: {
    src: "/studio/plumbing.webp",
    width: 1200,
    height: 900,
    alt: "A technician fits a threaded radiator pipe with plumbing tools beside the work.",
    credit: "Photo by Sergei Starostin on Pexels",
    sourceUrl:
      "https://www.pexels.com/photo/professional-plumber-installing-a-radiator-pipe-29226620/",
    licenseUrl: "https://www.pexels.com/license/",
    label: "Representative photography",
  },
  painting: {
    src: "/studio/painting.webp",
    width: 1200,
    height: 900,
    alt: "A person uses a roller to paint an interior wall beside a protected window and paint tray.",
    credit: "Photo by Tima Miroshnichenko on Pexels",
    sourceUrl:
      "https://www.pexels.com/photo/man-painting-the-wall-6474471/",
    licenseUrl: "https://www.pexels.com/license/",
    label: "Representative photography",
  },
} as const satisfies Record<string, StudioPhoto>;
