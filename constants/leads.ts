export const LEAD_STATUSES = [
  "nieuw",
  "gecontacteerd",
  "geïnteresseerd",
  "klant",
  "niet geïnteresseerd",
  "gesloten",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const emptyContactDraft = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  message: "",
  processingConsent: false,
  marketingConsent: false,
};

export type ContactDraft = typeof emptyContactDraft;
