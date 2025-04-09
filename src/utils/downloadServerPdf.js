// /src/utils/downloadServerPdf.js

export const downloadServerPdf = async ({ formData, evaluationHtml }) => {
    try {
      const response = await fetch("http://localhost:4001/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, evaluationHtml }),
      });
  
      if (!response.ok) {
        throw new Error("PDF generation failed. Server returned " + response.status);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = `Bamboo_Evaluation_${formData.brandName || "Campaign"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  
      console.log("✅ PDF downloaded successfully");
    } catch (error) {
      console.error("❌ PDF download failed:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };
  