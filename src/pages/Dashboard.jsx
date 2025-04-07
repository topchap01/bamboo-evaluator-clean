// src/pages/Dashboard.jsx
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
    <div style={{ maxWidth: "700px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Submit a Campaign</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input name="brandName" placeholder="Brand name (e.g. McQuigam Wines)" onChange={handleChange} required />
        <input name="objective" placeholder="Objective (e.g. Drive short-term sales)" onChange={handleChange} required />
        <input name="targetAudience" placeholder="Target audience (e.g. Adults 25–45, premium wine buyers)" onChange={handleChange} required />
        <input name="offer" placeholder="Offer (e.g. Buy any bottle to enter)" onChange={handleChange} required />
        <input name="creativeHeadline" placeholder="Creative headline (e.g. Sip & Win a Trip on The Ghan)" onChange={handleChange} required />
        <input name="entryMechanic" placeholder="Entry mechanic (e.g. Scan QR on bottle, upload receipt)" onChange={handleChange} required />
        <input name="prizeDetails" placeholder="Prize/reward details (e.g. 5x trips, minor prizes weekly)" onChange={handleChange} required />
        <input name="mediaBudget" placeholder="Media budget (e.g. $250,000)" onChange={handleChange} required />
        <input name="mediaChannels" placeholder="Media channels (e.g. Instagram, in-store POS, email)" onChange={handleChange} required />
        <input name="startDate" type="date" onChange={handleChange} required />
        <input name="endDate" type="date" onChange={handleChange} required />
        <button type="submit" style={{ padding: "1rem", background: "#1976D2", color: "white", border: "none", borderRadius: "6px" }}>
          Evaluate Campaign
        </button>
      </form>

      {evaluation && (
        <div style={{ marginTop: "2rem" }}>
          <div
            ref={evalRef}
            style={{
              whiteSpace: "pre-wrap",
              backgroundColor: "#f9f9f9",
              padding: "1.5rem",
              borderRadius: "10px",
              border: "1px solid #ccc",
              lineHeight: 1.6,
              color: "#333"
            }}
          >
            <h3 style={{ fontWeight: "600", marginBottom: "1rem" }}>📋 GPT Evaluation</h3>
            <p>{evaluation}</p>
          </div>

          <button
            style={{ marginTop: "1rem", padding: "0.75rem 1.25rem" }}
            onClick={async () => {
              const input = evalRef.current;
              const canvas = await html2canvas(input);
              const imgData = canvas.toDataURL("image/png");

              const pdf = new jsPDF("p", "mm", "a4");
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              const imgProps = pdf.getImageProperties(imgData);
              const imgRatio = imgProps.width / imgProps.height;
              const pdfWidth = pageWidth;
              const pdfHeight = pageWidth / imgRatio;

              let position = 0;
              pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);

              // Add extra pages if content height exceeds A4
              while (pdfHeight + position > pageHeight) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
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
