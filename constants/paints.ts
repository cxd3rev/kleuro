export type PaintPreset = {
  name: string;
  hex: string;
};

export const PAINT_PRESETS: PaintPreset[] = [
  { name: "Wit", hex: "#F7F7F5" },
  { name: "Gebroken wit", hex: "#F2EFE6" },
  { name: "Lichtgrijs", hex: "#D5D5D2" },
  { name: "Middengrijs", hex: "#8E8E8E" },
  { name: "Antraciet", hex: "#3A3A3A" },
  { name: "Zwart", hex: "#1A1A1A" },
  { name: "Beige", hex: "#D9C3A3" },
  { name: "Zand", hex: "#C4A574" },
  { name: "Donkergroen", hex: "#2F4A3C" },
  { name: "Donkerblauw", hex: "#1E3A5F" },
  { name: "Baksteenrood", hex: "#8B3A2F" },
];

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
