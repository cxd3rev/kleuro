export type PaintPreset = {
  name: string;
  hex: string;
};

export type PaintGroup = {
  title: string;
  colors: PaintPreset[];
};

export const PAINT_GROUPS: PaintGroup[] = [
  {
    title: "Neutraal",
    colors: [
      { name: "Wit", hex: "#F7F7F5" },
      { name: "Gebroken wit", hex: "#F2EFE6" },
      { name: "Crème", hex: "#F3E6C8" },
      { name: "Lichtgrijs", hex: "#D5D5D2" },
      { name: "Middengrijs", hex: "#8E8E8E" },
      { name: "Antraciet", hex: "#3A3A3A" },
      { name: "Zwart", hex: "#1A1A1A" },
    ],
  },
  {
    title: "Warm",
    colors: [
      { name: "Beige", hex: "#D9C3A3" },
      { name: "Zand", hex: "#C4A574" },
      { name: "Taupe", hex: "#8B7355" },
      { name: "Terracotta", hex: "#C0653A" },
      { name: "Baksteenrood", hex: "#8B3A2F" },
      { name: "Bordeaux", hex: "#6B1E2A" },
    ],
  },
  {
    title: "Groen",
    colors: [
      { name: "Salie", hex: "#9AAF92" },
      { name: "Olijf", hex: "#6B7F3B" },
      { name: "Mosgroen", hex: "#4A6B4A" },
      { name: "Donkergroen", hex: "#2F4A3C" },
      { name: "Flessengroen", hex: "#1F3D2B" },
    ],
  },
  {
    title: "Blauw",
    colors: [
      { name: "Lichtblauw", hex: "#A9C4D6" },
      { name: "Staalgrijsblauw", hex: "#5E7385" },
      { name: "Petrol", hex: "#2F5D62" },
      { name: "Donkerblauw", hex: "#1E3A5F" },
      { name: "Marine", hex: "#152238" },
    ],
  },
  {
    title: "Geel en oker",
    colors: [
      { name: "Zachtgeel", hex: "#F0E0A0" },
      { name: "Oker", hex: "#C9A227" },
      { name: "Mosterd", hex: "#B8860B" },
    ],
  },
  {
    title: "Rood en paars",
    colors: [
      { name: "Zalm", hex: "#E08B7A" },
      { name: "Koraal", hex: "#D45D4A" },
      { name: "Pruim", hex: "#5C3A5C" },
    ],
  },
];

export const PAINT_PRESETS: PaintPreset[] = PAINT_GROUPS.flatMap(
  (group) => group.colors,
);

export type ColorChoice = {
  hex: string;
  label: string;
};

const HEX_PATTERN = /^#?([0-9A-Fa-f]{6})$/;

export function normalizeHex(value: string) {
  const match = value.trim().match(HEX_PATTERN);
  if (!match) {
    return null;
  }
  return `#${match[1].toUpperCase()}`;
}

export function presetByHex(hex: string) {
  return PAINT_PRESETS.find((item) => item.hex.toUpperCase() === hex.toUpperCase());
}
