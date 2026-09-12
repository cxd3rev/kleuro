import type { WorkId } from "../config/pricing";

export const WORK_OPTIONS: { id: WorkId; label: string }[] = [
  { id: "clean", label: "Reinigen" },
  { id: "sand", label: "Schuren" },
  { id: "repairs", label: "Kleine herstellingen" },
  { id: "primer", label: "Primer / grondlaag" },
  { id: "paint", label: "Schilderen" },
  { id: "extraCoats", label: "Meerdere lagen schilderen" },
];
