const express = require("express");
const { getSupabaseAdmin } = require("../lib/supabase");
const {
  decodeImage,
  extensionForMime,
  normalizeLead,
  validateLeadBody,
} = require("../lib/leadPayload");

const router = express.Router();
const memoryLeads = [];

async function uploadPrivateImage(supabase, bucket, path, image) {
  const { error } = await supabase.storage.from(bucket).upload(path, image.buffer, {
    contentType: image.mimeType,
    upsert: false,
  });
  if (error) {
    throw error;
  }
  return `${bucket}/${path}`;
}

router.post("/", async (req, res) => {
  const errors = validateLeadBody(req.body ?? {});
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ error: "invalid_lead", fields: errors });
    return;
  }

  if (process.env.LEAD_STORE === "memory") {
    const lead = normalizeLead(req.body);
    const record = { id: `memory-${memoryLeads.length + 1}`, ...lead };
    memoryLeads.push(record);
    res.json({ ok: true, id: record.id });
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.status(503).json({ error: "lead_unavailable" });
    return;
  }

  try {
    const lead = normalizeLead(req.body);
    const original = decodeImage(
      req.body.originalImageBase64,
      req.body.originalMimeType,
    );
    const generated = decodeImage(req.body.generatedImageUri);

    if (original) {
      const path = `${lead.session_id}/original.${extensionForMime(original.mimeType)}`;
      lead.original_image_url = await uploadPrivateImage(
        supabase,
        "lead-originals",
        path,
        original,
      );
    }

    if (generated) {
      const path = `${lead.session_id}/generated.${extensionForMime(generated.mimeType)}`;
      lead.generated_image_url = await uploadPrivateImage(
        supabase,
        "lead-visuals",
        path,
        generated,
      );
    }

    const { data, error } = await supabase
      .from("leads")
      .insert(lead)
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    res.json({ ok: true, id: data.id });
  } catch (error) {
    console.error("Lead save failed");
    res.status(500).json({ error: "lead_failed" });
  }
});

module.exports = router;
