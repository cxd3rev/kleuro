import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { inspectImageQuality, QUALITY_MESSAGES, type QualityIssue } from "./photoQuality";

const ALLOWED_MIME = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp"]);

export type ProcessedPhoto = {
  uri: string;
  base64: string;
  mimeType: "image/jpeg";
  width: number;
  height: number;
  warnings: QualityIssue[];
};

export const unsupportedTypeMessage =
  "Dit bestandstype wordt niet ondersteund. Gebruik JPG, JPEG, PNG of WebP.";

export function isAllowedImage(options: {
  mimeType?: string | null;
  fileName?: string | null;
  uri?: string | null;
}) {
  const mime = options.mimeType?.toLowerCase();
  if (mime && ALLOWED_MIME.has(mime)) {
    return true;
  }

  const name = (options.fileName || options.uri || "").toLowerCase();
  const extension = name.split("?")[0].split("#")[0].split(".").pop();
  return Boolean(extension && ALLOWED_EXT.has(extension));
}

export async function processPhoto(asset: {
  uri: string;
  width?: number;
  height?: number;
  mimeType?: string | null;
  fileName?: string | null;
}): Promise<ProcessedPhoto> {
  if (!isAllowedImage(asset)) {
    throw new Error("UNSUPPORTED_TYPE");
  }

  const width = asset.width ?? 1600;
  const actions: ImageManipulator.Action[] =
    width > 1600 ? [{ resize: { width: 1600 } }] : [];

  const compressed = await ImageManipulator.manipulateAsync(asset.uri, actions, {
    compress: 0.7,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });

  if (!compressed.base64) {
    throw new Error("PROCESS_FAILED");
  }

  const thumb = await ImageManipulator.manipulateAsync(
    compressed.uri,
    [{ resize: { width: 48 } }],
    {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    },
  );

  const warnings = inspectImageQuality({
    width: compressed.width,
    height: compressed.height,
    jpegBase64: thumb.base64,
  });

  return {
    uri: compressed.uri,
    base64: compressed.base64,
    mimeType: "image/jpeg",
    width: compressed.width,
    height: compressed.height,
    warnings,
  };
}

export async function pickFromLibrary() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error("LIBRARY_PERMISSION");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: 0.9,
    exif: false,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return processPhoto(result.assets[0]);
}

export function warningText(issue: QualityIssue) {
  return QUALITY_MESSAGES[issue];
}
