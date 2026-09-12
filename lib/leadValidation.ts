import type { ContactDraft } from "../constants/leads";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadFieldErrors = Partial<
  Record<
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "processingConsent",
    string
  >
>;

export function validateLeadDraft(draft: ContactDraft): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (!draft.firstName.trim()) {
    errors.firstName = "Vul je voornaam in.";
  } else if (draft.firstName.trim().length > 80) {
    errors.firstName = "Gebruik maximaal 80 tekens.";
  }
  if (!draft.lastName.trim()) {
    errors.lastName = "Vul je achternaam in.";
  } else if (draft.lastName.trim().length > 80) {
    errors.lastName = "Gebruik maximaal 80 tekens.";
  }
  if (!draft.email.trim()) {
    errors.email = "Vul je e-mailadres in.";
  } else if (!EMAIL_PATTERN.test(draft.email.trim()) || draft.email.trim().length > 254) {
    errors.email = "Vul een geldig e-mailadres in.";
  }

  const digits = draft.phone.replace(/\D/g, "");
  if (!draft.phone.trim()) {
    errors.phone = "Vul je telefoonnummer in.";
  } else if (digits.length < 8 || draft.phone.trim().length > 40) {
    errors.phone = "Vul een geldig telefoonnummer in.";
  }

  if (!draft.processingConsent) {
    errors.processingConsent =
      "Bevestig dat we je gegevens mogen gebruiken om je aanvraag te behandelen.";
  }

  return errors;
}
