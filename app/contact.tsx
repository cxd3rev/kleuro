import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { ConsentCheck } from "../components/ConsentCheck";
import { TextField } from "../components/FormFields";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { WORK_OPTIONS } from "../constants/work";
import {
  MARKETING_CONSENT_LABEL,
  PRIVACY_POLICY_VERSION,
  PROCESSING_CONSENT_LABEL,
} from "../constants/privacy";
import { useProject } from "../context/ProjectContext";
import { submitLead } from "../lib/api";
import { validateLeadDraft } from "../lib/leadValidation";
import { includedWorkIds, priceRangeFromDetails } from "../lib/pricingInput";

const SUBMIT_ERROR =
  "Je aanvraag kon niet worden verstuurd. Controleer je gegevens en probeer het opnieuw.";

export default function ContactScreen() {
  const router = useRouter();
  const {
    sessionId,
    photo,
    surfaces,
    colorChoices,
    visualization,
    details,
    contact,
    setContact,
  } = useProject();
  const [errors, setErrors] = useState(validateLeadDraft(contact));
  const [showErrors, setShowErrors] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateContact = (patch: Partial<typeof contact>) => {
    const next = { ...contact, ...patch };
    setContact(next);
    if (showErrors) {
      setErrors(validateLeadDraft(next));
    }
  };

  const handleSubmit = async () => {
    const nextErrors = validateLeadDraft(contact);
    setShowErrors(true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const selectedSurfaces = surfaces
      .filter((item) => item.selected)
      .map((item) => ({
        id: item.id,
        name: item.name,
      }));
    const selectedColours = selectedSurfaces.map((item) => ({
      id: item.id,
      name: item.name,
      hex: colorChoices[item.id]?.hex ?? "",
      label: colorChoices[item.id]?.label ?? "",
    }));
    const range = priceRangeFromDetails(details);

    setSubmitting(true);
    setSubmitError("");
    try {
      await submitLead({
        sessionId,
        firstName: contact.firstName.trim(),
        lastName: contact.lastName.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
        address: contact.address.trim(),
        message: contact.message.trim(),
        processingConsent: true,
        marketingConsent: contact.marketingConsent,
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
        originalImageBase64: photo?.base64 ?? null,
        originalMimeType: photo?.mimeType ?? "image/jpeg",
        generatedImageUri: visualization?.imageUri ?? null,
        selectedSurfaces,
        selectedColours,
        measurements: {
          facadeM2: details.facadeM2,
          doorCount: details.doorCount,
          garageDoorCount: details.garageDoorCount,
          windowM2: details.windowM2,
          extraInfo: details.extraInfo,
        },
        selectedWork: includedWorkIds(),
        estimatedMin: range.low,
        estimatedMax: range.high,
        source: "kleuro-app",
        includedWorkLabels: WORK_OPTIONS.map((item) => item.label),
      });
      router.push("/bedankt");
    } catch {
      setSubmitError(SUBMIT_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Contact" />
      <AppText variant="bold" className="mb-3 text-2xl leading-8 text-kleuro-dark">
        Interesse in je project?
      </AppText>
      <AppText className="mb-5 text-base leading-7 text-kleuro-muted">
        Laat je gegevens achter en we nemen contact met je op over de
        mogelijkheden.
      </AppText>

      <View className="mb-6 rounded-3xl bg-kleuro-cream p-4">
        <AppText className="text-[15px] leading-6 text-kleuro-dark">
          We vragen alleen wat nodig is om je aanvraag te behandelen en je te
          kunnen bereiken. Kleuro is gratis. Er is geen account nodig.
        </AppText>
      </View>

      <TextField
        label="Voornaam"
        required
        value={contact.firstName}
        onChange={(firstName) => updateContact({ firstName })}
        autoComplete="given-name"
        textContentType="givenName"
        error={showErrors ? errors.firstName : undefined}
      />
      <TextField
        label="Achternaam"
        required
        value={contact.lastName}
        onChange={(lastName) => updateContact({ lastName })}
        autoComplete="family-name"
        textContentType="familyName"
        error={showErrors ? errors.lastName : undefined}
      />
      <TextField
        label="E-mailadres"
        required
        value={contact.email}
        onChange={(email) => updateContact({ email })}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        error={showErrors ? errors.email : undefined}
      />
      <TextField
        label="Telefoonnummer"
        required
        value={contact.phone}
        onChange={(phone) => updateContact({ phone })}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        error={showErrors ? errors.phone : undefined}
      />
      <TextField
        label="Adres"
        value={contact.address}
        onChange={(address) => updateContact({ address })}
        autoComplete="street-address"
        textContentType="fullStreetAddress"
      />
      <TextField
        label="Bericht"
        value={contact.message}
        onChange={(message) => updateContact({ message })}
        multiline
        placeholder="Optioneel, bijvoorbeeld wanneer we je het beste kunnen bereiken."
      />

      <AppText variant="semibold" className="mb-2 text-base text-kleuro-dark">
        Privacy
      </AppText>
      <AppText className="mb-4 text-[15px] leading-6 text-kleuro-muted">
        Noodzakelijk contact staat los van optionele marketing. Marketing staat
        standaard uit.
      </AppText>

      <ConsentCheck
        label={PROCESSING_CONSENT_LABEL}
        checked={contact.processingConsent}
        onToggle={() =>
          updateContact({ processingConsent: !contact.processingConsent })
        }
        required
        error={showErrors ? errors.processingConsent : undefined}
      />
      <ConsentCheck
        label={MARKETING_CONSENT_LABEL}
        checked={contact.marketingConsent}
        onToggle={() =>
          updateContact({ marketingConsent: !contact.marketingConsent })
        }
      />

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Privacybeleid"
        onPress={() => router.push("/privacybeleid")}
        className="mb-6 min-h-[44px] justify-center"
      >
        <AppText variant="semibold" className="text-base text-kleuro-dark underline">
          Privacybeleid
        </AppText>
      </Pressable>

      {submitError ? (
        <View className="mb-4 rounded-3xl bg-[#FFF1EC] px-4 py-3">
          <AppText className="text-[15px] leading-6 text-[#C2410C]">
            {submitError}
          </AppText>
        </View>
      ) : null}

      <Button
        label={submitting ? "Aanvraag wordt verstuurd..." : "Mijn aanvraag versturen"}
        disabled={submitting}
        onPress={() => {
          void handleSubmit();
        }}
      />
    </Screen>
  );
}
