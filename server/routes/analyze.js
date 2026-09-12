const express = require("express");
const OpenAI = require("openai");
const { SURFACE_CATALOG } = require("../catalog");
const { stripDataUrl } = require("../lib/images");
const { clampNumber } = require("../lib/numbers");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body ?? {};
    const base64 = stripDataUrl(imageBase64);
    if (!base64) {
      res.status(400).json({ error: "missing_image" });
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: "analysis_unavailable" });
      return;
    }

    const safeMime =
      mimeType === "image/png" || mimeType === "image/webp"
        ? mimeType
        : "image/jpeg";
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `Je analyseert een foto van een woning voor een schildersapp.
Antwoord uitsluitend met JSON in dit formaat:
{
  "houseVisible": true,
  "tooDark": false,
  "surfaces": [
    { "id": "facade", "name": "Gevel", "visible": true, "confidence": 0.95 }
  ]
}

Gebruik exact deze ids en namen:
${SURFACE_CATALOG.map((item) => `- ${item.id} / ${item.name}`).join("\n")}

Regels:
- Geef altijd alle 8 surfaces terug.
- visible=true alleen als dat schilderbare onderdeel duidelijk in beeld is.
- confidence is een getal tussen 0 en 1.
- tooDark=true alleen bij een extreem donkere foto.
- houseVisible=false alleen als er nauwelijks een woning of gebouw te zien is.
- Wees mild: bij twijfel mag visible true zijn met een lagere confidence.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Herken de zichtbare schilderbare onderdelen van deze woning.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${safeMime};base64,${base64}`,
                detail: "low",
              },
            },
          ],
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      res.status(502).json({ error: "analysis_failed" });
      return;
    }

    const parsed = JSON.parse(raw);
    const surfacesById = new Map(
      (Array.isArray(parsed.surfaces) ? parsed.surfaces : []).map((item) => [
        item.id,
        item,
      ]),
    );

    const surfaces = SURFACE_CATALOG.map((item) => {
      const match = surfacesById.get(item.id);
      const confidence = clampNumber(match?.confidence, 0, 1, 0);
      return {
        id: item.id,
        name: item.name,
        visible: Boolean(match?.visible),
        confidence,
      };
    });

    res.json({
      houseVisible: parsed.houseVisible !== false,
      tooDark: parsed.tooDark === true,
      surfaces,
    });
  } catch (error) {
    console.error("Vision analysis failed");
    res.status(500).json({ error: "analysis_failed" });
  }
});

module.exports = router;
