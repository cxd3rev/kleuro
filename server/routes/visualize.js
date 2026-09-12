const express = require("express");
const OpenAI = require("openai");
const { toFile } = require("openai");
const { SURFACE_CATALOG } = require("../catalog");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { imageBase64, mimeType, paints } = req.body ?? {};
    if (!imageBase64 || typeof imageBase64 !== "string") {
      res.status(400).json({ error: "missing_image" });
      return;
    }
    if (!Array.isArray(paints) || paints.length === 0) {
      res.status(400).json({ error: "missing_paints" });
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: "visualization_unavailable" });
      return;
    }

    const hexPattern = /^#?[0-9A-Fa-f]{6}$/;
    const safePaints = paints
      .map((item) => {
        const hex = String(item?.color?.hex ?? "").trim();
        if (!hexPattern.test(hex)) {
          return null;
        }
        const catalog = SURFACE_CATALOG.find((entry) => entry.id === item.id);
        return {
          surfaceName: catalog?.name || item.surfaceName || "Onderdeel",
          hex: hex.startsWith("#") ? hex.toUpperCase() : `#${hex.toUpperCase()}`,
          label: item?.color?.label || "custom",
        };
      })
      .filter(Boolean);

    if (safePaints.length === 0) {
      res.status(400).json({ error: "invalid_paints" });
      return;
    }

    const base64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
    const extension = mimeType === "image/png" ? "png" : "jpg";
    const openai = new OpenAI({ apiKey });
    const image = await toFile(Buffer.from(base64, "base64"), `house.${extension}`, {
      type: mimeType === "image/png" ? "image/png" : "image/jpeg",
    });

    const paintLines = safePaints
      .map((item) => `- ${item.surfaceName}: ${item.hex} (${item.label})`)
      .join("\n");

    const prompt = `Photorealistic house-paint edit of the provided photo. This is an image edit, not a new generation.

Keep the exact same photograph:
- same camera angle, perspective, framing and crop
- same architecture, proportions and number of storeys
- same window positions, door positions, garage, roof, garden, plants and driveway
- same lighting, shadows, reflections and surroundings

ONLY change the paint color of these selected surfaces:
${paintLines}

Do NOT:
- move or resize windows or doors
- change the roof
- add floors
- enlarge the house
- redesign the architecture
- generate a different house
- unnecessarily change the environment
- paint window glass unless window frames are selected

If "Ramen" is selected, recolor frames/sashes only and keep glass transparent.

The result must look like the same house, freshly painted.`;

    const result = await openai.images.edit({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      image,
      prompt,
      input_fidelity: "high",
      quality: "medium",
      output_format: "jpeg",
      output_compression: 75,
      size: "auto",
    });

    const imageBase64Out = result.data?.[0]?.b64_json;
    if (!imageBase64Out) {
      res.status(502).json({ error: "visualization_failed" });
      return;
    }

    res.json({
      imageBase64: imageBase64Out,
      mimeType: "image/jpeg",
    });
  } catch (error) {
    console.error("Visualization failed");
    res.status(500).json({ error: "visualization_failed" });
  }
});

module.exports = router;
