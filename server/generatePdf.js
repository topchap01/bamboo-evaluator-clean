// server/generatePdf.js
import puppeteer from "puppeteer";
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";




console.log("👀 Starting Bamboo PDF Generator...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4001;
app.use(cors()); // ✅ Allow all origins
app.use(bodyParser.json({ limit: "2mb" }));

app.post("/generate-pdf", async (req, res) => {
  const { formData, evaluationHtml } = req.body;

  if (!formData || !evaluationHtml) {
    return res.status(400).send("Missing required data.");
  }

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Load a local HTML template
    const templatePath = path.join(__dirname, "template.html");
    const templateHtml = fs.readFileSync(templatePath, "utf-8");

    const compiledHtml = templateHtml
      .replace("<!--EVALUATION_CONTENT-->", evaluationHtml)
      .replace("<!--WATERMARK-->", `<div class='watermark'>Bamboo Marketing</div>`)
      .replace("<!--VERSION-->", `Evaluator v5.1`);

    await page.setContent(compiledHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "1in", bottom: "1in", left: "1in", right: "1in" },
      printBackground: true
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Bamboo_Evaluation_${formData.brandName || "Campaign"}.pdf"`
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).send("Failed to generate PDF.");
  }
});

app.listen(PORT, () => console.log(`🚀 PDF generator running on http://localhost:${PORT}`));
