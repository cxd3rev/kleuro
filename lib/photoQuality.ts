import jpeg from "jpeg-js";

export type QualityIssue = "dark" | "small" | "no-house";

export const QUALITY_MESSAGES: Record<QualityIssue, string> = {
  dark: "Deze foto is erg donker. Je kunt toch doorgaan, maar een lichtere foto geeft vaak een beter beeld.",
  small:
    "Deze foto is vrij klein. Je kunt toch doorgaan, maar een scherpere foto werkt beter.",
  "no-house":
    "Het is niet duidelijk of er een woning op de foto staat. Je kunt toch doorgaan.",
};

function base64ToUint8Array(base64: string) {
  const clean = base64.replace(/^data:[^;]+;base64,/, "");
  const chars = atob(clean);
  const bytes = new Uint8Array(chars.length);
  for (let index = 0; index < chars.length; index += 1) {
    bytes[index] = chars.charCodeAt(index);
  }
  return bytes;
}

export function inspectImageQuality(options: {
  width: number;
  height: number;
  jpegBase64?: string | null;
}) {
  const issues: QualityIssue[] = [];

  if (options.width < 360 || options.height < 360) {
    issues.push("small");
  }

  if (!options.jpegBase64) {
    return issues;
  }

  try {
    const decoded = jpeg.decode(base64ToUint8Array(options.jpegBase64), {
      useTArray: true,
    });
    const pixels = decoded.data;
    let total = 0;
    let samples = 0;

    for (let index = 0; index < pixels.length; index += 16) {
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      total += (r + g + b) / 3;
      samples += 1;
    }

    if (samples === 0) {
      return issues;
    }

    const mean = total / samples;
    if (mean < 32) {
      issues.push("dark");
    }

    let variance = 0;
    for (let index = 0; index < pixels.length; index += 16) {
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const luminance = (r + g + b) / 3;
      const delta = luminance - mean;
      variance += delta * delta;
    }

    const stdDev = Math.sqrt(variance / samples);
    if (stdDev < 11) {
      issues.push("no-house");
    }
  } catch {
    return issues;
  }

  return issues;
}
