import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { emptyContactDraft, type ContactDraft } from "../constants/leads";
import type { ColorChoice } from "../constants/paints";
import {
  createManualSurfaces,
  type SurfaceId,
  type SurfaceResult,
} from "../constants/surfaces";
import type { ProcessedPhoto } from "../lib/photo";
import type { QualityIssue } from "../lib/photoQuality";
import { createSessionId } from "../lib/session";

export type VisualizationResult = {
  imageUri: string;
  signature: string;
};

export type ProjectDetails = {
  facadeM2: string;
  doorCount: number;
  garageDoorCount: number;
  windowM2: string;
  extraInfo: string;
};

const emptyDetails: ProjectDetails = {
  facadeM2: "",
  doorCount: 0,
  garageDoorCount: 0,
  windowM2: "",
  extraInfo: "",
};

type ProjectContextValue = {
  sessionId: string;
  photo: ProcessedPhoto | null;
  surfaces: SurfaceResult[];
  colorChoices: Partial<Record<SurfaceId, ColorChoice>>;
  visualization: VisualizationResult | null;
  details: ProjectDetails;
  contact: ContactDraft;
  analysisFailed: boolean;
  extraWarnings: QualityIssue[];
  setPhoto: (photo: ProcessedPhoto | null) => void;
  setSurfaces: (surfaces: SurfaceResult[]) => void;
  toggleSurface: (id: SurfaceId) => void;
  setSurfaceColor: (id: SurfaceId, color: ColorChoice) => void;
  setDetails: (details: ProjectDetails) => void;
  setContact: (contact: ContactDraft) => void;
  useManualSurfaces: () => void;
  setAnalysisFailed: (failed: boolean) => void;
  setExtraWarnings: (warnings: QualityIssue[]) => void;
  setVisualization: (result: VisualizationResult | null) => void;
  resetProject: () => void;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState(createSessionId);
  const [photo, setPhotoState] = useState<ProcessedPhoto | null>(null);
  const [surfaces, setSurfaces] = useState<SurfaceResult[]>(createManualSurfaces());
  const [colorChoices, setColorChoices] = useState<
    Partial<Record<SurfaceId, ColorChoice>>
  >({});
  const [visualization, setVisualization] = useState<VisualizationResult | null>(
    null,
  );
  const [details, setDetails] = useState<ProjectDetails>(emptyDetails);
  const [contact, setContact] = useState<ContactDraft>(emptyContactDraft);
  const [analysisFailed, setAnalysisFailed] = useState(false);
  const [extraWarnings, setExtraWarnings] = useState<QualityIssue[]>([]);

  const resetProject = () => {
    setSessionId(createSessionId());
    setPhotoState(null);
    setSurfaces(createManualSurfaces());
    setColorChoices({});
    setVisualization(null);
    setDetails(emptyDetails);
    setContact(emptyContactDraft);
    setAnalysisFailed(false);
    setExtraWarnings([]);
  };

  const value = useMemo<ProjectContextValue>(
    () => ({
      sessionId,
      photo,
      surfaces,
      colorChoices,
      visualization,
      details,
      contact,
      analysisFailed,
      extraWarnings,
      setPhoto: (next) => {
        setPhotoState(next);
        setSurfaces(createManualSurfaces());
        setColorChoices({});
        setVisualization(null);
        setDetails(emptyDetails);
        setAnalysisFailed(false);
        setExtraWarnings([]);
      },
      setSurfaces,
      toggleSurface: (id) => {
        setSurfaces((current) =>
          current.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item,
          ),
        );
      },
      setSurfaceColor: (id, color) => {
        setColorChoices((current) => ({ ...current, [id]: color }));
      },
      setDetails,
      setContact,
      useManualSurfaces: () => {
        setSurfaces(createManualSurfaces());
        setAnalysisFailed(true);
        setExtraWarnings([]);
      },
      setAnalysisFailed,
      setExtraWarnings,
      setVisualization,
      resetProject,
    }),
    [
      analysisFailed,
      colorChoices,
      contact,
      details,
      extraWarnings,
      photo,
      sessionId,
      surfaces,
      visualization,
    ],
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within ProjectProvider");
  }
  return context;
}

export function colorSignature(
  surfaces: SurfaceResult[],
  colorChoices: Partial<Record<SurfaceId, ColorChoice>>,
) {
  return surfaces
    .filter((item) => item.selected)
    .map((item) => `${item.id}:${colorChoices[item.id]?.hex ?? ""}`)
    .join("|");
}
