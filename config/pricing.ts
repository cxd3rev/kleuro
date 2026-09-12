export const pricingConfig = {
  cleaningPerM2: 7.5,
  sandingPerM2: 11,
  primerPerM2: 9.5,
  paintingPerM2: 26,
  extraCoatPerM2: 15,
  smallRepairsBase: 175,
  smallRepairsPerM2: 1.5,
  doorEach: 95,
  windowEach: 55,
  windowPerM2: 38,
  garageDoorEach: 220,
  minimumProject: 1500,
  assumedFacadeM2: 90,
  rangeLowFactor: 0.88,
  rangeHighFactor: 1.18,
  rounding: 100,
} as const;

export type WorkId =
  | "clean"
  | "sand"
  | "repairs"
  | "primer"
  | "paint"
  | "extraCoats";

export const includedWorks: WorkId[] = [
  "clean",
  "sand",
  "repairs",
  "primer",
  "paint",
  "extraCoats",
];

export type PricingInput = {
  facadeM2?: number;
  doorCount?: number;
  garageDoorCount?: number;
  windowM2?: number;
};

export type PriceRange = {
  low: number;
  high: number;
  midpoint: number;
  usedAssumedFacade: boolean;
  facadeM2: number;
};

function asPositiveNumber(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return value;
}

export function cleaningCost(m2: number) {
  return m2 * pricingConfig.cleaningPerM2;
}

export function sandingCost(m2: number) {
  return m2 * pricingConfig.sandingPerM2;
}

export function primerCost(m2: number) {
  return m2 * pricingConfig.primerPerM2;
}

export function paintingCost(m2: number) {
  return m2 * pricingConfig.paintingPerM2;
}

export function extraCoatCost(m2: number) {
  return m2 * pricingConfig.extraCoatPerM2;
}

export function smallRepairsCost(m2: number) {
  return pricingConfig.smallRepairsBase + m2 * pricingConfig.smallRepairsPerM2;
}

export function doorsCost(count: number) {
  return count * pricingConfig.doorEach;
}

export function windowUnitCost(count: number) {
  return count * pricingConfig.windowEach;
}

export function windowsCost(windowM2: number) {
  if (windowM2 > 0) {
    return windowM2 * pricingConfig.windowPerM2;
  }
  return 0;
}

export function garageDoorsCost(count: number) {
  return count * pricingConfig.garageDoorEach;
}

export function roundToRangeStep(value: number) {
  const step = pricingConfig.rounding;
  return Math.max(step, Math.round(value / step) * step);
}

export function calculateIndicativeRange(input: PricingInput): PriceRange {
  const usedAssumedFacade = !(asPositiveNumber(input.facadeM2) > 0);
  const facadeM2 = usedAssumedFacade
    ? pricingConfig.assumedFacadeM2
    : asPositiveNumber(input.facadeM2);
  const doorCount = asPositiveNumber(input.doorCount);
  const garageDoorCount = asPositiveNumber(input.garageDoorCount);
  const windowM2 = asPositiveNumber(input.windowM2);

  const subtotal =
    cleaningCost(facadeM2) +
    sandingCost(facadeM2) +
    smallRepairsCost(facadeM2) +
    primerCost(facadeM2) +
    paintingCost(facadeM2) +
    extraCoatCost(facadeM2) +
    doorsCost(doorCount) +
    windowsCost(windowM2) +
    garageDoorsCost(garageDoorCount);

  const midpoint = Math.max(pricingConfig.minimumProject, subtotal);
  let low = roundToRangeStep(midpoint * pricingConfig.rangeLowFactor);
  let high = roundToRangeStep(midpoint * pricingConfig.rangeHighFactor);

  if (low < pricingConfig.minimumProject) {
    low = roundToRangeStep(pricingConfig.minimumProject);
  }
  if (high <= low) {
    high = low + pricingConfig.rounding * 5;
  }

  return {
    low,
    high,
    midpoint: roundToRangeStep(midpoint),
    usedAssumedFacade,
    facadeM2,
  };
}

export function formatEuroRange(low: number, high: number) {
  return `${formatEuro(low)} – ${formatEuro(high)}`;
}

export function formatEuro(value: number) {
  return `€${value.toLocaleString("nl-NL", {
    maximumFractionDigits: 0,
  })}`;
}
