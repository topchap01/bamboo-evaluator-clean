import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { evaluateCampaign } from "../gptEvaluator";
import { useState, useRef } from "react";

function Dashboard() {
  const [formData, setFormData] = useState({
    brandName: "",
    objective: "",
    targetAudience: "",
    offer: "",
    creativeHeadline: "",
    entryMechanic: "",
    prizeDetails: "",
    mediaBudget: "",
    mediaChannels: "",
    startDate: "",
    endDate: ""
  });

  const placeholderMap = {
    brandName: "e.g. McQuigam Wines",
    objective: "e.g. Drive retail trial during summer",
    targetAudience: "e.g. 25–45yo wine drinkers, regional Australia",
    offer: "e.g. Buy 2 bottles, scan QR to win",
    creativeHeadline: "e.g. Sip & Win a Trip on The Ghan",
    entryMechanic: "e.g. Scan QR, enter online, instant win",
    prizeDetails: "e.g. Luxury rail trip + daily wine prizes",
    mediaBudget: "e.g. $150,000",
    mediaChannels: "e.g. In-store, Facebook, Instagram, Trade Press"
  };

  const [evaluation, setEvaluation] = useState("");
  const evalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setEvaluation("⏳ Evaluating campaign...");

      const response = await evaluateCampaign(formData);
      setEvaluation(response);

      const auth = getAuth();
      const user = auth.currentUser;

      await addDoc(collection(db, "campaignEvaluations"), {
        userId: user ? user.uid : null,
        email: user ? user.email : "anonymous",
        formData,
        evaluation: response,
        createdAt: serverTimestamp()
      });

      console.log("✅ Data saved to Firestore");
    } catch (error) {
      console.error("🔥 Error during evaluation or save:", error);
      setEvaluation("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          margin: "3rem auto",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "1.8rem", marginBottom: "0.5rem" }}>📋 Submit Your Campaign</h2>
        <p style={{ textAlign: "center", color: "#666", fontSize: "0.95rem" }}>
          Please fill out the campaign details below for evaluation.
        </p>

        {["brandName", "objective", "targetAudience", "offer", "creativeHeadline", "entryMechanic", "prizeDetails", "mediaBudget", "mediaChannels"].map(name => (
          <div key={name} style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.25rem", fontWeight: "bold" }}>
              {name.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase())}
            </label>
            <input
              name={name}
              placeholder={placeholderMap[name] || ""}
              onChange={handleChange}
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem"
              }}
            />
          </div>
        ))}

        {["startDate", "endDate"].map(dateField => (
          <div key={dateField} style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "0.25rem", fontWeight: "bold" }}>{dateField === "startDate" ? "Campaign Start Date" : "Campaign End Date"}</label>
            <input
              name={dateField}
              type="date"
              onChange={handleChange}
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem"
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "0.9rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          🚀 Evaluate Campaign
        </button>
      </form>

      {evaluation && (
        <div style={{ maxWidth: "800px", margin: "3rem auto" }}>
          <div
            ref={evalRef}
            style={{
              whiteSpace: "pre-wrap",
              backgroundColor: "#f9f9f9",
              color: "#333",
              padding: "2rem",
              borderRadius: "10px",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              lineHeight: "1.6"
            }}
          >
            <h3 style={{ marginBottom: "1rem", fontWeight: "600" }}>Campaign Evaluation</h3>
            <p>{evaluation.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
          </div>

          <button
            style={{ marginTop: "1rem", padding: "0.75rem 1.5rem", borderRadius: "8px", background: "#1976D2", color: "#fff", border: "none" }}
            onClick={async () => {
              const input = evalRef.current;
              const canvas = await html2canvas(input);
              const imgData = canvas.toDataURL("image/png");

              const pdf = new jsPDF("p", "mm", "a4");
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();

              const imgWidth = pageWidth;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;

              let position = 0;

              pdf.setFontSize(12);
              pdf.text(`Campaign Evaluation — ${formData.brandName}`, 10, 20);
              pdf.text(`Objective: ${formData.objective}`, 10, 28);
              pdf.text(`Target Audience: ${formData.targetAudience}`, 10, 36);
              pdf.text(`Created: ${new Date().toLocaleDateString()}`, 10, 44);
              position = 50;

              const imgChunkHeight = pageHeight - position;
              let remainingHeight = imgHeight;

              while (remainingHeight > 0) {
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                remainingHeight -= imgChunkHeight;
                if (remainingHeight > 0) {
                  pdf.addPage();
                  position = 10;
                }
              }

              pdf.save(`Bamboo_Evaluation_${formData.brandName}.pdf`);
            }}
          >
            📄 Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;