import { getApiBaseUrl } from "./config";
import type { ColorChoice } from "../constants/paints";
import type { SurfaceResult } from "../constants/surfaces";
import { mapAnalysisToSurfaces } from "../constants/surfaces";

function userFacingApiError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message === "API_URL_MISSING") {
    return new Error("API_URL_MISSING");
  }
  return new Error(fallback);
}

export function apiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message === "API_URL_MISSING") {
    return "De app kan de server nu niet bereiken. Probeer het later opnieuw.";
  }
  return fallback;
}

export type AnalysisResponse = {
  houseVisible: boolean;
  tooDark: boolean;
  surfaces: SurfaceResult[];
};

export async function analyzeHomePhoto(options: {
  imageBase64: string;
  mimeType: string;
}): Promise<AnalysisResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: options.imageBase64,
        mimeType: options.mimeType,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("ANALYSIS_FAILED");
    }

    const payload = await response.json();
    return {
      houseVisible: payload.houseVisible !== false,
      tooDark: payload.tooDark === true,
      surfaces: mapAnalysisToSurfaces(payload.surfaces ?? []),
    };
  } catch (error) {
    throw userFacingApiError(error, "ANALYSIS_FAILED");
  } finally {
    clearTimeout(timeout);
  }
}

export async function visualizeHomePhoto(options: {
  imageBase64: string;
  mimeType: string;
  paints: {
    id: string;
    surfaceName: string;
    color: ColorChoice;
  }[];
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/visualize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("VISUALIZATION_FAILED");
    }

    const payload = await response.json();
    if (!payload.imageBase64) {
      throw new Error("VISUALIZATION_FAILED");
    }

    const mimeType = payload.mimeType === "image/png" ? "image/png" : "image/jpeg";
    return `data:${mimeType};base64,${payload.imageBase64}`;
  } catch (error) {
    throw userFacingApiError(error, "VISUALIZATION_FAILED");
  } finally {
    clearTimeout(timeout);
  }
}

export async function submitLead(payload: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("LEAD_FAILED");
    }

    return response.json();
  } catch (error) {
    throw userFacingApiError(error, "LEAD_FAILED");
  } finally {
    clearTimeout(timeout);
  }
}
