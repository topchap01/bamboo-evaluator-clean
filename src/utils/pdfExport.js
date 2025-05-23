import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PdfDownloadButton = ({ formData, evaluationText }) => {
  const generatePdf = () => {
    const doc = new jsPDF();

    const now = new Date();
    const formattedDate = now.toLocaleDateString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(34, 66, 124); // Navy blue
    doc.text("Bamboo Evaluator Report", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Brand: ${formData.brandName}`, 14, 30);
    doc.text(`Objective: ${formData.objective}`, 14, 38);
    doc.text(`Target Audience: ${formData.targetAudience}`, 14, 46);
    doc.text(`Offer: ${formData.offer}`, 14, 54);
    doc.text(`Creative Headline: ${formData.creativeHeadline}`, 14, 62);
    doc.text(`Entry Mechanic: ${formData.entryMechanic}`, 14, 70);
    doc.text(`Prize Details: ${formData.prizeDetails}`, 14, 78);
    doc.text(`Media Budget: ${formData.mediaBudget}`, 14, 86);
    doc.text(`Media Channels: ${formData.mediaChannels}`, 14, 94);
    doc.text(`Dates: ${formData.startDate} to ${formData.endDate}`, 14, 102);
    doc.text(`Created: ${formattedDate}`, 14, 110);

    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(14, 114, 196, 114);

    // Evaluation Section
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text("Evaluation Summary", 14, 124);

    doc.setFontSize(11);
    autoTable(doc, {
      startY: 130,
      theme: "grid",
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: "bold", textColor: [22, 44, 90] },
        1: { cellWidth: 120 },
      },
      body: evaluationText
        .split(/\n(?=\d+\. )/) // Split by new sections
        .map((line) => {
          const parts = line.split(/\n|- /);
          return {
            0: parts[0]?.replace(/^\d+\.\s*/, "") || "",
            1: parts.slice(1).join(" - ").trim(),
          };
        }),
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Generated by Bamboo Evaluator", 105, doc.internal.pageSize.height - 10, null, null, "center");

    doc.save(`Bamboo_Evaluation_${formData.brandName || "Campaign"}.pdf`);
  };

  return (
    <button
      onClick={generatePdf}
      style={{
        marginTop: "1.5rem",
        backgroundColor: "#22427C",
        color: "white",
        padding: "0.75rem 1.25rem",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "1rem",
      }}
    >
      📄 Download PDF
    </button>
  );
};

export default PdfDownloadButton;
