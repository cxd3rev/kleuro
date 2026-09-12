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
  }
  if (!draft.lastName.trim()) {
    errors.lastName = "Vul je achternaam in.";
  }
  if (!draft.email.trim()) {
    errors.email = "Vul je e-mailadres in.";
  } else if (!EMAIL_PATTERN.test(draft.email.trim())) {
    errors.email = "Vul een geldig e-mailadres in.";
  }

  const digits = draft.phone.replace(/\D/g, "");
  if (!draft.phone.trim()) {
    errors.phone = "Vul je telefoonnummer in.";
  } else if (digits.length < 8) {
    errors.phone = "Vul een geldig telefoonnummer in.";
  }

  if (!draft.processingConsent) {
    errors.processingConsent =
      "Bevestig dat we je gegevens mogen gebruiken om je aanvraag te behandelen.";
  }

  return errors;
}
