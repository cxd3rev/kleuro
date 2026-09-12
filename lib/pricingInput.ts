import {
  calculateIndicativeRange,
  includedWorks,
  type PriceRange,
} from "../config/pricing";
import type { ProjectDetails } from "../context/ProjectContext";

export function parseOptionalNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) {
    return undefined;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function priceRangeFromDetails(details: ProjectDetails): PriceRange {
  return calculateIndicativeRange({
    facadeM2: parseOptionalNumber(details.facadeM2),
    doorCount: details.doorCount || undefined,
    garageDoorCount: details.garageDoorCount || undefined,
    windowM2: parseOptionalNumber(details.windowM2),
  });
}

export function includedWorkIds() {
  return [...includedWorks];
}
