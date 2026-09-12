import catalog from "./surfaces-catalog.json";

export type SurfaceId = string;

export type SurfaceResult = {
  id: SurfaceId;
  name: string;
  visible: boolean;
  confidence: number;
  selected: boolean;
};

export const SURFACE_CATALOG: { id: SurfaceId; name: string }[] = catalog;

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
      selected: visible && confidence >= 0.45,
    };
  });
}
