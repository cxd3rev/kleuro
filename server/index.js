require("dotenv").config({ path: require("path").join(__dirname, ".env") });
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const cors = require("cors");
const express = require("express");
const analyzeRouter = require("./routes/analyze");
const visualizeRouter = require("./routes/visualize");

const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(cors());
app.use(express.json({ limit: "12mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/analyze", analyzeRouter);
app.use("/api/visualize", visualizeRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Kleuro API listening on ${PORT}`);
});
