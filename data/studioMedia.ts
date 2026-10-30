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
} as const satisfies Record<string, StudioPhoto>;
