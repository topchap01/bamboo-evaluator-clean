// 📁 src/utils/pdfExport.js
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateStyledPdf = (formData, evaluation) => {
  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    content: [
      {
        text: "Bamboo Evaluator\nCampaign Report",
        style: "header",
      },
      {
        text: `Brand: ${formData.brandName}\nCreated: ${new Date().toLocaleDateString()}`,
        style: "subheader",
        margin: [0, 10, 0, 20],
      },
      {
        columns: [
          {
            width: "50%",
            stack: [
              { text: `Objective: ${formData.objective}`, style: "label" },
              { text: `Target Audience: ${formData.targetAudience}`, style: "label" },
              { text: `Offer: ${formData.offer}`, style: "label" },
              { text: `Creative Hook: ${formData.creativeHeadline}`, style: "label" },
              { text: `Prize: ${formData.prizeDetails}`, style: "label" },
            ],
          },
          {
            width: "50%",
            stack: [
              { text: `Budget: ${formData.mediaBudget}`, style: "label" },
              { text: `Channels: ${formData.mediaChannels}`, style: "label" },
              { text: `Entry Mechanic: ${formData.entryMechanic}`, style: "label" },
              { text: `Start: ${formData.startDate}`, style: "label" },
              { text: `End: ${formData.endDate}`, style: "label" },
            ],
          },
        ],
        columnGap: 20,
      },
      {
        text: "Evaluation Summary",
        style: "sectionHeader",
        margin: [0, 30, 0, 10],
      },
      {
        text: evaluation,
        style: "body",
      },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        color: "#2E7D32",
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 12,
        alignment: "center",
        color: "#555",
      },
      label: {
        fontSize: 10,
        margin: [0, 4],
        color: "#333",
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        decoration: "underline",
        color: "#37474F",
      },
      body: {
        fontSize: 11,
        lineHeight: 1.4,
        color: "#212121",
      },
    },
  };

  pdfMake.createPdf(docDefinition).download(`Bamboo_Evaluation_${formData.brandName}.pdf`);
};
