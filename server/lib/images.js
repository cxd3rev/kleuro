const MAX_IMAGE_BASE64_CHARS = 10_000_000;
const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function stripDataUrl(imageBase64) {
  if (!imageBase64 || typeof imageBase64 !== "string") {
    return null;
  }
  if (imageBase64.length > MAX_IMAGE_BASE64_CHARS) {
    return null;
  }
  return imageBase64.replace(/^data:[^;]+;base64,/, "");
}

function isAllowedImageMime(mimeType) {
  return ALLOWED_IMAGE_MIME.has(String(mimeType ?? "").toLowerCase());
}

module.exports = {
  MAX_IMAGE_BASE64_CHARS,
  stripDataUrl,
  isAllowedImageMime,
};
