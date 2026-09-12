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

function decodeImage(value, fallbackMime) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const match = value.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return {
      mimeType: match[1],
      buffer: Buffer.from(match[2], "base64"),
    };
  }

  return {
    mimeType: fallbackMime || "image/jpeg",
    buffer: Buffer.from(value, "base64"),
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
  }
  if (!String(body?.lastName ?? "").trim()) {
    errors.lastName = "required";
  }
  const email = String(body?.email ?? "").trim();
  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = "invalid";
  }
  const digits = String(body?.phone ?? "").replace(/\D/g, "");
  if (digits.length < 8) {
    errors.phone = "invalid";
  }
  if (body?.processingConsent !== true) {
    errors.processingConsent = "required";
  }
  return errors;
}

function normalizeLead(body) {
  return {
    session_id: String(body.sessionId).trim(),
    first_name: String(body.firstName).trim(),
    last_name: String(body.lastName).trim(),
    email: String(body.email).trim().toLowerCase(),
    phone: String(body.phone).trim(),
    address: String(body.address ?? "").trim() || null,
    message: String(body.message ?? "").trim() || null,
    selected_surfaces: Array.isArray(body.selectedSurfaces)
      ? body.selectedSurfaces
      : [],
    selected_colours: Array.isArray(body.selectedColours)
      ? body.selectedColours
      : [],
    measurements:
      body.measurements && typeof body.measurements === "object"
        ? body.measurements
        : {},
    selected_work: Array.isArray(body.selectedWork) ? body.selectedWork : [],
    estimated_min: Number.isFinite(Number(body.estimatedMin))
      ? Number(body.estimatedMin)
      : null,
    estimated_max: Number.isFinite(Number(body.estimatedMax))
      ? Number(body.estimatedMax)
      : null,
    marketing_consent: body.marketingConsent === true,
    consent_timestamp: new Date().toISOString(),
    privacy_policy_version: String(body.privacyPolicyVersion ?? "1.0"),
    source: String(body.source ?? "kleuro-app"),
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
