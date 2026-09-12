export type SurfaceId =
  | "facade"
  | "window-frames"
  | "windows"
  | "doors"
  | "garage-door"
  | "shutters"
  | "eaves"
  | "other";

export type SurfaceResult = {
  id: SurfaceId;
  name: string;
  visible: boolean;
  confidence: number;
  selected: boolean;
};

export const SURFACE_CATALOG: { id: SurfaceId; name: string }[] = [
  { id: "facade", name: "Gevel" },
  { id: "window-frames", name: "Raamkozijnen" },
  { id: "windows", name: "Ramen" },
  { id: "doors", name: "Deuren" },
  { id: "garage-door", name: "Garagepoort" },
  { id: "shutters", name: "Luiken" },
  { id: "eaves", name: "Dakrand" },
  { id: "other", name: "Andere onderdelen" },
];

export function createManualSurfaces(): SurfaceResult[] {
  return SURFACE_CATALOG.map((item) => ({
    ...item,
    visible: false,
    confidence: 0,
    selected: false,
  }));
}

export function mapAnalysisToSurfaces(
  surfaces: { id: string; name?: string; visible?: boolean; confidence?: number }[],
): SurfaceResult[] {
  const byId = new Map(surfaces.map((item) => [item.id, item]));
  return SURFACE_CATALOG.map((item) => {
    const match = byId.get(item.id);
    const visible = Boolean(match?.visible);
    const confidence = Number(match?.confidence) || 0;
    return {
      ...item,
      visible,
      confidence,
      selected: visible && confidence >= 0.4,
    };
  });
}
