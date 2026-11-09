import type { TopicSummaryDto } from "@assetizers/shared";

export type AreaKey = "main-course" | "practice-bites" | "specials";

export interface AreaConfig {
  key: AreaKey;
  label: string;
  /** Fill/border accent (CSS variable). */
  accent: string;
  /** Accessible text color for the accent. */
  accentText: string;
  hubCaption?: string;
  listCaption?: string;
  /** "pill": area pill + category heading. "inline": "Area • Category" heading. */
  listHeading: "pill" | "inline";
  includes: (topic: TopicSummaryDto) => boolean;
}

export const AREAS: Record<AreaKey, AreaConfig> = {
  "main-course": {
    key: "main-course",
    label: "Main Course",
    accent: "var(--area-main-course)",
    accentText: "var(--area-main-course-text)",
    hubCaption: "Take a bite!",
    listCaption: "Savor your choice!",
    listHeading: "pill",
    includes: (topic) => topic.lessonCount > 0,
  },
  "practice-bites": {
    key: "practice-bites",
    label: "Practice Bites",
    accent: "var(--area-practice-bites)",
    accentText: "var(--area-practice-bites-text)",
    listHeading: "inline",
    includes: (topic) => topic.activityId !== null,
  },
  specials: {
    key: "specials",
    label: "Specials",
    accent: "var(--area-specials)",
    accentText: "var(--area-specials-text)",
    listHeading: "inline",
    includes: (topic) => topic.caseStudyId !== null,
  },
};

export const AREA_LIST = Object.values(AREAS);

const CATEGORY_ACCENTS: Record<string, { accent: string; accentText: string }> = {
  current: { accent: "var(--category-current)", accentText: "var(--category-current-text)" },
  "non-current": {
    accent: "var(--category-non-current)",
    accentText: "var(--category-non-current-text)",
  },
};

export function categoryAccent(slug: string) {
  return (
    CATEGORY_ACCENTS[slug] ?? {
      accent: "var(--color-orange)",
      accentText: "var(--color-orange-strong)",
    }
  );
}

export const FALLBACK_ILLUSTRATION = "/illustrations/plate.svg";

export const paths = {
  home: () => "/",
  area: (area: AreaKey) => `/${area}`,
  category: (area: AreaKey, category: string) => `/${area}/${category}`,
  topic: (area: AreaKey, category: string, topic: string) => `/${area}/${category}/${topic}`,
};
