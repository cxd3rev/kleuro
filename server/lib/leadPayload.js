const { isAllowedImageMime, stripDataUrl } = require("./images");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SESSION_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const LEAD_STATUSES = [
  "nieuw",
  "gecontacteerd",
  "geïnteresseerd",
  "klant",
  "niet geïnteresseerd",
  "gesloten",
];

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function clip(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function decodeImage(value, fallbackMime) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const match = value.match(/^data:([^;]+);base64,(.+)$/);
  const mimeType = match ? match[1] : fallbackMime || "image/jpeg";
  const encoded = match ? match[2] : value;
  if (!stripDataUrl(value) || !isAllowedImageMime(mimeType)) {
    return null;
  }

  const buffer = Buffer.from(encoded, "base64");
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) {
    return null;
  }

  return {
    mimeType: mimeType === "image/jpg" ? "image/jpeg" : mimeType,
    buffer,
  };
}

function extensionForMime(mimeType) {
  if (mimeType === "image/png") {
    return "png";
  }
  if (mimeType === "image/webp") {
    return "webp";
  }
  return "jpg";
}

function validateLeadBody(body) {
  const errors = {};
  if (!SESSION_PATTERN.test(String(body?.sessionId ?? ""))) {
    errors.sessionId = "invalid";
  }
  if (!String(body?.firstName ?? "").trim()) {
    errors.firstName = "required";
  } else if (String(body.firstName).trim().length > 80) {
    errors.firstName = "too_long";
  }
  if (!String(body?.lastName ?? "").trim()) {
    errors.lastName = "required";
  } else if (String(body.lastName).trim().length > 80) {
    errors.lastName = "too_long";
  }
  const email = String(body?.email ?? "").trim();
  if (!email || !EMAIL_PATTERN.test(email) || email.length > 254) {
    errors.email = "invalid";
  }
  const phone = String(body?.phone ?? "").trim();
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8 || phone.length > 40) {
    errors.phone = "invalid";
  }
  if (body?.processingConsent !== true) {
    errors.processingConsent = "required";
  }
  return errors;
}

function sanitizeList(items, mapFn, max = 16) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.slice(0, max).map(mapFn).filter(Boolean);
}

function normalizeLead(body) {
  const measurements =
    body.measurements && typeof body.measurements === "object"
      ? body.measurements
      : {};

  return {
    session_id: String(body.sessionId).trim(),
    first_name: clip(body.firstName, 80),
    last_name: clip(body.lastName, 80),
    email: clip(body.email, 254).toLowerCase(),
    phone: clip(body.phone, 40),
    address: clip(body.address, 200) || null,
    message: clip(body.message, 2000) || null,
    selected_surfaces: sanitizeList(body.selectedSurfaces, (item) => ({
      id: clip(item?.id, 40),
      name: clip(item?.name, 80),
    })),
    selected_colours: sanitizeList(body.selectedColours, (item) => ({
      id: clip(item?.id, 40),
      name: clip(item?.name, 80),
      hex: clip(item?.hex, 16),
      label: clip(item?.label, 80),
    })),
    measurements: {
      facadeM2: clip(measurements.facadeM2, 20),
      doorCount: Number.isFinite(Number(measurements.doorCount))
        ? Math.max(0, Math.min(99, Number(measurements.doorCount)))
        : 0,
      garageDoorCount: Number.isFinite(Number(measurements.garageDoorCount))
        ? Math.max(0, Math.min(99, Number(measurements.garageDoorCount)))
        : 0,
      windowM2: clip(measurements.windowM2, 20),
      extraInfo: clip(measurements.extraInfo, 2000),
    },
    selected_work: sanitizeList(body.selectedWork, (item) => clip(item, 40)),
    estimated_min: Number.isFinite(Number(body.estimatedMin))
      ? Number(body.estimatedMin)
      : null,
    estimated_max: Number.isFinite(Number(body.estimatedMax))
      ? Number(body.estimatedMax)
      : null,
    marketing_consent: body.marketingConsent === true,
    consent_timestamp: new Date().toISOString(),
    privacy_policy_version: clip(body.privacyPolicyVersion ?? "1.0", 20),
    source: clip(body.source ?? "kleuro-app", 40),
    lead_status: LEAD_STATUSES.includes(body.leadStatus)
      ? body.leadStatus
      : "nieuw",
  };
}

module.exports = {
  LEAD_STATUSES,
  decodeImage,
  extensionForMime,
  validateLeadBody,
  normalizeLead,
};
